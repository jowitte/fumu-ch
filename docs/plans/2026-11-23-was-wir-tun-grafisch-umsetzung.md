# Was wir tun grafisch – Umsetzungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `/was-wir-tun/` nach Variante B umbauen: Kopf mit Diagramm wie die Pillar-Seite, Ansatz als Raster über die volle Breite, Schwerpunkt auf einer Karte, Leistungen als Coral-Karte(n), Logos in Pflaume, Zitat im Sockel – ohne Wortlaut zu ändern.

**Architecture:** Die Seite rendert ihre vier Sektionen selbst (wie `index.astro` die Startseite) und findet sie über neue Sektions-`id`s statt über Labels. `Sektion.astro` bleibt für About, Kontakt und Pillars unverändert. Zwei kleine Bausteine entstehen: `LeistungsKarten.astro` (eine bis fünf Pillars, Flächen nach Position) und `SockelZitat.astro` (aus `index.astro` herausgelöst). Die Bildunterschrift von `Figure` wird optional.

**Tech Stack:** Astro 7 (static), reines CSS mit Custom Properties, TypeScript, Vitest.

**Spec:** `docs/plans/2026-11-23-was-wir-tun-grafisch-entwurf.md` (freigegeben 2026-11-23). Massstab für Aufbau, Grössen und Abstände: `docs/plans/assets/2026-11-23-was-wir-tun-grafisch/b-1-leistung.png`, `b-5-leistungen.png`, `b-mobil.png`; CSS-Werte in `…/mockup/WasWirTunMockup.astro` ablesen (Wegwerf-Skizze, nicht kopieren).

## Global Constraints

- **Voraussetzung:** Das Diagramm ist im Vault gezeichnet und von Jochen abgenommen (`Aufwände/fumu Marketing/fumu.ch/assets/diagram-technologie-allein.excalidraw.svg`), der Alt-Text steht fest. Ohne beides nicht anfangen.
- Kein Wortlaut ändert sich. Neu sind nur Alt-Text und gegebenenfalls Bildunterschrift des Diagramms. Reihenfolge der Sektionen bleibt: Unser Ansatz, Schwerpunkt, Leistungen, Referenzen.
- Farben nur über die Tokens in `global.css`. Coral als grosse Fläche einmal pro Seite (die erste Leistungs-Karte), höchstens eine Safran-Fläche pro Bildschirmhöhe, Coral-Schrift unter 24 px nur auf Weiss, Links auf Rosé-hell in Pflaume.
- Ansatz ohne Karten, ohne Icons, ohne Nummern.
- Markdown-Zwilling `/was-wir-tun.md` und `llms-full.txt`: einzige Änderung ist das Diagramm direkt nach der H1. JSON-LD (`serviceLd` in `was-wir-tun.astro`) bleibt byte-gleich. Alle übrigen Seiten bleiben im Text unverändert.
- Keine neuen Abhängigkeiten, kein Client-JS. Breakpoint 860 px.
- `npm run build` und `npx vitest run` grün nach jedem Task.
- Arbeitsort: `main` im Hauptverzeichnis `~/Data/fumu-ch`. Vor jedem Commit `git status`: Änderungen anderer Schreiber (Vault-Session, VS Code, Tracker-Job) nicht anfassen, nur die eigenen Dateien stagen. Push erst nach Jochens Freigabe im Lokal-Review – der Push ist der Deploy.
- `<baseline>` meint ein Verzeichnis ausserhalb des Repos (Scratchpad der Session) mit dem Build vor Task 1.

## Review Focus

1. **Zwei bis fünf Leistungen:** Kommt Pillar 2 dazu, stehen zwei halbe Karten (Coral, Safran) nebeneinander, ab drei die übrigen in Dritteln; Teaser laufen nicht unter das Papierstück in der Ecke (Sichtprüfung mit vorübergehenden Einträgen in Task 5, Schritt 9).
2. **Kontrastmodus (forced-colors):** Die Logos sind CSS-Masken mit Hintergrundfarbe und verschwänden, wenn der Browser Hintergründe überschreibt – sie müssen sichtbar bleiben (Regel in Task 5, Schritt 6, Prüfung per Emulation in Schritt 9).
3. **Diagramm auf 400 px:** klein, aber per Tippen vergrösserbar, ohne Überlauf (Task 5, Schritt 9).
4. **Hero ohne Bildunterschrift:** kein leeres `<figcaption>`, kein leerer Absatz in der Zoom-Ebene, keine leere Kursivzeile im Markdown (Tests in Task 1).
5. **Sektion fehlt oder ist umbenannt:** Benennt der Vault eine Sektion um, bleibt die `id`; fehlt eine `id`, bricht der Build mit klarer Meldung statt leer zu rendern (Test in Task 3).

---

### Task 1: Bildunterschrift optional

**Files:**
- Modify: `src/data/pages/types.ts` (`Figure.caption`, Kommentar an `PageContent.hero`)
- Modify: `src/data/pages/to-markdown.ts` (`figure()`, `textFragments`)
- Modify: `src/data/pages/to-markdown.test.ts`
- Modify: `src/components/Figure.astro`

**Interfaces:**
- Produces: `type Figure = { src: string; alt: string; caption?: string }`. Ohne `caption`: Markdown nur `![alt](src)`, HTML ohne `<figcaption>` und ohne `<p>` in der Zoom-Ebene.

- [ ] **Step 1: Baseline sichern** – `npm run build`, dann `dist/` nach `<baseline>/` kopieren. Expected: Build grün.
- [ ] **Step 2: Failing tests** in `to-markdown.test.ts`, im `describe('Hero')`:
  - `it('steht ohne Bildunterschrift allein vor dem Lead')`: `toMarkdown(page({ hero: { src: hero.src, alt: hero.alt }, intro: ['Lead.'] }))` ist `'![Zwei Kästen, durch einen Pfeil verbunden.](/images/pillars/beispiel.svg)\n\nLead.'`
  - `it('führt ohne Bildunterschrift Alt-Text und Pfad, aber kein leeres Stück')`: `textFragments(page({ hero: { src: hero.src, alt: hero.alt } }))` enthält `hero.alt` und `hero.src` und kein `''`.
  - Im `describe.each(pages)`-Test «beginnt mit Hero …» den erwarteten Hero-Block so bilden, dass die Kursivzeile nur bei gesetzter `caption` dazukommt.
- [ ] **Step 3: Rot prüfen** – `npx vitest run src/data/pages/to-markdown.test.ts`. Expected: die zwei neuen Tests schlagen fehl (TypeScript-Fehler oder `*undefined*` im Markdown).
- [ ] **Step 4: Implementieren** – `caption?: string` in `Figure`; `figure()` hängt `\n\n*caption*` nur bei gesetzter Unterschrift an; `textFragments` pusht `caption` nur, wenn vorhanden (Hero und `image`-Items); in `Figure.astro` `<figcaption>` und den `<p>` der Zoom-Ebene nur bei gesetzter Unterschrift. Kommentar an `hero` in `types.ts`: rendert die Pillar-Route und `/was-wir-tun/`.
- [ ] **Step 5: Grün prüfen** – `npx vitest run && npm run build`. Expected: alle Tests grün, Build grün; `node scripts/text-diff.mjs <baseline> dist` ohne Unterschiede.
- [ ] **Step 6: Commit** – `git add src/data/pages/types.ts src/data/pages/to-markdown.ts src/data/pages/to-markdown.test.ts src/components/Figure.astro`, Commit «Figure: Bildunterschrift optional».

### Task 2: Flächen der Leistungen als eigene Funktion

**Files:**
- Create: `src/lib/leistungs-toene.ts`, `src/lib/leistungs-toene.test.ts`
- Modify: `src/lib/startseite.ts`

**Interfaces:**
- Produces: `type ThemaTon = 'coral' | 'saffron' | 'blush-light'` und `leistungsToene(anzahl: number): ThemaTon[]` in `src/lib/leistungs-toene.ts`. `startseite.ts` importiert beides und re-exportiert `ThemaTon`; `startseitenFlaechen` liefert `{ themen: leistungsToene(n), heroSafran: false }` wie bisher.

- [ ] **Step 1: Failing test** `leistungs-toene.test.ts`: `leistungsToene(0)` → `[]`; `(1)` → `['coral']`; `(2)` → `['coral', 'saffron']`; `(5)` → `['coral', 'saffron', 'blush-light', 'blush-light', 'blush-light']`. Kommentar: Regeln 2 und 4 des Design-Entwurfs vom 22.11.
- [ ] **Step 2: Rot prüfen** – `npx vitest run src/lib/leistungs-toene.test.ts`. Expected: FAIL, Modul fehlt.
- [ ] **Step 3: Implementieren** – Funktion aus `startseitenFlaechen` herauslösen, den Kommentar zu den Regeln mitnehmen; `startseite.ts` darauf umstellen.
- [ ] **Step 4: Grün prüfen** – `npx vitest run src/lib/`. Expected: neue und bestehende Tests (`startseite.test.ts`) grün.
- [ ] **Step 5: Commit** – Commit «Leistungs-Flächen als eigene Funktion für Startseite und Was wir tun».

### Task 3: Daten – Sektions-Anker und Diagramm

**Files:**
- Create: `public/images/was-wir-tun/technologie-allein.svg` (Kopie des abgenommenen Exports aus dem Vault)
- Modify: `src/data/pages/was-wir-tun.ts`
- Modify: `src/data/pages/types.ts` (Helfer `sectionById`)
- Create: `src/data/pages/was-wir-tun.test.ts`

**Interfaces:**
- Consumes: `Figure` mit optionaler `caption` (Task 1).
- Produces: `sectionById(page: PageContent, id: string): Section` in `types.ts` – wirft `Error(\`${page.title}: Sektion mit id «${id}» fehlt\`)`. In `wasWirTun`: `id`s `ansatz`, `schwerpunkt`, `leistungen`, `referenzen` in dieser Reihenfolge; `hero: { src: '/images/was-wir-tun/technologie-allein.svg', alt: '<Alt-Text aus dem Vault>' }` plus `caption`, falls der Vault eine liefert.

- [ ] **Step 1: SVG übernehmen** – Export aus dem Vault nach `public/images/was-wir-tun/technologie-allein.svg` kopieren. Expected: `grep -c "@font-face" public/images/was-wir-tun/technologie-allein.svg` ≥ 1 (Schrift eingebettet), im Browser geöffnet erscheint Excalifont.
- [ ] **Step 2: Failing tests** in `was-wir-tun.test.ts`:
  - `it('trägt die vier Sektionen mit ihren Ankern')`: `wasWirTun.sections.map(s => s.id)` ist `['ansatz', 'schwerpunkt', 'leistungen', 'referenzen']`.
  - `it('findet eine Sektion über ihre id')`: `sectionById(wasWirTun, 'leistungen').label` ist `'Leistungen'`.
  - `it('bricht ab, wenn eine id fehlt')`: `expect(() => sectionById(wasWirTun, 'gibt-es-nicht')).toThrow('Sektion mit id «gibt-es-nicht» fehlt')`.
  - `it('zeigt im Kopf ein Diagramm, das unter public liegt')`: `wasWirTun.hero?.src` endet auf `.svg`, und `existsSync(join('public', wasWirTun.hero!.src))` ist `true`.
- [ ] **Step 3: Rot prüfen** – `npx vitest run src/data/pages/was-wir-tun.test.ts`. Expected: FAIL.
- [ ] **Step 4: Implementieren** – `sectionById` neben den Type Guards in `types.ts`; in `was-wir-tun.ts` die vier `id`s und `hero` setzen. Labels und Texte nicht anfassen.
- [ ] **Step 5: Grün prüfen** – `npx vitest run && npm run build`. Expected: grün; `dist/was-wir-tun.md` beginnt nach der H1 mit `![<Alt-Text>](/images/was-wir-tun/technologie-allein.svg)`; `node scripts/text-diff.mjs <baseline> dist` ohne Unterschiede (die HTML-Seite rendert `hero` erst ab Task 5).
- [ ] **Step 6: Commit** – SVG, `was-wir-tun.ts`, `types.ts`, Test. Commit «Was wir tun: Sektions-Anker und Diagramm im Datenmodul».

### Task 4: Zitat im Sockel als Baustein

**Files:**
- Create: `src/components/SockelZitat.astro`
- Modify: `src/pages/index.astro` (Zitat-Markup und `.zitat*`-Stile raus, Baustein rein)

**Interfaces:**
- Produces: `SockelZitat.astro` mit Props `{ zitat: QuoteItem; titel?: { text: string; id: string } }`. Mit `titel`: `<section aria-labelledby={titel.id}>` mit visuell verstecktem H2 (wie heute auf der Startseite); ohne `titel`: derselbe Block als `<div>`. Markup und Stile 1:1 aus `index.astro` (Safran-Fleck mit «, Zitat Serif kursiv weiss, Quelle in Rosé; mobil wie dort).

- [ ] **Step 1: Herauslösen** – Markup und Stile aus `index.astro` in den Baustein, `index.astro` ruft `<SockelZitat zitat={zitat} titel={{ text: referenzen.label, id: 'referenzen' }} />` im Fragment `sockel` auf.
- [ ] **Step 2: Prüfen** – `npm run build && node scripts/text-diff.mjs <baseline> dist`. Expected: für `index.html` keine Unterschiede. Startseite lokal (`npm run dev`) bei 1280 und 400 px gegen die Live-Seite vergleichen: Zitat sieht gleich aus.
- [ ] **Step 3: Commit** – Commit «Startseite: Zitat im Sockel als Baustein».

### Task 5: Die Seite /was-wir-tun/

**Files:**
- Create: `src/components/LeistungsKarten.astro`
- Modify: `src/pages/was-wir-tun.astro` (vollständig neu gesetzt; `serviceLd` unverändert übernehmen)

**Interfaces:**
- Consumes: `leistungsToene` (Task 2), `sectionById` und `hero` (Task 3), `SockelZitat` (Task 4), `Figure.astro`, `Karte.astro`, `RichText.astro`.
- Produces: `LeistungsKarten.astro` mit Props `{ entries: LinksItem['entries'] }`. Rendert `<ul>` mit je einer `Karte` (Link, Ton nach `leistungsToene(entries.length)`), darin H3 (Titel), `<p>` (Teaser), Pfeil `→` als `aria-hidden`-Span unten, wie auf der Startseite.

- [ ] **Step 1: Leistungs-Karten** – Raster aus sechs Spalten, Abstand 28 px. Eine Karte: volle Breite, `min-height` 240 px, Titel 52 px. Zwei und mehr: die ersten zwei je drei Spalten (Titel 44 px), weitere je zwei Spalten (Titel 34 px, Innenabstand 30 px). Auf Coral- und Safran-Karten, sobald sie nicht volle Breite haben, hält der Teaser rechts 96 px Abstand (Papierstück der `Karte`). Unter 860 px eine Spalte, Titel 36 px. Die Anzahl als Klasse am Raster (`einzeln` bei einer Karte), kein JS.
- [ ] **Step 2: Kopf** – `<div class="container">`, darin `<section class="kopf">`: Raster `0.9fr / 1.1fr`, vertikal mittig, Abstand 56 px; links H1 (`wasWirTun.title`, 76 px) und die Lead-Absätze (19 px, Pflaume-soft, `max-width: 30em`); rechts `<Karte tone="blush-light">` mit `<Figure figure={wasWirTun.hero} class="kopf-figur" eager />` (`.kopf-figur { margin: 0 }`, Figure verlangt den Rand vom Aufrufer), Innenabstand 22 px, wie `.pillar-hero-karte` in `[pillar].astro`. `PageIntro` entfällt hier.
- [ ] **Step 3: Unser Ansatz** – Sektion `ansatz`: H2 (44 px), darunter 2 × 2-Raster (Abstand 48 / 64 px). Pro Item: Haarlinie oben in `--color-blush`, `tag` als Span in Serif 48 px Pflaume, `title` als H3 in Sans 600 17 px Pflaume, `body` über `RichText` (17 px, Tinte).
- [ ] **Step 4: Schwerpunkt** – Sektion `schwerpunkt`: H2, darunter `<Karte tone="blush-light">` mit zwei Spalten (Abstand 56 px, Innenabstand 40 / 44 px); pro Item Etikett (`tag`, Versalien 13 px), H3 Serif 34 px, Text.
- [ ] **Step 5: Leistungen** – Sektion `leistungen`: H2, darunter `<LeistungsKarten entries={…} />` mit den Einträgen des `links`-Items.
- [ ] **Step 6: Referenzen** – Sektion `referenzen`: H2, Logos in fünf Spalten. Jedes Logo als `<span class="logo-bild" role="img" aria-label="Logo <Name>" style="--logo: url('<image>')">` mit `mask` und `-webkit-mask` (`left center / contain no-repeat`), `background: var(--color-plum)`, Höhe 36 px, `max-width` 180 px; darunter die Notiz (14 px, Pflaume-soft). Unter `@media (forced-colors: active)`: `forced-color-adjust: none; background: CanvasText`. Das `quote`-Item rendert hier nicht.
- [ ] **Step 7: Sockel** – `<SockelZitat slot="sockel" zitat={…} />` ohne `titel` (die sichtbare H2 «Referenzen» steht oben).
- [ ] **Step 8: Mobil** – unter 860 px alles einspaltig: Kopf (Titel, Lead, Diagramm), Säulen (Säulen-Wort 36 px), Schwerpunkt-Spalten untereinander (Innenabstand 30 / 26 px), Logos untereinander; H1 46 px, H2 36 px.
- [ ] **Step 9: Prüfen** – `npm run build && npx vitest run`. Dann:
  - `node scripts/text-diff.mjs <baseline> dist`. Expected: nur `was-wir-tun/index.html` mit neu: Alt-Text, «Vergrössern», «Schliessen», «In voller Grösse öffnen» (Zoom des Diagramms) und gegebenenfalls Unterschrift; fehlt: nichts.
  - `node scripts/overflow-check.mjs`. Expected: Exit 0.
  - `npm run dev`, `/was-wir-tun/` bei 1280 und 400 px gegen `b-1-leistung.png` und `b-mobil.png`; Diagramm per Klick vergrössern und mit Esc schliessen; Tab-Reihenfolge Kopf → Diagramm → Leistungs-Karte; Kontrastmodus in den Chrome-DevTools emulieren (Rendering → forced-colors: active): Logos sichtbar.
  - Zwei bis fünf Leistungen: im Dev-Server vorübergehend vier erfundene Einträge an `entries` anhängen und bei 2 und 5 Einträgen, 1280 und 400 px gegen `b-5-leistungen.png` prüfen; der lange Titel «Medien, Werbung und AdTech» bricht sauber, kein Teaser läuft unter das Eckpapier. Platzhalter danach entfernen, `git diff` zeigt keine Reste.
  - `diff <(sed -n '/application\/ld+json/,/<\/script>/p' <baseline>/was-wir-tun/index.html) <(sed -n '/application\/ld+json/,/<\/script>/p' dist/was-wir-tun/index.html)`. Expected: keine Ausgabe (JSON-LD unverändert).
- [ ] **Step 10: Commit** – `LeistungsKarten.astro` und `was-wir-tun.astro`. Commit «Was wir tun: Kopf mit Diagramm, Ansatz als Raster, Leistungen als Karten, Zitat im Sockel».

### Task 6: Doku, Lokal-Review, Rückkanal

**Files:**
- Modify: `CLAUDE.md` (Abschnitt Architektur oder Content: wie `/was-wir-tun/` rendert)
- Modify: `docs/plans/2026-11-23-was-wir-tun-grafisch-umsetzung.md` (Checkboxen)

- [ ] **Step 1: CLAUDE.md** – ein Absatz: `/was-wir-tun/` rendert seine Sektionen selbst und findet sie über `id` (`ansatz`, `schwerpunkt`, `leistungen`, `referenzen`, Helfer `sectionById`); Kopf-Diagramm über `hero` (Quelle im Vault, `diagram-technologie-allein`); Leistungs-Karten über `LeistungsKarten.astro`, Flächen aus `leistungsToene`; `Sektion.astro` rendert weiter About, Kontakt und Pillars.
- [ ] **Step 2: Lokal-Review mit Jochen** – `npm run dev`, Jochen sieht `/was-wir-tun/` und die Startseite (Zitat) bei Desktop und Handy-Breite. Expected: Jochens Freigabe.
- [ ] **Step 3: Push** – erst nach der Freigabe: `git pull --rebase`, `npm run build`, `git push`. Expected: Netlify-Deploy grün, https://fumu.ch/was-wir-tun/ zeigt die neue Seite.
- [ ] **Step 4: Rückkanal** – in der Vault-Story «Pillar 1 und Kategorie-Seite live auf fumu.ch» den Umsetzungs-Task abhaken, Log-Eintrag mit Commit-Hash.
