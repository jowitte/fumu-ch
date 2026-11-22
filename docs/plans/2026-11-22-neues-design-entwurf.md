# Neues Design für fumu.ch – Entwurf

Stand: 2026-11-22 · Status: freigegeben von Jochen am 2026-11-22, samt den Entscheiden unten · Entstanden in der Session fumu-ch-redesign (Branch `redesign-prototyp`), mit Jochen im Browser abgestimmt. Bezug im Vault: Story «fumu.ch im neuen Design live», Recherche «Vorbilder für fumu.ch», Story «Startseite führt direkt zu den Leistungen».

Referenz-Mockups liegen neben diesem Dokument unter `docs/plans/assets/2026-11-22-neues-design/`: `startseite.html`, `perspektive.html` (im Browser direkt öffnen; Schriften kommen dort von Google Fonts), dazu Screenshots (`m4-full.png`, `p4-top.png`, `p4-video.png`) und der Bildentwurf `hero-a.jpg`. Die Mockups sind Wegwerf-Skizzen: Massstab für Wirkung, Farben, Formen und Aufbau, nicht für Code.

## Absicht

fumu.ch bekommt ein neues Aussehen, das so leicht wirkt wie Parse.ly und sich klar von onelog.ch unterscheidet. Ein erster Prototyp (Branch `redesign-prototyp`, Haarlinien, Mono-Etiketten, Raster) blieb zu nah am alten Editorial-Layout und mischte alte und neue Farben. Jochen hat deshalb am 22.11. einen Neuanfang freigegeben, bis zur Neuerfindung der Marke, mit einer Bedingung: **Coral #C44540 bleibt.**

Was Jochen an onelog.ch überzeugt und hier gefehlt hat:

- eine schöne Illustration mit Menschen gleich oben
- ein Angebot, das man sofort erkennt (bei onelog: Prime und Marketplace)

Gewählt hat er Mischung 4 aus drei Runden: die Bleistiftzeichnung aus Richtung A auf der Basis von Richtung C, oben weiss, unten Pflaume. Sein Urteil: «modern und warm, aber professionell». Sein Einwand: Die Site wird farbiger, Coral als Signatur könnte untergehen. Die Farbregeln unten antworten darauf.

## Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**

- Die ganze Site in einem System: Startseite, Leistungsseiten (Pillars), Was wir tun, Über fumu, Kontakt, Perspektiven (Übersicht, Themen, Artikel), AI-Crawler-Radar, Rechtstexte, 404. Jochen hat entschieden, dass das neue Design auch für die Perspektiven gilt.
- Startseite: Menschen im Bild oben, die Leistungen mit Namen ohne Scrollen erkennbar, mit einem Klick zur Leistung oder zum Kontakt (Akzeptanzkriterium der Story «Startseite führt direkt zu den Leistungen»).
- Jedes bestehende Bleistiftbild und jedes Loop-Video der Perspektiven (weisser Grund) steht ohne Nacharbeit im neuen Design.
- Coral bleibt die Farbe, an der man fumu erkennt.

**Nicht-Ziele**

- Texte: Kein Wortlaut ändert sich, ausser auf der Startseite. Deren Texte (höchstens 200 Wörter) entstehen im Vault und kommen später als reine Textänderung (siehe «Übergangs-Startseite»).
- Content Collections, Markdown-Zwillinge, `llms.txt`, JSON-LD, RSS, Sitemap und Routen bleiben, wie sie sind. Ausnahme: `home.md` zieht mit, sobald die Startseiten-Texte aus dem Vault kommen.
- Decks, Dokumente und Typst-Vorlagen, die `brand.yaml` lesen: eigene Story im Vault.
- Dark Mode.

**Anti-Ziele** – das Ergebnis ist verfehlt, auch wenn alles funktioniert, wenn:

- Coral in der Farbmenge untergeht oder für Flächen-Deko verbraucht wird.
- fumu.ch neben onelog.ch wie aus demselben Baukasten wirkt: Strichfiguren in Tusche mit versetzter blauer Fläche, Produktansichten, Karten mit kleinen Icons.
- der Grund nach «Elfenbein mit Serif» aussieht, dem Erkennungszeichen der KI-Labore, oder «schmierig» wirkt (Jochen zu Creme-Tönen). Oben und in der Mitte ist der Grund reines Weiss.

## Ansätze

| Ansatz | Kern | Ergebnis |
|---|---|---|
| Haarlinie (Branch `redesign-prototyp`) | Elfenbein oder Papier mit Raster, Mono-Etiketten, Kopf in zwei Tönen, Diagramme als «Abb.» | verworfen: zu nah am alten Auftritt, Farben passen nicht zusammen, keine Menschen |
| A – Bleistift | Graphitskizze, eine Farbe, Serif | Bildstil gewählt |
| B – Risografie | zwei Druckfarben, Korn, fette Grotesk | gestrichen |
| C – Papierschnitt | Pflaume, Coral, Safran, Rosé, geschnittene Papierkarten, Instrument Serif | Basis gewählt |
| Mischung 1 – Skizzenblatt | Zeichnung als Blatt auf Pflaume | nicht gewählt |
| Mischung 2 – Kreide auf Pflaume | heller Stift auf dunklem Grund | nicht gewählt: neue Bilder bräuchten einen eigenen Stil |
| Mischung 3 – Bleistift mit Papier | Kopf hell, gerissenes Papier im Bild | Vorstufe |
| **Mischung 4 – weiss oben, Pflaume unten** | Bleistift auf gerissenem Papier (CSS), weisse Mitte mit Papierkarten, Pflaume als Sockel unten | **gewählt** |

Warum 4: Die Zeichnung trägt die Menschen und die Wärme, ohne onelog zu ähneln. Der weisse Grund lässt Bilder und Videos mit weissem Hintergrund nahtlos stehen. Die Papierformen kommen aus CSS statt aus dem Bild, deshalb passt jedes Bild im Stil `editorial` ohne Nacharbeit. Die Pflaume gibt der Seite unten Gewicht und trennt sie am deutlichsten von onelog.

## Das System

### Farben

| Token | Wert | Rolle |
|---|---|---|
| `--white` | #FFFFFF | Grund oben und in der Mitte jeder Seite |
| `--plum` | #43233B | Sockel unten; Überschriften, Logo-Schrift, Navigation |
| `--plum-soft` | #6B4A63 | Sekundärtext, Leads |
| `--ink` | #2B1A27 | Fliesstext |
| `--coral` | #C44540 | Signatur: Knöpfe, Links, Daten, aktiver Menüpunkt, Punkt im Logo, der Akzent in jedem Bild |
| `--saffron` | #E9A23B | Papier: Flächen |
| `--blush` | #F3D9C4 | Papier: Flächen, Thema-Streifen |
| `--blush-light` | #F8EADF | Papier: Karten, Hinterlegung von Bildern |

**Regeln für die Signatur** (Antwort auf Jochens Einwand):

1. Coral handelt, Papier trägt, Pflaume gründet. Coral steht nur auf Elementen, die etwas tun oder auszeichnen: Knopf, Link, Datum, aktiver Zustand, der eine Akzent im Bild. Auf Weiss und auf den Papierflächen sind Safran und Rosé nie Text, Link oder Knopf.
2. Pro Bildschirmhöhe höchstens eine Fläche in Safran. Die Papierform in der Ecke der Coral-Karte ist deshalb Rosé, nicht Safran wie im Mockup.
3. Coral-Schrift unter 24 px nur auf Weiss (4.9:1). Auf Rosé-hell (4.2:1) erst ab 24 px.
4. Coral als grosse Fläche nur einmal pro Seite (auf der Startseite: die Karte des ersten Themas).
5. Keine weiteren Farben. Ausnahme: Die Charts des Radars behalten die validierte Kategorien-Palette (`src/data/crawler-tracker.ts`).
6. **Auf Pflaume** reicht Coral als Schrift nicht (2.8:1). Im Sockel gilt deshalb: Text Weiss (13.6:1), Nebentext Rosé (10:1), Links und Fokusring Safran (6.3:1). Coral steht dort nur als Knopf (Fläche mit weisser Schrift) und als Datum auf den weissen Blättern.

Es fallen weg: Elfenbein, Sage, Lavender, Sand (heute die Farben der drei Themen) und Navy. Die Themen der Perspektiven tragen keine eigene Farbe mehr.

### Schrift

- **Instrument Serif** 400 und 400 kursiv: Titel, H1–H3, Zitate, Dauer der Formate, Logo-Schriftzug.
- **Instrument Sans** 400–600: Text, Navigation, Knöpfe, Etiketten (Versalien, 13 px, Sperrung 0.05em).
- Kursiv nur für Zitate und die Dauer der Formate, nicht zur Hervorhebung (Stilregel im Vault).
- Self-hosted als woff2 in `public/fonts/` (OFL), Schnitte latin und latin-ext wie heute. Fraunces und IBM Plex (Sans und Mono) fallen weg. Excalifont bleibt für die Diagramme.

Richtgrössen (Desktop / unter 860 px): H1 Startseite 96 / 58 px, H1 übrige Seiten 76 / 46 px, H2 als Sektionstitel 60 / 44 px, H2 im Lesetext 38 px, Kartentitel 52 / 34 px, Lead 19 px, Fliesstext 17 px (Seiten) und 18.5 px (Perspektiven).

### Formen

- **Papierkarte:** ungleiche Ecken (`border-radius: 22px 8px 26px 10px / 10px 24px 8px 20px`), weicher Schatten zwischen den Lagen. Flächen: Coral (erstes Thema), Safran (zweites Thema), Rosé-hell (Formate, Newsletter, Hinweise), weiss auf Pflaume (Perspektiven als Blätter, leicht gedreht um höchstens ±0.8°).
- **Gerissenes Papier:** Fläche mit unregelmässiger, gerissener Kante (`clip-path: polygon(…)`), in Rosé, Rosé-hell oder Safran, hinter Bildern und Videos. Die Polygone werden beim Build aus einem festen Startwert erzeugt (deterministisch, wie die Funktion `torn()` in `assets/2026-11-22-neues-design/mix4.py`), nicht zufällig im Browser.
- **Pflaumensockel:** der untere Teil jeder Seite, mit gerissener Oberkante. Er enthält je nach Seite Zitat, Perspektiven als Blätter, den Abschluss «25 Minuten Kennenlernen» mit Knopf, die Newsletter-Zeile und den Fuss.
- **Knopf:** Coral, weisse Schrift, Papier-Ecken, Schatten.
- Es entfallen: Haarlinien-Raster, Mono-Etiketten, die Label-Spalte im Stil von Ben Evans mit Coral-Linie, die Doodle-Icons.

### Bildsprache

- **Menschen und Szenen:** Bleistift im Bild-Stil `editorial` (Graphit, Schraffur, genau ein Element in Coral, weisser Grund), wie er heute für die Perspektiven läuft. Im Layout steht das Bild immer mit `mix-blend-mode: multiply` auf einer Form aus gerissenem Papier: Das Weiss wird durchsichtig, die Striche liegen auf dem Papier. Dasselbe gilt für die Loop-Videos (`.loop-illustration`) und für das Standbild, das bei «Bewegung reduzieren» an ihre Stelle tritt.
- **Bild der Startseite:** neu, Motiv wie im Mockup (drei Menschen, einer zeichnet einen klaren Weg durch ein Gewirr, der Weg in Coral). `hero-a.jpg` ist ein Entwurf vom 22.11.; das endgültige Bild entsteht über den Bild-Workflow im Vault und wird dort abgenommen.
- **Diagramme** (Excalidraw, Excalifont) bleiben, wie sie sind. Sie stehen frei auf Weiss oder auf einer Karte in Rosé-hell, ohne gerissene Form; Vergrössern per Klick bleibt. Die Nummerierung «Abb. N» aus dem ersten Prototyp entfällt.
- **Doodle-Icons** (Bild-Stil `icon`) erscheinen nicht mehr auf der Site. Die Dateien und das Frontmatter-Feld `icon` bleiben.
- **Porträts** (Über fumu) bleiben Fotos; **Logos** von Referenzen stehen auf Weiss mit `multiply`.

### Bausteine pro Seite

**Kopfzeile (alle Seiten):** weiss, Schriftzug «fumu.» (Instrument Serif, Plum, Punkt in Coral) links. Rechts die Navigation «Was wir tun», «Perspektiven», «Über fumu» und der Knopf «Termin vereinbaren» auf `/kontakt/`. Der aktive Punkt ist Coral. Mobil wie heute ein Menü-Knopf.

**Sockel und Fuss (alle Seiten):** Pflaume mit gerissener Oberkante. Zuunterst der Fuss: «© {Jahr} fumu GmbH, Zürich», AI-Crawler-Radar, Impressum, Datenschutz, AGB, hello@fumu.ch. Der Link zum Radar ist neu (Entscheid der Session): Er steht heute als Release im Update-Strom der Startseite, der wegfällt, und sonst in keiner Navigation. `src/data/updates.ts` wird nicht mehr gerendert, bleibt aber liegen. Darüber die Newsletter-Zeile mit ihrem heutigen Text. Den Abschluss «25 Minuten Kennenlernen» (Text von der Kontaktseite) mit Knopf zeigen alle Seiten ausser `/kontakt/`.

**Startseite:**
1. Kopf: H1 (Claim), Lead (Positionierungssatz), Knopf und «25 Minuten Kennenlernen. Kein Pitch.», rechts das Bild auf gerissenem Papier.
2. «Was wir tun»: die Leistungen mit Namen. Im Mockup zwei Themen-Karten (Coral, Safran) und drei Format-Karten (Rosé-hell) mit der Dauer in Coral.
3. Sockel: Zitat, die letzten drei Perspektiven als Blätter, Abschluss, Fuss.

Welche Leistungen die Startseite zeigt und wohin jede führt, entscheidet die Vault-Story.

**Übergangs-Startseite** (Entscheid Jochen, 22.11.): Das Design geht live, sobald es gebaut ist, und wartet nicht auf die Vault-Texte. Bis die kommen, verwendet die Startseite nur Texte und Leistungen, die heute schon auf der Site stehen:
- Kopf: Claim und Lead aus dem heutigen Kopf der Startseite.
- «Was wir tun»: die Leistungen aus `/was-wir-tun/` (heute die Pillar KI-Transformation) mit ihrem Teaser und die Formate, wie sie dort und auf den Pillar-Seiten stehen, je mit ihrem Link.
- Zitat: ein Testimonial von `/about/`.
- keine Platzhalter, keine Leistung ohne Seite, kein neuer Satz.
`index.astro` und `home.md` ziehen im selben Zug mit, damit HTML und Markdown nicht auseinanderlaufen. Die Mockup-Texte (Positionierungssatz, zwei Themen und drei Formate) sind nur Gestaltungsmuster.

**Leistungsseite (Pillar):**
- Kopf: H1 (`heading`), Lead, Hero-Diagramm rechts auf Rosé-hell.
- Darunter eine Lesespalte (≈ 760 px) mit H2 in Serif statt der Label-Spalte links.
- Abschnitt `formate`: Format-Karten.
- Abschnitt `faq`: aufklappbare Fragen mit einem Plus in Coral.
- Sockel: verwandte Perspektiven (`relatedPerspektiven`) als Blätter, dann Abschluss und Fuss.

**Was wir tun, Über fumu, Kontakt:**
- Aufbau aus `PageContent` wie heute, gerendert in einer Spalte mit H2 in Serif.
- Pillar-Liste: Themen-Karten. Formate: Format-Karten.
- Personen: Foto mit Text. Zitate: gross in Serif kursiv.
- Kontakt: Termin, E-Mail und das Newsletter-Formular auf einer Karte in Rosé-hell, ohne Abschluss im Sockel.

**Perspektiven-Übersicht:**
- H1 und Lead.
- Die drei Themen als Karten in Rosé-hell, ohne Themenfarbe und ohne Icon. Der Hinweis zum Radar bleibt.
- Darunter die Perspektiven als Zeilen: Datum in Coral, Titel in Serif, Beschreibung, Thema. Gruppiert nach Monat wie heute.

**Themen-Seiten:** Kopf mit Teaser, Hinweis als Karte, die Perspektiven als Zeilen. Die Themen-Übersicht zeigt die Themen als Karten.

**Perspektive:** wie `perspektive.html`.
- Kopf in der Lesespalte: Datum, Thema als Streifen in Rosé, Autor oder Autoren verlinkt, Lesedauer, gegebenenfalls «Überarbeitet …». Darunter der Titel.
- Lesespalte 680 px mit Zwischentiteln in Serif.
- Bilder und Videos mit weissem Grund liegen auf Papier und ragen etwas aus der Spalte. Detail-Bilder (Zoom) stehen frei.
- Serien-Navigation (vorheriger und nächster Teil) als zwei Karten, Newsletter als Karte.
- Sockel: «Mehr aus dem Thema …» mit bis zu drei weiteren Perspektiven desselben Themas als Blätter. Ohne Thema: die drei neuesten.

**AI-Crawler-Radar:** Lesespalte, klappbare Abschnitte mit Plus, Charts in ihrer Palette. Sockel wie überall.

**Rechtstexte, 404:** Lesespalte, H1 und H2 in Serif.

### Barrierefreiheit und Verhalten

- Kontraste nach den Farbregeln oben; Fokus sichtbar (2 px, Coral auf Weiss und Papier, Safran auf Pflaume).
- `<details>` ohne Client-JS wie heute.
- Bewegung nur in den Loop-Videos; «Bewegung reduzieren» zeigt das Standbild, wie heute.
- Bei 400 px Breite läuft nichts über; Karten und Spalten stapeln sich unter 860 px.

## Technische Eckpunkte

- Ort (Jochen, 22.11.): Dieses Dokument und die Mockups kommen auf `main` unter `docs/plans/`. Umgesetzt wird auf einem neuen Branch `redesign` von `main`, ausgecheckt in einem eigenen Worktree, damit die anderen Schreiber im Hauptverzeichnis (Vault-Session, VS Code, launchd-Job) nicht auf dem Branch landen. Der Branch `redesign-prototyp` bleibt als Referenz und wird nicht weitergebaut, sein Worktree wird aufgeräumt. Wiederverwendbar ist `src/lib/reading-time.ts` mit Tests.
- Favicon, Apple-Touch-Icon, `og-default.png` und das Logo im Organization-JSON-LD zeigen heute den alten Auftritt. Kommt der Schriftzug «fumu.», leitet der Umbau sie daraus ab: Plum auf Weiss mit Punkt in Coral; das OG-Bild 1200×630 mit Schriftzug und Claim. Die Logo-Dateien in `brand.yaml` zieht der Vault nach.
- `global.css`: neue Tokens, die alten Farb- und Schrift-Tokens raus. Betroffene Komponenten: `BaseLayout` (Sockel), `Header`, `Footer`, `EvansSection` (wird zur einspaltigen Sektion), `PageIntro`, `Figure`, `CollapsibleSection`, `NewsletterSignup`, `RichText` (nur Stile). Neu: Papierkarte, gerissenes Papier (Polygon-Erzeugung mit Test), Sockel.
- Die remark/rehype-Plugins bleiben; die Stile für `.loop-illustration` und `.post-figure` ziehen nach.
- Schriften: Instrument Serif und Instrument Sans als woff2 beschaffen, zum Beispiel über die npm-Pakete von Fontsource oder Google Fonts. Der Download braucht Jochens OK.
- `src/data/series.ts > color` bleibt im Datenmodell, wird aber nicht mehr gerendert.
- Verifikation: `npm run build` und `npx vitest run` grün, Ansicht Desktop und 400 px, Lokal-Review mit Jochen. Live erst nach seiner Freigabe (Push auf `main` ist der Deploy).

## Entscheide in diesem Entwurf

Vorschläge aus der Session, von Jochen am 22.11. mit dem Dokument freigegeben. Der Download der Schriften (Instrument Serif und Instrument Sans, OFL, über die npm-Pakete von Fontsource) ist ebenfalls freigegeben.

1. Schriftzug «fumu.» mit Punkt in Coral in Instrument Serif statt des heutigen Logos.
2. Navigation: «Kontakt & Newsletter» wird zum Knopf «Termin vereinbaren». Der Newsletter ist über Sockel und Kontaktseite erreichbar. Reihenfolge: Was wir tun, Perspektiven, Über fumu.
3. Startseite: die Leistungen als zwei Themen und drei Formate. Der Inhalt bleibt Sache der Vault-Story.
4. Der Abschluss «25 Minuten Kennenlernen» steht unten auf jeder Seite ausser Kontakt.
5. Themen ohne eigene Farbe; Doodle-Icons und «Abb. N» entfallen.
6. Der AI-Crawler-Radar bekommt einen Link im Fuss, weil der Update-Strom der Startseite wegfällt.
7. Kommt der Schriftzug, ziehen Favicon, Touch-Icon und das Standard-OG-Bild mit.

## Rückkanal in den Vault

- `brand.yaml`: neue Farben (Pflaume, Safran, Rosé, Weiss), Schriften (Instrument), Überschriften in Plum statt Coral. Wirkt auf Decks und Dokumente, deshalb als eigene Story.
- Story «fumu.ch im neuen Design live»: Das Akzeptanzkriterium «die Perspektiven lesen sich weiter wie heute» ist durch Jochens Entscheid überholt. Die Tasks zu Grund, Diagramm-Stil und Doodle-Icons erledigt dieser Entwurf.
- Story «Startseite führt direkt zu den Leistungen»: Texte (höchstens 200 Wörter) und die Wahl der Leistungen.
- Bild der Startseite über den Bild-Workflow.
- Logo-Dateien (`brand.yaml > logo`), falls der Schriftzug «fumu.» kommt.
