# Was wir tun grafisch – Entwurf

Stand: 2026-11-23 · Status: freigegeben von Jochen am 2026-11-23, samt den fünf Entscheiden unten · Entstanden in der Session was-wir-tun-grafisch, Variante B von Jochen am Mockup gewählt. Umsetzungsplan: `docs/plans/2026-11-23-was-wir-tun-grafisch-umsetzung.md`. Bezug im Vault: Story «Pillar 1 und Kategorie-Seite live auf fumu.ch», Task «`/was-wir-tun/` grafisch zur Kategorie-Seite ausbauen».

Screenshots und Mockup-Quellen liegen unter `docs/plans/assets/2026-11-23-was-wir-tun-grafisch/`:

- `heute.png` – die Seite, wie sie am 23.11. live war
- `b-1-leistung.png`, `b-5-leistungen.png`, `b-mobil.png` – die gewählte Variante, mit einer und mit fünf Leistungen, dazu mobil (400 px)
- `a-1-leistung.png`, `c-5-leistungen.png` – die beiden nicht gewählten Varianten
- `mockup/WasWirTunMockup.astro`, `mockup/AnsatzDiagramm.astro` – die Wegwerf-Skizze, die im Worktree `.claude/worktrees/was-wir-tun-grafisch` lief. Massstab für Aufbau, Grössen und Wirkung, nicht für Code.

## Absicht

Seit dem neuen Design (live seit `ead9782`) wirkt `/was-wir-tun/` auf Jochen zu textlastig. Viel Text ist es nicht: 361 Wörter (Unser Ansatz 94, Schwerpunkt 82, Leistungen 22, Referenzen 127). Textlastig wird die Seite durch ihre Form:

- Alles steht in einer Spalte von 760 px, die rechten 40 Prozent des Containers bleiben von oben bis unten leer.
- Sie ist die einzige Hauptseite ohne Bild oder Diagramm; Startseite und Pillar haben eins im Kopf.
- Sechsmal hintereinander dasselbe Muster aus Etikett, Titel und Absatz.
- Der Ausgang zur Pillar kommt nach 180 Wörtern Methodik, in der blassesten Karte (Rosé-hell).
- Die fünf Kundenlogos sind Coral-Silhouetten aus der Zeit vor dem Redesign. Sie verbrauchen die Signatur als Deko (Regel 1 des Design-Entwurfs vom 22.11.).

Ziel: Dieselben Texte, aber als Seite gesetzt statt als Dokument.

## Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**

- Der Kopf ist gebaut wie der Kopf der Pillar-Seite: links Titel und Lead, rechts ein Diagramm auf einer Karte in Rosé-hell, das den Lead-Satz als Bild zeigt.
- Die Seite nutzt die volle Containerbreite (1200 px).
- Der Ausgang zur Pillar ist die eine Coral-Fläche der Seite (Regel 4). Das Layout trägt eine Leistung heute und wächst ohne Umbau auf fünf.
- Coral steht nur noch auf dem, was etwas tut oder auszeichnet.

**Nicht-Ziele**

- Wortlaut, Reihenfolge der Sektionen und Auswahl der Inhalte bleiben, wie sie sind (Vault-Sache). Neu sind nur Text im Diagramm, Alt-Text und gegebenenfalls eine Bildunterschrift; die liefert der Vault.
- Markdown-Zwilling, `llms-full.txt` und JSON-LD bleiben, mit einer Ausnahme: Das Diagramm erscheint im Markdown direkt nach der H1, wie das Hero-Diagramm der Pillar (`to-markdown.ts` tut das schon für `hero`).
- Header-Navigation mit Pillar-Untermenü: eigener Task in derselben Story.
- Kachel-Satz der Serviceangebote: eigene Story («Serviceangebote auf fumu.ch abbilden»).
- Pillar 2 bis 5.

**Anti-Ziele** – verfehlt, auch wenn alles funktioniert, wenn:

- die Seite zum Kartenbaukasten wird (Anti-Ziel des Redesigns, onelog). Der Ansatz bleibt auf Weiss, ohne Karten und ohne Icons.
- das Diagramm wie eine Folie aus dem Beraterbaukasten wirkt: vier Begriffe in Kästchen ohne Aussage. Es muss den Unterschied zeigen, den der Lead behauptet (allein: keine Wirkung; zusammen: Wirkung).
- eine zweite grosse Coral-Fläche dazukommt.

## Ansätze

Gesammelt wurden fünf Ideen: Bild im Kopf, Diagramm zum Lead-Satz, Raster statt Liste, Coral-Karte als Ausgang (wahlweise hochgerückt), Zitat in den Sockel plus Logos in Pflaume. Als ganze Seiten gebaut wurden drei Kombinationen:

| Variante | Kern | Ergebnis |
|---|---|---|
| A «Ruhig» | Bleistiftbild im Kopf (Platzhalter: Irrgarten aus «Die unsichtbare Reorganisation»), Raster, Coral-Karte am heutigen Platz, Zitat im Sockel | nicht gewählt: Das Bild bringt Wärme, sagt aber nichts; ein eigenes Motiv bräuchte den Bild-Workflow |
| **B «Diagramm»** | wie A, im Kopf das Diagramm zum Lead-Satz statt des Bilds | **gewählt** (Jochen, 23.11.: «B ist gut») |
| C «Ausgang zuerst» | Leistungen direkt unter dem Kopf, Ansatz kompakt in vier Spalten | nicht gewählt: Mit einer Leistung wirkt die Coral-Karte unter dem Kopf wie eine Kopie der Startseite, die vier Säulen werden Kleingedrucktes, und die Reihenfolge ist Vault-Sache |

Warum B: Das Diagramm trägt Inhalt, der Kopf folgt dem Muster der Pillar-Seite, und die Reihenfolge der Seite bleibt unberührt.

## Der Entwurf, Abschnitt für Abschnitt

Massstab ist `b-1-leistung.png` und `b-5-leistungen.png`. Farben, Schriften und Formen nach dem Design-Entwurf vom 22.11. (Tokens in `global.css`).

**1. Kopf.** Raster aus zwei Spalten (`0.9fr` / `1.1fr`), vertikal mittig. Links H1 «Was wir tun» (76 px) und der Lead (19 px, Pflaume-soft), rechts eine `Karte` in Rosé-hell mit dem Diagramm (Innenabstand rund 22 px), per Klick vergrösserbar über `Figure.astro` wie auf der Pillar. Der Lead steht im Kopf, nicht darunter wie auf der Pillar, weil der H1 hier kurz ist.

**Diagramm.** Excalidraw, Excalifont, wie das Organigramm der Pillar. Zwei Zeilen, getrennt durch eine Haarlinie:

- oben «Technologie allein»: ein graues Kästchen «Technologie», ein gestrichelter grauer Pfeil, der vor dem Ziel abreisst, ein gestricheltes, graues Kästchen «Wirkung»
- unten «mit Strategie, Organisation und Prozessen»: drei graue Kästchen nebeneinander (Strategie, Organisation, Prozesse) über einem breiten Kästchen «Technologie», rechts davon eine Klammer und ein Pfeil in Coral zu «Wirkung» (Rosé-Füllung, Coral-Rand – wie «KI im gemeinsamen Prozess» im Organigramm)

Die Beschriftung nimmt nur Wörter aus dem Lead-Satz. Querformat, im Mockup etwa 600 × 320.

**2. Unser Ansatz.** H2 wie heute (Serif 44 px). Darunter ein Raster 2 × 2 über die volle Breite, Abstand rund 48 px vertikal, 64 px horizontal. Jede Zelle hat oben eine Haarlinie in Rosé (`--color-blush`), dann das Säulen-Wort aus `tag` gross in Serif (48 px, Pflaume), darunter der `title` als Zeile in Sans 600, 17 px, Pflaume (bleibt semantisch die H3), dann der Text (17 px, Tinte). Keine Karten, keine Icons, keine Nummern.

**3. Schwerpunkt.** H2 wie heute. Darunter eine Karte in Rosé-hell über die volle Breite, innen zwei Spalten (KI | Domäne), je Etikett (Versalien 13 px), H3 in Serif 34 px und Text.

**4. Leistungen.** H2 wie heute. Die Pillars aus der Registry als `Karte`-Links mit Titel (Serif), Teaser und Pfeil unten, wie auf der Startseite. Fläche nach Position: erste Coral, zweite Safran, alle weiteren Rosé-hell (Regeln 2 und 4, dieselbe Zuordnung wie `startseitenFlaechen`). Anordnung im Raster aus sechs Spalten:

- eine Leistung: volle Breite, Titel 52 px
- zwei: je halbe Breite
- drei bis fünf: die ersten zwei halbe Breite (Titel 44 px), die übrigen je ein Drittel (Titel 34 px)

Auf Coral- und Safran-Karten hält der Teaser Abstand zum Papierstück in der Ecke (im Mockup `padding-right: 96px`, sobald die Karte nur halb breit ist).

**5. Referenzen.** H2 wie heute. Die fünf Logos in einer Reihe (fünf Spalten), in Pflaume statt Coral, darunter je die Notiz (14 px, Pflaume-soft). Das Zitat steht nicht mehr hier.

**6. Sockel.** Das Zitat wandert in den Slot `sockel`, gesetzt wie auf der Startseite: Safran-Fleck mit «, Zitat in Serif kursiv, weiss, Quelle in Rosé. Darauf folgen wie überall Abschluss, Newsletter und Fuss.

**Mobil (unter 860 px).** Alles einspaltig: Kopf (Titel, Lead, darunter das Diagramm), Säulen untereinander (Säulen-Wort 36 px), Schwerpunkt-Karte mit beiden Spalten untereinander, Leistungen untereinander (Titel 36 px), Logos untereinander. Das Diagramm ist mobil klein, aber per Tippen vergrösserbar. Bei 400 px läuft nichts über (`scripts/overflow-check.mjs`).

## Entscheide in diesem Entwurf

Vorschläge der Session, von Jochen am 2026-11-23 mit dem Dokument freigegeben:

1. **Logos in Pflaume.** Dargestellt über eine CSS-Maske auf der bestehenden Datei (die WebPs haben einen Alphakanal), die Dateien bleiben unverändert. Grund: Regel 1, Coral nur auf dem, was handelt.
2. **Zitat in den Sockel**, wie auf der Startseite. Der Markdown-Zwilling behält das Zitat unter «Referenzen».
3. **Säulen-Wort gross, Titel als Unterzeile.** Die vier Begriffe Strategie, Organisation, Prozesse, Technologie sind das, was man beim Überfliegen erfassen soll; «Klarheit schaffen» und die anderen Titel bleiben H3 im HTML und im Markdown.
4. **Leistungsfarben nach Position wie auf der Startseite.** Startseite und `/was-wir-tun/` zeigen damit dieselbe Coral-Karte für KI-Transformation. Gewollt: dieselbe Leistung sieht überall gleich aus.
5. **Diagramm ohne Bildunterschrift**, falls der Vault keine liefert: Der Lead-Satz steht direkt daneben, eine Unterschrift würde ihn wiederholen. Dafür wird `caption` im Typ `Figure` für den Hero optional (Pillar behält ihre).

## Was der Vault liefert

Entscheid Jochen (23.11.): Das Diagramm entsteht zuerst, ordentlich in einer eigenen Vault-Session; die Umsetzung hier beginnt erst, wenn es abgenommen ist.

- **Diagramm:** Excalidraw-Quelle über `/visualize` im Vault nach der Skizze oben, abgelegt wie das Organigramm unter `Aufwände/fumu Marketing/fumu.ch/assets/diagram-technologie-allein.excalidraw.md`, SVG-Export mit eingebetteter Schrift daneben (`….excalidraw.svg`). Ziel im Repo: `public/images/was-wir-tun/technologie-allein.svg`. Jochen nimmt das Diagramm ab.
- **Alt-Text** des Diagramms und die Entscheidung, ob es eine Bildunterschrift trägt (Entscheid 5).

## Technische Eckpunkte

- **Ort:** `main`, Hauptverzeichnis – die Umsetzung passt in eine Session. Vor dem ersten Schreibzugriff `git status`: Dort können uncommittete Änderungen anderer Schreiber liegen; nur die eigenen Dateien stagen.
- **Daten (`src/data/pages/was-wir-tun.ts`):** Die vier Sektionen bekommen `id`s (`ansatz`, `schwerpunkt`, `leistungen`, `referenzen`). Das sind HTML-Anker, keine Textänderung; die Seite findet ihre Sektionen darüber statt über die Labels, die Vault-Wortlaut sind. Fehlt eine, bricht der Build laut (wie `index.astro` bei der Startseite). Dazu `hero: { src, alt, caption? }` mit dem SVG unter `public/images/was-wir-tun/`.
- **Seite (`src/pages/was-wir-tun.astro`):** rendert die Sektionen selbst, wie `index.astro` die Startseite, statt über `Sektion.astro`. `Sektion.astro` bleibt unverändert und rendert weiter About, Kontakt und die Pillars. JSON-LD (`serviceLd`) bleibt.
- **Flächen:** Die Zuordnung Coral/Safran/Rosé-hell aus `src/lib/startseite.ts` wiederverwenden (gegebenenfalls umbenennen, `startseite.test.ts` zieht mit), nicht ein zweites Mal schreiben.
- **Logo-Maske:** `mask` mit `--logo: url(…)`, `role="img"` und `aria-label="Logo <Name>"`, damit Screenreader den Namen weiter lesen.
- **`types.ts`:** Kommentar an `hero` («Rendert bisher nur die Pillar-Route») nachziehen; `caption` optional nach Entscheid 5. `to-markdown.ts` lässt eine fehlende Unterschrift weg, auch in `textFragments` (dort heute `hero.caption.trim()` ohne Wächter); `Figure.astro` rendert ohne Unterschrift kein leeres `<figcaption>`.
- **Excalifont:** steht als `public/fonts/excalifont-regular.woff2` bereit, der Excalidraw-Export bettet die Schrift aber ohnehin ins SVG ein (wie beim Organigramm).
- **Verifikation:** `npm run build` und `npx vitest run` grün; `scripts/text-diff.mjs` gegen einen Baseline-Build zeigt auf `/was-wir-tun/` nur den neuen Alt-Text (und gegebenenfalls die Bildunterschrift), sonst keine Wortänderung auf irgendeiner Seite; `scripts/overflow-check.mjs` bei 400 px ohne Befund; Ansicht Desktop und 400 px gegen die Screenshots; Lokal-Review mit Jochen. Live erst nach seiner Freigabe (Push auf `main` ist der Deploy).

## Rückkanal in den Vault

- Story «Pillar 1 und Kategorie-Seite live auf fumu.ch»: Task «grafisch ausbauen» abhaken, Log-Eintrag mit diesem Entwurf, Umsetzungs-Task in den Plan.
- Diagramm, Alt-Text, gegebenenfalls Bildunterschrift (siehe «Was der Vault liefert»).
