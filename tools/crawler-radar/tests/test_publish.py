import pandas as pd
import pytest

import publish


def _tiny_timeline() -> pd.DataFrame:
    # 2 Daten, 2 Kategorien, 2 Sites je Kategorie, 2 Crawler
    rows = []
    for date in ("2026-06-01", "2026-06-15"):
        for cat, sites in (("platform", ["Reddit", "LinkedIn"]),
                           ("ecommerce", ["Migros", "Brack"])):
            for site in sites:
                for crawler, status in (("gptbot", "BLOCK"),
                                        ("amazonbot", "DEFAULT")):
                    # Brack liefert ERROR (Bot-Schutz)
                    st = "ERROR" if site == "Brack" else status
                    rows.append(dict(date=date, category=cat, region="CH",
                                     subcategory="", name=site, url=f"{site}.ch",
                                     crawler_id=crawler, bot_category="scraper",
                                     honors_robots=True, status=st))
    return pd.DataFrame(rows)


def test_meta_uses_latest_snapshot():
    payload = publish.build_payload(_tiny_timeline())
    assert payload["meta"]["snapshot_date"] == "2026-06-15"
    assert payload["meta"]["site_count"] == 4
    assert payload["meta"]["crawler_count"] == 2


def test_by_category_block_share_includes_error_in_denominator():
    payload = publish.build_payload(_tiny_timeline())
    cats = {c["category"]: c for c in payload["by_category"]}
    # platform: beide Sites erreichbar, gptbot=BLOCK, amazonbot=DEFAULT -> 2/4 = 0.5
    assert cats["platform"]["block_share"] == 0.5
    assert cats["platform"]["label"] == "Plattformen"
    # ecommerce: Migros gptbot BLOCK (1), Rest DEFAULT/ERROR -> 1/4 = 0.25
    assert cats["ecommerce"]["block_share"] == 0.25


def test_trend_has_one_entry_per_date():
    payload = publish.build_payload(_tiny_timeline())
    dates = [t["date"] for t in payload["trend"]]
    assert dates == ["2026-06-01", "2026-06-15"]
    assert "platform" in payload["trend"][0]["by_category"]


def test_methodology_is_nonempty_list():
    payload = publish.build_payload(_tiny_timeline())
    assert isinstance(payload["methodology"], list)
    assert len(payload["methodology"]) >= 3


def _change_timeline(site_crawler_transitions: dict) -> pd.DataFrame:
    """Baut eine 2-Daten-Timeline aus {site: {crawler_id: (prev_status, latest_status)}}."""
    rows = []
    for site, crawlers in site_crawler_transitions.items():
        for crawler, (prev_status, latest_status) in crawlers.items():
            for date, status in (("2026-06-01", prev_status), ("2026-06-15", latest_status)):
                rows.append(dict(date=date, category="platform", region="CH",
                                 subcategory="", name=site, url=f"{site}.ch",
                                 crawler_id=crawler, bot_category="scraper",
                                 honors_robots=True, status=status))
    return pd.DataFrame(rows)


def test_headline_reflects_change_stats_plural():
    # X: bot1 wechselt (BLOCK->DEFAULT), bot2 bleibt (BLOCK->BLOCK)
    # Y: bot1 bleibt (DEFAULT->DEFAULT), bot2 wechselt (BLOCK->DEFAULT)
    # Z: keine Wechsel
    # -> 2 geänderte Zellen (X/bot1, Y/bot2), 2 betroffene Sites (X, Y)
    df = _change_timeline({
        "X": {"bot1": ("BLOCK", "DEFAULT"), "bot2": ("BLOCK", "BLOCK")},
        "Y": {"bot1": ("DEFAULT", "DEFAULT"), "bot2": ("BLOCK", "DEFAULT")},
        "Z": {"bot1": ("BLOCK", "BLOCK"), "bot2": ("DEFAULT", "DEFAULT")},
    })

    n_changes, n_sites_changed = publish._change_stats(df, "2026-06-15")
    assert n_changes == 2
    assert n_sites_changed == 2

    payload = publish.build_payload(df)
    assert payload["headline"] == "Snapshot 2026-06-15: 2 Veränderungen auf 2 Sites."


def test_headline_reflects_change_stats_singular_site():
    # X: beide Crawler wechseln (2 geänderte Zellen, aber nur 1 betroffene Site)
    # Y: keine Wechsel
    df = _change_timeline({
        "X": {"bot1": ("BLOCK", "DEFAULT"), "bot2": ("BLOCK", "DEFAULT")},
        "Y": {"bot1": ("DEFAULT", "DEFAULT"), "bot2": ("BLOCK", "BLOCK")},
    })

    n_changes, n_sites_changed = publish._change_stats(df, "2026-06-15")
    assert n_changes == 2
    assert n_sites_changed == 1

    payload = publish.build_payload(df)
    assert payload["headline"] == "Snapshot 2026-06-15: 2 Veränderungen auf 1 Site."


def _by_crawler_timeline() -> pd.DataFrame:
    # Ein Snapshot-Datum, 4 Sites, 2 Crawler mit unterschiedlichem Block-Share:
    # bot_high: BLOCK, BLOCK, BLOCK, DEFAULT -> 3/4 = 0.75, blocked_sites=3
    # bot_low:  BLOCK, DEFAULT, DEFAULT, DEFAULT -> 1/4 = 0.25, blocked_sites=1
    statuses = {
        "bot_high": {"S1": "BLOCK", "S2": "BLOCK", "S3": "BLOCK", "S4": "DEFAULT"},
        "bot_low": {"S1": "BLOCK", "S2": "DEFAULT", "S3": "DEFAULT", "S4": "DEFAULT"},
    }
    rows = []
    for crawler, site_status in statuses.items():
        for site, status in site_status.items():
            rows.append(dict(date="2026-06-15", category="platform", region="CH",
                             subcategory="", name=site, url=f"{site}.ch",
                             crawler_id=crawler, bot_category="scraper",
                             honors_robots=True, status=status))
    return pd.DataFrame(rows)


def test_by_crawler_block_share_and_sorting():
    payload = publish.build_payload(_by_crawler_timeline())
    by_crawler = payload["by_crawler"]

    assert [c["crawler_id"] for c in by_crawler] == ["bot_high", "bot_low"]

    crawlers = {c["crawler_id"]: c for c in by_crawler}
    assert crawlers["bot_high"]["block_share"] == 0.75
    assert crawlers["bot_low"]["block_share"] == 0.25

    # sortiert absteigend nach block_share
    shares = [c["block_share"] for c in by_crawler]
    assert shares == sorted(shares, reverse=True)


def test_by_crawler_blocked_sites_counts_distinct_sites():
    payload = publish.build_payload(_by_crawler_timeline())
    crawlers = {c["crawler_id"]: c for c in payload["by_crawler"]}

    assert crawlers["bot_high"]["blocked_sites"] == 3
    assert crawlers["bot_low"]["blocked_sites"] == 1


def test_runs_one_entry_per_date_descending():
    payload = publish.build_payload(_tiny_timeline())
    assert [r["date"] for r in payload["runs"]] == ["2026-06-15", "2026-06-01"]


def test_runs_first_run_has_null_changes_and_erstsnapshot_summary():
    payload = publish.build_payload(_tiny_timeline())
    first = payload["runs"][-1]
    assert first["changes"] is None
    assert first["sites_changed"] is None
    assert first["summary"] == "Erst-Snapshot: 4 Sites × 2 Crawler."
    assert first["commentary"] is None


def test_runs_mechanical_summary_names_changed_sites():
    df = _change_timeline({
        "X": {"bot1": ("BLOCK", "DEFAULT"), "bot2": ("BLOCK", "BLOCK")},
        "Y": {"bot1": ("DEFAULT", "DEFAULT"), "bot2": ("BLOCK", "DEFAULT")},
        "Z": {"bot1": ("BLOCK", "BLOCK"), "bot2": ("DEFAULT", "DEFAULT")},
    })
    latest = publish.build_payload(df)["runs"][0]
    assert latest["changes"] == 2
    assert latest["sites_changed"] == 2
    assert latest["summary"] == "2 Veränderungen auf 2 Sites (X, Y)."
    assert latest["commentary"] is None


def test_runs_mechanical_summary_singular_site():
    df = _change_timeline({
        "X": {"bot1": ("BLOCK", "DEFAULT"), "bot2": ("BLOCK", "DEFAULT")},
        "Y": {"bot1": ("DEFAULT", "DEFAULT"), "bot2": ("BLOCK", "BLOCK")},
    })
    latest = publish.build_payload(df)["runs"][0]
    assert latest["summary"] == "2 Veränderungen auf 1 Site (X)."


def test_runs_zero_changes_summary():
    df = _change_timeline({"X": {"bot1": ("BLOCK", "BLOCK")}})
    latest = publish.build_payload(df)["runs"][0]
    assert latest["changes"] == 0
    assert latest["sites_changed"] == 0
    assert latest["summary"] == "Keine Veränderungen gegenüber dem Vor-Snapshot."


def test_runs_summary_caps_site_names_at_three():
    df = _change_timeline({
        "A": {"bot1": ("BLOCK", "DEFAULT")},
        "B": {"bot1": ("BLOCK", "DEFAULT")},
        "C": {"bot1": ("BLOCK", "DEFAULT")},
        "D": {"bot1": ("BLOCK", "DEFAULT")},
    })
    latest = publish.build_payload(df)["runs"][0]
    assert latest["summary"] == "4 Veränderungen auf 4 Sites (A, B, C, u.a.)."


def test_runs_pairwise_across_three_dates():
    rows = []
    for date, status in (("2026-06-01", "BLOCK"),
                         ("2026-06-15", "DEFAULT"),
                         ("2026-06-29", "DEFAULT")):
        rows.append(dict(date=date, category="platform", region="CH",
                         subcategory="", name="X", url="X.ch",
                         crawler_id="bot1", bot_category="scraper",
                         honors_robots=True, status=status))
    runs = publish.build_payload(pd.DataFrame(rows))["runs"]
    assert [r["date"] for r in runs] == ["2026-06-29", "2026-06-15", "2026-06-01"]
    assert runs[0]["changes"] == 0   # 06-29 vs. 06-15
    assert runs[1]["changes"] == 1   # 06-15 vs. 06-01
    assert runs[1]["summary"] == "1 Veränderung auf 1 Site (X)."
    assert runs[2]["changes"] is None


def test_runs_curated_override_keeps_mechanical_stats():
    content = {"runs": {"2026-06-15": {"summary": "Kuratiert.",
                                       "commentary": "Einordnung."}}}
    payload = publish.build_payload(_tiny_timeline(), content=content)
    latest = payload["runs"][0]
    assert latest["summary"] == "Kuratiert."
    assert latest["commentary"] == "Einordnung."
    assert latest["changes"] == 0  # Zahlen bleiben mechanisch


def test_sites_from_latest_snapshot_sorted_by_category_then_name():
    payload = publish.build_payload(_tiny_timeline())
    sites = payload["sites"]
    assert len(sites) == 4
    assert sites[0] == {"name": "Brack", "domain": "Brack.ch",
                        "category": "ecommerce", "label": "E-Commerce"}
    assert [s["name"] for s in sites] == ["Brack", "Migros", "LinkedIn", "Reddit"]


def test_methodology_details_default_empty():
    payload = publish.build_payload(_tiny_timeline())
    assert payload["methodology_details"] == []


def test_methodology_details_from_content():
    content = {"methodology_details": [{"title": "Erhebung", "body": "So."}]}
    payload = publish.build_payload(_tiny_timeline(), content=content)
    assert payload["methodology_details"] == [{"title": "Erhebung", "body": "So."}]


def test_load_content_missing_file_returns_empty(tmp_path):
    assert publish.load_content(tmp_path / "nope.yaml") == {}


def test_load_content_normalizes_yaml_date_keys(tmp_path):
    p = tmp_path / "content.yaml"
    p.write_text("runs:\n  2026-06-15:\n    summary: S\n", encoding="utf-8")
    content = publish.load_content(p)
    assert content["runs"]["2026-06-15"]["summary"] == "S"


def test_thin_snapshot_raises():
    df = _tiny_timeline()
    # jüngsten Snapshot künstlich ausdünnen: nur 1 von 4 Sites behalten
    latest = df["date"].max()
    thin = df[(df["date"] != latest) | (df["name"] == "Reddit")]
    with pytest.raises(publish.ThinSnapshotError):
        publish.build_payload(thin, min_ratio=0.8)


def test_thin_snapshot_allowed_with_low_threshold():
    df = _tiny_timeline()
    latest = df["date"].max()
    thin = df[(df["date"] != latest) | (df["name"] == "Reddit")]
    payload = publish.build_payload(thin, min_ratio=0.0)
    assert payload["meta"]["site_count"] == 1


def test_error_flood_raises():
    """Netz weg zur Cron-Zeit: volle Site-Zahl, aber nur ERROR-Zellen. Der
    Site-Guard sieht das nicht – der Error-Guard muss (Incident 2026-07-20)."""
    df = _tiny_timeline()
    latest = df["date"].max()
    df.loc[df["date"] == latest, "status"] = "ERROR"
    with pytest.raises(publish.ErrorFloodError):
        publish.build_payload(df)


def test_error_flood_tolerates_normal_bot_protection():
    """Die Fixture hat eine von vier Sites dauerhaft auf ERROR (Bot-Schutz) –
    das ist der Normalfall und darf nicht blockieren."""
    payload = publish.build_payload(_tiny_timeline())
    assert payload["meta"]["site_count"] == 4


def test_error_flood_allowed_with_force_threshold():
    df = _tiny_timeline()
    latest = df["date"].max()
    df.loc[df["date"] == latest, "status"] = "ERROR"
    payload = publish.build_payload(df, max_error_rate=1.0)
    assert payload["meta"]["snapshot_date"] == latest


def test_by_crawler_carries_bot_metadata():
    """by_crawler trägt Typ-Metadaten: bot_category/honors_robots aus der
    Timeline, provider aus crawlers.yaml ([[Typen von KI Bots]]-Taxonomie)."""
    payload = publish.build_payload(_tiny_timeline())
    cr = {c["crawler_id"]: c for c in payload["by_crawler"]}
    assert cr["gptbot"]["bot_category"] == "scraper"
    assert cr["gptbot"]["provider"] == "OpenAI"
    assert cr["gptbot"]["honors_robots"] is True
    assert cr["amazonbot"]["provider"] == "Amazon"


def test_by_crawler_unknown_crawler_has_no_provider():
    """Crawler ohne crawlers.yaml-Eintrag: provider None, kein Crash."""
    df = _tiny_timeline()
    df.loc[df["crawler_id"] == "amazonbot", "crawler_id"] = "mysterybot"
    payload = publish.build_payload(df)
    cr = {c["crawler_id"]: c for c in payload["by_crawler"]}
    assert cr["mysterybot"]["provider"] is None
    assert cr["mysterybot"]["bot_category"] == "scraper"


def test_generated_at_is_zurich_time_even_if_process_runs_in_utc(monkeypatch):
    """Server-Cron läuft mit Prozess-Zeitzone UTC (CRON_TZ stellt nur den
    Trigger). generated_at muss trotzdem Zürcher Zeit tragen."""
    import time
    from datetime import datetime
    from zoneinfo import ZoneInfo

    monkeypatch.setenv("TZ", "UTC")
    time.tzset()
    try:
        payload = publish.build_payload(_tiny_timeline())
    finally:
        monkeypatch.undo()
        time.tzset()
    stamp = datetime.fromisoformat(payload["meta"]["generated_at"])
    expected = datetime.now(ZoneInfo("Europe/Zurich")).utcoffset()
    assert stamp.utcoffset() == expected
    assert stamp.utcoffset().total_seconds() in (3600, 7200)


def test_default_output_is_tracker_json_in_this_repo():
    """Ohne --output schreibt publish.py ins Tracker-JSON der Site – abgeleitet
    aus der Skript-Position, nicht aus einem absoluten Pfad."""
    from pathlib import Path

    repo_root = Path(publish.__file__).resolve().parents[2]
    assert (repo_root / "astro.config.mjs").is_file()
    assert publish.DEFAULT_OUTPUT == repo_root / "src" / "data" / "ai-crawler-tracker.json"
    assert publish.DEFAULT_OUTPUT.is_file()


def test_main_without_output_writes_default_path(tmp_path, monkeypatch):
    target = tmp_path / "tracker.json"
    timeline = tmp_path / "timeline.csv"
    _tiny_timeline().to_csv(timeline, index=False)
    monkeypatch.setattr(publish, "DEFAULT_OUTPUT", target)
    monkeypatch.setattr("sys.argv", ["publish.py", "--timeline", str(timeline)])
    assert publish.main() == 0
    assert '"snapshot_date": "2026-06-15"' in target.read_text(encoding="utf-8")


def test_main_output_dash_prints_to_stdout(tmp_path, monkeypatch, capsys):
    target = tmp_path / "tracker.json"
    timeline = tmp_path / "timeline.csv"
    _tiny_timeline().to_csv(timeline, index=False)
    monkeypatch.setattr(publish, "DEFAULT_OUTPUT", target)
    monkeypatch.setattr("sys.argv", ["publish.py", "--timeline", str(timeline), "--output", "-"])
    assert publish.main() == 0
    assert '"snapshot_date": "2026-06-15"' in capsys.readouterr().out
    assert not target.exists()
