import gzip

import analyze

ROBOTS = "User-agent: GPTBot\nDisallow: /\n"
CAPTCHA = ('<!doctype html><html lang="en-US"><head>'
           '<base href="https://www.google.com/recaptcha/challengepage/">')


def test_plain_robots_is_read():
    text, reason = analyze.read_response(
        ROBOTS.encode(), None, "https://www.nzz.ch/robots.txt")
    assert text == ROBOTS
    assert reason is None


def test_gzip_body_is_decompressed_even_without_header():
    # Independent liefert gzip, obwohl wir keines anfragen.
    raw = gzip.compress(ROBOTS.encode())
    for encoding in ("gzip", None):
        text, reason = analyze.read_response(
            raw, encoding, "https://www.independent.co.uk/robots.txt")
        assert text == ROBOTS
        assert reason is None


def test_html_on_robots_path_is_no_signal():
    # LinkedIn: Captcha-Seite mit Status 200 an der robots.txt-Adresse.
    text, reason = analyze.read_response(
        CAPTCHA.encode(), None, "https://linkedin.com/robots.txt")
    assert text is None
    assert "HTML" in reason


def test_html_after_redirect_away_means_no_robots_file():
    # Lindt, Inditex: /robots.txt leitet auf die Startseite um -> Datei fehlt.
    text, reason = analyze.read_response(
        b"<!DOCTYPE html><html><head>", None, "https://www.lindt.ch/de/")
    assert text == ""
    assert reason is None


def test_html_detection_ignores_leading_whitespace_and_bom():
    raw = "﻿\n  <html><body>Just a moment...</body></html>".encode()
    text, _ = analyze.read_response(raw, None, "https://www.temu.com/robots.txt")
    assert text is None


def test_robots_file_mentioning_html_stays_robots():
    body = "# see https://example.com/<html>\nUser-agent: *\nDisallow: /x.html\n"
    text, _ = analyze.read_response(
        body.encode(), None, "https://example.com/robots.txt")
    assert text == body


def test_captcha_site_lands_as_error(monkeypatch):
    monkeypatch.setattr(
        analyze, "fetch_robots", lambda host: (None, "https://x: HTML statt robots.txt"))
    crawler = analyze.CrawlerSpec(
        id="gptbot", user_agent="GPTBot", bot_category="scraper",
        provider="OpenAI", label="GPTBot")
    row = analyze.analyze_site(
        "platform", {"name": "LinkedIn", "url": "linkedin.com"}, [crawler])
    assert row["results"] == {"gptbot": "ERROR"}
