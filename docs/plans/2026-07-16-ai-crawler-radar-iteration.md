# AI-Crawler-Radar – Iteration 2 (Verlauf oben, Lauf-Log, klappbare Details)

Stand: 2026-07-16 · Quelle: Akasha-Vault, Story «Bot Analyzer» (`Aufwände/fumu Marketing/AI-Crawler-Monitoring/`). Baut auf `2026-07-07-ai-crawler-tracker.md` auf – Erst-Version ist gebaut, aber noch nicht deployed. Self-contained.

## Kontext

Die Erst-Version von `/ai-crawler-radar` steht (Headline, Kategorie-/Crawler-Balken, Trend, Methodik-Fussnote). Vor dem Deploy soll die Seite umgebaut werden: Der Verlauf wird die Hauptsicht, die Detail-Auswertungen wandern in klappbare Sections. Dazu kommen zwei neue Inhalte aus dem Vault: ein Lauf-Log (pro Veröffentlichung ein kurzer Update-Text) und die Liste der gemonitorten Sites mit Kategorie-Zuordnung.

**Voraussetzung für die Schritte 3 und 5:** Die Vault-Pipeline (`publish.py`) liefert zuerst das erweiterte JSON (Felder `runs`, `sites`, erweiterte Methodik – siehe Daten-Vertrag). Die Umbau-Schritte 1, 2 und 4 gehen ohne neue Daten.

## Änderungen

1. **Verlauf nach oben.** Der Trend-Chart wird die erste Sicht nach Vorspann und Snapshot-Datum – nicht mehr die Balken.
2. **Lauf-Log unter dem Verlauf.** Pro Veröffentlichungslauf ein kurzer Eintrag (Datum, Anzahl Veränderungen, ein bis zwei Sätze Zusammenfassung, optional eine kuratierte Einordnung zum Themenfeld). Chronologisch absteigend, die jüngsten 5–6 offen, ältere hinter einem «ältere Läufe»-Aufklapper.
3. **Detail-Auswertungen klappbar.** Block-Anteil nach Kategorie und nach Crawler werden zu eingeklappten Sections («Details»), nur bei Bedarf aufzuklappen.
4. **Methodik klappbar und ausführlicher.** Gleiche Klapp-Mechanik; der ausführlichere Wortlaut kommt aus dem Vault (Rückkanal), bis dahin die bestehenden drei Sätze rendern.
5. **Gemonitorte Sites klappbar.** Eigene eingeklappte Section: alle Sites mit Kategorie-Zuordnung (gruppiert nach Kategorie oder als Tabelle mit Kategorie-Spalte – Wahl beim Frontend-Agenten).

## Daten-Vertrag – Erweiterung `src/data/ai-crawler-tracker.json`

Additiv zum bestehenden Vertrag, alte Felder unverändert. Neue Felder (Beispielwerte illustrativ):

```json
{
  "runs": [
    {
      "date": "2026-07-13",
      "changes": 10,
      "sites_changed": 2,
      "summary": "Der Standard sperrt fünf Trainings-Crawler und öffnet den OpenAI-Suchbot; WSJ nimmt die Juni-Öffnung teilweise zurück.",
      "commentary": null
    }
  ],
  "sites": [
    { "name": "NZZ", "domain": "nzz.ch", "category": "publisher_paywall", "label": "Paywall-Publisher" }
  ],
  "methodology_details": [
    { "title": "Erhebung", "body": "Alle 14 Tage ruft der Analyzer die robots.txt jeder Site ab und wertet …" }
  ]
}
```

- `runs` ist absteigend nach Datum nützlich. `summary` ist der faktische Kern (aus dem Diff), `commentary` die optionale kuratierte Einordnung – `null`, wenn keine vorliegt, dann nur `summary` rendern.
- `sites` deckt das volle Sample ab (~108 Einträge); `category`/`label` entsprechen den Werten aus `by_category`.
- `methodology_details` ergänzt die bestehenden `methodology`-Sätze (die bleiben als Kurzfassung im eingeklappten Kopf sichtbar oder als Einstieg der Section – Wahl beim Frontend-Agenten).
- Solange die Felder fehlen, rendert die Seite ohne die betroffenen Sections (Guard: Felder optional, kein Build-Bruch – der harte Vertrag der Erst-Version bleibt hart).

## Technische Eckpunkte

- **Klapp-Mechanik ohne Client-JS:** natives `<details>/<summary>` – bleibt in der Statisch-ohne-JS-Entscheidung der Erst-Version. Eine gemeinsame, gestylte Komponente (z. B. `CollapsibleSection.astro`) für die Punkte 3–5, damit die Sections einheitlich aussehen: Summary-Zeile im fumu-CSS (Fraunces-Titel, dezenter Chevron/Marker über CSS), sauberer Fokus-Zustand, `open`-Default steuerbar per Prop.
- **Markdown-Zwilling** (`ai-crawler-radar.md.ts`) mitziehen: Lauf-Log und Site-Liste auch dort ausgeben (Tabellen), Klapp-Mechanik entfällt dort naturgemäss.
- **Barrierefreiheit:** `<summary>` ist nativ fokussier- und bedienbar; Inhalte in den Sections bleiben als semantische Tabellen/Listen.
- **Verifikation:** `npm run build` grün mit und ohne die neuen JSON-Felder; Seite weiterhin ohne Client-JS; Lauf-Log und Site-Liste sichtbar, sobald die Felder da sind.

## Schritte

- [x] `CollapsibleSection.astro` bauen (natives `<details>`, fumu-CSS, `open`-Prop). *(Erledigt 2026-07-16: Fraunces-Titel in Coral, CSS-Chevron, Fokus-Ring, `open`-Prop.)*
- [x] Seiten-Aufbau umstellen: Vorspann → Snapshot-Datum → Trend-Chart → Lauf-Log → klappbare Sections (Kategorie, Crawler, Methodik, Sites). *(Erledigt 2026-07-16.)*
- [x] Loader/Guard um die optionalen Felder `runs`, `sites`, `methodology_details` erweitern (fehlend = Section weglassen, kein Build-Bruch). *(Erledigt 2026-07-16: additiv als `.optional()`; Kern-Vertrag unverändert hart.)*
- [x] Lauf-Log-Rendering (jüngste 5–6 offen, Rest hinter «ältere Läufe»). *(Erledigt 2026-07-16: jüngste 6 offen, Rest in «Ältere Läufe (n)»-Details; `commentary` als abgesetzte Einordnung mit Coral-Linie, nur wenn nicht null.)*
- [x] Site-Liste-Rendering (Gruppierung nach Kategorie). *(Erledigt 2026-07-16: gruppiert in der Reihenfolge der Kategorie-Balken, zweispaltige Liste mit Mono-Domain; Sites mit unbekannter Kategorie landen sichtbar in einer «Weitere»-Gruppe statt still zu verschwinden.)*
- [x] Methodik-Section auf `methodology_details` umstellen, Fallback auf die drei Kurzsätze. *(Erledigt 2026-07-16: Kurzsätze als Einstieg der Section, `methodology_details` als H3-Abschnitte dahinter.)*
- [x] Markdown-Zwilling nachziehen. *(Erledigt 2026-07-16: Lauf-Log als Abschnitte, Sites als Tabelle, Methodik-Details als Unterabschnitte – jeweils nur wenn Felder vorhanden; Abschnittsreihenfolge wie auf der Seite.)*
- [x] `npm run build` grün, `npm run preview` sichten – beide Zustände (mit/ohne neue Felder). *(Erledigt 2026-07-16: ohne Felder = echtes JSON, Sections fehlen sauber; mit Feldern via temporär augmentiertem JSON gesichtet und danach zurückgesetzt – committet ist nur das echte JSON.)*

## Entscheidungen

- **`<details>` statt JS-Accordion** – hält die No-Client-JS-Linie, crawlbar, barrierefrei ohne Zusatzaufwand.
- **Neue JSON-Felder optional im Guard** – die Seite bleibt deploybar, bevor die Vault-Pipeline liefert; der bestehende Kern-Vertrag bleibt hart.
- **Lauf-Log-Texte kommen aus dem Vault** – `summary` mechanisch aus dem Diff, `commentary` kuratiert. Die Seite rechnet und textet nichts selbst.

## Rückkanal (zurück in die Vault-Story «Bot Analyzer»)

- **Fraunces-Summary-Titel (zur Bestätigung):** Der Plan verlangt Fraunces für die Summary-Zeilen der klappbaren Sections; die kuratierte CI-Runde vom 2026-07-15 hatte Serifen aber auf H1 beschränkt (H2+ sans). Umgesetzt wie im Plan spezifiziert (Fraunces, Coral, 20px) – falls die H1-only-Regel gelten soll, ist es ein Einzeiler in `CollapsibleSection.astro`.

- **Methodik-Wortlaut:** ausführlicher Text (Abschnitte für `methodology_details`) wird im Vault geschrieben und per JSON geliefert – bis dahin Fallback auf die drei Kurzsätze.
- **Lauf-Log-Backfill:** Sollen die bisherigen ~14 Snapshots rückwirkend `summary`-Texte bekommen (mechanisch aus den Diffs) oder startet das Log mit dem nächsten Lauf? Empfehlung Vault-Seite: mechanischer Backfill, kuratierte `commentary` nur nach vorne.
- **Kuratierungs-Weg für `commentary`:** Vorschlag Vault-Seite – beim manuellen Tracker-Sheet-Update (`/robots-txt snap`) füllen, optional mit kurzer Themenfeld-Recherche; die launchd-Automatik bleibt rein mechanisch.
