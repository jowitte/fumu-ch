# Neues Design für fumu.ch – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die ganze Site in das freigegebene Design «Mischung 4» umbauen – Bleistift auf gerissenem Papier, weiss oben, Pflaume als Sockel unten, Instrument Serif und Sans, Coral als Signatur –, ohne Wortlaut zu ändern; die Startseite als Übergangs-Startseite aus bestehenden Texten.

**Architecture:** Neue Tokens und Schriften in `global.css`; die gerissenen Papierkanten entstehen beim Build als CSS-Variablen (`--torn-*`) aus einer getesteten Funktion; neue Bausteine (Sockel, Karte, Papierbild, Perspektiven-Blätter) ersetzen das Ben-Evans-Raster. Die Startseite wird wie about/kontakt ein `PageContent`-Modul, aus dem HTML und Markdown-Zwilling entstehen.

**Tech Stack:** Astro 7 (static), reines CSS mit Custom Properties, TypeScript, Vitest, self-hosted woff2.

**Spec:** `docs/plans/2026-11-22-neues-design-entwurf.md` (freigegeben). Referenz-Mockups: `docs/plans/assets/2026-11-22-neues-design/startseite.html` und `perspektive.html` – CSS-Werte für Abstände, Grössen und Schatten dort ablesen.

## Global Constraints

- Farben exakt: Weiss #FFFFFF, Pflaume #43233B, Pflaume-soft #6B4A63, Tinte #2B1A27, Coral #C44540, Safran #E9A23B, Rosé #F3D9C4, Rosé-hell #F8EADF. Keine weiteren Farben ausser der Chart-Palette in `src/data/crawler-tracker.ts`.
- Farbregeln 1–6 aus dem Entwurf gelten überall; besonders: Coral-Schrift unter 24 px nur auf Weiss; auf Pflaume Text Weiss, Nebentext Rosé, Links und Fokus Safran, Coral nur als Knopf.
- Schriften: Instrument Serif 400 (normal, kursiv), Instrument Sans 400–600, self-hosted in `public/fonts/`. Fraunces und IBM Plex fallen weg; Excalifont bleibt.
- Kein Wortlaut ändert sich. Erlaubte Abweichungen sind nur die freigegebenen Entscheide des Entwurfs (Navigation, Abschluss, Radar-Link, Schriftzug) und die Übergangs-Startseite aus bestehenden Texten.
- Markdown-Zwillinge, `llms.txt`, `llms-full.txt`, JSON-LD, RSS, Sitemap bleiben byte-gleich – Ausnahme `/index.md` (Task 5).
- Kein Client-JS-Framework; `<details>` ohne JS. Breakpoint 860 px.
- `npm run build` und `npx vitest run` grün nach jedem Task.
- Arbeitsort: Branch `redesign` in einem eigenen Worktree. Nie auf `main` pushen ohne Jochens Ansage – der Push ist der Deploy.
- `<workspace>` meint den Plan-Workspace des Ausführungs-Skills (`.superpowers/sdd/2026-11-22-neues-design-umsetzung/`, git-ignoriert).

## Review Focus

1. **Wenig oder kein Material:** eine einzige Pillar (heute so), ein Thema mit nur einer Perspektive, ein Artikel ohne Thema – Karten und Blätter dürfen nicht leer oder kaputt stehen (Tests in Task 7, Sichtprüfung in Task 5).
2. **Lange Wörter in grosser Serif bei 400 px:** «Medien, Marketing und Werbung», «Urteilsfähigkeit», Perspektiven-Titel – nichts läuft über (Überlauf-Prüfung in Task 11).
3. **«Bewegung reduzieren»:** Das Standbild an Stelle des Loop-Videos liegt ebenfalls auf Papier und mit `multiply` (Sichtprüfung in Task 7).
4. **Kontrast im Sockel und auf Papierflächen:** Links und Fokus im Sockel Safran, keine Coral-Schrift unter 24 px auf Rosé (Prüfschritt in Task 11).
5. **Inhalt unverändert:** kein Satz, Link oder Zustand fällt weg (Text- und Markdown-Vergleich gegen die Baseline in Task 11).

---

### Task 1: Worktree, Baseline, Schriften und Tokens

**Files:**
- Modify: `src/styles/global.css` (Schriften, `:root`, Basis-Typografie, Zoom- und Loop-Stile)
- Modify: `src/layouts/BaseLayout.astro` (Font-Preload)
- Create: `scripts/text-diff.mjs`
- Create: `public/fonts/instrument-serif-latin.woff2`, `…-latin-ext.woff2`, `instrument-serif-italic-latin.woff2`, `…-latin-ext.woff2`, `instrument-sans-latin.woff2`, `instrument-sans-latin-ext.woff2`, `public/fonts/OFL-instrument.txt`
- Delete: `public/fonts/fraunces-*.woff2`, `public/fonts/ibm-plex-*.woff2`

**Interfaces:**
- Produces (CSS-Tokens, von allen späteren Tasks benutzt): `--color-white`, `--color-plum`, `--color-plum-soft`, `--color-ink`, `--color-coral`, `--color-saffron`, `--color-blush`, `--color-blush-light`, `--color-plum-line: rgb(243 217 196 / .22)`, `--font-serif: 'Instrument Serif', Georgia, serif`, `--font-sans: 'Instrument Sans', system-ui, sans-serif`, `--radius-cut: 22px 8px 26px 10px / 10px 24px 8px 20px`, `--shadow-layer: 0 1px 0 rgb(0 0 0 / .06), 0 14px 24px -18px rgb(43 26 39 / .5)`, `--shadow-sheet: 0 18px 30px -20px rgb(0 0 0 / .7)`, `--max-width: 1200px`, `--read-width: 680px`, `--page-width: 760px`, Spacing `--space-xs…xl` wie heute.
- Entfernt: `--color-bg`, `--color-text`, `--color-text-light`, `--color-primary`, `--color-neutral`, `--color-sage`, `--color-lavender`, `--color-sand`, `--font-mono`. Jede Verwendung im Code wird in ihrem Task ersetzt; bis dahin dürfen Komponenten auf Fallbacks fallen.

- [ ] **Step 1: Worktree anlegen** – mit superpowers:using-git-worktrees einen Worktree auf neuem Branch `redesign` von `main` (Stand mit Commit «Plan: Entwurf für das neue Design …»). `npm install`.
- [ ] **Step 2: Baseline sichern** – `scripts/text-diff.mjs` anlegen (Verhalten siehe Task 11, Schritt 1). `npm run build`, dann den ganzen `dist/` nach `<workspace>/baseline/` kopieren. Expected: 27 Seiten gebaut; `node scripts/text-diff.mjs <workspace>/baseline dist` meldet keine Unterschiede.
- [ ] **Step 3: Schriften beschaffen** (Download freigegeben) – `npm install --no-save @fontsource/instrument-serif @fontsource-variable/instrument-sans`, die woff2 für latin und latin-ext (Serif 400 normal und kursiv, Sans variable wght) unter obigen Namen nach `public/fonts/` kopieren, OFL-Text dazu. `package.json` bleibt unverändert. Expected: `ls public/fonts/instrument-*` zeigt 6 Dateien.
- [ ] **Step 4: `global.css` umstellen** – `@font-face` für die neuen Dateien mit den bestehenden `unicode-range`-Strings für latin und latin-ext; alte `@font-face` raus; `:root` auf die Tokens oben; `body` Weiss, Tinte, Instrument Sans 17px/1.6; h1–h3 Instrument Serif 400 in Pflaume (Grössen aus dem Entwurf), h4–h6 Instrument Sans 600; Links Coral mit Unterstreichung (Offset 0.22em); Fokus `outline: 2px solid var(--color-coral)`; Breakpoint 860 px. Zoom-Ebene und `.loop-illustration` auf die neuen Tokens (Papier kommt in Task 4).
- [ ] **Step 5: Preload** in `BaseLayout.astro` auf `instrument-sans-latin.woff2` und `instrument-serif-latin.woff2`.
- [ ] **Step 6: Verifizieren** – `npm run build && npx vitest run`. Expected: 27 Seiten, alle Tests grün; `grep -l "Instrument Serif" dist/_astro/*.css` findet eine Datei; `grep -rl "Fraunces\|IBM Plex" dist/_astro/*.css` findet nichts.
- [ ] **Step 7: Commit** – `git add` der genannten Dateien, Commit «Design: Tokens und Schriften (Instrument, Pflaume, Coral)».

### Task 2: Gerissenes Papier als CSS-Variablen

**Files:**
- Create: `src/lib/torn-paper.ts`, `src/lib/torn-paper.test.ts`
- Modify: `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `tornPolygon(seed: number, opts?: { points?: number; jitter?: number; cx?: number; cy?: number; rx?: number; ry?: number }): string`, `tornEdge(seed: number, teeth?: number): string`, `tornTokens(): Record<'--torn-1' | '--torn-2' | '--torn-3' | '--torn-edge', string>`; CSS-Variablen `--torn-1`, `--torn-2`, `--torn-3`, `--torn-edge` auf `:root` jeder Seite.

- [ ] **Step 1: Tests schreiben** (`src/lib/torn-paper.test.ts`):
  - `tornPolygon(7)` zweimal aufgerufen liefert denselben String; `tornPolygon(7) !== tornPolygon(11)`.
  - `tornPolygon(7)` beginnt mit `polygon(`, hat 90 Punkte (89 Kommas), jeder Punkt matcht `/^-?\d+\.\d% -?\d+\.\d%$/`, alle Werte liegen zwischen −5 und 105.
  - `tornPolygon(7, { points: 40 })` hat 40 Punkte.
  - `tornEdge(3)` endet mit `100% 100%, 0% 100%)`, beginnt mit `polygon(0% `, alle y-Werte der Kante liegen zwischen 25 und 75; Standard 20 Zacken.
  - `tornTokens()` hat genau die vier Schlüssel; alle Werte beginnen mit `polygon(`.
- [ ] **Step 2: Laufen lassen** – `npx vitest run src/lib/torn-paper.test.ts`. Expected: FAIL (Modul fehlt).
- [ ] **Step 3: Implementieren** – `tornPolygon` portiert `torn()` aus `docs/plans/assets/2026-11-22-neues-design/mix4.py` (Ellipse mit 7 sinusförmigen Wellen plus Zittern) mit einem deterministischen PRNG (z. B. mulberry32) statt `random.Random`; Defaults points 90, jitter 0.035, cx 52, cy 52, rx 47, ry 44; Zahlen mit einer Nachkommastelle. `tornEdge`: x gleichmässig 0–100 %, y mit Zittern um 50 % (Bereich 25–75), dann `100% 100%, 0% 100%`. `tornTokens`: `--torn-1` = tornPolygon(7), `--torn-2` = tornPolygon(11, { points: 70, jitter: 0.05, cx: 50, cy: 50, rx: 46, ry: 45 }), `--torn-3` = tornPolygon(23), `--torn-edge` = tornEdge(3).
- [ ] **Step 4: Tests grün** – `npx vitest run src/lib/torn-paper.test.ts`. Expected: PASS.
- [ ] **Step 5: In BaseLayout einspeisen** – im `<head>` `<style is:inline set:html={…}>` mit `:root{--torn-1:…;…}` aus `tornTokens()`. Expected nach `npm run build`: `grep -c "\-\-torn-edge:polygon" dist/index.html` = 1.
- [ ] **Step 6: Commit** «Design: gerissene Papierkanten als Build-Tokens».

### Task 3: Kopfzeile, Sockel und Fuss

**Files:**
- Modify: `src/components/Header.astro`, `src/layouts/BaseLayout.astro`
- Create: `src/components/Sockel.astro`
- Delete: `src/components/Footer.astro` (Inhalt geht in den Sockel)

**Interfaces:**
- Consumes: Tokens (Task 1), `--torn-edge` (Task 2), `kontakt` aus `src/data/pages/kontakt.ts`.
- Produces: `BaseLayout` Props `abschluss?: boolean` (Default `true`) und benannter Slot `sockel`; `Sockel.astro` Props `{ abschluss: boolean }`, Default-Slot für seitenspezifischen Inhalt.

- [ ] **Step 1: Header** – Schriftzug `fumu<span>.</span>` (Instrument Serif 40 px, Pflaume, Punkt Coral, Link auf `/`); Navigation «Was wir tun» `/was-wir-tun/`, «Perspektiven» `/perspektiven/`, «Über fumu» `/about/`; Knopf «Termin vereinbaren» auf `/kontakt/` (Coral, `--radius-cut`, `--shadow-layer`). Aktiv-Logik wie heute (Pillars markieren «Was wir tun»), aktiver Punkt Coral, `aria-current="page"`. Mobil: bestehender Menü-Knopf; der Termin-Knopf bleibt sichtbar.
- [ ] **Step 2: Sockel** – Pflaume, Oberkante `::before` mit `clip-path: var(--torn-edge)` (24 px hoch, 22 px nach oben versetzt, wie `.sockel::before` im Mockup). Reihenfolge: Default-Slot → wenn `abschluss`: Abschluss mit Titel, Text und CTA aus der Sektion «Termin» in `kontakt.ts` (Titel «25 Minuten Kennenlernen», `body`, `cta` – nicht abtippen, importieren) → Newsletter-Zeile mit dem heutigen Text aus `Footer.astro` und Link `/kontakt/#newsletter` → Fuss: «© {Jahr} fumu GmbH, Zürich», Links «AI-Crawler-Radar» `/ai-crawler-radar/`, «Impressum», «Datenschutz», «AGB», «hello@fumu.ch». Farben nach Regel 6 (Text Weiss, Nebentext Rosé, Links und Fokus Safran).
- [ ] **Step 3: BaseLayout** – `<Footer />` ersetzen durch `<Sockel abschluss={abschluss}><slot name="sockel" /></Sockel>`; Brotkrumen in Instrument Sans 13 px, Pflaume-soft.
- [ ] **Step 4: Verifizieren** – `npm run build && npx vitest run` grün; `grep -c "AI-Crawler-Radar" dist/impressum/index.html` ≥ 1; `grep -c "25 Minuten Kennenlernen" dist/about/index.html` ≥ 1; Sichtprüfung Desktop und 400 px einer beliebigen Seite: Sockel mit gerissener Kante, Menü bedienbar.
- [ ] **Step 5: Commit** «Design: Kopfzeile und Pflaumensockel».

### Task 4: Bausteine Karte, Papierbild, Perspektiven-Blätter

**Files:**
- Create: `src/components/Karte.astro`, `src/components/PapierBild.astro`, `src/components/PerspektivenBlaetter.astro`
- Modify: `src/styles/global.css` (Papier für `.loop-illustration` und Illustrationen im Markdown)

**Interfaces:**
- Produces:
  - `Karte.astro` Props `{ tone: 'coral' | 'saffron' | 'blush-light' | 'white'; href?: string; class?: string }`, Default-Slot; rendert `<a>` mit `href`, sonst `<div>`; `--radius-cut`, `--shadow-layer`; Coral → weisse Schrift, sonst Tinte; Coral-Karte trägt rechts oben ein Papierstück in Rosé, Safran-Karte eines in Rosé-hell (Regel 2).
  - `PapierBild.astro` Props `{ src: string; alt: string; width: number; height: number; torn?: 1 | 2 | 3; tone?: 'blush' | 'blush-light'; safran?: boolean; eager?: boolean }`: `<figure>` mit Papierform (`clip-path: var(--torn-N)`, Inset wie `.collage .rose` im Mockup), optional zweiter Form in Safran (`--torn-2`, wie `.collage .safran`), darüber das Bild mit `mix-blend-mode: multiply`.
  - `PerspektivenBlaetter.astro` Props `{ items: Array<{ href: string; title: string; text: string; date?: Date }> }`: Raster mit bis zu drei weissen Blättern auf Pflaume, `--shadow-sheet`, das erste −0.8°, das dritte +0.7° gedreht; Datum (falls vorhanden) Coral in Versalien; Titel Instrument Serif 32 px Pflaume; unter 860 px einspaltig, ohne Drehung.
  - Global: `.loop-illustration` und `p:has(> img[src*="-hero."]:only-child)` bekommen `position: relative` und ein `::before` in Rosé-hell mit `clip-path: var(--torn-1)`; Video bzw. Bild darüber mit `multiply`; dasselbe für das Standbild bei `prefers-reduced-motion`.

- [ ] **Step 1: Komponenten schreiben** nach den Interfaces; Werte aus `startseite.html`.
- [ ] **Step 2: Verifizieren** – `npm run build && npx vitest run` grün. Sichtprüfung über eine Perspektive mit Loop-Video (z. B. `/perspektiven/wer-bildet-noch-aus/`) und eine mit Bleistift-Bild (`/perspektiven/alte-metriken-versagen/`): Papierform hinter dem Bild, Weiss durchsichtig; dasselbe mit aktivierter Option «Bewegung reduzieren» (DevTools → Rendering → `prefers-reduced-motion: reduce`).
- [ ] **Step 3: Commit** «Design: Karte, Papierbild, Perspektiven-Blätter».

### Task 5: Übergangs-Startseite aus bestehenden Texten

**Files:**
- Create: `src/data/pages/home.ts`, `src/data/pages/home.test.ts`, `public/images/home/hero-weg.webp`
- Modify: `src/pages/index.astro`, `src/pages/index.md.ts`, `src/content/pages/home.md`

**Interfaces:**
- Consumes: `pillars`, `pillarPath` (`src/data/pillars.ts`), `about` (`src/data/pages/about.ts`), `toMarkdown` (`src/data/pages/to-markdown.ts`), Bausteine aus Task 4, Sockel-Slot aus Task 3.
- Produces: `export const home: PageContent` in `src/data/pages/home.ts` mit
  - `title` und `description` = Frontmatter von `home.md` (wörtlich übernehmen),
  - `heading: 'Technologie in Wirkung übersetzen.'`,
  - `intro: ['Wir verbinden Strategie, Organisation und Technologie – damit aus technologischem Potenzial echte Wirkung wird.']`,
  - `sections`: `{ label: 'Was wir tun', items: [ { kind: 'links', entries: pillars → { title: label, href: pillarPath, teaser } }, …die Items der Sektion `id: 'formate'` jeder Pillar unverändert ] }` und `{ label: 'Referenzen', items: [ das erste `quote`-Item aus `about.sections` ] }`.

- [ ] **Step 1: Tests schreiben** (`src/data/pages/home.test.ts`):
  - `home.heading` ist `'Technologie in Wirkung übersetzen.'`; `home.intro` wie oben.
  - Die `links`-Einträge entsprechen `pillars` (heute genau ein Eintrag `{ title: 'KI-Transformation', href: '/ki-transformation/', … }`).
  - Die Format-Items haben die Titel `['KI-Wertstromanalyse', 'Strategische Begleitung', 'KI-Implementierung']` und sind dieselben Objekte wie in der Pillar.
  - Das Zitat hat `cite: 'Silvano Oeschger, ehem. CEO OneLog AG'`.
  - `headingOf(home)` ist der Claim; `toMarkdown(home)` enthält den Lead, `- [KI-Transformation](/ki-transformation/): ` und `— Silvano Oeschger, ehem. CEO OneLog AG` und enthält weder «Platzhalter» noch «Updates».
  - Jedes Stück aus `textFragments(home)` kommt in `toMarkdown(home)` vor (dieselbe Regressionsprüfung wie für die übrigen Datenseiten).
- [ ] **Step 2: Laufen lassen** – `npx vitest run src/data/pages/home.test.ts`. Expected: FAIL (Modul fehlt).
- [ ] **Step 3: `home.ts` implementieren**. Kein neuer Satz; alle Texte kommen aus den genannten Modulen.
- [ ] **Step 4: Tests grün** – Expected: PASS.
- [ ] **Step 5: Bild** – `docs/plans/assets/2026-11-22-neues-design/hero-a.jpg` als `public/images/home/hero-weg.webp` (Breite 1200, Qualität 82) ablegen; Alt-Text: «Drei Menschen über einem grossen Blatt: Einer zeichnet einen klaren Weg durch ein Gewirr von Linien.» Es ist ein Übergangsbild; das abgenommene Bild aus dem Vault ersetzt die Datei später unter demselben Namen.
- [ ] **Step 6: `index.astro`** – Aufbau wie `startseite.html`, gespeist aus `home`: Kopf (H1 `heading`, Lead `intro`, Knopf «Termin vereinbaren» `/kontakt/`, rechts `PapierBild` mit `safran`), «Was wir tun» als H2 mit Themen-Karten (`links`-Einträge; erste Coral, zweite Safran, weitere Rosé-hell; eine einzelne Karte spannt die volle Breite) und Format-Karten (Rosé-hell, `tag` als Dauer in Coral kursiv ≥ 24 px, Titel, `body` über `RichText`, Karte verlinkt auf `${pillarPath}#formate`). Im Slot `sockel`: Zitat (Safran-Kreis mit «, Text in Serif kursiv weiss, Quelle Rosé), dann H2 «Perspektiven» mit Link «Alle Perspektiven» und `PerspektivenBlaetter` mit den drei neuesten publizierten Perspektiven (`description` als Text).
- [ ] **Step 7: Markdown-Zwilling** – `index.md.ts` gibt `# ${headingOf(home)}` und darunter `toMarkdown(home)` aus (gleiche Response-Header wie heute); der Body von `home.md` wird entfernt, das Frontmatter bleibt (Quelle für title/description in `index.astro`).
- [ ] **Step 8: Verifizieren** – `npm run build && npx vitest run` grün; `dist/index.md` beginnt mit `# Technologie in Wirkung übersetzen.` und enthält die drei Formate und das Zitat; Sichtprüfung Desktop und 400 px, auch mit nur einer Themen-Karte.
- [ ] **Step 9: Commit** «Startseite: Übergangs-Startseite im neuen Design, HTML und Markdown aus home.ts».

### Task 6: Seiten aus PageContent (Was wir tun, Über fumu, Kontakt, Pillar)

**Files:**
- Create: `src/components/Sektion.astro` (ersetzt `EvansSection.astro`)
- Delete: `src/components/EvansSection.astro`
- Modify: `src/components/PageIntro.astro`, `src/components/Figure.astro`, `src/pages/was-wir-tun.astro`, `src/pages/about.astro`, `src/pages/kontakt.astro`, `src/pages/[pillar].astro`

**Interfaces:**
- Consumes: `Karte`, `PerspektivenBlaetter` (Task 4), Sockel-Slot und `abschluss` (Task 3).
- Produces: `Sektion.astro` Props `{ section: Section }` (Typ aus `src/data/pages/types.ts`), einspaltig in `--page-width`, `id={section.id}`, H2 = `section.label` in Instrument Serif 44 px.

- [ ] **Step 1: `Sektion.astro`** – rendert alle Item-Arten wie heute `EvansSection`, nur neu gestaltet: `item` (Tag als Versalien-Etikett Pflaume-soft, Titel H3 Serif, `RichText`, CTA als Coral-Link), `links` (Themen-Karten Rosé-hell, Titel H3 Serif, Teaser), `person` (rundes Foto, Name H3, Tag, Text, Links), `quote` (Serif kursiv 30 px Pflaume, Quelle in Versalien), `logos` (Raster, `multiply`), `image` (`Figure` frei auf Weiss), Sektion `formate` (Items mit Titel als Format-Karten im Raster, Dauer in Coral ≥ 24 px), Sektion `faq` (`<details>`, Plus in Coral rechts, Haarlinie in Rosé dazwischen). Inline-Links Coral unterstrichen.
- [ ] **Step 2: `PageIntro`** – Lead 19 px Pflaume-soft, `max-width: --page-width`. **`Figure`** – Legende Instrument Sans 14 px Pflaume-soft; Zoom-Ebene unverändert in Funktion.
- [ ] **Step 3: Seiten** – `was-wir-tun`, `about`, `kontakt`: H1 Serif 76/46 px, `PageIntro`, Sektionen über `Sektion`; `kontakt` setzt `abschluss={false}`. `[pillar]`: Kopf mit H1 (`headingOf`), rechts Hero-`Figure` auf Karte Rosé-hell, darunter Lead; Sektionen ausser der angehängten Related-Sektion; die Related-Sektion (letzte Sektion, wenn `pillar.page.relatedPerspektiven` gesetzt ist; Label = `relatedPerspektiven.label`) geht in den Slot `sockel` als H2 plus `PerspektivenBlaetter` (Text = Teaser, ohne Datum). Geschwister-Leiste bleibt als Links unter dem Inhalt.
- [ ] **Step 4: Verifizieren** – `npm run build && npx vitest run` grün (die bestehenden Tests zu `structured-data`, `to-markdown`, `related` bleiben unverändert grün); `diff <workspace>/baseline/ki-transformation.md dist/ki-transformation.md` leer (ebenso about, was-wir-tun, kontakt); Sichtprüfung der vier Seiten Desktop und 400 px, FAQ per Tastatur.
- [ ] **Step 5: Commit** «Design: Seiten aus PageContent einspaltig mit Karten».

### Task 7: Perspektive

**Files:**
- Create: `src/lib/sockel.ts`, `src/lib/sockel.test.ts`; `src/lib/reading-time.ts` und `src/lib/reading-time.test.ts` vom Branch `redesign-prototyp` übernehmen (`git checkout redesign-prototyp -- src/lib/reading-time.ts src/lib/reading-time.test.ts`)
- Modify: `src/pages/perspektiven/[...slug].astro`

**Interfaces:**
- Produces: `type BlattPost = { id: string; title: string; description: string; date: Date; series?: string }` und `sockelPerspektiven(posts: BlattPost[], current: BlattPost, n?: number): BlattPost[]` (Default 3); `readingMinutes(body: string | undefined): number`.

- [ ] **Step 1: Tests schreiben** (`src/lib/sockel.test.ts`):
  - Artikel mit Thema und vier weiteren desselben Themas → die drei neuesten davon, neueste zuerst, ohne den Artikel selbst.
  - Artikel mit Thema und genau einem weiteren → genau dieser eine.
  - Artikel mit Thema ohne weitere → die drei neuesten aller Perspektiven ohne den Artikel.
  - Artikel ohne Thema → die drei neuesten aller Perspektiven ohne den Artikel.
  - Weniger als drei Perspektiven insgesamt → alle ausser dem Artikel, kein Fehler.
- [ ] **Step 2: Laufen lassen** – `npx vitest run src/lib/sockel.test.ts`. Expected: FAIL.
- [ ] **Step 3: `sockelPerspektiven` implementieren.**
- [ ] **Step 4: Tests grün** – `npx vitest run src/lib/sockel.test.ts src/lib/reading-time.test.ts`. Expected: PASS.
- [ ] **Step 5: Artikelseite** – nach `perspektive.html`: Kopf in der Lesespalte (Breite `--read-width`): Meta-Zeile mit Datum (Coral, Versalien), «Thema: {name}» als Streifen in Rosé (Link auf die Themenseite, nur mit Thema; bei `seriesPart` «Teil {n} im Thema {name}»), Autor oder Autoren verlinkt wie heute, «{readingMinutes} Min.», bei `updated` «Überarbeitet {Datum}»; Hinweis «Geplant für …» im Dev wie heute; H1 Serif 76/46 px. Lesespalte 18.5 px/1.72, H2 Serif 38 px; Illustrationen und Loop-Videos ragen 110 px links und rechts aus der Spalte (unter 1000 px 20 px). Serien-Navigation als zwei Karten Rosé-hell, Newsletter-Hinweis als Karte Rosé-hell mit seinem heutigen Text. Im Slot `sockel`: H2 «Mehr aus dem Thema {name}» mit Link «Zum Thema» (ohne Thema: H2 «Perspektiven» mit Link «Alle Perspektiven»), `PerspektivenBlaetter` aus `sockelPerspektiven`, darunter «← Alle Perspektiven». Doodle-Icon wird nicht gerendert.
- [ ] **Step 6: Verifizieren** – `npm run build && npx vitest run` grün; `diff -r` der Perspektiven-`.md` gegen die Baseline leer; Sichtprüfung `/perspektiven/wer-bildet-noch-aus/` (Video auf Papier, auch mit «Bewegung reduzieren»), `/perspektiven/robots-txt-vertragsklausel/` (Überarbeitet, Charts, Zoom), eine Perspektive ohne Thema, Desktop und 400 px.
- [ ] **Step 7: Commit** «Design: Perspektive mit Lesespalte, Papier und Sockel».

### Task 8: Perspektiven-Übersicht und Themen

**Files:**
- Modify: `src/pages/perspektiven/index.astro`, `src/pages/perspektiven/themen/index.astro`, `src/pages/perspektiven/themen/[slug].astro`

**Interfaces:**
- Consumes: `Karte` (Task 4), `readingMinutes` (Task 7).

- [ ] **Step 1: Übersicht** – H1 «Perspektiven», Lead; die drei Themen als Karten Rosé-hell (Name als H2-Link, `cardTeaser`, Callout mit `renderInlineLinks`, Link «Zum Thema»), ohne Themenfarbe und Icon. Darunter je Monat eine H2 in Serif und die Perspektiven als Zeilen: Datum (Coral, Versalien), Titel (Serif 28 px, Link), Beschreibung, «Thema: {name}» als Link. Leerer Zustand «In Kürze» wie heute.
- [ ] **Step 2: Themen-Übersicht** – Themen als Karten Rosé-hell mit Name, Anzahl, Teaser; Link «← Alle Perspektiven».
- [ ] **Step 3: Themen-Seite** – H1, Teaser als Lead, Callout als Karte Rosé-hell mit Label in Versalien, H2 «Perspektiven», Zeilen wie in der Übersicht (mit «Teil {n}», wo gesetzt), «← Alle Perspektiven».
- [ ] **Step 4: Verifizieren** – `npm run build && npx vitest run` grün; `diff` der Themen-`.md` gegen Baseline leer; Sichtprüfung Desktop und 400 px.
- [ ] **Step 5: Commit** «Design: Perspektiven-Übersicht und Themen».

### Task 9: Radar, Rechtstexte, 404, Formulare und Charts

**Files:**
- Modify: `src/pages/ai-crawler-radar.astro`, `src/components/CollapsibleSection.astro`, `src/components/NewsletterSignup.astro`, `src/components/charts/BlockShareBars.astro`, `src/components/charts/TrendChart.astro`, `src/pages/impressum.astro`, `src/pages/datenschutz.astro`, `src/pages/agb.astro`, `src/pages/404.astro`, `src/styles/global.css` (`.content`)

- [ ] **Step 1: Radar** – Lesespalte linksbündig (`--page-width`), H1 Serif, Snapshot-Zeile in Versalien Pflaume-soft, Inline-Links Coral unterstrichen; `CollapsibleSection`: Titel H2-Stil Serif, Plus in Coral rechts statt Chevron, Haarlinie in Rosé. Charts: Farben unverändert, `var(--font-mono)` → `var(--font-sans)` mit `font-variant-numeric: tabular-nums`.
- [ ] **Step 2: Newsletter-Formular** – Feld weiss mit Rand Pflaume-soft (≥ 3:1), Knopf Coral mit `--radius-cut`, Label in Versalien Pflaume-soft, Fokus Coral.
- [ ] **Step 3: Rechtstexte und 404** – `.container.content` linksbündig in `--page-width`, H2 Serif; 404: H1 Serif, Text, Link Coral.
- [ ] **Step 4: Verifizieren** – `npm run build && npx vitest run` grün; `grep -rn "font-mono\|color-bg\|color-text\b\|color-text-light\|color-sage\|color-lavender\|color-sand\|color-neutral\|color-primary" src/` leer; `diff` von `ai-crawler-radar.md`, `impressum.md`, `datenschutz.md`, `agb.md` gegen Baseline leer; Sichtprüfung Desktop und 400 px.
- [ ] **Step 5: Commit** «Design: Radar, Rechtstexte, 404, Formulare».

### Task 10: Favicon, Touch-Icon, OG-Bild

**Files:**
- Create: `scripts/brand-assets.mjs`
- Modify (ersetzt): `public/favicon.ico`, `public/favicon-16x16.png`, `public/favicon-32x32.png`, `public/apple-touch-icon.png`, `public/images/og-default.png`

**Interfaces:**
- Consumes: Schriften aus Task 1.

- [ ] **Step 1: Skript** `scripts/brand-assets.mjs` – rendert eine HTML-Vorlage mit den self-hosted Instrument-Schriften per `playwright-core` (Pfad per Umgebungsvariable `PLAYWRIGHT_CORE`, Default `/Users/jochen.witte/Data/Akasha/.claude/lib/publish/node_modules/playwright-core`; im Kopf des Skripts dokumentiert, keine neue Abhängigkeit im Repo): Icon «f.» (Instrument Serif, Pflaume auf Weiss, Punkt Coral) als 16, 32 und 180 px PNG; OG-Bild 1200×630: Weiss, Schriftzug «fumu.» 140 px, darunter der Claim «Technologie in Wirkung übersetzen.» in Pflaume-soft, unten eine Papierkante in Rosé. `favicon.ico` aus 16 und 32 px mit `magick`.
- [ ] **Step 2: Laufen lassen** – `node scripts/brand-assets.mjs`. Expected: fünf Dateien neu geschrieben; `magick identify public/favicon.ico` zeigt 16×16 und 32×32; `magick identify public/images/og-default.png` zeigt 1200x630.
- [ ] **Step 3: Sichtprüfung** der fünf Dateien (Read), dann `npm run build` grün.
- [ ] **Step 4: Commit** «Design: Favicon, Touch-Icon und OG-Bild im neuen Schriftzug».

### Task 11: Abnahme

**Files:**
- Create: `scripts/overflow-check.mjs`
- Use: `scripts/text-diff.mjs` (Task 1)
- Modify: `CLAUDE.md` (Stack-Tabelle Schriften; Abschnitt Design-System; Startseite-Quelle; Sockel)

- [ ] **Step 1: Text-Vergleich** – `scripts/text-diff.mjs <baseline-dir> <dist-dir>` (in Task 1 angelegt): liest jede `index.html` beider Bäume, entfernt `<script>`, `<style>`, `<svg>`, Tags und Entities, vergleicht die Wort-Multimengen je Seite und gibt pro Seite «fehlt:» und «neu:» aus. `node scripts/text-diff.mjs <workspace>/baseline dist`. Expected: «fehlt:» nur bei der Startseite (alter Update-Strom, alte Teaser) und überall nur das Navigationslabel «Kontakt & Newsletter» und Alt-Texte der Doodle-Icons; «neu:» nur Abschluss, Radar-Link, «Termin vereinbaren», «Min.», «Thema»-Streifen, Sockel-Überschriften.
- [ ] **Step 2: Markdown-Vergleich** – `diff -r` aller `.md`, `llms.txt`, `llms-full.txt`, `rss.xml` gegen die Baseline. Expected: einzige Abweichung `index.md`.
- [ ] **Step 3: Überlauf** – `scripts/overflow-check.mjs` (playwright-core wie Task 10) öffnet bei 400 px Breite jede Seite aus `dist` über `npm run preview` und meldet `scrollWidth > 400`. Expected: keine Meldung.
- [ ] **Step 4: Kontrast-Stichprobe** – in DevTools je ein Link und Fokusring im Sockel (Safran auf Pflaume) und jede Coral-Schrift auf Rosé-hell (≥ 24 px). Expected: Regeln 3 und 6 eingehalten.
- [ ] **Step 5: CLAUDE.md** – Stack-Zeile Fonts auf Instrument Serif + Instrument Sans; Design-System-Tabellen (Farben, Typografie, Layout) auf die neuen Tokens; Hinweis: Texte der Startseite stehen in `src/data/pages/home.ts` (HTML und `/index.md` entstehen daraus); `BaseLayout`-Slot `sockel` und Prop `abschluss`; Papierkanten über `--torn-*`.
- [ ] **Step 6: Gesamtlauf** – `npm run build && npx vitest run`. Expected: alles grün.
- [ ] **Step 7: Commit** «Design: Abnahme-Skripte und CLAUDE.md».
- [ ] **Step 8: Lokal-Review mit Jochen** – `npm run dev` im Worktree auf einem freien Port, URL an Jochen. Merge auf `main` und Push nur auf seine Ansage.
