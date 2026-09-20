#!/usr/bin/env python3
"""Verdichtet den jüngsten robots.txt-Snapshot aus timeline.csv zum
Tracker-JSON für die öffentliche fumu.ch-Seite (Design-Spec > Daten-Vertrag)."""
from __future__ import annotations

import argparse
import json
import logging
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import pandas as pd
import yaml

from query import run_query  # DRY: block_share identisch zur internen Aggregation

HERE = Path(__file__).parent
DEFAULT_TIMELINE = HERE / "data" / "timeline.csv"
DEFAULT_CONTENT = HERE / "tracker-content.yaml"
DEFAULT_CRAWLERS = HERE / "crawlers.yaml"
# tools/crawler-radar/ liegt zwei Ebenen unter dem Repo-Root.
DEFAULT_OUTPUT = HERE.parent.parent / "src" / "data" / "ai-crawler-tracker.json"

# Der Server-Cron läuft mit Prozess-Zeitzone UTC (CRON_TZ stellt nur die
# Trigger-Zeit). Der Stempel gehört trotzdem in Zürcher Zeit.
TIMEZONE = ZoneInfo("Europe/Zurich")

CATEGORY_LABELS = {
    "publisher_paywall": "Paywall-Publisher",
    "publisher_open": "Publisher (frei)",
    "platform": "Plattformen",
    "brand": "Brands",
    "ecommerce": "E-Commerce",
}

# Guard-Schwelle: normale Snapshots liegen bei 10–12 % ERROR (Bot-Schutz-403,
# Timeouts einzelner Sites). Ein Netz-/DNS-Ausfall zur Cron-Zeit erzeugt 100 %.
# 30 % lässt einen schlechten Tag durch und fängt jeden echten Ausfall.
MAX_ERROR_RATE = 0.30

METHODOLOGY = [
    "ERROR-Zellen (Bot-Schutz-403/Timeout) sind nicht als Blockade gewertet – eigener Datenpunkt.",
    "Google-Agent ignoriert robots.txt laut Anbieter – DEFAULT heisst hier nicht 'wird durchgelassen'.",
    "robots.txt ist Deklaration, nicht Crawl-Realität (ChatGPT-User und Perplexity binden sich nicht).",
]

logging.basicConfig(level=logging.INFO, format="%(message)s", stream=sys.stderr)
log = logging.getLogger("publish")


class ThinSnapshotError(RuntimeError):
    """Jüngster Snapshot ist unplausibel dünn gegenüber dem Vor-Snapshot."""


class ErrorFloodError(RuntimeError):
    """Jüngster Snapshot besteht überwiegend aus ERROR-Zellen – der Lauf hat
    die robots.txt nicht erreicht (Netz/DNS weg), statt Policy zu messen."""


def _label(category: str) -> str:
    return CATEGORY_LABELS.get(category, category)


def _block_share_by(df: pd.DataFrame, group_field: str) -> pd.DataFrame:
    """Block-Share des jüngsten Snapshots pro group_field (via query.py)."""
    return run_query(df, "date=latest", [group_field], "block_share")


def _guard_snapshot_size(df: pd.DataFrame, latest: str, min_ratio: float) -> None:
    dates = sorted(df["date"].unique())
    if len(dates) < 2 or dates[-1] != latest:
        return
    prev_sites = df[df["date"] == dates[-2]]["name"].nunique()
    now_sites = df[df["date"] == latest]["name"].nunique()
    if prev_sites and now_sites < min_ratio * prev_sites:
        raise ThinSnapshotError(
            f"Snapshot {latest}: {now_sites} Sites < {min_ratio:.0%} von "
            f"{prev_sites} (Vor-Snapshot). Ausspielen blockiert."
        )


def _guard_error_rate(df: pd.DataFrame, latest: str, max_rate: float) -> None:
    """Ein Lauf ohne Netz liefert volle Site-Zahl, aber nur ERROR-Zellen – der
    Site-Guard sieht das nicht. Block-Anteil wäre dann flächendeckend 0 und
    risse ein Loch in die Zeitreihe."""
    status = df[df["date"] == latest]["status"]
    if status.empty:
        return
    error_rate = float((status == "ERROR").mean())
    if error_rate > max_rate:
        raise ErrorFloodError(
            f"Snapshot {latest}: {error_rate:.0%} ERROR-Zellen (Schwelle "
            f"{max_rate:.0%}). Lauf hat die Sites nicht erreicht – "
            f"Ausspielen blockiert."
        )


def load_content(path: Path) -> dict:
    """Kuratierte Content-Schicht (tracker-content.yaml). Fehlend = leer.
    YAML parst unquotete Datums-Keys als date-Objekte – auf ISO-Strings
    normalisieren, damit der Lookup gegen timeline-Daten greift."""
    if not path.exists():
        return {}
    content = yaml.safe_load(path.read_text(encoding="utf-8")) or {}
    if isinstance(content.get("runs"), dict):
        content["runs"] = {str(k): v for k, v in content["runs"].items()}
    return content


def _site_entries(now: pd.DataFrame) -> list[dict]:
    """Gemonitorte Sites aus dem jüngsten Snapshot, sortiert nach Kategorie/Name."""
    sites = (
        now[["name", "url", "category"]].drop_duplicates()
        .sort_values(["category", "name"])
    )
    return [
        {
            "name": row["name"],
            "domain": row["url"],
            "category": row["category"],
            "label": _label(row["category"]),
        }
        for _, row in sites.iterrows()
    ]


def _change_detail(df: pd.DataFrame, date: str, prev: str):
    """Status-Wechsel date vs. prev: (Zellen, Sites, Zell-Counts pro Site)."""
    key = ["name", "crawler_id"]
    a = df[df["date"] == prev].set_index(key)["status"]
    b = df[df["date"] == date].set_index(key)["status"]
    common = a.index.intersection(b.index)
    changed = a.loc[common] != b.loc[common]
    cells = changed[changed]
    per_site = (
        cells.groupby(level="name").size()
        .sort_index()
        .sort_values(ascending=False, kind="stable")
    )
    return int(changed.sum()), int(per_site.size), per_site


def _mechanical_summary(n_changes: int, n_sites: int, per_site: pd.Series) -> str:
    if n_changes == 0:
        return "Keine Veränderungen gegenüber dem Vor-Snapshot."
    names = [str(n) for n in per_site.index[:3]]
    if per_site.size > 3:
        names.append("u.a.")
    change_word = "Veränderung" if n_changes == 1 else "Veränderungen"
    site_word = "Site" if n_sites == 1 else "Sites"
    return (f"{n_changes} {change_word} auf {n_sites} {site_word} "
            f"({', '.join(names)}).")


def _run_entries(df: pd.DataFrame, content: dict | None) -> list[dict]:
    """Lauf-Log über alle Snapshot-Paare, jüngster zuerst. Kuratierte
    Overrides (summary/commentary) kommen aus content['runs'][date]."""
    overrides = (content or {}).get("runs", {})
    runs = []
    prev = None
    for date in sorted(df["date"].unique()):
        if prev is None:
            snap = df[df["date"] == date]
            entry = {
                "date": str(date),
                "changes": None,
                "sites_changed": None,
                "summary": (f"Erst-Snapshot: {snap['name'].nunique()} Sites × "
                            f"{snap['crawler_id'].nunique()} Crawler."),
                "commentary": None,
            }
        else:
            n_changes, n_sites, per_site = _change_detail(df, date, prev)
            entry = {
                "date": str(date),
                "changes": n_changes,
                "sites_changed": n_sites,
                "summary": _mechanical_summary(n_changes, n_sites, per_site),
                "commentary": None,
            }
        ov = overrides.get(str(date)) or {}
        if ov.get("summary"):
            entry["summary"] = ov["summary"]
        if ov.get("commentary"):
            entry["commentary"] = ov["commentary"]
        runs.append(entry)
        prev = date
    runs.reverse()
    return runs


def build_payload(df: pd.DataFrame, min_ratio: float = 0.8,
                  content: dict | None = None,
                  max_error_rate: float = MAX_ERROR_RATE) -> dict:
    latest = df["date"].max()
    _guard_snapshot_size(df, latest, min_ratio)
    _guard_error_rate(df, latest, max_error_rate)
    now = df[df["date"] == latest]

    by_cat = _block_share_by(df, "category")
    cat_site_counts = now.groupby("category")["name"].nunique()
    by_category = [
        {
            "category": row["category"],
            "label": _label(row["category"]),
            "block_share": round(float(row["block_share"]), 4),
            "site_count": int(cat_site_counts.get(row["category"], 0)),
        }
        for _, row in by_cat.iterrows()
    ]

    by_cr = _block_share_by(df, "crawler_id")
    blocked_counts = (
        now[now["status"].isin({"BLOCK", "DEFAULT_BLOCKED"})]
        .groupby("crawler_id")["name"].nunique()
    )
    # Typ-Metadaten je Crawler: bot_category/honors_robots stehen in der
    # Timeline (aus analyze), provider kommt aus crawlers.yaml
    # ([[Typen von KI Bots]]-Taxonomie: scraper/assistant/search/agent).
    crawler_traits = now.groupby("crawler_id")[["bot_category", "honors_robots"]].first()
    providers = _crawler_providers()
    by_crawler = sorted(
        [
            {
                "crawler_id": row["crawler_id"],
                "label": row["crawler_id"],
                "block_share": round(float(row["block_share"]), 4),
                "blocked_sites": int(blocked_counts.get(row["crawler_id"], 0)),
                "bot_category": str(crawler_traits.loc[row["crawler_id"], "bot_category"]),
                "honors_robots": bool(crawler_traits.loc[row["crawler_id"], "honors_robots"]),
                "provider": providers.get(row["crawler_id"]),
            }
            for _, row in by_cr.iterrows()
        ],
        key=lambda c: c["block_share"],
        reverse=True,
    )

    trend_raw = run_query(df, "", ["date", "category"], "block_share")
    trend = []
    for date, grp in trend_raw.groupby("date"):
        trend.append({
            "date": str(date),
            "by_category": {
                r["category"]: round(float(r["block_share"]), 4)
                for _, r in grp.iterrows()
            },
        })

    n_changes, n_sites_changed = _change_stats(df, latest)
    headline = (
        f"Snapshot {latest}: {n_changes} Veränderungen auf {n_sites_changed} "
        f"{'Site' if n_sites_changed == 1 else 'Sites'}."
    )

    return {
        "meta": {
            "snapshot_date": str(latest),
            "site_count": int(now["name"].nunique()),
            "crawler_count": int(now["crawler_id"].nunique()),
            "cadence_days": 14,
            "generated_at": datetime.now(TIMEZONE).isoformat(),
        },
        "headline": headline,
        "by_category": by_category,
        "by_crawler": by_crawler,
        "trend": trend,
        "runs": _run_entries(df, content),
        "sites": _site_entries(now),
        "methodology": METHODOLOGY,
        "methodology_details": (content or {}).get("methodology_details", []),
    }


def _crawler_providers(path: Path = DEFAULT_CRAWLERS) -> dict[str, str]:
    """id → provider aus crawlers.yaml; leer bei fehlender Datei."""
    if not path.is_file():
        return {}
    with path.open() as f:
        entries = yaml.safe_load(f) or []
    return {e["id"]: e.get("provider") for e in entries if isinstance(e, dict) and "id" in e}


def _change_stats(df: pd.DataFrame, latest: str) -> tuple[int, int]:
    """Zaehlt Status-Wechsel latest vs. vorheriger Snapshot (Zellen und Sites)."""
    dates = sorted(df["date"].unique())
    if len(dates) < 2 or dates[-1] != latest:
        return 0, 0
    prev = dates[-2]
    key = ["name", "crawler_id"]
    a = df[df["date"] == prev].set_index(key)["status"]
    b = df[df["date"] == latest].set_index(key)["status"]
    common = a.index.intersection(b.index)
    changed = a.loc[common] != b.loc[common]
    changed_cells = changed[changed]
    n_sites = changed_cells.index.get_level_values("name").nunique()
    return int(changed.sum()), int(n_sites)


def main() -> int:
    parser = argparse.ArgumentParser(description="Tracker-JSON aus timeline.csv bauen")
    parser.add_argument("--timeline", type=Path, default=DEFAULT_TIMELINE)
    parser.add_argument("--content", type=Path, default=DEFAULT_CONTENT,
                        help="Kuratierte Content-Schicht (tracker-content.yaml)")
    parser.add_argument("--output", type=Path, default=None,
                        help="Ziel-JSON (default: src/data/ai-crawler-tracker.json "
                             "dieses Repos; '-' schreibt nach stdout)")
    parser.add_argument("--force", action="store_true",
                        help="Plausibilitaets-Guard uebergehen")
    args = parser.parse_args()

    if not args.timeline.exists():
        log.error("Timeline fehlt: %s", args.timeline)
        return 1

    df = pd.read_csv(args.timeline)
    content = load_content(args.content)
    try:
        payload = build_payload(
            df,
            min_ratio=0.0 if args.force else 0.8,
            content=content,
            max_error_rate=1.0 if args.force else MAX_ERROR_RATE,
        )
    except (ThinSnapshotError, ErrorFloodError) as exc:
        log.error("%s (--force uebergeht)", exc)
        return 2
    text = json.dumps(payload, indent=2, ensure_ascii=False)

    output = args.output or DEFAULT_OUTPUT
    if str(output) == "-":
        print(text)
    else:
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(text + "\n", encoding="utf-8")
        log.info("Geschrieben: %s (Snapshot %s)", output, payload["meta"]["snapshot_date"])
    return 0


if __name__ == "__main__":
    sys.exit(main())
