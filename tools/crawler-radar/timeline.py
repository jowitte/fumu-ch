#!/usr/bin/env python3
"""Konsolidiert alle Snapshots zu Long-Format-Timeline.

Liest data/snapshot-*.json, mappt unterschiedliche Schema-Versionen, schreibt:
- data/timeline.csv  Long-Format mit einer Zeile pro (date, site, crawler)
- data/timeline.json Identische Daten als JSON (für Tools, die kein CSV mögen)

Schema-Versionen:
- "current"  Snapshot mit category/region/subcategory pro Site
- "legacy"   Snapshot mit market pro Site (vor 2026-04-27 Schema-Wechsel).
             Wird heuristisch auf publisher_paywall/publisher_open gemappt.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import pandas as pd
import yaml


HERE = Path(__file__).parent
DEFAULT_DATA_DIR = HERE / "data"
CRAWLERS_PATH = HERE / "crawlers.yaml"

# Heuristik für Pre-Schema-Snapshots: Klassifikation der ursprünglichen 32 Sites.
LEGACY_PUBLISHER_PAYWALL = {
    "NZZ", "Tages-Anzeiger", "Le Temps", "Republik", "Heidi.News", "Handelszeitung",
    "Spiegel", "Zeit", "FAZ", "Süddeutsche", "Welt", "Handelsblatt", "Manager Magazin",
    "Der Standard", "Die Presse",
    "NYT", "Washington Post", "FT", "WSJ", "Bloomberg",
}
LEGACY_PUBLISHER_OPEN = {
    "20 Minuten", "Blick", "Watson", "SRF", "Cash", "RTS",
    "Bild",
    "Kurier", "Profil",
    "BBC", "Guardian", "Reuters",
}


def load_crawler_lookup() -> dict[str, dict]:
    with CRAWLERS_PATH.open() as fh:
        crawlers = yaml.safe_load(fh)
    return {c["id"]: c for c in crawlers}


def detect_schema(snapshot: dict) -> str:
    rows = snapshot.get("rows", [])
    if not rows:
        return "current"
    if "market" in rows[0] and "category" not in rows[0]:
        return "legacy"
    return "current"


def normalize_row(row: dict, snapshot_date: str, schema: str) -> list[dict]:
    name = row["name"]
    url = row["url"]

    if schema == "legacy":
        market = row.get("market", "")
        if name in LEGACY_PUBLISHER_PAYWALL:
            category = "publisher_paywall"
        elif name in LEGACY_PUBLISHER_OPEN:
            category = "publisher_open"
        else:
            category = "publisher_paywall"  # konservative Default-Annahme
        region = market
        subcategory = ""
    else:
        category = row["category"]
        region = row.get("region", "")
        subcategory = row.get("subcategory") or ""

    records = []
    for crawler_id, status in row["results"].items():
        records.append({
            "date": snapshot_date,
            "category": category,
            "region": region,
            "subcategory": subcategory,
            "name": name,
            "url": url,
            "crawler_id": crawler_id,
            "status": status,
        })
    return records


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Konsolidiert Snapshots zu Long-Format-Timeline."
    )
    parser.add_argument("--data-dir", type=Path, default=DEFAULT_DATA_DIR)
    args = parser.parse_args()

    crawler_lookup = load_crawler_lookup()
    snapshots = sorted(args.data_dir.glob("snapshot-*.json"))
    if not snapshots:
        print(f"Keine Snapshots in {args.data_dir}", file=sys.stderr)
        return 1

    print(f"Konsolidiere {len(snapshots)} Snapshots...", file=sys.stderr)

    all_records: list[dict] = []
    schemas_seen: dict[str, int] = {}
    for path in snapshots:
        with path.open() as fh:
            snapshot = json.load(fh)
        schema = detect_schema(snapshot)
        schemas_seen[schema] = schemas_seen.get(schema, 0) + 1
        snapshot_date = snapshot.get("generated_at", path.stem.replace("snapshot-", ""))
        for row in snapshot["rows"]:
            all_records.extend(normalize_row(row, snapshot_date, schema))

    df = pd.DataFrame(all_records)
    df["bot_category"] = df["crawler_id"].map(
        lambda cid: crawler_lookup.get(cid, {}).get("bot_category", "unknown")
    )
    df["honors_robots"] = df["crawler_id"].map(
        lambda cid: crawler_lookup.get(cid, {}).get("honors_robots", True)
    )

    df = df[[
        "date", "category", "region", "subcategory", "name", "url",
        "crawler_id", "bot_category", "honors_robots", "status",
    ]]

    df = df.sort_values(["date", "category", "region", "name", "crawler_id"]).reset_index(drop=True)

    csv_path = args.data_dir / "timeline.csv"
    json_path = args.data_dir / "timeline.json"

    df.to_csv(csv_path, index=False)
    df.to_json(json_path, orient="records", indent=2, force_ascii=False)

    print(f"\nGeschrieben: {csv_path} ({len(df)} Zeilen)", file=sys.stderr)
    print(f"Geschrieben: {json_path}", file=sys.stderr)
    print(f"\nSchemas: {schemas_seen}", file=sys.stderr)
    print(f"Snapshots: {df['date'].nunique()} ({sorted(df['date'].unique().tolist())})", file=sys.stderr)
    print(f"Sites: {df.groupby(['category', 'name']).ngroups}", file=sys.stderr)
    print(f"Crawler: {df['crawler_id'].nunique()}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
