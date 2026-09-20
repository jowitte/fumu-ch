#!/usr/bin/env python3
"""Vergleicht zwei Snapshots und schreibt einen Markdown-Diff.

Logik:
- Severity-Skala mappt Status auf 0 (erlaubt) / 1 (teilweise) / 2 (blockiert).
- Verschärfung = severity_neu > severity_alt
- Lockerung   = severity_neu < severity_alt
- Andere Statuswechsel mit gleichem Effekt (z.B. DEFAULT → ALLOW) werden
  separat als "Andere Wechsel" gelistet — können relevant sein für Audit.

ERROR wird separat behandelt: "Erst verfügbar" / "Nicht mehr verfügbar".

Usage:
    diff.py [--from <date>] [--to <date>] [--output <pfad>]
    Default: jüngste zwei Snapshots, Output data/diff-<to>.md
"""

from __future__ import annotations

import argparse
import json
import sys
from collections import defaultdict
from pathlib import Path
from typing import Optional


HERE = Path(__file__).parent
DEFAULT_DATA_DIR = HERE / "data"

SEVERITY = {
    "ALLOW": 0,
    "DEFAULT": 0,
    "SELECTIVE": 1,
    "DEFAULT_BLOCKED": 2,
    "BLOCK": 2,
}


def load_snapshot(path: Path) -> dict:
    with path.open() as fh:
        return json.load(fh)


def index_results(snapshot: dict) -> dict[tuple[str, str], dict]:
    """Index (name, crawler_id) → {status, category, region, ...}."""
    index = {}
    for row in snapshot["rows"]:
        meta = {
            "category": row.get("category") or _legacy_category(row),
            "region": row.get("region") or row.get("market", ""),
            "name": row["name"],
            "url": row["url"],
        }
        for crawler_id, status in row["results"].items():
            index[(row["name"], crawler_id)] = {**meta, "status": status}
    return index


def _legacy_category(row: dict) -> str:
    """Heuristik für Pre-Schema-Snapshots."""
    name = row["name"]
    paywall = {"NZZ", "Tages-Anzeiger", "Le Temps", "Republik", "Heidi.News",
               "Handelszeitung", "Spiegel", "Zeit", "FAZ", "Süddeutsche", "Welt",
               "Handelsblatt", "Manager Magazin", "Der Standard", "Die Presse",
               "NYT", "Washington Post", "FT", "WSJ", "Bloomberg"}
    return "publisher_paywall" if name in paywall else "publisher_open"


def severity(status: str) -> Optional[int]:
    return SEVERITY.get(status)


def categorize_change(old_status: str, new_status: str) -> str:
    """Kategorisiert einen Status-Wechsel.

    Returns: "verschärft" | "gelockert" | "andere" | "neu_error" | "wieder_verfügbar"
    """
    if old_status == new_status:
        return "unverändert"
    if new_status == "ERROR":
        return "neu_error"
    if old_status == "ERROR":
        return "wieder_verfügbar"
    s_old = severity(old_status)
    s_new = severity(new_status)
    if s_old is None or s_new is None:
        return "andere"
    if s_new > s_old:
        return "verschärft"
    if s_new < s_old:
        return "gelockert"
    return "andere"


def block_share(rows: list[dict]) -> float:
    """Anteil der Zellen mit BLOCK / DEFAULT_BLOCKED."""
    if not rows:
        return 0.0
    n_block = sum(1 for r in rows if r["status"] in ("BLOCK", "DEFAULT_BLOCKED"))
    return n_block / len(rows)


def aggregate_by_category(snapshot: dict) -> dict[str, list[dict]]:
    """Sammelt alle (status)-Zellen pro category."""
    by_cat: dict[str, list[dict]] = defaultdict(list)
    for row in snapshot["rows"]:
        cat = row.get("category") or _legacy_category(row)
        for crawler_id, status in row["results"].items():
            by_cat[cat].append({"status": status, "crawler_id": crawler_id})
    return by_cat


def render_diff(
    old_snap: dict,
    new_snap: dict,
    old_date: str,
    new_date: str,
) -> str:
    old_idx = index_results(old_snap)
    new_idx = index_results(new_snap)

    common = sorted(set(old_idx) & set(new_idx))
    only_new = sorted(set(new_idx) - set(old_idx))
    only_old = sorted(set(old_idx) - set(new_idx))

    by_cat: dict[str, list[tuple[tuple[str, str], str, str]]] = defaultdict(list)
    for key in common:
        old_status = old_idx[key]["status"]
        new_status = new_idx[key]["status"]
        cat_change = categorize_change(old_status, new_status)
        if cat_change == "unverändert":
            continue
        by_cat[cat_change].append((key, old_status, new_status))

    out: list[str] = []
    out.append(f"# Robots-Diff {new_date} vs. {old_date}")
    out.append("")
    out.append(f"**Vergleich:** {len(common)} überlappende Zellen, "
               f"{len([k for k in by_cat.values() for _ in k])} Veränderungen.")
    out.append("")

    section_titles = [
        ("verschärft", "Verschärft (neu blockiert / restriktiver)"),
        ("gelockert", "Gelockert (neu erlaubt / weniger restriktiv)"),
        ("neu_error", "Neu nicht erreichbar"),
        ("wieder_verfügbar", "Wieder erreichbar"),
        ("andere", "Andere Statuswechsel (gleiche Wirkung, andere Form)"),
    ]
    for key, title in section_titles:
        items = by_cat.get(key, [])
        if not items:
            continue
        out.append(f"## {title}")
        out.append("")
        # nach Kategorie/Region/Name gruppieren für lesbarere Darstellung
        items.sort(key=lambda x: (
            new_idx[x[0]]["category"], new_idx[x[0]]["region"], x[0][0], x[0][1]
        ))
        for (name, crawler_id), old_st, new_st in items:
            meta = new_idx[(name, crawler_id)]
            cat_label = meta["category"]
            region = meta["region"]
            out.append(
                f"- **{name}** ({cat_label}/{region}) × {crawler_id}: "
                f"`{old_st}` → `{new_st}`"
            )
        out.append("")

    if only_new:
        out.append("## Neu im Sample")
        out.append("")
        seen_sites = set()
        for name, crawler_id in only_new:
            if name in seen_sites:
                continue
            seen_sites.add(name)
            meta = new_idx[(name, crawler_id)]
            out.append(f"- **{name}** ({meta['category']}/{meta['region']})")
        out.append("")

    if only_old:
        out.append("## Aus Sample entfernt")
        out.append("")
        seen_sites = set()
        for name, crawler_id in only_old:
            if name in seen_sites:
                continue
            seen_sites.add(name)
            out.append(f"- **{name}**")
        out.append("")

    # Aggregat-Sektion: Block-Quote pro Kategorie
    out.append("## Aggregat")
    out.append("")
    old_by_cat = aggregate_by_category(old_snap)
    new_by_cat = aggregate_by_category(new_snap)
    all_cats = sorted(set(old_by_cat) | set(new_by_cat))
    out.append("| Kategorie | Block-Quote alt | Block-Quote neu | Δ |")
    out.append("|---|---|---|---|")
    for cat in all_cats:
        old_q = block_share(old_by_cat.get(cat, [])) * 100
        new_q = block_share(new_by_cat.get(cat, [])) * 100
        delta = new_q - old_q
        arrow = "↑" if delta > 0.5 else ("↓" if delta < -0.5 else "→")
        out.append(f"| {cat} | {old_q:.0f}% | {new_q:.0f}% | {arrow} {delta:+.0f} |")
    out.append("")

    return "\n".join(out)


def main() -> int:
    parser = argparse.ArgumentParser(description="Diff zwischen zwei Snapshots.")
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    parser.add_argument("--from", dest="from_date", help="alte Snapshot-Datum (default: zweitjüngster)")
    parser.add_argument("--to", dest="to_date", help="neuer Snapshot-Datum (default: jüngster)")
    parser.add_argument("--output", type=Path, help="Output-Pfad (default: data/diff-<to>.md)")
    args = parser.parse_args()

    snapshots = sorted(args.data_dir.glob("snapshot-*.json"))
    if len(snapshots) < 2:
        print(f"Brauche mind. 2 Snapshots in {args.data_dir}, gefunden: {len(snapshots)}",
              file=sys.stderr)
        return 1

    if args.to_date:
        new_path = args.data_dir / f"snapshot-{args.to_date}.json"
    else:
        new_path = snapshots[-1]
    if args.from_date:
        old_path = args.data_dir / f"snapshot-{args.from_date}.json"
    else:
        # Default: zweitjüngster
        if new_path == snapshots[-1]:
            old_path = snapshots[-2]
        else:
            idx = snapshots.index(new_path)
            old_path = snapshots[idx - 1]

    if not old_path.exists() or not new_path.exists():
        print(f"Snapshot fehlt: {old_path if not old_path.exists() else new_path}",
              file=sys.stderr)
        return 1

    old_snap = load_snapshot(old_path)
    new_snap = load_snapshot(new_path)
    old_date = old_snap.get("generated_at", old_path.stem.replace("snapshot-", ""))
    new_date = new_snap.get("generated_at", new_path.stem.replace("snapshot-", ""))

    print(f"Diff: {old_date} → {new_date}", file=sys.stderr)

    md = render_diff(old_snap, new_snap, old_date, new_date)

    output = args.output or (args.data_dir / f"diff-{new_date}.md")
    output.write_text(md, encoding="utf-8")
    print(f"Geschrieben: {output}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
