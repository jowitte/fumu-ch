# FAQ auf Pillar-Seiten aufklappbar

Stand: 2026-11-09 · Quelle: Akasha-Vault, Story «Pillar 1 und Kategorie-Seite live auf fumu.ch». Baut auf dem Seitentyp aus `2026-08-21-pillar-seiten.md` auf.

## Kontext

`/ki-transformation/` ist seit 2026-11-09 live und liest sich zu textlastig: 1'374 Wörter und kein Bild. Der FAQ-Block allein hat 490 Wörter und ist damit grösser als die Analyse mit 328 Wörtern, die laut Bauplan den Grossteil der Seite tragen soll. Gekürzt wird der Inhalt nicht, weil die Tiefe für Ranking und KI-Antworten zählt. Geändert wird die Form: Sichtbar sind nur die Fragen, die Antwort öffnet sich auf Klick.

## Akzeptanzkriterien

- Ich sehe auf `/ki-transformation/` im Abschnitt «Häufige Fragen» die sieben Fragen und öffne jede Antwort mit einem Klick, auch mit der Tastatur.
- Der Antworttext steht weiter im HTML. `/ki-transformation.md`, `/llms-full.txt` und das `FAQPage`-JSON-LD sind unverändert.
- Die Lösung gilt für jede Pillar, also für jede Section mit `id: 'faq'`. Alle anderen Seiten sehen aus wie vorher.

## Technische Eckpunkte

- Natives `<details>`/`<summary>`, kein JavaScript. Alle Antworten sind beim Laden zu.
- Die Frage im `<summary>` sieht aus wie die bisherigen Item-Titel im Evans-Raster. Der Aufklapp-Marker kommt aus dem Design-System (Coral), nicht aus dem Browser-Default.
- Gerendert wird dort, wo die FAQ-Section heute entsteht. Der Markdown-Kanal (`to-markdown.ts`) bleibt unberührt.

## Schritte

- [x] FAQ-Section auf `<details>`/`<summary>` umstellen
- [x] Styling von Summary und Marker im Design-System
- [x] `npm run build` grün, `npx vitest run` grün
- [x] Gegenprobe: `/ki-transformation.md` und `/llms-full.txt` gegen den Stand vor der Änderung diffen, kein Unterschied
- [x] Lokales Review durch Jochen, Commit und Push erst nach seiner Freigabe

## Rückkanal

Ergebnis in die Vault-Story «Pillar 1 und Kategorie-Seite live auf fumu.ch»: den Task «FAQ auf `/ki-transformation/` aufklappbar machen» abhaken, Log-Eintrag mit Commit. Ein zweiter Schritt folgt später aus dem Vault, eine Skizze in der Analyse. Dafür braucht das Schema einen Bild-Eintrag, der ist nicht Teil dieses Plans.
