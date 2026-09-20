#!/usr/bin/env python3
"""Robots.txt-Analyzer für AI-Crawler-Policies.

Lädt robots.txt von einer Sample-Liste, parst pro AI-Crawler den effektiven
Status (BLOCK / ALLOW / SELECTIVE / DEFAULT) und gibt Daten als JSON und CSV
aus.

Robots.txt-Spec-Verhalten:
- User-agent matching ist case-insensitive (per RFC 9309).
- Multiple User-agent-Lines vor einem Direktiven-Block: alle Agents teilen
  sich den Block.
- Kein passendes User-agent-Match → fallback auf User-agent: * (catchall).
- Keine Disallow-Linie für einen Crawler → erlaubt.
- Disallow: / → komplett blockiert.
- Disallow: <empty> → komplett erlaubt.
- Disallow: /pfad → teilweise blockiert (SELECTIVE).
- Allow überschreibt Disallow für spezifischere Pfade.

Status-Codes:
- BLOCK: Crawler-Pfad / blockiert (explizit oder durch *).
- ALLOW: Explizit erlaubt (Disallow: leer oder Allow: /).
- SELECTIVE: Explizit erwähnt, partial Disallow.
- DEFAULT: Crawler nicht erwähnt, keine catchall-Sperre — implizit erlaubt.
- DEFAULT_BLOCKED: Crawler nicht erwähnt, * blockiert alle.
- ERROR: robots.txt nicht verfügbar.

Usage:
    python analyze.py [--sample sample.yaml] [--crawlers crawlers.yaml]
                      [--output data/snapshot-YYYY-MM-DD.json]
"""

from __future__ import annotations

import argparse
import csv
import gzip
import json
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from dataclasses import dataclass, field, asdict
from datetime import date
from pathlib import Path
from typing import Optional

import urllib.request
import urllib.error
import urllib.parse

import yaml


HERE = Path(__file__).parent
DEFAULT_SAMPLE = HERE / "sample.yaml"
DEFAULT_CRAWLERS = HERE / "crawlers.yaml"
DEFAULT_OUTPUT_DIR = HERE / "data"

USER_AGENT_HEADER = "fumu-Crawler/1.0 (+https://fumu.ch; AI crawler policy research; respect robots)"
TIMEOUT_SECONDS = 15


@dataclass
class CrawlerSpec:
    id: str
    user_agent: str
    bot_category: str  # scraper | assistant | search | agent
    provider: str
    label: str
    purpose: str = ""  # legacy-Feld, bleibt bis Migration komplett
    honors_robots: bool = True


@dataclass
class RobotsBlock:
    """Ein User-agent-Block mit zugeordneten Direktiven."""

    agents: list[str] = field(default_factory=list)
    disallow: list[str] = field(default_factory=list)
    allow: list[str] = field(default_factory=list)


def read_response(
    raw: bytes, content_encoding: Optional[str], final_url: str
) -> tuple[Optional[str], Optional[str]]:
    """Liest den Body einer 200-Antwort als robots.txt.

    Returns (text, reason). Status 200 heisst nicht, dass eine robots.txt kam:
    - gzip-Body (auch unangefragt) wird entpackt.
    - HTML nach einem Redirect weg von /robots.txt (Startseite, 404-Seite):
      die Datei fehlt, das gilt wie ein 404 → leerer Text.
    - HTML an der robots.txt-Adresse selbst (Captcha, JS-Challenge): kein
      Signal → (None, Grund), die Site landet als ERROR statt als DEFAULT.
    """
    if (content_encoding or "").lower() == "gzip" or raw[:2] == b"\x1f\x8b":
        try:
            raw = gzip.decompress(raw)
        except (OSError, EOFError) as exc:
            return None, f"gzip nicht lesbar: {exc}"

    text = None
    for enc in ("utf-8", "latin-1"):
        try:
            text = raw.decode(enc)
            break
        except UnicodeDecodeError:
            continue
    if text is None:
        text = raw.decode("utf-8", errors="replace")

    head = text.lstrip("﻿ \t\r\n")[:200].lower()
    if head.startswith(("<!doctype", "<html", "<head", "<body", "<script")):
        path = urllib.parse.urlsplit(final_url).path.rstrip("/").lower()
        if path.endswith("/robots.txt"):
            return None, "HTML statt robots.txt (Bot-Schutz)"
        return "", None
    return text, None


def fetch_robots(url_host: str) -> tuple[Optional[str], Optional[str]]:
    """Lädt robots.txt von https://<host>/robots.txt.

    Returns (text, error). Fallback http nur wenn https scheitert.
    Probiert für jede Domain auch www.-Subdomain als Fallback (manche Sites
    haben dort die "echte" robots.txt). 404 wird als leerer Text behandelt
    (kein robots.txt = alles erlaubt per RFC 9309). Den Body prüft
    read_response – eine Captcha-Seite mit Status 200 ist keine robots.txt.
    """
    last_error = None
    candidates = [url_host]
    if not url_host.startswith("www."):
        candidates.append(f"www.{url_host}")

    saw_404 = False
    for host in candidates:
        for scheme in ("https", "http"):
            url = f"{scheme}://{host}/robots.txt"
            try:
                req = urllib.request.Request(
                    url, headers={"User-Agent": USER_AGENT_HEADER}
                )
                with urllib.request.urlopen(req, timeout=TIMEOUT_SECONDS) as resp:
                    if resp.status >= 400:
                        if resp.status == 404:
                            saw_404 = True
                        continue
                    text, reason = read_response(
                        resp.read(),
                        resp.headers.get("Content-Encoding"),
                        resp.geturl(),
                    )
                    if text is None:
                        last_error = f"{scheme}://{host}: {reason}"
                        continue
                    if text == "" and resp.geturl() != url:
                        # Redirect weg von robots.txt – wie 404, aber der
                        # www.-Kandidat darf noch eine echte Datei liefern.
                        saw_404 = True
                        continue
                    return text, None
            except urllib.error.HTTPError as exc:
                if exc.code == 404:
                    saw_404 = True
                last_error = f"{scheme}://{host}: {exc}"
                continue
            except (urllib.error.URLError, TimeoutError) as exc:
                last_error = f"{scheme}://{host}: {exc}"
                continue
            except Exception as exc:  # noqa: BLE001
                last_error = f"{scheme}://{host}: {exc.__class__.__name__}: {exc}"
                continue

    if saw_404:
        # Kein robots.txt vorhanden → per Spec alles erlaubt.
        return "", None
    return None, last_error


def parse_robots(text: str) -> list[RobotsBlock]:
    """Parst robots.txt in Blocks. Group-Logik per RFC 9309."""

    blocks: list[RobotsBlock] = []
    current = RobotsBlock()
    seen_directive_in_current = False

    for raw_line in text.splitlines():
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        key = key.strip().lower()
        value = value.strip()

        if key == "user-agent":
            if seen_directive_in_current:
                # Ein neuer Block beginnt nach Direktiven.
                if current.agents:
                    blocks.append(current)
                current = RobotsBlock()
                seen_directive_in_current = False
            current.agents.append(value)
        elif key == "disallow":
            current.disallow.append(value)
            seen_directive_in_current = True
        elif key == "allow":
            current.allow.append(value)
            seen_directive_in_current = True
        # andere Directives (Sitemap, Crawl-delay) ignorieren wir hier.

    if current.agents:
        blocks.append(current)

    return blocks


def find_block_for_agent(
    blocks: list[RobotsBlock], crawler_user_agent: str
) -> tuple[Optional[RobotsBlock], bool]:
    """Findet den passenden Block für einen Crawler.

    Returns (block, is_explicit). is_explicit = True wenn der Crawler namentlich
    erwähnt war, False wenn nur catchall * matchte.
    """
    target = crawler_user_agent.lower()
    catchall: Optional[RobotsBlock] = None

    for block in blocks:
        for agent in block.agents:
            agent_lower = agent.lower().strip()
            if agent_lower == target:
                return block, True
            if agent_lower == "*" and catchall is None:
                catchall = block

    return catchall, False


def classify_block(block: RobotsBlock) -> str:
    """Klassifiziert einen Block in BLOCK / ALLOW / SELECTIVE."""
    disallows = [d.strip() for d in block.disallow]
    allows = [a.strip() for a in block.allow]

    has_total_block = any(d == "/" for d in disallows)
    has_partial_block = any(d and d != "/" for d in disallows)
    has_total_allow = any(a == "/" for a in allows)
    only_empty_disallow = all(d == "" for d in disallows) and disallows

    # Allow: / dominiert Disallow: / — explizit erlaubt.
    if has_total_block and not has_total_allow:
        return "BLOCK"
    if only_empty_disallow:
        return "ALLOW"
    if has_total_allow and not has_partial_block:
        return "ALLOW"
    if has_partial_block:
        return "SELECTIVE"
    if not disallows and not allows:
        return "ALLOW"  # leerer Block = erlaubt
    return "ALLOW"


def evaluate_crawler(
    blocks: list[RobotsBlock], crawler: CrawlerSpec
) -> str:
    block, is_explicit = find_block_for_agent(blocks, crawler.user_agent)
    if block is None:
        return "DEFAULT"  # weder explizit noch catchall — implizit erlaubt
    classification = classify_block(block)
    if not is_explicit:
        # Catchall regelt den Crawler.
        if classification == "BLOCK":
            return "DEFAULT_BLOCKED"
        return "DEFAULT"
    return classification


def analyze_site(
    category: str,
    site: dict,
    crawlers: list[CrawlerSpec],
) -> dict:
    name = site["name"]
    url = site["url"]
    region = site.get("region", "")
    subcategory = site.get("subcategory")

    text, error = fetch_robots(url)
    if text is None:
        results = {c.id: "ERROR" for c in crawlers}
        return {
            "category": category,
            "region": region,
            "subcategory": subcategory,
            "name": name,
            "url": url,
            "error": error,
            "robots_size": 0,
            "results": results,
        }

    blocks = parse_robots(text)
    results = {c.id: evaluate_crawler(blocks, c) for c in crawlers}
    return {
        "category": category,
        "region": region,
        "subcategory": subcategory,
        "name": name,
        "url": url,
        "error": None,
        "robots_size": len(text),
        "results": results,
    }


def load_sample(path: Path) -> dict:
    with path.open("r", encoding="utf-8") as fh:
        sample = yaml.safe_load(fh)
    # YAML 1.1 parst On/Off/Yes/No/True/False als Boolean — name muss str bleiben.
    for sites in sample.values():
        for site in sites:
            site["name"] = str(site["name"])
    return sample


def load_crawlers(path: Path) -> list[CrawlerSpec]:
    with path.open("r", encoding="utf-8") as fh:
        raw = yaml.safe_load(fh)
    return [CrawlerSpec(**item) for item in raw]


def write_outputs(snapshot: dict, output_dir: Path, datestamp: str) -> tuple[Path, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    json_path = output_dir / f"snapshot-{datestamp}.json"
    csv_path = output_dir / f"snapshot-{datestamp}.csv"

    with json_path.open("w", encoding="utf-8") as fh:
        json.dump(snapshot, fh, indent=2, ensure_ascii=False)

    crawler_ids = [c["id"] for c in snapshot["crawlers"]]
    with csv_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(
            ["category", "region", "subcategory", "name", "url"]
            + crawler_ids
            + ["error"]
        )
        for row in snapshot["rows"]:
            writer.writerow(
                [
                    row["category"],
                    row["region"],
                    row.get("subcategory") or "",
                    row["name"],
                    row["url"],
                ]
                + [row["results"][cid] for cid in crawler_ids]
                + [row.get("error") or ""]
            )

    return json_path, csv_path


def main() -> int:
    parser = argparse.ArgumentParser(description="Robots.txt-Analyzer für AI-Crawler-Policies.")
    parser.add_argument("--sample", type=Path, default=DEFAULT_SAMPLE)
    parser.add_argument("--crawlers", type=Path, default=DEFAULT_CRAWLERS)
    parser.add_argument("--output-dir", type=Path, default=DEFAULT_OUTPUT_DIR)
    parser.add_argument("--datestamp", default=date.today().isoformat())
    parser.add_argument("--workers", type=int, default=8)
    args = parser.parse_args()

    sample = load_sample(args.sample)
    crawlers = load_crawlers(args.crawlers)

    tasks = []
    for category, sites in sample.items():
        for site in sites:
            tasks.append((category, site))

    print(f"Analysiere {len(tasks)} Sites × {len(crawlers)} Crawler...", file=sys.stderr)

    rows = []
    with ThreadPoolExecutor(max_workers=args.workers) as pool:
        futures = {
            pool.submit(analyze_site, category, site, crawlers): (category, site["name"])
            for category, site in tasks
        }
        for future in as_completed(futures):
            category, name = futures[future]
            try:
                row = future.result()
            except Exception as exc:  # noqa: BLE001
                row = {
                    "category": category,
                    "region": "",
                    "subcategory": None,
                    "name": name,
                    "url": "",
                    "error": f"unexpected: {exc}",
                    "robots_size": 0,
                    "results": {c.id: "ERROR" for c in crawlers},
                }
            status_summary = ", ".join(
                f"{cid}={val}" for cid, val in list(row["results"].items())[:3]
            )
            err = f" [{row['error']}]" if row.get("error") else ""
            print(f"  {category:20s} {str(name):24s} {status_summary}...{err}", file=sys.stderr)
            rows.append(row)

    # Stabil sortieren: Kategorie-Reihenfolge wie im Sample, dann Site-Reihenfolge.
    category_order = list(sample.keys())
    name_order = {(c, s["name"]): i for c, sites in sample.items() for i, s in enumerate(sites)}
    rows.sort(key=lambda r: (category_order.index(r["category"]), name_order[(r["category"], r["name"])]))

    snapshot = {
        "generated_at": args.datestamp,
        "user_agent": USER_AGENT_HEADER,
        "crawlers": [asdict(c) for c in crawlers],
        "rows": rows,
    }

    json_path, csv_path = write_outputs(snapshot, args.output_dir, args.datestamp)
    print(f"\nGeschrieben: {json_path}", file=sys.stderr)
    print(f"Geschrieben: {csv_path}", file=sys.stderr)

    # Print kurze Zusammenfassung.
    counts = {}
    for row in rows:
        for status in row["results"].values():
            counts[status] = counts.get(status, 0) + 1
    print("\nStatus-Zählung:", file=sys.stderr)
    for status, n in sorted(counts.items(), key=lambda x: -x[1]):
        print(f"  {status:18s} {n}", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
