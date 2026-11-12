# Bilder auf Pillar-Seiten

Stand: 2026-11-09 · Quelle: Akasha-Vault, Story «Pillar 1 und Kategorie-Seite live auf fumu.ch». Baut auf dem Seitentyp aus `2026-08-21-pillar-seiten.md` und auf `2026-11-09-faq-aufklappbar.md` auf.

## Kontext

`/ki-transformation/` hat 1'374 Wörter und kein einziges Bild. Jochen hat zwei Bilder freigegeben: eine Skizze, die Punkt- und Systemlösung an derselben Organisation zeigt, und den Zeitbalken der KI-Wertstromanalyse aus dem Produktblatt. Laut Entscheid vom 2026-09-01 bekommt die Wertstromanalyse keine eigene Seite und steht auf Pillar 1. Der Zeitbalken ist deshalb der Ort, an dem die Website zeigt, was sie misst.

Das Seitenmodul (`src/data/pages/types.ts`) kennt bisher keine Bilder. Dieser Plan führt einen Bild-Eintrag ein, der für jede Seite aus `PageContent` gilt.

## Akzeptanzkriterien

- Ich sehe auf `/ki-transformation/` im Abschnitt «Was die Forschung zeigt» das Organigramm direkt nach dem Absatz zu *Power and Prediction* und im Abschnitt «Wie wir arbeiten» den Zeitbalken direkt nach dem Eintrag zur KI-Wertstromanalyse.
- Beide Bilder haben einen Alt-Text und eine Bildunterschrift. Auf 400 px Breite bleiben sie lesbar oder lassen sich antippen.
- `/ki-transformation.md` und `/llms-full.txt` führen beide Bilder als Markdown-Bild mit Alt-Text und Bildunterschrift. Der übrige Text bleibt byte-identisch.
- Die anderen Seiten (about, kontakt, was-wir-tun) sehen aus wie vorher.

## Technische Eckpunkte

- Neuer Item-Typ `kind: 'image'` mit `src`, `alt` und `caption`. `EvansSection.astro` rendert ihn als `<figure>` mit `<img loading="lazy" decoding="async">` und `<figcaption>`. `to-markdown.ts` serialisiert ihn als `![alt](src)` mit der Bildunterschrift als eigener Zeile darunter. Test in `to-markdown.test.ts` mitziehen.
- Die Bilder sind SVG-Exporte aus Excalidraw mit eingebetteter Schrift. Ablage unter `public/images/pillars/`. SVG statt WebP, weil es Diagramme sind (wie `maschinen-werbemaschine-pipes.svg` bei den Perspektiven).
- Die Bildbreite folgt der Textspalte. Ist ein Diagramm auf dem Handy zu klein, öffnet ein Tippen es in voller Grösse (einfacher Link auf die SVG-Datei, kein JavaScript).

## Die zwei Bilder

**1. Organigramm**, Quelle im Vault: `/Users/jochen.witte/Data/Akasha/Aufwände/fumu Marketing/fumu.ch/assets/diagram-organigramm-prozess.excalidraw.svg`, Ziel `public/images/pillars/ki-transformation-organigramm.svg`. Platz: Section «Was die Forschung zeigt», nach dem Absatz, der mit «In *Power and Prediction* beschreiben» beginnt.

- Alt-Text: «Links ein Organigramm mit Geschäftsleitung, drei Bereichen und sechs Teams, jedes Team mit eigenem KI-Werkzeug. Rechts dieselben sechs Teams ohne die Ebene der Bereiche, nebeneinander entlang des Prozesses vom Kundenwunsch bis zur Erfüllung, darunter die KI als gemeinsamer Prozess.»
- Bildunterschrift: «Punktlösung und Systemlösung an derselben Organisation.»

**2. Zeitbalken**, Quelle im Vault: `/Users/jochen.witte/Data/Akasha/Aufwände/FUMU/assets/diagram-wertstrom-zeitbalken.excalidraw.svg`, Ziel `public/images/pillars/ki-wertstromanalyse-zeitbalken.svg`. Platz: Section «Wie wir arbeiten», nach dem Eintrag «KI-Wertstromanalyse».

- Alt-Text: «Zeitachse eines Prozesses mit fünf Schritten: Auftrag klären 1 Stunde, Planen 4 Stunden, Umsetzen 8 Stunden, Prüfen 3 Stunden, Abrechnen 1 Stunde. Dazwischen liegen Wartezeiten von 2, 5, 1 und 3 Tagen, die längste nach dem Planen ist hervorgehoben.»
- Bildunterschrift: «Beispiel: 13 Tage Durchlaufzeit, davon 17 Stunden Arbeit.»

Alt-Texte und Bildunterschriften sind abgestimmter Wortlaut. Trägt einer im Raster nicht, an die Vault-Session zurückgeben, nicht im Repo umschreiben.

## Schritte

- [x] Item-Typ `image` in `types.ts`, Rendering in `EvansSection.astro`, Serialisierung in `to-markdown.ts`, Test mitziehen
- [x] Beide SVGs nach `public/images/pillars/` kopieren und vorher im Browser prüfen, dass die Schrift eingebettet ist
- [x] Beide Einträge in `src/data/pages/ki-transformation.ts` an den genannten Stellen einsetzen
- [x] `npm run build` grün, `npx vitest run` grün
- [x] Gegenprobe: `/ki-transformation.md` und `/llms-full.txt` gegen den Stand vorher diffen, Unterschied nur die zwei Bilder samt Bildunterschrift
- [x] Ansicht auf Desktop und 400 px prüfen
- [x] Lokales Review durch Jochen, Commit und Push erst nach seiner Freigabe

## Nachtrag 2026-11-12: Organigramm als Hero

Änderung von Jochen nach dem ersten lokalen Review (über die Pillar-1-Session): Das Organigramm steht oben auf der Seite, nicht mitten im Text. Ersetzt beim Organigramm den Platz aus dem ersten Akzeptanzkriterium, der Zeitbalken bleibt bei der KI-Wertstromanalyse.

- [x] Optionales Feld `hero` auf `PageContent`, gleiche Form wie der Bild-Eintrag (`src`, `alt`, `caption`), lädt sofort statt lazy. Spalte und Hero teilen sich `Figure.astro`.
- [x] Organigramm aus «Was die Forschung zeigt» herausgenommen und als `hero` gesetzt
- [x] `to-markdown.ts` gibt den Hero direkt nach der H1 aus, vor dem Lead, Tests mitgezogen
- [x] `width`/`height` an beiden `<img>` aus der viewBox des SVG, beim Build gelesen (`src/lib/svg-size.ts`), damit der Lead nicht springt. Ein falscher Bildpfad bricht damit den Build.
- [x] Die Schrift im Zeitbalken bleibt bewusst nicht eingebettet: Helvetica fällt im cleanen Look sauber auf die Systemschrift zurück.

Zweite Runde nach Jochens Blick auf den breiten Hero (Entwürfe A/B/C, Jochen wählt B):

- [x] Hero wie im Magazin: rechts im Lead, rund 480 px breit, ragt aus der 720er-Lesespalte in den freien Rand, der Lead umfliesst ihn. Auf dem Handy in voller Breite zwischen H1 und Lead.
- [x] Organigramm gestapelt neu exportiert (Vault, `assets/diagram-organigramm-gestapelt.excalidraw.md`), Punktlösung oben, Systemlösung unten. Alt-Text und Bildunterschrift dafür neu: «Punktlösung und Systemlösung an derselben Organisation: Oben bekommt jedes Team ein KI-Werkzeug, unten ändern sich Ebenen und Übergaben mit.»
- [x] Vergrössern für jedes Diagramm (`Figure.astro`): Hover zeigt den Hinweis «⤢ Vergrössern», Klick oder Tippen öffnet eine Ebene (Popover-API, kein JS) mit Bild, Bildunterschrift, «Schliessen» und dem Link «In voller Grösse öffnen» auf die Datei. Regel von Jochen: nur für Bilder mit Details, nicht für Illustrationen, Logos oder Porträts.
- [x] Gegenprobe der Markdown-Kanäle, Ansicht auf Desktop und 400 px, Ebene geöffnet und geschlossen (Esc, Schliessen)

## Rückkanal

In die Vault-Story «Pillar 1 und Kategorie-Seite live auf fumu.ch»: den Task zur Skizze abhaken, Log-Eintrag mit Commit. Die Excalidraw-Quellen bleiben im Vault. Ändert Jochen dort ein Bild, wird der SVG-Export neu kopiert.
