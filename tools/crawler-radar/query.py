#!/usr/bin/env python3
"""Ad-hoc Aggregations-Query auf timeline.csv.

Filter, gruppiert und aggregiert die Long-Format-Timeline. Output als CSV
oder JSON, default auf stdout.

Beispiele:
    # Block-Quote der CH-Brands pro Branche × Bot-Typ
    query.py --filter "category=brand,region=CH" \
             --group-by "subcategory,bot_category" --metric block_share

    # Aktueller Status pro Site × Crawler (für Heatmap)
    query.py --filter "date=latest" --group-by "category,name,crawler_id" --metric status

    # Vordefinierte Sicht aus presets.yaml
    query.py --preset aggregated_block_quote
"""

from __future__ import annotations

import argparse
import sys
from pathlib import Path
from typing import Optional

import pandas as pd
import yaml


HERE = Path(__file__).parent
DEFAULT_TIMELINE = HERE / "data" / "timeline.csv"
DEFAULT_PRESETS = HERE / "presets.yaml"


METRIC_BLOCK_STATES = {"BLOCK", "DEFAULT_BLOCKED"}
METRIC_ALLOW_STATES = {"ALLOW", "DEFAULT"}
METRIC_SELECTIVE_STATES = {"SELECTIVE"}


def parse_filter(filter_str: str) -> dict[str, list[str]]:
    """Parst 'feld=wert,feld=wert1|wert2' zu Dict."""
    result: dict[str, list[str]] = {}
    if not filter_str:
        return result
    for clause in filter_str.split(","):
        clause = clause.strip()
        if not clause or "=" not in clause:
            continue
        field, _, value = clause.partition("=")
        field = field.strip()
        values = [v.strip() for v in value.split("|") if v.strip()]
        result[field] = values
    return result


def apply_filter(df: pd.DataFrame, filters: dict[str, list[str]]) -> pd.DataFrame:
    """Wendet Filter-Dict auf DataFrame an. 'date=latest' ist Spezialfall."""
    out = df
    for field, values in filters.items():
        if field == "date" and values == ["latest"]:
            latest = out["date"].max()
            out = out[out["date"] == latest]
            continue
        if field not in out.columns:
            print(f"Warnung: Feld '{field}' nicht in Daten — Filter ignoriert.",
                  file=sys.stderr)
            continue
        out = out[out[field].isin(values)]
    return out


def aggregate(df: pd.DataFrame, group_by: list[str], metric: str) -> pd.DataFrame:
    """Aggregiert mit gegebener Metrik."""
    if not group_by:
        # Keine Gruppierung: berechne Metrik über kompletten Frame
        return pd.DataFrame([_compute_metric(df, metric)])

    grouped = df.groupby(group_by, dropna=False)

    if metric == "count":
        return grouped.size().reset_index(name="count")
    if metric == "block_share":
        agg = grouped.apply(lambda g: (g["status"].isin(METRIC_BLOCK_STATES)).mean(),
                            include_groups=False)
        return agg.reset_index(name="block_share")
    if metric == "allow_share":
        agg = grouped.apply(lambda g: (g["status"].isin(METRIC_ALLOW_STATES)).mean(),
                            include_groups=False)
        return agg.reset_index(name="allow_share")
    if metric == "selective_share":
        agg = grouped.apply(lambda g: (g["status"].isin(METRIC_SELECTIVE_STATES)).mean(),
                            include_groups=False)
        return agg.reset_index(name="selective_share")
    if metric == "status":
        # Modal-Wert pro Gruppe (häufigster Status, bei Tie der erste alphabetisch)
        agg = grouped["status"].agg(
            lambda s: s.value_counts().idxmax() if not s.empty else ""
        )
        return agg.reset_index(name="status")
    if metric == "change_count":
        # Anzahl Statuswechsel pro Gruppe entlang der Datums-Achse
        if "date" not in df.columns:
            raise ValueError("change_count braucht 'date' in den Daten")
        # Gruppiere ohne date (date wird zur Wechsel-Berechnung gebraucht)
        gb_no_date = [g for g in group_by if g != "date"]
        if not gb_no_date:
            raise ValueError("change_count braucht mind. ein Gruppierungs-Feld neben 'date'")
        df_sorted = df.sort_values(["date"])
        agg = df_sorted.groupby(gb_no_date, dropna=False)["status"].apply(
            lambda s: int((s != s.shift()).sum() - 1) if len(s) > 1 else 0
        )
        return agg.reset_index(name="change_count")

    raise ValueError(f"Unbekannte Metrik: {metric}")


def _compute_metric(df: pd.DataFrame, metric: str) -> dict:
    if metric == "count":
        return {"count": len(df)}
    if metric == "block_share":
        return {"block_share": df["status"].isin(METRIC_BLOCK_STATES).mean() if len(df) else 0.0}
    if metric == "allow_share":
        return {"allow_share": df["status"].isin(METRIC_ALLOW_STATES).mean() if len(df) else 0.0}
    if metric == "selective_share":
        return {"selective_share": df["status"].isin(METRIC_SELECTIVE_STATES).mean() if len(df) else 0.0}
    raise ValueError(f"Metrik '{metric}' braucht --group-by")


def load_preset(name: str, presets_path: Path) -> dict:
    with presets_path.open() as fh:
        presets = yaml.safe_load(fh)
    if name not in presets:
        raise SystemExit(f"Preset '{name}' nicht gefunden. Verfügbar: {list(presets)}")
    return presets[name]


def run_query(
    df: pd.DataFrame,
    filter_str: str,
    group_by: list[str],
    metric: str,
) -> pd.DataFrame:
    filters = parse_filter(filter_str)
    filtered = apply_filter(df, filters)
    if filtered.empty:
        print("Warnung: Filter liefert keine Zeilen.", file=sys.stderr)
    return aggregate(filtered, group_by, metric)


def main() -> int:
    parser = argparse.ArgumentParser(description="Ad-hoc Query auf timeline.csv")
    parser.add_argument("--timeline", type=Path, default=DEFAULT_TIMELINE)
    parser.add_argument("--presets", type=Path, default=DEFAULT_PRESETS)
    parser.add_argument("--preset", help="Preset-Name aus presets.yaml")
    parser.add_argument("--filter", default="", help="z.B. 'category=brand,region=CH'")
    parser.add_argument("--group-by", default="", help="z.B. 'subcategory,bot_category'")
    parser.add_argument("--metric", default="count",
                        choices=["count", "block_share", "allow_share",
                                 "selective_share", "status", "change_count"])
    parser.add_argument("--output", type=Path, help="Output-Datei (default: stdout)")
    parser.add_argument("--format", choices=["csv", "json"], default="csv")
    args = parser.parse_args()

    if not args.timeline.exists():
        print(f"Timeline fehlt: {args.timeline}. Bitte erst timeline.py laufen lassen.",
              file=sys.stderr)
        return 1

    df = pd.read_csv(args.timeline)

    if args.preset:
        preset = load_preset(args.preset, args.presets)
        q = preset.get("query", {})
        filter_str = q.get("filter", args.filter)
        group_by = [g.strip() for g in q.get("group_by", "").split(",") if g.strip()]
        metric = q.get("metric", args.metric)
    else:
        filter_str = args.filter
        group_by = [g.strip() for g in args.group_by.split(",") if g.strip()]
        metric = args.metric

    result = run_query(df, filter_str, group_by, metric)

    if args.output:
        if args.format == "json":
            result.to_json(args.output, orient="records", indent=2, force_ascii=False)
        else:
            result.to_csv(args.output, index=False)
        print(f"Geschrieben: {args.output} ({len(result)} Zeilen)", file=sys.stderr)
    else:
        if args.format == "json":
            print(result.to_json(orient="records", indent=2, force_ascii=False))
        else:
            print(result.to_csv(index=False), end="")

    return 0


if __name__ == "__main__":
    sys.exit(main())
