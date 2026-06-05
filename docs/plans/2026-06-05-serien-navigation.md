# Serien-Navigation für Perspektiven

Stand: 2026-06-05 · Quelle: Akasha-Vault, Story «Perspektiven filtern und verbinden» (Stufe 1 von 4). Self-contained – alle nötigen Daten stehen hier.

## Kontext

fumu.ch hat zwei Perspektivenserien: «AI in der digitalen Werbung» (6 Posts live, ein siebter folgt) und «KI und Arbeit» (Rahmen-Post live, fünf Folgeposts im Wochen-Rollout ab 2026-06-15). Leser sollen eine Serie als Cluster erleben: Serienseite mit allen Teilen, Serien-Hinweis und Vor/Zurück-Navigation im Post. Alles statisch gerendert – crawlbare Links sind Akzeptanzkriterium, keine Client-Logik.

## Akzeptanzkriterien (aus der Vault-Story)

- Die Serie KI und Arbeit ist als Cluster auffindbar: Von jedem Serien-Post gelangt der Leser zu den anderen Teilen.
- Die Mechanik erzeugt crawlbare interne Links (statisches HTML, keine Client-Filter).
- Die «Verwandt-Sektion mit Kontext am Post-Ende» ist **Stufe 2** und nicht Teil dieses Plans.

## Serien-Daten

Quelle der Wahrheit für Name und Teaser sind die Epic-Notizen im Vault (Sektion «Serienseite»). Teaser von Jochen freigegeben am 2026-06-05 – wörtlich übernehmen:

### Serie `ai-digitale-werbung`

- Name: AI in der digitalen Werbung
- Teaser: Was passiert mit der digitalen Werbung, wenn die Antwort direkt im Chat erscheint? Sechs Perspektiven zu den Verschiebungen des Jahres 2026 – vom zweiten Unbundling über Agentic Advertising bis zum Reset der Messung.

| seriesPart | Datei (`src/content/perspektiven/`) |
| --- | --- |
| 1 | `das-doppelte-unbundling.md` |
| 2 | `60-dollar-chat-antwort.md` |
| 3 | `zero-click.md` |
| 4 | `ende-der-billigen-kampagne.md` |
| 5 | `maschinen-werbemaschine.md` |
| 6 | `alte-metriken-versagen.md` |
| 7 | «Wenn Maschinen einkaufen» – existiert noch nicht, bekommt die 7 bei Publikation |

Hinweis: `ai-trends-2026.md` (Whitepaper-Platzhalter, draft) gehört **nicht** zur Serie.

### Serie `ki-und-arbeit`

- Name: KI und Arbeit
- Teaser: KI verändert Arbeit – aber kaum jemand gestaltet diese Veränderung aktiv. Sechs Perspektiven über eine Reorganisation, die ohne Architekt läuft: vom einzelnen Arbeitstag über Team und Organisation bis zum Unternehmen, das aus der Trennung von Voraussage und Entscheidung entsteht.

| seriesPart | Datei |
| --- | --- |
| 1 | `unsichtbare-reorganisation.md` |
| 2–6 | Folgeposts, entstehen wöchentlich ab W26 – Felder setzt `/fumu-web` beim Anlegen |

## Schritte

- [x] 1. `src/content.config.ts`: `perspektiven`-Schema um `series: z.string().optional()` und `seriesPart: z.number().int().positive().optional()` erweitern (optional – Bestands-Posts ohne Serie bleiben gültig)
- [x] 2. Serien-Registry `src/data/series.ts`: Map Slug → `{ name, teaser }` mit den zwei Serien oben
- [x] 3. Frontmatter der 7 Serien-Posts ergänzen (`series` + `seriesPart` gemäss Tabellen)
- [x] 4. Serienseite `src/pages/perspektiven/serien/[slug].astro`: Name als H1, Teaser, Teile in `seriesPart`-Reihenfolge (nur `draft: false`), Meta-Title/-Description, Schema/Breadcrumb analog bestehender Seiten
- [x] 5. Artikel-Layout: Serien-Hinweis oben («Teil X der Serie <Name>» als Link auf die Serienseite) und Vor/Zurück-Navigation am Post-Ende (nur `draft: false`-Nachbarn, mit Post-Titeln als Linktext)
- [x] 6. `/perspektiven/`-Übersicht: Serien-Zugehörigkeit pro Eintrag sichtbar machen (dezentes Label, verlinkt auf Serienseite)
- [x] 7. `llms.txt`-Endpoint prüfen: Serienseiten aufnehmen, falls der Endpoint Seiten listet
- [x] 8. `npm run build` grün; Stichprobe: `/perspektiven/serien/ki-und-arbeit/` und Vor/Zurück auf `das-doppelte-unbundling` (kein Zurück, Vor auf Teil 2)

Umgesetzt 2026-06-05. Zwei plankonforme Ergänzungen ausserhalb der Schritte: Serien-Index `/perspektiven/serien/` (vermeidet 404-Breadcrumb-Zwischenlink) und `.md`-Twin `serien/[slug].md.ts` plus Serien-Zeile in `llms-full.txt` (Agent-Readiness-Konvention aus CLAUDE.md).

## Entscheidungen

- `seriesPart` folgt der **Publikations-Reihenfolge**, nicht der Trend-Nummerierung des Whitepapers.
- Route unter `/perspektiven/serien/<slug>/`, damit die Serienseiten im Perspektiven-Cluster bleiben.
- Serien-Name und Teaser werden nur aus dem Vault nachgezogen, nie im Repo umformuliert (Vault ist Quell-Wahrheit).

## Rückkanal

Inhaltliche Fragen (Teaser-Wortlaut, Serien-Name, Reihenfolge) gehören in den Vault zurück (Epic-Notizen der Serien, Sektion «Serienseite») – nicht hier entscheiden. Checkboxen beim Abarbeiten direkt in diesem File pflegen.
