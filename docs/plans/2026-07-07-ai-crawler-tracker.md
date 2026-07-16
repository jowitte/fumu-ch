# AI-Crawler-Tracker – öffentliche Daten-Seite

Stand: 2026-07-07 · Quelle: Akasha-Vault, Story «Bot Analyzer» (`Aufwände/fumu Marketing/AI-Crawler-Monitoring/`), Design-Spec `var/docs/superpowers/specs/2026-07-07-bot-analyzer-design.md`. Self-contained – der Daten-Vertrag steht hier vollständig.

## Kontext

fumu betreibt seit April 2026 ein internes Monitoring, das alle 14 Tage erhebt, wer welche AI-Crawler in robots.txt reinlässt (~108 Sites × 20 Crawler). Bisher lebt das nur im Vault. Diese Seite bringt eine **kuratierte, öffentliche Sicht** auf fumu.ch – ein Daten-Produkt zur Positionierung in den Themen Open Web und Agentic AI.

Eine Pipeline im Vault (`publish.py`, separater Plan) schreibt bei jedem Lauf ein verdichtetes JSON nach `src/data/ai-crawler-tracker.json`, committet und pusht – Netlify baut automatisch. Diese Seite **liest dieses JSON beim Build** und rendert es. Kein Fetch zur Laufzeit, kein Client-JS.

**Voraussetzung:** Der Vault-Pipeline-Plan landet zuerst und committet eine erste echte `src/data/ai-crawler-tracker.json`. Gegen diese reale Datei wird gebaut (kein erfundenes Fixture).

## Akzeptanzkriterien (aus der Vault-Story)

- Ein Besucher kann die aktuellen Crawler-Analyse-Ergebnisse auf fumu.ch abrufen, ohne selbst etwas anzustossen.
- Das Snapshot-Datum ist auf der Seite sichtbar (Pflicht – robots.txt-Daten sind Momentaufnahmen).
- Die Seite rendert statisch (crawlbares HTML, kein Client-JS-Framework); ein kaputtes/fehlendes JSON bricht den Build ehrlich, statt still falsch zu rendern.
- **Nicht Teil:** die volle interaktive 108×20-Matrix mit Client-Filtern (Folge-Story).

## Daten-Vertrag – `src/data/ai-crawler-tracker.json`

Vom Vault erzeugt, hier read-only konsumiert. Struktur (Beispielwerte illustrativ):

```json
{
  "meta": {
    "snapshot_date": "2026-07-06",
    "site_count": 108,
    "crawler_count": 20,
    "cadence_days": 14,
    "generated_at": "2026-07-06T09:03:11+02:00"
  },
  "headline": "Snapshot 2026-07-06: 21 Veränderungen auf 2 Sites.",
  "by_category": [
    { "category": "platform", "label": "Plattformen", "block_share": 0.58, "site_count": 12 },
    { "category": "publisher_paywall", "label": "Paywall-Publisher", "block_share": 0.52, "site_count": 23 }
  ],
  "by_crawler": [
    { "crawler_id": "amazonbot", "label": "amazonbot", "block_share": 0.29, "blocked_sites": 28 }
  ],
  "trend": [
    { "date": "2026-05-04", "by_category": { "platform": 0.73, "publisher_paywall": 0.59 } }
  ],
  "methodology": [
    "ERROR-Zellen (Bot-Schutz-403/Timeout) sind nicht als Blockade gewertet – eigener Datenpunkt.",
    "Google-Agent ignoriert robots.txt laut Anbieter – DEFAULT heisst hier nicht 'wird durchgelassen'.",
    "robots.txt ist Deklaration, nicht Crawl-Realität (ChatGPT-User und Perplexity binden sich nicht)."
  ]
}
```

`block_share` ist ein Anteil 0..1. `by_category` und `by_crawler` sind absteigend nach `block_share` nützlich zu zeigen. `trend` ist eine Zeitreihe (aufsteigend nach Datum) für den Verlauf.

## Technische Eckpunkte

- **Stack wie gehabt:** Astro 6 static, kein JS-Framework, CSS über die bestehenden Custom Properties (`src/styles/global.css`), Fraunces/IBM Plex.
- **Daten-Loader** analog `src/data/series.ts`: ein Modul `src/data/crawler-tracker.ts`, das die JSON importiert, gegen ein Schema validiert (TS-Interface + Runtime-Guard; wenn eine Zod-Abhängigkeit schon im Build-Graph ist, gern Zod – sonst ein schlanker Guard, der bei Strukturbruch `throw`t, damit `npm run build` rot wird). Die Seite konsumiert nur den Loader.
- **Rendering (Ziel):** Charts als **Build-Zeit-SVG/HTML/CSS** aus den Zahlen – kein Client-JS, responsive, barrierefrei (Titel/aria, Zahlen auch als Text/Tabelle zugänglich). Komponentenwahl liegt beim Frontend-Agenten; keine schwere Charting-Runtime für die Kurationssicht.
- **Optionaler MVP-Zwischenschritt:** Wenn eine erste Live-Version schneller stehen soll, dürfen zuerst die vom Analyzer gerenderten Heatmap-Bilder eingebettet werden (`<img>`), danach auf SVG upgraden. Sauber ist SVG.
- **Aufbau der Seite:** Headline oben (`meta.snapshot_date` prominent), darunter (1) Block-Quote nach Kategorie, (2) Block-Quote nach Crawler (Top-N genügt), (3) Trend je Kategorie über die Snapshots, Methodik als Fussnote. Kurzer erklärender Vorspann (ein, zwei Sätze – Wortlaut kommt aus dem Vault, siehe Rückkanal).
- **Route/Nav:** Arbeitstitel `/ai-crawler-radar` (bzw. als `pages`-Collection-Seite mit `order`). Finaler Name/Slug und Navigationsplatz sind eine **inhaltliche Entscheidung im Vault** – vor dem Merge bestätigen (Rückkanal).
- **Verifikation:** `npm run build` grün (rendert die Route aus echten Daten), Snapshot-Datum sichtbar, Seite ohne Client-JS.

## Schritte

- [x] Voraussetzung prüfen: `src/data/ai-crawler-tracker.json` existiert im Repo (vom Vault-Pipeline-Lauf). Wenn nicht: im Vault einen `publish.py --output src/data/ai-crawler-tracker.json`-Lauf anstossen lassen (Rückkanal), nicht selbst Daten erfinden. *(Erledigt 2026-07-16: Snapshot 2026-07-13, 108 Sites × 20 Crawler.)*
- [ ] `src/data/crawler-tracker.ts` – Loader mit TS-Interface (`meta/headline/by_category/by_crawler/trend/methodology`) und Runtime-Guard, der bei Strukturbruch `throw`t.
- [ ] Chart-Komponenten (Build-Zeit-SVG/CSS): Kategorie-Balken, Crawler-Balken (Top-N), Trend-Linie. Barrierefrei, im fumu-CSS.
- [ ] Seite/Route anlegen, Loader konsumieren, Headline + Snapshot-Datum + Methodik-Fussnote, erklärender Vorspann (Platzhalter bis Vault-Wortlaut da ist).
- [ ] Navigation/`order` setzen (Arbeitstitel, final per Rückkanal).
- [ ] `npm run build` grün, lokal `npm run preview` sichten.
- [ ] Plan-Checkboxen pflegen, offene inhaltliche Punkte in den Rückkanal.

## Entscheidungen

- **Statisch, kein Client-JS** für die Kurationssicht – crawlbar und schnell, passt zum bestehenden fumu-Stack. Interaktivität (Filter, Volmatrix) ist bewusst Folge-Story.
- **Daten kommen fertig verdichtet aus dem Vault** – diese Seite rechnet nichts, sie stellt dar. Der Analyzer bleibt Quell-Wahrheit; inhaltliche Änderungen an Zahlen/Sätzen gehen in den Vault, nicht in den Astro-Build.
- **Build gegen echte Daten**, kein erfundenes Fixture – der Vertrag ist real belegt.

## Rückkanal (zurück in die Vault-Story «Bot Analyzer»)

Beantwortet 2026-07-16 aus dem Vault:

- **Name und Slug:** `AI-Crawler-Radar` / `/ai-crawler-radar` ist final. Navigationsplatz: als `pages`-Collection-Seite mit `order` ans Ende der bestehenden Navigation.
- **Vorspann-Wortlaut** (Jochen-Stimme, wörtlich übernehmen):

  > fumu erhebt seit April 2026 alle 14 Tage, welche AI-Crawler die robots.txt von gut 100 Sites zulassen – Publisher mit und ohne Paywall, Plattformen, Brands und E-Commerce, Schwerpunkt Schweiz. Der Radar zeigt den jüngsten Snapshot und den Verlauf; robots.txt ist dabei Deklaration, nicht Crawl-Realität.

  Methodik-Fussnote: die drei Sätze aus `methodology` im JSON unverändert rendern.
- **`block_share`-Definition bleibt** identisch zur internen Sicht (ERROR im Nenner). Eine zweite, besucherfreundlichere Zahlendefinition liefe intern/extern auseinander; die Methodik-Fussnote weist ERROR als eigenen Datenpunkt aus.

Neu offen nach Umsetzung: nichts Inhaltliches erwartet – bei Fragen zurück in die Vault-Story.
