# Neues Design: Prototyp der Startseite

> **Abgelöst (2026-11-22):** Der Prototyp nach diesem Plan liegt auf dem Branch `redesign-prototyp` und wurde verworfen. Gilt ab jetzt: `docs/plans/2026-11-22-neues-design-entwurf.md`.

Stand: 2026-11-12 · Quelle: Akasha-Vault, Story «fumu.ch im neuen Design live», Vorschlag und Screenshots in «Vorbilder für fumu.ch» (`Aufwände/fumu Marketing/fumu.ch/`, Bilder unter `assets/fumu-vorbild-*.png`).

## Kontext

fumu.ch bekommt ein neues Aussehen. Es soll so leicht wirken wie Parse.ly und sich klar von der neuen onelog.ch unterscheiden; deren Prototyp liegt in `~/Data/onelog-website`. onelog.ch arbeitet mit Strichfiguren in Tusche, einer versetzten Farbfläche in Steel Blue, einer Produktansicht im Kopf und Karten mit kleinen Bildern. fumu.ch nimmt nichts davon.

Jochen hat am 2026-11-12 diese Richtung gewählt:

- **Kopf:** ein ganzer Satz in zwei Tönen. Der Satzanfang steht dunkel, die Positionierung gedämpft, ähnlich wie bei normally.com. Darunter folgt ein Satz, der fumu abgrenzt.
- **Bild:** Diagramme als «Abb. 1» mit Legende, ein feines Raster und Etiketten am Rand in Mono. Es gibt keine Illustrationen und keine Figuren.
- **Leistungen:** Sie öffnen sich über die Fragen der Kunden, als aufklappbare Ich-Sätze. Jede Frage führt zu einer Seite.
- **Farbe:** Coral ist die einzige Akzentfarbe.

Offen ist der Grund. Zur Wahl stehen das heutige Elfenbein #FBFAF7 und weisses Papier mit feinem Raster. Der Prototyp zeigt beides umschaltbar, Jochen entscheidet im Review.

Dieser Plan baut **nur den Prototyp**. Er wird nicht nach `main` gemergt und nicht deployt. Grundlagen und Rollout kommen in einem eigenen Plan, sobald der Grund gewählt ist und die Texte der Startseite aus der Vault-Story «Startseite führt direkt zu den Leistungen» freigegeben sind.

## Akzeptanzkriterien

- Ich sehe lokal eine Startseite mit diesen Teilen:
	- einem Kopf als ganzer Satz in zwei Tönen
	- einem Diagramm als «Abb. 1» mit Legende
	- den Leistungen als aufklappbare Fragen der Kunden
	- Coral als einziger Akzentfarbe
- Ich kann mit einem Knopf zwischen Elfenbein und weissem Papier mit Raster umschalten.
- Ich kann den Prototyp neben dem Prototyp von onelog.ch ansehen, beide Seiten laufen gleichzeitig lokal.
- Auf einer Pillar-Seite und einer Perspektive sehe ich, wie Grund, Kopfzeile und Fuss dort wirken. Ihr Inhalt ist unverändert.
- Nichts davon ist live.

## Technische Eckpunkte

- **Branch:** `redesign-prototyp`, von `main` abgezweigt. Auf `main` liegt noch die Arbeit an den Pillar-Bildern uncommitted (`docs/plans/2026-11-09-pillar-bilder.md`, offen ist nur Jochens Review). Erst abzweigen, wenn sie committed ist, sonst wandert sie mit in den Branch. Ist sie beim Start noch nicht committed: nachfragen, nicht stashen.
- **Grund als Token:** `--color-bg` bleibt die Variable. Neu ist ein Attribut `data-grund` auf `<html>` mit den Werten `elfenbein` und `papier`; `papier` heisst Weiss plus ein feines Raster als CSS-Hintergrund (`linear-gradient`, keine Bilddatei). Umgeschaltet wird mit einem kleinen fixierten Knopf und ein paar Zeilen Inline-Script. Beides existiert nur im Prototyp.
- **Schrift:** Es kommt keine neue Schrift dazu. Der Kopf steht im Prototyp in IBM Plex Sans, gross und in zwei Tönen; das löst die Startseite von «Elfenbein mit Serif». Fraunces bleibt im H1 der Perspektiven. Etiketten über den Sektionen und am Rand stehen in IBM Plex Mono, in Versalien und mit Sperrung.
- **Abb. 1:** `Figure.astro` wiederverwenden. Als Inhalt dient das Organigramm, das schon unter `public/images/pillars/ki-transformation-organigramm.svg` liegt. Die Legende lautet «Abb. 1: Punktlösung und Systemlösung an derselben Organisation.», kursiv oder in Mono, und links bündig.
- **Leistungen:** `CollapsibleSection.astro` oder natives `<details>` (kein Client-JS). Pro Frage ein Satz und ein Link.
- **Perspektiven auf der Startseite:** die letzten drei als Zeilen mit Haarlinie. Am Rand stehen die Etiketten Datum, Thema und Lesedauer in Mono, ohne die Doodle-Icons. Grund: Der Bild-Stil `icon` (Tusche plus ein Element in Coral) ist gleich gebaut wie der Stil `spot` von onelog.ch.
- **Farbe:** Sage und Lavender kommen auf der Startseite nicht mehr vor. Coral nur für Links, den Knopf zum Kontakt und eine Hervorhebung pro Abbildung.
- **Markdown-Zwilling:** `src/content/pages/home.md` bleibt im Prototyp unverändert. Die Drift ist bewusst, weil der Branch nicht gemergt wird.

## Platzhalter-Texte

Alle Texte im Prototyp sind Platzhalter. Der Wortlaut kommt aus dem Vault (Story «Startseite führt direkt zu den Leistungen») und wird hier nicht ausformuliert oder verbessert. Im Prototyp gelten diese Fassungen:

- **Kopf:**
	- dunkel: «fumu.»
	- gedämpft: «Technologie in Wirkung übersetzen. Wir verbinden Strategie, Organisation und Technologie, damit aus technologischem Potenzial echte Wirkung wird.»
	- darunter in Klein: «[Platzhalter: Satz, der fumu abgrenzt]»
- **Fragen der Kunden** (aus den Anruf-Anlässen der Positionierung):
	1. «Unser Vermarktungsgeschäft soll Produkte bekommen.» → `/ki-transformation/`
	2. «Wir wollen unsere Agentur für KI aufstellen.» → `/ki-transformation/`
	3. «Wir müssen eine Richtung entscheiden, die an einer technischen Frage hängt.» → `/was-wir-tun/`
	4. «Wir brauchen jemanden, der die Umsetzung auf Zeit führt.» → `/was-wir-tun/`

	Unter jeder Frage steht «[Platzhalter: ein Satz]» und der Link.

## Schritte

- [x] Prüfen, dass die Pillar-Bilder auf `main` committed sind, dann Branch `redesign-prototyp` anlegen
- [x] `data-grund` mit den Varianten `elfenbein` und `papier` in `global.css`, Umschalter in `BaseLayout.astro` (nur auf dem Branch)
- [x] Kopfzeile und Fuss im neuen Ton: Haarlinien, Menü ohne Farbe, Coral nur für den aktiven Punkt und den Knopf zum Kontakt
- [x] Startseite `index.astro` neu: Kopf, Abb. 1, Leistungen als Fragen, Perspektiven als Zeilen, Etiketten über den Sektionen
- [x] `npm run build` grün, `npx vitest run` grün
- [x] Ansicht auf Desktop und 400 px, beide Gründe
- [x] Screenshots der Startseite in beiden Gründen (1440×900) nach `/Users/jochen.witte/Data/Akasha/Aufwände/fumu Marketing/fumu.ch/assets/fumu-redesign-prototyp-elfenbein.png` und `…-papier.png`
- [ ] Lokales Review mit Jochen: fumu.ch mit `npm run dev` (Port 4321), daneben onelog in `~/Data/onelog-website` mit `npm run dev -- --port 4322`

## Entscheidungen

- Der Prototyp darf an Kopfzeile, Fuss und globalen Tokens ändern, weil Jochen die Wirkung auf den übrigen Seiten sehen soll. Bauen soll er nur die Startseite.
- Das Raster ist dekorativ und leise: Linien höchstens mit 4 bis 6 Prozent Deckkraft, damit lange Texte darauf ruhig bleiben.
- Wenn der Prototyp ohne Figuren kühl wirkt, wird das im Review benannt und nicht im Prototyp mit Illustrationen ausgeglichen.

## Ausblick (nicht Teil dieses Plans)

- **Phase 2:** Grundlagen auf `main`, also Tokens, Kopfzeile, Fuss und Schrift nach dem Entscheid zum Grund. Dazu die Startseite mit den freigegebenen Texten, `index.astro` und `home.md` im selben Zug. Live nach Review.
- **Phase 3:** Pillar-Seiten (`EvansSection`, `PageIntro`), «Was wir tun», About und Kontakt. Die Perspektiven behalten ihr Leselayout und gleichen nur Kopf und Bilder an.
- **Offen im Vault:**
	- ob die Doodle-Icons der Perspektiven bleiben
	- wie die Diagramme als «Abb.» im Stil für alle Seiten festgelegt werden

## Rückkanal

Das Ergebnis des Reviews geht in die Vault-Story «fumu.ch im neuen Design live»:

- der gewählte Grund
- was vom Prototyp bleibt und was wegfällt
- die zwei Screenshots

Den Task zum Prototyp abhaken, Log-Eintrag mit dem Stand des Branches. Den Plan für Phase 2 schreibt die Vault-Session.

### Stand Branch `redesign-prototyp` (2026-11-22)

Umsetzung in einem Worktree (`.claude/worktrees/redesign-prototyp`), damit `main` im Hauptverzeichnis für die anderen Schreiber ausgecheckt bleibt. Abweichungen vom Plan:

- **Ganze Site statt nur Startseite.** Jochens Ansage vom 22.11.: «Redesign der gesamten Seite inklusive der Perspektiven. Punkt. Inhaltlich aber keine Änderungen.» Alle Seiten tragen das neue Design, Texte unverändert. Der Satz unter Ausblick «Die Perspektiven behalten ihr Leselayout und gleichen nur Kopf und Bilder an» ist damit überholt, ebenso das Akzeptanzkriterium der Story «die Perspektiven lesen sich weiter wie heute».
- **Überschriften in Tinte statt Coral**, Fraunces nur im H1 der Perspektiven. Das überstimmt die CI vom 2026-07-15 («Coral durchgehend für Überschriften») bewusst, weil der Plan Coral auf Links, den Knopf zum Kontakt und eine Hervorhebung pro Abbildung begrenzt.
- **Elfenbein = #F7F5EF**, der heutige Wert in `global.css` (seit 2026-08-25 aus brand.yaml). #FBFAF7 im Plan ist veraltet.
- **Doodle-Icons** sind site-weit per CSS ausgeblendet, das Markup bleibt. Entscheid weiter offen im Vault.
- **«Abb. N»** zählt per CSS auf jeder Seite durch, auch für Diagramme in den Perspektiven (dort nur die Nummer, weil das Markdown keine Legende trägt). Vorschlag für den offenen Task «Stil der Diagramme als Abb.».
- **Neue Etiketten ohne Textänderung:** Lesedauer (200 Wörter pro Minute) am Rand der Perspektiven, «Themen» über den drei Themen auf /perspektiven/. Die Releases (`updates.ts`) stehen nicht mehr auf der Startseite (Plan: «die letzten drei» Perspektiven).
- **Umschalter** als Liste von Achsen gebaut: Jede weitere Variante (z. B. Schrift im Kopf, Legende kursiv oder Mono) ist ein Eintrag in `BaseLayout.astro` plus CSS. `?grund=papier` und `?panel=aus` in der URL für Screenshots.
- **Ports:** 4321 und 4322 waren von Servern aus dem Hauptverzeichnis belegt. Prototyp auf http://127.0.0.1:4331/, onelog lief schon auf http://localhost:4400/.

