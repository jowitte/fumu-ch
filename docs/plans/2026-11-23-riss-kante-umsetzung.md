# Riss an Sockelkante und Knöpfen – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Sockel-Oberkante und alle Knöpfe bekommen den feinen Papierriss der Variante D statt Zacken und Papier-Ecken; das OG-Bild zieht mit.

**Architecture:** Ein neues Modul `src/lib/riss.ts` erzeugt beim Build nahtlos kachelbare SVG-Streifen aus periodischem Wertrauschen (mulberry32, fbm). `tornCss()` schreibt sie als Data-URIs in Custom Properties in das generierte `src/styles/torn-paper.css`. Der Sockel legt die Kante als `repeat-x`-Hintergrund über seine Oberkante; `.btn` zeichnet seine Fläche in `::before` (Maske aus Riss-Streifen oben und unten, `clip-path` für leicht unregelmässige Seiten) und den Faserrand in `::after`.

**Tech Stack:** Astro 7 (static), TypeScript, Vitest, reines CSS (mask, clip-path, filter: drop-shadow), Node ≥ 22.18 für die Skripte (Type Stripping).

**Spec:** `docs/plans/2026-11-23-riss-kante-entwurf.md` (freigegeben 2026-11-23). Referenz-Mockup: `docs/plans/assets/2026-11-23-riss/kante-und-knopf.html`, Abschnitt D; Funktionen `rauschen`, `fbm`, `kanteGerissen`, `knopf(…'gerissen')`.

## Global Constraints

- Nur Sockelkante, `.btn` und der Newsletter-Knopf «Anmelden» ändern sich, dazu das OG-Bild. `--torn-1…3`, Karten, Blätter, Thema-Streifen bleiben unverändert.
- Deterministisch beim Build, kein Client-JS; Zufall nur über mulberry32 wie in `src/lib/torn-paper.ts`.
- Rezeptur-Werte aus dem Entwurf: Riss 9 px · fbm(x / 220), 8 Oktaven, Gain 0.56; Faserrand max(0, 2.6 · fbm₂(x / 55) + 0.4) px, fbm₂ 6 Oktaven, Gain 0.6; Fasern Länge 1–3.6 px, Strich 0.3–0.6 px, Deckkraft 0.25–0.6, ±60° nach aussen; Knopf-Riss 3 px · fbm(x / 60), 7 Oktaven, Gain 0.55; Knopf-Faserrand max(0, 1.8 · fbm(x / 25) + 0.3) px; Seiten ±1.5 px; Startwerte Riss 21, Faserrand 33, Fasern 5.
- Periodisch statt Mockup-Frequenz: Frequenzfaktor pro Oktave genau 2, Gitterperiode = Kachelbreite / Massstab (muss ganzzahlig sein).
- Faserton = Grundfarbe gemischt mit 37 % Weiss (Pflaume → `#897484`, Coral → `#DA8A87`); keine weiteren Farben.
- Schatten Sockelkante: `drop-shadow(0 -1px 0 rgb(43 26 39 / .10)) drop-shadow(0 -5px 7px rgb(43 26 39 / .12))`.
- Fokusring der Knöpfe bleibt das Rechteck-`outline`; Text bleibt Text.
- Markdown-Zwillinge, `llms*.txt`, RSS, Sitemap, JSON-LD und Seitentext bleiben unverändert.
- `npm run build` und `npx vitest run` grün nach jedem Task; Arbeit auf `main` im Hauptverzeichnis, Push nur auf Jochens Ansage.

## Review Focus

1. **Sehr breite und sehr schmale Fenster:** Bei 2560 px wiederholt sich die Sockelkachel (1100 px) mehrfach – keine sichtbare Naht; bei 400 px kein Überlauf (Periodizitäts-Test in Task 1, Aufnahme 2560/1280/400 in Task 2).
2. **Knöpfe breiter als eine Kachel:** Der Newsletter-Knopf läuft mobil über die volle Breite (über 300 px) – der Riss wiederholt sich ohne Naht (Periodizitäts-Test in Task 1, Aufnahme 400 px in Task 3).
3. **Safari:** `mask` mit SVG-Data-URI und `clip-path` mit `calc()` in `polygon()` – `-webkit-mask` mitschreiben (Sichtprüfung im Lokal-Review, Task 4).
4. **Erzwungene Farben (Windows-Kontrastmodus):** Ohne eigenen Hintergrund verschwindet die Knopf-Fläche; der Knopf braucht dort einen Rahmen (`@media (forced-colors: active)`, Prüfung per emulierten forced-colors in Task 3).
5. **Zustände:** Hover dunkelt die Fläche (`--btn-farbe`), Fokus zeigt den Ring, `disabled` am Newsletter-Knopf bleibt halbtransparent (Playwright-Prüfung in Task 3).

---

### Task 1: Riss-Generator `src/lib/riss.ts`

**Files:**
- Create: `src/lib/riss.ts`, `src/lib/riss.test.ts`, `src/lib/zufall.ts`
- Modify: `src/lib/torn-paper.ts` (importiert `mulberry32` aus `zufall.ts` statt eigener Kopie; Ausgabe unverändert)

**Interfaces:**
- Consumes: nichts aus anderen Tasks.
- Produces:
  - `mulberry32(seed: number): () => number` in `src/lib/zufall.ts` – die heutige Funktion aus `torn-paper.ts`, unverändert verschoben (eigenes Modul, weil `torn-paper.ts` in Task 2 `riss.ts` importiert und sonst ein Import-Kreis entstünde)
  - `FARBEN: { white: '#FFFFFF'; plum: '#43233B'; coral: '#C44540'; blush: '#F3D9C4' }`
  - `mischFarbe(hex: string, mit: string, anteil: number): string` – lineare sRGB-Mischung, gerundet, Grossbuchstaben-Hex
  - `fbmPeriodisch(seed: number, oktaven: number, gain: number, periode: number): (x: number) => number` – x in Gittereinheiten der Grundoktave, Ergebnis in [−1, 1], f(x + periode) = f(x)
  - `rissKanteSvg(opts: { farbe: string; faser: string; breite?: number; hoehe?: number; basis?: number }): string` – Defaults breite 1100, hoehe 48, basis 22; Fläche unterhalb der Kante, Faserrand, Fasern
  - `knopfKantenSvg(art: 'oben' | 'unten' | 'faser'): string` – Kachel 300 × 10 px, schwarz auf transparent (Maske)
  - `knopfSeitenPolygon(): string` – `polygon(…)` mit `calc()`-Versatz ≤ 1.5 px an linker und rechter Seite, oben und unten über den Rand hinaus (−20 % / 120 %)
  - `svgDataUri(svg: string): string` – `url("data:image/svg+xml,…")`, ohne rohe `#`, `<`, `>`, `"`

- [ ] **Step 1: Tests schreiben** (`src/lib/riss.test.ts`):
  - `mischFarbe(FARBEN.plum, FARBEN.white, 0.37)` ist `'#897484'`; mit Coral `'#DA8A87'`.
  - `FARBEN` stimmt mit `src/styles/global.css` überein (Datei lesen, je `--color-white|plum|coral|blush: <hex>;` finden).
  - `fbmPeriodisch(21, 8, 0.56, 5)`: zweimal erzeugt gleiche Werte; für x in 0…5 (Schritt 0.37) gilt |f(x) − f(x + 5)| < 1e-9; alle Werte in [−1, 1].
  - `rissKanteSvg({ farbe: FARBEN.plum, faser: '#897484' })`: beginnt mit `<svg`, enthält `width="1100"`, `height="48"`, beide Farben; der erste und der letzte Punkt des Hauptpfads haben dieselbe y-Koordinate (Naht); alle y der Kante liegen in [0, 48]; zweimal erzeugt identisch.
  - `knopfKantenSvg('oben')`, `('unten')`, `('faser')`: je `width="300"`, `height="10"`; Kante an x = 0 und x = 300 gleich; alle y in [0, 10]; `oben` und `unten` sind verschieden.
  - `knopfSeitenPolygon()`: beginnt mit `polygon(`, enthält `-20%` und `120%`, jeder `calc`-Versatz ≤ 1.5 px.
  - Die bestehenden Tests in `torn-paper.test.ts` bleiben unverändert grün (Beleg, dass das Verschieben von `mulberry32` die Polygone nicht ändert; der Sync-Test mit `torn-paper.css` fängt jede Abweichung).
  - `svgDataUri('<svg fill="#43233B"/>')` beginnt mit `url("data:image/svg+xml,` und enthält im Nutzteil weder `#` noch `<`, `>` oder `"`.
- [ ] **Step 2: Laufen lassen** – `npx vitest run src/lib/riss.test.ts`. Expected: FAIL (Modul fehlt).
- [ ] **Step 3: Implementieren.** Periodisches Wertrauschen: ein Array aus 4096 Stützwerten (mulberry32, [−1, 1]); in Oktave o mit Frequenz 2^o, Gitterperiode `periode · 2^o`, Index modulo dieser Periode, Oktaven-Versatz `o · 37.1`, weiche Interpolation s = t²(3 − 2t), normiert auf die Amplitudensumme. Kanten als Polylinien, Punkte alle 1.5 px (Sockel) bzw. 1 px (Knopf), eine Nachkommastelle. Massstäbe so, dass die Gitterperiode ganzzahlig ist: Sockel 1100 / 220 = 5, Faserrand 1100 / 55 = 20, Knopf 300 / 60 = 5, Knopf-Faser 300 / 25 = 12. Fasern nur im Bereich x ∈ [4, breite − 4], 55 Stück. Knopf-Streifen: Kante um y = 5 (`oben`: Fläche darunter; `unten`: Fläche darüber, anderer Startwert; `faser`: Kante um max(0, 1.8 · fbm + 0.3) px nach oben versetzt, Fläche darunter).
- [ ] **Step 4: Tests grün** – `npx vitest run src/lib/riss.test.ts`. Expected: PASS; danach `npx vitest run` ganz grün.
- [ ] **Step 5: Commit** «Riss: Generator für nahtlose Papierriss-Kacheln».

### Task 2: Sockelkante aus der Riss-Kachel

**Files:**
- Modify: `src/lib/torn-paper.ts`, `src/lib/torn-paper.test.ts`, `src/components/Sockel.astro`, `src/styles/torn-paper.css` (erzeugt), `scripts/torn-css.mjs` (nur Kommentar, falls nötig)

**Interfaces:**
- Consumes: `rissKanteSvg`, `knopfKantenSvg`, `knopfSeitenPolygon`, `svgDataUri`, `mischFarbe`, `FARBEN` (Task 1).
- Produces: CSS-Variablen in `torn-paper.css`: `--riss-kante`, `--riss-oben`, `--riss-unten`, `--riss-faser`, `--riss-knopf-faser` (Farbe), `--riss-seiten`; `--torn-edge` und `tornEdge` entfallen; `TornTokens` hat nur noch `--torn-1…3`.

- [ ] **Step 1: Tests anpassen** (`torn-paper.test.ts`): `describe('tornEdge')` entfernen; `tornTokens()` hat genau `['--torn-1', '--torn-2', '--torn-3']`; `tornCss()` enthält `--riss-kante: url("data:image/svg+xml,`, `--riss-oben:`, `--riss-unten:`, `--riss-faser:`, `--riss-seiten: polygon(` und `--riss-knopf-faser: #DA8A87`; enthält nicht `--torn-edge`. Der Sync-Test mit `torn-paper.css` bleibt.
- [ ] **Step 2: Laufen lassen** – Expected: FAIL.
- [ ] **Step 3: `torn-paper.ts`** – `tornEdge` und `--torn-edge` entfernen; `tornCss()` schreibt zusätzlich die Riss-Variablen (Sockelkante in Pflaume mit Faserton `mischFarbe(plum, white, .37)`; Knopf-Streifen als Masken; `--riss-knopf-faser` = `mischFarbe(coral, white, .37)`). Dann `node scripts/torn-css.mjs`.
- [ ] **Step 4: Tests grün** – `npx vitest run`. Expected: PASS.
- [ ] **Step 5: `Sockel.astro`** – `.sockel::before`: `top: -38px; height: 48px; background: var(--riss-kante) repeat-x left top / auto 100%;` ohne `clip-path`, mit dem Schatten aus den Global Constraints; Kommentar oben auf die Riss-Kachel umstellen.
- [ ] **Step 6: Verifizieren** – `npm run build && npx vitest run` grün; `grep -c "torn-edge" dist/_astro/*.css` findet nichts; Aufnahmen des Sockels bei 2560, 1280 und 400 px (eine Seite mit Abschluss, `/kontakt/` ohne): Riss ohne Naht, Faserrand stellenweise, kein weisser Spalt zwischen Kante und Sockel; `node scripts/overflow-check.mjs` meldet keinen Überlauf.
- [ ] **Step 7: Commit** «Riss: Sockelkante als nahtlose Papierriss-Kachel».

### Task 3: Knöpfe als ausgerissene Streifen

**Files:**
- Modify: `src/styles/global.css` (`.btn`, Token `--shadow-layer-drop`), `src/components/NewsletterSignup.astro` (Knopf nutzt `.btn`), `src/components/Header.astro` (nur falls Abstände nachziehen)

**Interfaces:**
- Consumes: `--riss-oben`, `--riss-unten`, `--riss-faser`, `--riss-knopf-faser`, `--riss-seiten` (Task 2).
- Produces: `.btn` mit Custom Property `--btn-farbe` (Default `var(--color-coral)`), auch für `<button>` nutzbar.

- [ ] **Step 1: Prüfskript zuerst** – `scripts/knopf-check.mjs` (playwright-core wie `overflow-check.mjs`, eigener Static-Server über `dist/`): öffnet `/` und `/kontakt/` bei 1280 und 400 px und meldet für jeden `.btn`: `::before` hat `mask-image` mit `data:image/svg+xml`; Fläche (`::before` background-color) ist Coral, bei Hover dunkler; `:focus-visible` zeigt `outline-style: solid`; der Newsletter-Knopf trägt `.btn`, ist bei `disabled` halbtransparent; mit `forcedColors: 'active'` hat `.btn` einen sichtbaren Rahmen. Exit 1 bei einem Befund.
- [ ] **Step 2: Laufen lassen** – `npm run build && node scripts/knopf-check.mjs`. Expected: FAIL (heute keine Maske, Newsletter-Knopf ohne `.btn`).
- [ ] **Step 3: `.btn` in `global.css`** – Fläche ins `::before` (`inset: 0`, `z-index: -1`, `background: var(--btn-farbe)`, `mask` und `-webkit-mask`: `var(--riss-oben) top left / auto 10px repeat-x, var(--riss-unten) bottom left / auto 10px repeat-x, linear-gradient(#000 0 0) center / 100% calc(100% - 18px) no-repeat`, `clip-path: var(--riss-seiten)`); Faserrand ins `::after` (`z-index: -2`, `background: var(--riss-knopf-faser)`, Maske `var(--riss-faser) top left / auto 10px repeat-x` mit begrenzter Höhe 10 px); `.btn` selbst: `position: relative; isolation: isolate; background: none; border-radius: 0; box-shadow: none; filter: drop-shadow(0 1px 0 rgb(0 0 0 / .06)) drop-shadow(0 8px 6px rgb(43 26 39 / .18));` Hover setzt `--btn-farbe` auf die heutige Hover-Mischung. `@media (forced-colors: active) { .btn { border: 1px solid ButtonText; } }`. Padding so, dass die Schrift in der sichtbaren Fläche mittig steht.
- [ ] **Step 4: Newsletter-Knopf** – `class="btn newsletter-button"`; in `NewsletterSignup.astro` eigene Fläche, Radius und Schatten entfernen, Grösse und `disabled` behalten.
- [ ] **Step 5: Verifizieren** – `npm run build && node scripts/knopf-check.mjs` → PASS; `npx vitest run` grün; Aufnahmen aller Knöpfe (Kopfzeile, Startseite, Sockel, Formular) bei 1280 und 400 px, Weiss und Pflaume; Kontrast-Stichprobe Weiss auf Coral unverändert.
- [ ] **Step 6: Commit** «Riss: Knöpfe als ausgerissene Streifen».

### Task 4: OG-Bild, Doku, Abnahme

**Files:**
- Modify: `scripts/brand-assets.mjs`, `public/images/og-default.png` (neu erzeugt), `CLAUDE.md` (Design-System > Formen), `docs/plans/2026-11-23-riss-kante-umsetzung.md` (Checkboxen)

**Interfaces:**
- Consumes: `rissKanteSvg`, `svgDataUri`, `mischFarbe`, `FARBEN` (Task 1).

- [ ] **Step 1: `brand-assets.mjs`** – Import `tornEdge` ersetzen; die Papierkante im OG-Bild als `background: ${svgDataUri(rissKanteSvg({ farbe: FARBEN.blush, faser: mischFarbe(FARBEN.blush, FARBEN.white, .37) }))} repeat-x` über dem Rosé-Streifen. `node scripts/brand-assets.mjs`; Bild ansehen.
- [ ] **Step 2: `CLAUDE.md`** – Formen: Sockelkante und Knöpfe aus `src/lib/riss.ts` (Variablen `--riss-*` in `torn-paper.css`), `--torn-1…3` nur noch für die Papierformen hinter Bildern, `.btn` zeichnet die Fläche in `::before` (Farbe über `--btn-farbe`).
- [ ] **Step 3: Abnahme** – `npm run build && npx vitest run` grün; `node scripts/text-diff.mjs <stand-vorher> dist` ohne Unterschiede (Stand vor Task 1 in den Scratchpad sichern); Markdown-, llms-, RSS-Dateien byte-gleich; `node scripts/overflow-check.mjs` und `node scripts/knopf-check.mjs` ohne Befund.
- [ ] **Step 4: Commit** «Riss: OG-Bild und CLAUDE.md».
- [ ] **Step 5: Lokal-Review mit Jochen** – Dev-Server auf freiem Port, auch in Safari; Push nur auf seine Ansage.
