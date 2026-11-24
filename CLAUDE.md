# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# fumu.ch Website

Astro-basierte statische Website für fumu – Beratung für KI-Transformation in Medien, Marketing und Werbung. fumu übersetzt Technologie in Wirkung: Strategie, Organisation, Prozesse und Technologie, bis in die Umsetzung.

## Stack

| Komponente | Wahl | Details |
|------------|------|---------|
| Framework | Astro 7 (Static) | `output: 'static'`, kein JS-Framework, Node >= 22.12 |
| Markdown | `@astrojs/markdown-remark` (`processor: unified()`) | Astro 7 rendert per Default mit Sätteri; die eigenen remark/rehype-Plugins verlangen unified |
| Integrations | `@astrojs/rss`, `@astrojs/sitemap` | RSS-Feed, Sitemap mit `lastmod` |
| Hosting | Netlify Free | Auto-Deploy via GitHub (`origin: jowitte/fumu-ch`), native Forms, Node 22 |
| Fonts | Instrument Serif + Instrument Sans | Titel H1–H3, Zitate, Schriftzug (Instrument Serif 400, normal und kursiv), Text und Navigation (Instrument Sans, Variable 400–700, normal und kursiv); self-hosted woff2 in `public/fonts/` (Fontsource, OFL), Excalifont für die Diagramme |
| CSS | Custom Properties | Kein Framework, reines CSS in `src/styles/global.css` |
| Content | Astro Content Collections | Markdown mit Zod-Schema (`src/content.config.ts`) |
| Preview | https://fumu-ch.netlify.app | Staging-URL · Produktion: https://fumu.ch |

## Befehle

```bash
cd ~/Data/fumu-ch
npm run dev      # Lokaler Dev-Server (localhost:4321)
npm run build    # Production Build → dist/
npm run preview  # Preview des Builds
```

Kein Linter konfiguriert. Verifikation ist `npm run build` – es prüft Zod-Schemas und generiert alle dynamischen Routen, prüft aber keine TypeScript-Typen (`@astrojs/check` ist nicht installiert) – plus `npx vitest run` für die Unit-Tests (`src/plugins/*.test.mjs`, `src/lib/*.test.ts`, `src/data/**/*.test.ts`). Vor jedem Commit, der Content oder Routen berührt: `npm run build` muss grün durchlaufen. Die Radar-Pipeline unter `tools/crawler-radar/` hat eigene Python-Tests (siehe Architektur > AI-Crawler-Radar-Pipeline).

## Deploy

Push auf `main` → Netlify baut automatisch. Kein manueller Deploy nötig.

## Plan-Aufnahme (Übergabe aus dem Akasha-Vault)

Inhaltliche Planung passiert im Akasha-Vault; technische Umsetzungs-Pläne werden als self-contained Markdown-Files in `docs/plans/` übergeben (`YYYY-MM-DD-<thema>.md`). Bei Aufnahme: Plan lesen, Schritte abarbeiten, Checkboxen direkt im Plan-File pflegen, `npm run build` als Verifikation. Inhaltliche Fragen (Wortlaut, Naming, Reihenfolge) gehören in den Vault zurück, nicht im Plan entschieden. Abgeschlossene Pläne bleiben als Doku liegen.

**Arbeitsort** (seit 2026-11-23): Repo-Sessions laufen im cmux-Workspace fumu-ch, gestartet in diesem Verzeichnis mit `--add-dir ~/Data/Akasha`. Arbeit auf `main`, die in einer Session fertig wird, geschieht hier im Hauptverzeichnis. Arbeit auf einem eigenen Branch, die über eine Session hinausgeht, kommt in einen Worktree (`.claude/worktrees/<name>`, Skill `superpowers:using-git-worktrees`): Hier schreiben die drei anderen Schreiber, und solange ein Branch ausgecheckt ist, landen ihre Commits darauf. Gestaltung, die erst am Bild entschieden wird (Mockups, Bildsprache), darf in der Repo-Session fallen; das Ergebnis geht als Entwurf nach `docs/plans/` und als Log-Eintrag in die Vault-Story. Regel im Vault: `Aufwände/fumu Marketing/CLAUDE.md` > Wo die fumu-ch-Session läuft.

**Zweiter Schreiber:** Content-nahe Edits (Seitentext, Navigation, Verlinkung, Redirects, Daten-Files wie `src/data/ai-crawler-tracker.json`) kommen auch direkt aus der Akasha-Vault-Session – dort über den `/fumu-web`-Skill (seit 2026-07-16), der Eingangsritual und Betriebsregeln trägt: `git status` vor Schreibzugriff, Whitelist-Staging, Commit/Push nur auf Ansage. Uncommitted Änderungen im Working Tree können also vom Vault stammen – vor `git checkout`/`stash`/`reset` prüfen, nicht wegwerfen. Konvention: `Akasha-Vault > Aufwände/fumu Marketing/CLAUDE.md` > «Zusammenarbeit mit dem Website-Repo».

**Dritter Schreiber:** Jochen editiert publizierte Perspektiven von Hand in VS Code (Repo als Workspace, `.vscode/` gitignored). Uncommitted Content-Änderungen können also auch daher stammen; Hintergrund ist der Perspektiven-Lebenszyklus (Repo-File als Master nach Publish, siehe Akasha-Vault `var/references/DOKUMENT-LEBENSZYKLUS.md` > Publizierte Perspektiven).

**Vierter Schreiber:** Ein Cron-Job auf dem Server `akasha-cloud` fährt alle 14 Tage `tools/crawler-radar/run.sh` aus einem eigenen Klon und committet und pusht von ausserhalb – genau `tools/crawler-radar/data/` und `src/data/ai-crawler-tracker.json`, Message `data: AI-Crawler-Tracker-Snapshot YYYY-MM-DD`. Vor Arbeit an diesen Pfaden `git pull`, und dort keine uncommitteten Änderungen liegen lassen. Die kuratierten Lauf-Texte (`tools/crawler-radar/tracker-content.yaml`) pflegt weiter die Vault-Session. Bis der Server-Cron eingerichtet ist, committet übergangsweise noch der launchd-Job auf Jochens Mac das Tracker-JSON.

## Content Collections

Schema-Definition: `src/content.config.ts` (Glob-Loader + Zod). Ändert man ein Feld dort, muss das Frontmatter aller Dateien der Collection nachgezogen werden, sonst bricht der Build.

### `pages` – Statische Seiten

Pfad: `src/content/pages/*.md`

```yaml
title: string        # Seitentitel
description: string   # Meta-Description
order: number         # Navigationsreihenfolge
```

Seiten: was-wir-tun, about, perspektiven, kontakt, impressum, datenschutz

Die Startseite hat keine Collection-Datei mehr (seit 2026-11-23). Einzige Quelle ist `src/data/pages/home.ts` – Title, Description und Inhalt; daraus entstehen `index.astro`, `/index.md` und der Startseiten-Abschnitt in `/llms-full.txt`, alle über `loadPage`. Bis die Startseiten-Texte aus dem Vault kommen, ist sie eine Übergangs-Startseite aus Texten, die schon auf der Site stehen.

### `perspektiven` – Blog/Artikel

Pfad: `src/content/perspektiven/*.md`

```yaml
title: string                       # Artikeltitel
description: string                  # Meta-Description / Teaser
date: date                          # Publikationstermin (YYYY-MM-DD), darf in der Zukunft liegen
updated: date?                      # Überarbeitungsdatum, nur bei echter Überarbeitung; ändert die Sortierung nicht
category: string?                   # z.B. "KI & AdTech"
image: string?                      # optionales Header-/OG-Bild
draft: boolean (false)              # true = wird nicht gebaut
authors: string[] (['jochen-witte']) # Autor-Slugs, siehe Autoren-System
```

Slug = Dateiname (ohne `.md`). URL: `/perspektiven/[slug]/`. Sichtbar ist ein Artikel, wenn `draft: false` **und** `date` erreicht ist (`src/lib/published.ts`, an allen Filter-Stellen; neue Ausgaben nutzen `isPublished`, nie `!data.draft`). Ein künftiges `date` hält den Artikel aus Build, Listing, Themenseiten, RSS, llms.txt und Sitemap heraus; der Dev-Server zeigt ihn mit Hinweis. Ein GitHub-Actions-Cron (`.github/workflows/scheduled-build.yml`, 04:00 UTC) stösst über den Netlify-Build-Hook `scheduled-publish` (Secret `NETLIFY_BUILD_HOOK`) den täglichen Build an, damit der Termin ohne Push greift. `updated` erscheint in der Label-Spalte, als `dateModified` im Article-Markup und als Sitemap-`lastmod` (`src/lib/sitemap-lastmod.mjs`); alle übrigen Seiten tragen kein `lastmod`.

### Autoren-System

Autoren sind **nicht** Freitext, sondern Slugs aus einer zentralen Registry: `src/content/authors.ts`. Das `authors`-Frontmatter referenziert diese Slugs (z.B. `jochen-witte`, `stefan-ropte`, `lukas-goeroeg`, `daniel-tschudi`). `resolveAuthors()` löst Slugs zu `{ name, linkedin }` auf und fällt bei leerer/unbekannter Liste auf `jochen-witte` zurück. `getAuthorUrl()` verlinkt auf den Anker `/about/#<slug>`. Neuen Autor → erst Eintrag in `authors.ts`, dann im Frontmatter referenzieren.

## Architektur

### Routing-Muster: HTML- und Markdown-Zwillinge

Fast jede Seite existiert **doppelt** – als HTML für Menschen und als Quell-Markdown für Agents/LLMs:

- **HTML:** `src/pages/*.astro` (statische Seiten, laden `pages`-Collection) und `src/pages/perspektiven/[...slug].astro` (Artikel).
- **Markdown:** `src/pages/[slug].md.ts`, `src/pages/index.md.ts`, `src/pages/perspektiven/[slug].md.ts` generieren beim Build pro Seite eine `.md`-Variante (Titel + roher Body, **kein** HTML→MD-Konvertierungsverlust).

Beide Welten werden über die Content Collections gespeist – die Markdown-Routen sind die Single Source of Truth für die Agent-Readiness-Schicht. Wer eine neue Seite anlegt, sollte die `.md`-Variante mitdenken.

**Achtung Drift bei bespoke Seiten.** Einige `.astro`-Seiten laden die `pages`-Collection **nicht**, sondern hardcoden ihren Inhalt im eigenen Layout (z.B. `kontakt.astro`, `datenschutz.astro`, `impressum.astro`). Bei solchen Seiten ist die Collection-`.md` (die `[slug].md.ts` serviert) ein **parallel von Hand gepflegtes** File, kein Derivat der gerenderten Seite. Folge: Wer den Text einer bespoke Seite ändert, muss die zugehörige `.md` im **selben Edit** nachziehen – sonst driften Menschen-Seite und Agent-Markdown auseinander (passiert 2026-06-08 auf der Kontaktseite: `.md` zeigte „30 Minuten / Lass uns sprechen", die Seite „25 Minuten Kennenlernen"). Warnsignal: Ich editiere sichtbaren Text in `kontakt.astro` / `datenschutz.astro` / `impressum.astro`, ohne die gleichnamige `.md` in `src/content/pages/` anzufassen – Stopp, Twin synchron halten. (Sauberere Dauerlösung – die bespoke Seiten aus der Collection speisen statt zu hardcoden – ist eine eigene Story.)

### Agent-/AI-Readiness-Schicht

Bewusster Schwerpunkt des Projekts (siehe Git-Historie): die Site ist für AI-Crawler und Agents optimiert. Diese Teile hängen zusammen und sollten konsistent gepflegt werden:

- `src/pages/llms.txt.ts` / `llms-full.txt.ts` – generieren `/llms.txt` (Index) und `/llms-full.txt` aus den Collections.
- `netlify/edge-functions/markdown-negotiation.ts` – Content Negotiation: bei `Accept: text/markdown` wird intern die `.md`-Variante gefetcht und mit `Content-Type: text/markdown` + `Vary: Accept` ausgeliefert. `x-edge-bypass`-Header verhindert Rekursion; Static Assets sind via `excludedPath` ausgenommen.
- `netlify.toml` – setzt auf `/` `Link`-Header mit `rel="describedby"` auf `llms.txt`/`llms-full.txt` (RFC 8288) sowie Security-Header (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- `public/robots.txt` – Content-Signals (`ai-train=yes, search=yes, ai-input=yes`) plus explizite Allow-Blocks für GPTBot, ClaudeBot, PerplexityBot etc. Position: AI-Sichtbarkeit ist Asset, Content darf in Modelle einfliessen.
- JSON-LD immer über `jsonLd()` aus `src/lib/json-ld.ts` in `set:html` geben (maskiert `<`); der Brotkrumen-Pfad kommt aus `src/lib/breadcrumb.ts`, letzte Stufe mit Seitentitel.
- `src/pages/.well-known/api-catalog.ts` – RFC-9727-Stub (`application/linkset+json`, aktuell leeres `linkset`). Wird gefüllt, sobald fumu echte APIs hat.

Beim Ändern dieser Schicht: Konsistenz wahren (neue Page → in `.md`-Route, llms.txt und ggf. Sitemap berücksichtigen).

### Markdown-Pipeline (`astro.config.mjs`)

Astro 7 rendert Markdown per Default mit **Sätteri**, das keine remark/rehype-Plugins kennt. Weil die vier Plugins unten tragend sind, läuft die Pipeline über `markdown.processor: unified({ remarkPlugins, rehypePlugins })` aus `@astrojs/markdown-remark` weiter auf unified. Wer den Prozessor umstellt, verliert Wikilink-Auflösung, Marker-Stripping, Lazy-Images und das Vergrössern der Diagramme auf einen Schlag.

Vier eigene Plugins verarbeiten jedes Markdown vor dem Render:

- `remarkWikilinks` (remark, `src/plugins/remark-wikilinks.mjs`) – löst `[[…]]` auf: Anker-Wikilinks werden zu internen Links, Notiz-Wikilinks zu Klartext.

- `remarkStripObsidianMarkers` (remark) – entfernt `%% … %%`-Inline-Kommentare (Obsidian-Kommentare, `@dieter`/`@jochen`-Mentions) und Legacy-`[!dieter]`/`[!jochen]`-Dialog-Blockquotes aus dem AST. **Belt-and-Suspenders**: Pendant zu `dialog_filter.py` im Akasha-Vault; die primäre Bereinigung passiert im `/fumu-web`-Skill beim Transform, das Plugin fängt Drift ab.
- `rehypeImgLazy` (rehype) – setzt `loading="lazy"` + `decoding="async"` auf alle `<img>` im Markdown-Output (Astro tut das nur für die `astro:assets`-Pipeline, nicht für `/public`-Pfade).
- `rehypeImgZoom` (rehype, `src/plugins/rehype-img-zoom.mjs`) – macht Detail-Bilder (Diagramme, Charts, Screenshots), die allein in einem Absatz stehen, per Klick vergrösserbar: dasselbe Markup wie `Figure.astro` auf den Pillar-Seiten, Stile in `global.css` («Diagramme vergrössern»). Illustrationen erkennt es am Dateinamen auf `-hero` und lässt sie, wie sie sind. SVGs bekommen `width`/`height` aus der viewBox.

### Pillar-Seiten (`src/pages/[pillar].astro`)

Themenseiten unter «Was wir tun», je eine pro Suchraum (Plan: `docs/plans/2026-08-21-pillar-seiten.md`, Bauplan im Vault: «Pillar-Architektur fumu.ch»). Eine Pillar ist ein `PageContent`-Modul unter `src/data/pages/<slug>.ts` plus ein Eintrag in der Registry `src/data/pillars.ts`; Route, Markdown-Zwilling, llms.txt/llms-full.txt, Pillar-Liste auf `/was-wir-tun/` und Header-Aktivzustand folgen daraus, ohne Änderung an Komponenten oder Routen.

- `heading` trägt den H1, wenn er länger ist als der Title-Tag; `intro` ist ein Absatz-Array.
- Section-`id: 'formate'` speist den Angebotskatalog im `ProfessionalService`-JSON-LD, `id: 'faq'` das `FAQPage`-JSON-LD und die `###`-Paare im Markdown (`src/data/pages/structured-data.ts`).
- `relatedPerspektiven` (Slugs) wird zur Build-Zeit gegen die publizierten Perspektiven aufgelöst (`loadPage` in `src/data/pages/index.ts`); ein unbekannter Slug bricht den Build, ebenso jeder Inline-Link auf eine nicht publizierte Perspektive und ein Pillar-Slug, den schon eine andere Seite belegt.
- Copy-Quelle ist die Vault-Notiz der Pillar; im Modul nicht umformulieren.

### Kategorie-Seite `/was-wir-tun/` (`src/pages/was-wir-tun.astro`)

Seit 2026-11-23 (Entwurf B, `docs/plans/2026-11-23-was-wir-tun-grafisch-entwurf.md`) rendert die Seite ihre Sektionen selbst, wie `index.astro` die Startseite, und findet sie über ihre `id` – `ansatz`, `schwerpunkt`, `leistungen`, `referenzen` – mit `sectionsByIds` aus `src/data/pages/types.ts`. Ein Label darf der Vault umbenennen; fehlt eine `id`, kommt eine Sektion dazu, wechselt die Reihenfolge oder trägt eine Sektion eine Item-Art, die die Seite nicht rendert (`itemsOfKinds`), bricht der Build. Das Diagramm im Kopf kommt über `hero` aus `src/data/pages/was-wir-tun.ts` (Quelle im Vault: `diagram-technologie-allein.excalidraw.md` im Ordner fumu.ch, ohne Bildunterschrift; `Figure.caption` ist optional). Die Leistungen stehen als Karten über `LeistungsKarten.astro`, eine bis fünf Pillars, Flächen nach Position aus `src/lib/leistungs-toene.ts` (dieselbe Funktion wie auf der Startseite). Das Zitat steht im Sockel über `SockelZitat.astro`, im Markdown-Zwilling weiter unter «Referenzen». `Sektion.astro` rendert weiterhin Kontakt und die Pillars.

### Seite `/about/` (`src/pages/about.astro`)

Seit 2026-11-24 (Entwurf B, `docs/plans/2026-11-24-ueber-fumu-grafisch-entwurf.md`) gebaut wie `/was-wir-tun/`: Die Seite findet ihre Sektionen über `id` – `gruender`, `netzwerk`, `arbeit`, `formate` – und bricht den Build über dieselben Wächter, dazu `singleItem`, wenn «Gründer» oder «Wie wir arbeiten» nicht genau ein Zitat tragen. Das Oeschger-Zitat steht im Kopf auf einer Karte, das von Schoch und Wehrle im Sockel; im Markdown-Zwilling stehen beide an ihrem Ort in den Sektionen. Die Porträts kommen über `Portraet.astro`. Die Personen-Anker (`jochen-witte` usw.) sind das Ziel der Autorenlinks und müssen bleiben (Test in `about.test.ts`).

### Weitere generierte Routen

- `src/pages/rss.xml.ts` – RSS-Feed der veröffentlichten Perspektiven.
- `public/_redirects` – 301/404-Redirects aus der WordPress→Astro-Migration (alte `/author/*`, `/tag/*`, `/category/*`, `/wp-*`-URLs). Beim Umbenennen/Entfernen von URLs hier nachziehen.

### AI-Crawler-Radar-Pipeline (`tools/crawler-radar/`)

Erhebung, Snapshots und Publish des Radars liegen seit 2026-09-20 in diesem Repo (vorher Python-Lib im Akasha-Vault, Plan: `docs/plans/2026-09-20-crawler-radar-pipeline-ins-repo.md`). `tools/` liegt ausserhalb von `src/` und `public/` und berührt den Astro-Build nicht; die Site liest nur das Ergebnis `src/data/ai-crawler-tracker.json`.

- Kette: `analyze.py` (robots.txt der 108 Sites aus `sample.yaml` holen → `data/snapshot-YYYY-MM-DD.{json,csv}`) → `timeline.py` (`data/timeline.{csv,json}`) → `diff.py` (`data/diff-YYYY-MM-DD.md`) → `publish.py` (Tracker-JSON; Default-Output ist das Repo-JSON, `--output -` schreibt nach stdout). `query.py` ist die Ad-hoc-Aggregation, auf der `publish.py` aufbaut.
- `run.sh [--force] [--sample PATH]` ist der Cron-Wrapper: Wochen-Gate (nur gerade ISO-Wochen, `--force` überspringt), `git pull --rebase`, Kette, ein Commit mit Whitelist-Staging, Push fail-soft. Log über `RADAR_LOG`, Default `tools/crawler-radar/cron.log` (gitignored). Exit 0 = veröffentlicht/übersprungen, 1 = Setup oder Pull gescheitert, 2 = Lauf verworfen.
- **Guard:** `publish.py` blockiert bei über 30 Prozent ERROR-Zellen oder unplausibel dünnem Snapshot. `run.sh` verwirft dann die Dateien des Laufs (`git restore` + `git clean`, beschränkt auf `data/` und das Tracker-JSON) – ein ausgefallener Lauf hinterlässt keinen Snapshot statt einer Null-Delle in der Zeitreihe. `data/archive/` belegt die zwei DNS-Ausfälle vom Juli/August 2026.
- Setup und Tests: `tools/crawler-radar/setup.sh` (venv + `requirements.txt`), dann `cd tools/crawler-radar && .venv/bin/python -m pytest -q` (39 Tests).
- **Nicht ändern ohne Rückmeldung in den Vault:** CLI-Argumente `--timeline`, `--presets`, `--data-dir` und die Spalten von `timeline.csv` – daran hängen `render.py` und der `/robots-txt`-Skill im Vault, die diese Daten lesend nutzen.

## Design-System

Stand: Redesign «Mischung 4» (2026-11), Entwurf und Begründung in `docs/plans/2026-11-22-neues-design-entwurf.md` – Bleistift auf gerissenem Papier, oben Weiss, unten Pflaume als Sockel, Coral als Signatur. Tokens in `src/styles/global.css`.

### Farben

| Variable | Hex | Verwendung |
|----------|-----|------------|
| `--color-white` | #FFFFFF | Grund oben und in der Mitte jeder Seite |
| `--color-plum` | #43233B | Sockel unten; Titel, Schriftzug, Navigation |
| `--color-plum-soft` | #6B4A63 | Sekundärtext, Leads, Etiketten |
| `--color-ink` | #2B1A27 | Fliesstext |
| `--color-coral` | #C44540 | Signatur: Knöpfe, Links, Daten, aktiver Menüpunkt, Punkt im Schriftzug |
| `--color-saffron` | #E9A23B | Papier: Flächen; im Sockel Links und Fokus |
| `--color-blush` | #F3D9C4 | Papier: Flächen, Thema-Streifen, Haarlinien |
| `--color-blush-light` | #F8EADF | Papier: Karten, Hinterlegung von Bildern |
| `--color-plum-line` | Rosé 22 % | Haarlinie im Sockel |

Regeln für die Signatur (Entwurf, Regeln 1–6): Coral steht nur auf dem, was etwas tut oder auszeichnet. Coral-Schrift unter 24 px nur auf Weiss (auf Rosé-hell erst ab 24 px – Links auf Rosé-hell-Karten stehen deshalb in Pflaume). Höchstens eine Safran-Fläche pro Bildschirmhöhe, Coral als grosse Fläche einmal pro Seite (Startseite: `src/lib/startseite.ts`; das Kopfbild trägt kein Safran-Papier, Safran gibt es dort nur als Karte der zweiten Leistung). Auf Pflaume: Text Weiss, Nebentext Rosé, Links und Fokus Safran, Coral nur als Knopf und als Datum auf den weissen Blättern. Keine weiteren Farben.

Link-, Fokus- und Titelfarbe hängen an vererbbaren Variablen (`--link`, `--focus`, `--heading`, Default Coral/Coral/Pflaume): Der Sockel stellt sie auf Safran und Weiss um, Karten und Blätter setzen sie für ihren Inhalt neu. Farben einer Fläche dort umstellen, nicht über Selektoren auf `a` oder `h2`.

**Chart-Serienfarben** kommen nicht aus dieser Tabelle, sondern aus der Brand-Kategorien-Palette (Akasha-Vault: `var/marken/fumu/brand.yaml` > `colors.categorical`, dataviz-validiert gegen ivory) – kanonische Kopie in `src/data/crawler-tracker.ts` > `categoryColors`. Keine ad-hoc Hexwerte in Chart-Komponenten.

### Typografie

- Text: `var(--font-sans)` – Instrument Sans, 17px/1.6, 400; Perspektiven 18.5px/1.72. Kursiv (echter Schnitt) nur für Werktitel im Fliesstext. Verwendungsregel für Auszeichnungen: Akasha-Vault `var/references/STILREGELN.md` > Auszeichnungen.
- Titel: `var(--font-serif)` – Instrument Serif 400 (nur dieser Schnitt), Pflaume. H1 76/46 px (Startseite 96/58, Pillar 60/40), H2 im Lesetext 38 px, Sektionstitel 44 px, Sockel-Titel 52/40 px, H3 28 px. H4–H6 in Instrument Sans 600.
- Serif kursiv: Zitate und die Dauer der Formate (Coral, ab 24 px).
- Etiketten: Versalien, 13 px, Sperrung 0.05em (`.label-caps` oder lokal).
- Schriftzug «fumu.» in der Kopfzeile: Instrument Serif 40 px, Punkt Coral. Favicon, Touch-Icon und `og-default.png` erzeugt `scripts/brand-assets.mjs`.

### Formen

- Papierkarte `Karte.astro`: `--radius-cut` (ungleiche Ecken), `--shadow-layer`; Töne Coral, Safran, Rosé-hell, Weiss.
- Gerissenes Papier hinter Bildern: `--torn-1`, `--torn-2`, `--torn-3` (clip-path-Polygone aus festen Startwerten, `src/lib/torn-paper.ts`). Illustrationen (`-hero`-Bilder) und Loop-Videos im Markdown liegen automatisch auf einer Papierform in Rosé-hell (`global.css`), Bilder im Layout über `PapierBild.astro`, optional mit stummem Loop-Video (`video`; das Bild bleibt Poster, Alt-Text-Träger und Ersatz bei «Bewegung reduzieren»). Startbild: `public/images/home/hero-team.{webp,mp4}`, Original-PNG im Vault.
- Porträts über `Portraet.astro`: Foto in Graustufen mit `multiply` auf Rosé-hell, beschnitten auf eine fast runde Form mit feinem Riss (`portraetPolygon` in `torn-paper.ts`, als `--form` im `style`-Attribut statt in `torn-paper.css`), dahinter ein Stück Papier in Rosé (`--torn-2`). Jedes Porträt auf `/about/` bleibt unter 200 KB (Test in `about.test.ts`); die Partner liegen als WebP, Jochens JPG bleibt, weil das Person-JSON-LD darauf zeigt.
- Feiner Papierriss (seit 2026-11-23, Entwurf `docs/plans/2026-11-23-riss-kante-entwurf.md`) an Sockelkante, Knöpfen und OG-Bild: `src/lib/riss.ts` erzeugt nahtlos kachelbare SVG-Streifen aus periodischem Rauschen (mulberry32 aus `src/lib/zufall.ts`, dieselbe Rezeptur wie der Linksrand der PDF-Vorlagen im Vault). Als `--riss-*`-Variablen stehen sie mit den `--torn-*` erzeugt in `src/styles/torn-paper.css`, das `BaseLayout` importiert; nach einer Änderung an `riss.ts` oder `torn-paper.ts` `node scripts/torn-css.mjs` laufen lassen, sonst schlägt der Test fehl.
- Knopf `.btn` (`global.css`): ausgerissener Streifen – Fläche im `::before` (Maske `--riss-oben`/`--riss-unten`, Seiten `--riss-seiten`), heller Faserrand im `::after`, Farbe über `--btn-farbe`, Schatten als `drop-shadow`, im Kontrastmodus ein Rahmen. Auch der Newsletter-Knopf nutzt `.btn`; nie `background` auf einen Knopf setzen, sonst liegt ein Rechteck hinter dem Riss. Prüfung: `node scripts/knopf-check.mjs`.
- Sockel `Sockel.astro`: Pflaume, Oberkante als wiederholte Riss-Kachel `--riss-kante` mit Schatten zur weissen Seite; enthält den Slot `sockel` aus `BaseLayout` (seitenspezifisch: Zitat, Perspektiven als Blätter über `PerspektivenBlaetter.astro`), den Abschluss «25 Minuten Kennenlernen» (Text aus der Sektion «Termin» in `src/data/pages/kontakt.ts`, abschaltbar mit `BaseLayout`-Prop `abschluss={false}`, nur auf `/kontakt/`), die Newsletter-Zeile und den Fuss mit Link zum AI-Crawler-Radar.

### Spacing

`--space-xs` (0.25rem) → `--space-sm` (0.5rem) → `--space-md` (1rem) → `--space-lg` (2rem) → `--space-xl` (4rem)

### Layout

- `--max-width`: 1200px (Container, Seitenrand 40/20 px)
- `--page-width`: 760px (Spalte der Seiten aus PageContent, Rechtstexte, Radar; linksbündig)
- `--read-width`: 680px (Lesespalte der Perspektiven, mittig)
- Breakpoint: 860px (Mobile)
- Abnahme-Skripte: `scripts/text-diff.mjs` (Wortmengen zweier Build-Bäume), `scripts/overflow-check.mjs` (Überlauf bei 400 px)

## Konventionen

### Neue Artikel anlegen

1. Markdown-Datei in `src/content/perspektiven/` erstellen
2. Slug = Dateiname (Kleinbuchstaben, Bindestriche, kein Datum)
3. Frontmatter muss dem Zod-Schema entsprechen (title, description, date; optional category, image, authors)
4. `draft: true` für unveröffentlichte Artikel
5. Keine Obsidian-Syntax: keine `[[Wikilinks]]`, keine `#tags`, keine Callouts, keine `%% %%`-Kommentare
6. Bilder als eigene Zeile `![alt](/images/perspektiven/…)`. Illustrationen heissen `<slug>-hero.<ext>`, alles andere gilt als Detail-Bild und wird vergrösserbar (Entscheid Jochen 2026-11-12: nur Bilder mit Details, nie Illustrationen oder Logos).
7. `npm run build` zur Verifikation laufen lassen

### Obsidian → Astro Transformation

Content stammt häufig aus dem Akasha-Vault. Die Bereinigung ist primär Aufgabe des **`/fumu-web`-Skills** (Transform-Schritt); die remark/rehype-Plugins sind nur das Sicherheitsnetz. Beim manuellen Übernehmen:

- `[[Wikilinks]]` → Klartext oder HTML-Link
- `#tags` in Navigationszeile → entfernen
- Obsidian-Frontmatter → Astro-Schema-Frontmatter
- Mermaid-Codeblöcke → pre-gerenderte SVGs
- Callouts (`> [!note]`) → HTML oder entfernen
- `%% … %%`-Kommentare und `[!dieter]`/`[!jochen]`-Dialoge → entfernen (werden sonst vom Plugin gestrippt)
- Interne Vault-Links → entfernen oder durch externe URLs ersetzen

### Seiten bearbeiten

Statische Seiten: Content in `src/content/pages/*.md`, Layout in `src/pages/*.astro`. Für rein inhaltliche Änderungen nur die Markdown-Datei editieren.

## Navigation

```
/                          → Home (Hero)
/was-wir-tun/              → Was wir tun
/ki-transformation/        → Pillar 1 (Registry: src/data/pillars.ts, Route [pillar].astro)
/about/                    → About (Autoren-Anker: /about/#<slug>)
/perspektiven/             → Artikelübersicht
/perspektiven/[slug]/      → Einzelartikel
/ai-crawler-radar/         → AI-Crawler-Radar (Daten-Seite aus src/data/ai-crawler-tracker.json; .md-Variante rendert Live-Daten via ai-crawler-radar.md.ts)
/kontakt/                  → Kontakt
/impressum/                → Impressum
/datenschutz/              → Datenschutz
/<seite>.md, /llms.txt     → Maschinen-/Agent-Varianten (siehe Agent-Readiness)
```
