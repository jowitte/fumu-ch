# Über fumu grafisch – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/about/` nach Variante B umbauen: Kopf mit dem Oeschger-Zitat auf einer Karte wie `/was-wir-tun/`, Gründer gross mit Porträt auf Papier, Netzwerk in drei Spalten, Prinzipien in vier Spalten, Formate 2 × 2, Schoch/Wehrle im Sockel – mit genau zwei Textänderungen.

**Architecture:** Die Seite rendert ihre vier Sektionen selbst wie `was-wir-tun.astro` und findet sie über neue Sektions-`id`s. Zwei Wächter aus `types.ts` brechen den Build, wenn der Vault eine Item-Art oder ein zweites Zitat dazugibt. Neu ist der Baustein `Portraet.astro`, dessen Form beim Build aus `tornPolygon` mit flachen Wellen entsteht.

**Tech Stack:** Astro 7 (static), reines CSS mit Custom Properties, TypeScript, Vitest; ImageMagick (`magick`) für die WebP-Porträts.

**Spec:** `docs/plans/2026-11-24-ueber-fumu-grafisch-entwurf.md`. Massstab für Aufbau, Grössen und Abstände: `docs/plans/assets/2026-11-24-ueber-fumu-grafisch/b-stimme.png` und `b-mobil.png`; CSS-Werte in `…/mockup/AboutMockup.astro` unter `variante-b` und den gemeinsamen Regeln ablesen (Wegwerf-Skizze, nicht kopieren).

## Global Constraints

- Textänderungen genau zwei: «20+ Jahre Digital» → «Digital seit 1998» (Jochens `body` in `about.ts` und `description` im Person-JSON-LD in `about.astro`), Lukas Görögs `tag` «KI Akademie» → «Akademie KI». Sonst kein Wort, keine Reihenfolge, kein Label.
- Die Anker `jochen-witte`, `stefan-ropte`, `lukas-goeroeg`, `daniel-tschudi` bleiben (`getAuthorUrl` verlinkt `/about/#<slug>`).
- Farben nur über die Tokens in `global.css`. Keine Coral-Fläche; Coral-Schrift unter 24 px nur auf Weiss; Safran im Kopf nur der Fleck mit «.
- Personen und Prinzipien ohne Karten, ohne Icons, ohne Nummern.
- `--torn-1` bis `--torn-3` und `src/styles/torn-paper.css` bleiben byte-gleich.
- Markdown-Zwilling `/about.md` und `llms-full.txt`: nur die zwei Textänderungen. Alle übrigen Seiten bleiben im Text unverändert.
- Keine neuen Abhängigkeiten, kein Client-JS. Breakpoint 860 px.
- `npm run build` und `npx vitest run` grün nach jedem Task.
- Arbeitsort: Worktree `.claude/worktrees/ueber-fumu-grafisch`, Branch `worktree-ueber-fumu-grafisch`. Nur eigene Dateien stagen, mit Pfad; der Symlink `node_modules` bleibt ungestaged. Nach `main` und live erst nach Jochens Freigabe im Lokal-Review.
- `<baseline>` meint ein Verzeichnis im Scratchpad der Session mit dem Build vor Task 1, Schritt 2.

## Review Focus

1. **Autorenlink:** `/about/#lukas-goeroeg` (und jeder andere Slug aus `src/content/authors.ts`) springt auf die Person, nicht ins Leere (Test in Task 2, Sichtprüfung in Task 5).
2. **Vault gibt etwas dazu:** ein Bild im Netzwerk, ein zweites Zitat beim Gründer, eine neue Sektion – der Build bricht mit klarer Meldung, statt es auf der HTML-Seite still wegzulassen (Tests in Task 3).
3. **Kontrastmodus (forced-colors):** Das Porträt liegt mit `multiply` auf Rosé-hell. Überschreibt der Browser den Hintergrund mit Schwarz, würde das Foto schwarz – es muss sichtbar bleiben (Regel in Task 4, Prüfung per Emulation in Task 5).
4. **Viertes Netzwerk-Mitglied:** Das Raster bricht in eine zweite Reihe um, ohne Lücke im Layout (Sichtprüfung mit vorübergehendem Eintrag in Task 5).
5. **Gewicht der Porträts:** Kein Porträt über 200 KB (Test in Task 2).

---

### Task 1: Porträt-Form

**Files:**
- Delete: `src/pages/about-a.astro`, `src/pages/about-b.astro`, `src/pages/about-c.astro`, `src/mockup/` (Wegwerf-Skizze; die Quelle liegt unter `docs/plans/assets/2026-11-24-ueber-fumu-grafisch/mockup/`)
- Modify: `src/lib/torn-paper.ts`
- Test: `src/lib/torn-paper.test.ts`

**Interfaces:**
- Produces: `TornOptions` bekommt `wellen?: number` (Anzahl, Default 7) und `welle?: number` (Stärke als Anteil, Default 0.08). `portraetPolygon(seed: number): string` = `tornPolygon(seed, { points: 140, wellen: 5, welle: 0.03, jitter: 0.012, cx: 50, cy: 50, rx: 48, ry: 48 })` – dieselbe Rechnung wie `portraetForm` im Mockup.

- [x] **Step 1: Mockup-Seiten entfernen** – die vier Pfade oben löschen (sie sind nicht eingecheckt). Expected: `git status --short src/` zeigt nichts mehr.
- [x] **Step 2: Baseline sichern** – `npm run build`, dann `dist/` nach `<baseline>/` kopieren. Expected: Build grün.
- [x] **Step 3: Failing tests** in `torn-paper.test.ts`, neues `describe('portraetPolygon')`:
  - `it('ist deterministisch und hat 140 Punkte')`: `portraetPolygon(3)` gleich `portraetPolygon(3)`, ungleich `portraetPolygon(17)`, `points(…)` hat Länge 140.
  - `it('bleibt fast rund')`: für die Startwerte 3, 17, 29, 41 liegt jeder Punkt zwischen 40 und 56 vom Mittelpunkt (50, 50) entfernt (`Math.hypot(x - 50, y - 50)`).
  - Im `describe('tornPolygon')`: `it('nimmt Anzahl und Stärke der Wellen an')`: `tornPolygon(7, { wellen: 5, welle: 0.03 })` ungleich `tornPolygon(7)`.
- [x] **Step 4: Rot prüfen** – `npx vitest run src/lib/torn-paper.test.ts`. Expected: FAIL, `portraetPolygon` fehlt.
- [x] **Step 5: Implementieren** – die zwei Optionen in `TornOptions` (mit Doku-Kommentar) und in `tornPolygon` (Array-Länge `wellen`, Spanne `± welle`); `portraetPolygon` mit Kommentar: fast rund mit feinem Riss, weil die grossen Wellen von `--torn-*` auf Gesichtern wie Kleckse wirken.
- [x] **Step 6: Grün prüfen** – `npx vitest run src/lib/`. Expected: alle grün, auch «steht unverändert in src/styles/torn-paper.css» (Defaults unverändert, kein `node scripts/torn-css.mjs` nötig).
- [x] **Step 7: Commit** – `git add src/lib/torn-paper.ts src/lib/torn-paper.test.ts`, Commit «Papier: fast runde Porträt-Form mit feinem Riss».

### Task 2: Daten – Anker, zwei Textänderungen, leichte Porträts

**Files:**
- Create: `public/images/stefan-ropte.webp`, `public/images/lukas-goeroeg.webp`, `public/images/daniel-tschudi.webp`
- Delete: `public/images/stefan-ropte.png`, `public/images/lukas-goeroeg.png`, `public/images/daniel-tschudi.png`
- Modify: `src/data/pages/about.ts`
- Create: `src/data/pages/about.test.ts`

**Interfaces:**
- Produces: `about.sections` mit den `id`s `gruender`, `netzwerk`, `arbeit`, `formate` in dieser Reihenfolge; Bildpfade `/images/<slug>.webp` für die drei Partner, `/images/jochen-witte.jpg` bleibt.

- [x] **Step 1: Failing tests** in `about.test.ts`, `describe('about')`:
  - `it('trägt die vier Sektionen mit ihren Ankern')`: `about.sections.map(s => s.id)` ist `['gruender', 'netzwerk', 'arbeit', 'formate']`.
  - `it('hat für jeden Autor einen Personen-Anker')`: jede `Object.keys(authors)` aus `src/content/authors.ts` steht unter den `anchor`s der `person`-Items.
  - `it('nennt bei Jochen das Startjahr')`: Jochens `body` enthält `'Digital seit 1998'` und nicht `'20+'`.
  - `it('schreibt die Akademie wie ihre Domain')`: das `tag` der Person `lukas-goeroeg` ist `'Akademie KI'`.
  - `it('zeigt Porträts, die unter public liegen und höchstens 200 KB wiegen')`: für jedes `person`-Item `existsSync(join('public', image))` und `statSync(…).size` ≤ 200_000.
- [x] **Step 2: Rot prüfen** – `npx vitest run src/data/pages/about.test.ts`. Expected: FAIL (ids, Texte, Lukas’ PNG 1,9 MB).
- [x] **Step 3: WebP erzeugen** – je `magick public/images/<slug>.png -resize '800x800>' -quality 82 public/images/<slug>.webp` (Daniel bleibt bei 400 px), dann die drei PNG löschen. Expected: drei WebP, jedes unter 200 KB; im Browser geöffnet sieht jedes aus wie vorher.
- [x] **Step 4: Implementieren** – in `about.ts` die vier `id`s, die zwei Textänderungen und die drei Bildpfade. Labels und übrige Texte nicht anfassen; den Kommentar an `formate` nachziehen (`about.astro` setzt die Formate jetzt selbst).
- [x] **Step 5: Grün prüfen** – `npx vitest run && npm run build`. Expected: grün. `node scripts/text-diff.mjs <baseline> dist`: nur `about/index.html` mit fehlt «20», «Jahre», neu «seit», «1998». `grep -c 'Akademie KI' dist/about.md` ist 2, `grep -c 'Digital seit 1998' dist/about.md` ist 1.
- [x] **Step 6: Commit** – WebP, gelöschte PNG, `about.ts`, Test. Commit «Über fumu: Sektions-Anker, Digital seit 1998, Akademie KI, Porträts als WebP».

### Task 3: Wächter für Item-Arten in types.ts

**Files:**
- Modify: `src/data/pages/types.ts`
- Modify: `src/pages/was-wir-tun.astro` (lokales `nur()` durch den Helfer ersetzen)
- Test: `src/data/pages/about.test.ts`

**Interfaces:**
- Produces in `types.ts`:
  - `itemsOfKinds<K extends Item['kind']>(page: PageContent, section: Section, ...kinds: K[]): Extract<Item, { kind: K }>[]` – wirft `${page.title}: «${section.label}» enthält ein Item «${kind}», das die Seite nicht rendert`.
  - `singleItem<K extends Item['kind']>(page: PageContent, section: Section, kind: K): Extract<Item, { kind: K }>` – wirft `${page.title}: «${section.label}» braucht genau ein Item «${kind}», hat ${n}`.

- [x] **Step 1: Failing tests** in `about.test.ts`, `describe('Wächter')`:
  - `it('lässt die Item-Arten durch, die eine Sektion trägt')`: `itemsOfKinds(about, sectionById(about, 'netzwerk'), 'person')` hat Länge 3.
  - `it('bricht ab, wenn eine Sektion eine fremde Item-Art trägt')`: Netzwerk mit angehängtem `{ kind: 'image', src: '/x.svg', alt: 'x' }` → `toThrow('«Netzwerk» enthält ein Item «image»')`.
  - `it('findet das eine Zitat einer Sektion')`: `singleItem(about, sectionById(about, 'gruender'), 'quote').cite` beginnt mit `'Silvano Oeschger'`.
  - `it('bricht ab, wenn eine Sektion zwei Zitate trägt')`: «Gründer» mit verdoppeltem Zitat → `toThrow('braucht genau ein Item «quote», hat 2')`.
  - `it('bricht ab, wenn eine Sektion dazukommt')`: `sectionsByIds({ ...about, sections: [...about.sections, { label: 'Häufige Fragen', items: [] }] }, ['gruender', 'netzwerk', 'arbeit', 'formate'])` → `toThrow('«Häufige Fragen»')`.
- [x] **Step 2: Rot prüfen** – `npx vitest run src/data/pages/about.test.ts`. Expected: FAIL, Helfer fehlen.
- [x] **Step 3: Implementieren** – beide Helfer neben `sectionsByIds`, mit Kommentar (Grund wie in `was-wir-tun.astro`: sonst stünde die Änderung nur im Markdown-Zwilling). In `was-wir-tun.astro` `nur(section, …)` durch `itemsOfKinds(wasWirTun, section, …)` ersetzen und das lokale `nur` streichen.
- [x] **Step 4: Grün prüfen** – `npx vitest run && npm run build`. Expected: grün; `node scripts/text-diff.mjs <baseline> dist` zeigt weiter nur die Änderung aus Task 2.
- [x] **Step 5: Commit** – `types.ts`, `was-wir-tun.astro`, Test. Commit «Wächter für Item-Arten und einzelne Items in types.ts».

### Task 4: Baustein Porträt

**Files:**
- Create: `src/components/Portraet.astro`

**Interfaces:**
- Consumes: `portraetPolygon` (Task 1).
- Produces: `Portraet.astro` mit Props `{ src: string; alt: string; form: number; eager?: boolean; class?: string }`. Rendert `<figure class="portraet">` mit `style="--form: <portraetPolygon(form)>"`, darin `<div class="portraet-papier" aria-hidden="true">` und `<div class="portraet-foto"><img …></div>`. Die Breite setzt der Aufrufer über `class` (in der Seite per `:global()`); der Rahmen ist quadratisch (`aspect-ratio: 1`). `img` mit `loading="lazy"` und `decoding="async"`, ohne `loading` bei `eager`.

- [x] **Step 1: Implementieren** – Stile nach dem Mockup (`.portraet`, `.portraet-papier`, `.portraet-foto`, `img`): Papier `--color-blush` mit `clip-path: var(--torn-2)` und `inset: 7% -5% -3% 9%`; Foto auf `--color-blush-light` mit `clip-path: var(--form)`; `img` `object-fit: cover`, `filter: grayscale(1) contrast(1.02)`, `mix-blend-mode: multiply`. Unter `@media (forced-colors: active)`: `.portraet-foto img { mix-blend-mode: normal; }` und das Papier ausblenden. Kommentar oben: wozu die zwei Ebenen, warum `multiply`, warum nicht `--torn-*` fürs Foto.
- [x] **Step 2: Prüfen** – `npm run build`. Expected: grün (der Baustein ist noch nicht eingebunden; die Sichtprüfung folgt in Task 5).
- [x] **Step 3: Commit** – Commit «Baustein Porträt: Foto auf gerissenem Papier».

### Task 5: Die Seite /about/

**Files:**
- Modify: `src/pages/about.astro` (neu gesetzt; `personLd` übernehmen, nur `description` hat sich in Task 2 geändert – hier nachziehen)

**Interfaces:**
- Consumes: `sectionsByIds`, `itemsOfKinds`, `singleItem` (Task 3), `Portraet.astro` (Task 4), `Karte.astro`, `RichText.astro`, `SockelZitat.astro`.

- [x] **Step 1: Daten holen** – `const [gruender, netzwerk, arbeit, formate] = sectionsByIds(about, ['gruender', 'netzwerk', 'arbeit', 'formate'])`; `itemsOfKinds(about, gruender, 'person', 'quote')`, `(netzwerk, 'person')`, `(arbeit, 'item', 'quote')`, `(formate, 'item')`; `jochen = singleItem(about, gruender, 'person')`, `oeschger = singleItem(about, gruender, 'quote')`, `schoch = singleItem(about, arbeit, 'quote')`. Kopfkommentar wie in `was-wir-tun.astro` (Entwurf B vom 24.11., Pfad zum Entwurf).
- [x] **Step 2: JSON-LD** – `description`: «… Prozessen und Technologie. Digital seit 1998. Startup-Gründer, …». Sonst `personLd` unverändert.
- [x] **Step 3: Kopf** – wie `was-wir-tun.astro`: Raster `0.9fr / 1.1fr`, vertikal mittig, Abstand 56 px; links H1 (76 px) und `about.intro` als Lead (19 px, Pflaume-soft, `max-width: 30em`); rechts `<Karte tone="blush-light">` (Innenabstand 34 / 40 / 36 px) mit Safran-Fleck «, 64 px (`aria-hidden`), `<figure>` mit `<blockquote>` (Serif kursiv 25 px, Pflaume, ohne Anführungszeichen) und `<figcaption>` (14 px, 500, Pflaume-soft). `PageIntro` entfällt.
- [x] **Step 4: Gründer** – `<section aria-labelledby="gruender">`, H2 (44 px). Raster `360px / 1fr`, Abstand 64 px, vertikal mittig, `id={jochen.anchor}` am Raster. `<Portraet form={3} eager …>`; Name als H3 Serif 44 px, Etikett `.label-caps` Pflaume-soft, Text 19 px, Links 15 px 600.
- [x] **Step 5: Netzwerk** – H2; drei Spalten, Abstand 48 / 56 px; pro Person `id={anchor}`, `<Portraet>` 200 px (Formen 17, 29, 41, weitere Personen 53, 67 …), H3 Serif 30 px, Etikett, Text 16 px, Links.
- [x] **Step 6: Wie wir arbeiten** – H2; vier Spalten, Abstand 40 px; pro Prinzip Haarlinie oben `--color-blush`, `padding-top` 22 px, H3 Serif 28 px, Text 17 px. Das Zitat rendert hier nicht.
- [x] **Step 7: Typische Formate** – `<section id="formate">`, H2; 2 × 2 `Karte tone="blush-light"`, Abstand 24 px; `tag` als Dauer Serif kursiv 26 px Coral, H3 Serif 34 px, Text 15,5 px Pflaume-soft.
- [x] **Step 8: Sockel** – `<SockelZitat slot="sockel" zitat={schoch} />` ohne `titel`.
- [x] **Step 9: Mobil** – unter 860 px alles einspaltig; Gründer-Porträt höchstens 280 px, Netzwerk-Porträts 180 px; H1 46 px, H2 36 px, Gründer-Name 36 px, Prinzip-Titel 28 px; Abstand der Blöcke `--space-xl`.
- [x] **Step 10: Prüfen** – `npm run build && npx vitest run`. Dann:
  - `node scripts/text-diff.mjs <baseline> dist`. Expected: nur `about/index.html`, fehlt «20», «Jahre», neu «seit», «1998».
  - `node scripts/overflow-check.mjs`. Expected: Exit 0.
  - `diff <(sed -n '/application\/ld+json/,/<\/script>/p' <baseline>/about/index.html) <(sed -n '/application\/ld+json/,/<\/script>/p' dist/about/index.html)`. Expected: nur die `description`-Zeile.
  - `npm run dev`, `/about/` bei 1280 und 400 px gegen `b-stimme.png` und `b-mobil.png`; `/about/#lukas-goeroeg` und `/about/#jochen-witte` springen an die Person; Kontrastmodus in den Chrome-DevTools emulieren (Rendering → forced-colors: active, dunkles Schema): alle vier Fotos sichtbar.
  - Viertes Netzwerk-Mitglied: im Dev-Server vorübergehend eine Kopie von Stefan anhängen, bei 1280 px bricht sie sauber in die zweite Reihe. Danach entfernen, `git diff src/data` zeigt keine Reste.
- [x] **Step 11: Commit** – `about.astro`. Commit «Über fumu: Zitat im Kopf, Gründer gross, Netzwerk und Prinzipien als Raster, Formate 2 × 2, Zitat im Sockel».

### Task 6: Doku, Lokal-Review, nach main, Rückkanal

**Files:**
- Modify: `CLAUDE.md`
- Modify: `docs/plans/2026-11-24-ueber-fumu-grafisch-umsetzung.md` (Checkboxen)

- [x] **Step 1: CLAUDE.md** – im Abschnitt zu `/was-wir-tun/` einen Absatz «Seite `/about/`»: rendert ihre Sektionen selbst über `id` (`gruender`, `netzwerk`, `arbeit`, `formate`), Wächter `itemsOfKinds` und `singleItem`; Oeschger-Zitat im Kopf, Schoch/Wehrle im Sockel, im Markdown-Zwilling an ihrem Ort; `Sektion.astro` rendert jetzt Kontakt und die Pillars (About aus dem Satz streichen). Unter Design-System > Formen: Porträts über `Portraet.astro`, Form `portraetPolygon`.
- [ ] **Step 2: Lokal-Review mit Jochen** – `npm run dev`, Jochen sieht `/about/` bei Desktop und Handy-Breite und bestätigt die Vorschläge 5 bis 7 des Entwurfs. Expected: Jochens Freigabe.
- [ ] **Step 3: Nach main und live** – erst nach der Freigabe: `git fetch`, Branch auf `origin/main` rebasen, `npm run build`, `git push origin HEAD:main`. Expected: Netlify-Deploy grün, https://fumu.ch/about/ zeigt die neue Seite. Das Hauptverzeichnis zieht beim nächsten `git pull` nach.
- [ ] **Step 4: Rückkanal** – Vault: Umsetzungs-Task in der Folder Note «fumu.ch» abhaken, Log-Eintrag mit Commit-Hash; Task «20+ Jahre Digital» in «fumu Sprachstil definiert und ausgerollt» abhaken.
