# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# fumu.ch Website

Astro-basierte statische Website für fumu – Strategieberatung für Digital Advertising, AdTech/MarTech und AI-Integration im DACH-Raum. fumu übersetzt Technologie in Wirkung: Strategie, Organisation, Prozesse und Technologie für das Medien- und Werbe-Ökosystem.

## Stack

| Komponente | Wahl | Details |
|------------|------|---------|
| Framework | Astro 6 (Static) | `output: 'static'`, kein JS-Framework |
| Integrations | `@astrojs/mdx`, `@astrojs/rss`, `@astrojs/sitemap` | MDX-Support, RSS-Feed, Sitemap mit `lastmod` |
| Hosting | Netlify Free | Auto-Deploy via GitHub (`origin: jowitte/fumu-ch`), native Forms, Node 22 |
| Fonts | Fraunces + IBM Plex | Headings (Fraunces), Body (IBM Plex Sans), Mono (IBM Plex Mono); self-hosted woff2 in `public/fonts/` |
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

Keine Tests, kein Linter konfiguriert. `npm run build` ist die Verifikation – es prüft Zod-Schemas, TypeScript (strict) und generiert alle dynamischen Routen. Vor jedem Commit, der Content oder Routen berührt: `npm run build` muss grün durchlaufen.

## Deploy

Push auf `main` → Netlify baut automatisch. Kein manueller Deploy nötig.

## Plan-Aufnahme (Übergabe aus dem Akasha-Vault)

Inhaltliche Planung passiert im Akasha-Vault; technische Umsetzungs-Pläne werden als self-contained Markdown-Files in `docs/plans/` übergeben (`YYYY-MM-DD-<thema>.md`). Bei Aufnahme: Plan lesen, Schritte abarbeiten, Checkboxen direkt im Plan-File pflegen, `npm run build` als Verifikation. Inhaltliche Fragen (Wortlaut, Naming, Reihenfolge) gehören in den Vault zurück, nicht im Plan entschieden. Abgeschlossene Pläne bleiben als Doku liegen.

**Zweiter Schreiber:** Content-nahe Edits (Seitentext, Navigation, Verlinkung, Redirects, Daten-Files wie `src/data/ai-crawler-tracker.json`) kommen auch direkt aus der Akasha-Vault-Session – dort über den `/fumu-web`-Skill (seit 2026-07-16), der Eingangsritual und Betriebsregeln trägt: `git status` vor Schreibzugriff, Whitelist-Staging, Commit/Push nur auf Ansage. Uncommitted Änderungen im Working Tree können also vom Vault stammen – vor `git checkout`/`stash`/`reset` prüfen, nicht wegwerfen. Konvention: `Akasha-Vault > Aufwände/fumu Marketing/CLAUDE.md` > «Zusammenarbeit mit dem Website-Repo».

**Dritter Schreiber:** Jochen editiert publizierte Perspektiven von Hand in VS Code (Repo als Workspace, `.vscode/` gitignored). Uncommitted Content-Änderungen können also auch daher stammen; Hintergrund ist der Perspektiven-Lebenszyklus (Repo-File als Master nach Publish, siehe Akasha-Vault `var/references/DOKUMENT-LEBENSZYKLUS.md` > Publizierte Perspektiven).

## Content Collections

Schema-Definition: `src/content.config.ts` (Glob-Loader + Zod). Ändert man ein Feld dort, muss das Frontmatter aller Dateien der Collection nachgezogen werden, sonst bricht der Build.

### `pages` – Statische Seiten

Pfad: `src/content/pages/*.md`

```yaml
title: string        # Seitentitel
description: string   # Meta-Description
order: number         # Navigationsreihenfolge
```

Seiten: home, was-wir-tun, about, perspektiven, kontakt, impressum, datenschutz

### `perspektiven` – Blog/Artikel

Pfad: `src/content/perspektiven/*.md`

```yaml
title: string                       # Artikeltitel
description: string                  # Meta-Description / Teaser
date: date                          # Publikationsdatum (YYYY-MM-DD), via z.coerce.date()
category: string?                   # z.B. "KI & AdTech"
image: string?                      # optionales Header-/OG-Bild
draft: boolean (false)              # true = wird nicht gebaut
authors: string[] (['jochen-witte']) # Autor-Slugs, siehe Autoren-System
```

Slug = Dateiname (ohne `.md`). URL: `/perspektiven/[slug]/`. `draft: true` schliesst den Artikel aus Build, Listing, RSS und llms.txt aus.

### Autoren-System

Autoren sind **nicht** Freitext, sondern Slugs aus einer zentralen Registry: `src/content/authors.ts`. Das `authors`-Frontmatter referenziert diese Slugs (z.B. `jochen-witte`, `stefan-ropte`, `lukas-goeroeg`, `daniel-tschudi`). `resolveAuthors()` löst Slugs zu `{ name, linkedin }` auf und fällt bei leerer/unbekannter Liste auf `jochen-witte` zurück. `getAuthorUrl()` verlinkt auf den Anker `/about/#<slug>`. Neuen Autor → erst Eintrag in `authors.ts`, dann im Frontmatter referenzieren.

## Architektur

### Routing-Muster: HTML- und Markdown-Zwillinge

Fast jede Seite existiert **doppelt** – als HTML für Menschen und als Quell-Markdown für Agents/LLMs:

- **HTML:** `src/pages/*.astro` (statische Seiten, laden `pages`-Collection) und `src/pages/perspektiven/[...slug].astro` (Artikel).
- **Markdown:** `src/pages/[slug].md.ts`, `src/pages/index.md.ts`, `src/pages/perspektiven/[slug].md.ts` generieren beim Build pro Seite eine `.md`-Variante (Titel + roher Body, **kein** HTML→MD-Konvertierungsverlust).

Beide Welten werden über die Content Collections gespeist – die Markdown-Routen sind die Single Source of Truth für die Agent-Readiness-Schicht. Wer eine neue Seite anlegt, sollte die `.md`-Variante mitdenken.

**Achtung Drift bei bespoke Seiten.** Einige `.astro`-Seiten laden die `pages`-Collection **nicht**, sondern hardcoden ihren Inhalt im eigenen Layout (z.B. `kontakt.astro`, `datenschutz.astro`, `impressum.astro` mit ihrem Ben-Evans-Raster). Bei solchen Seiten ist die Collection-`.md` (die `[slug].md.ts` serviert) ein **parallel von Hand gepflegtes** File, kein Derivat der gerenderten Seite. Folge: Wer den Text einer bespoke Seite ändert, muss die zugehörige `.md` im **selben Edit** nachziehen – sonst driften Menschen-Seite und Agent-Markdown auseinander (passiert 2026-06-08 auf der Kontaktseite: `.md` zeigte „30 Minuten / Lass uns sprechen", die Seite „25 Minuten Kennenlernen"). Warnsignal: Ich editiere sichtbaren Text in `kontakt.astro` / `datenschutz.astro` / `impressum.astro`, ohne die gleichnamige `.md` in `src/content/pages/` anzufassen – Stopp, Twin synchron halten. (Sauberere Dauerlösung – die bespoke Seiten aus der Collection speisen statt zu hardcoden – ist eine eigene Story.)

### Agent-/AI-Readiness-Schicht

Bewusster Schwerpunkt des Projekts (siehe Git-Historie): die Site ist für AI-Crawler und Agents optimiert. Diese Teile hängen zusammen und sollten konsistent gepflegt werden:

- `src/pages/llms.txt.ts` / `llms-full.txt.ts` – generieren `/llms.txt` (Index) und `/llms-full.txt` aus den Collections.
- `netlify/edge-functions/markdown-negotiation.ts` – Content Negotiation: bei `Accept: text/markdown` wird intern die `.md`-Variante gefetcht und mit `Content-Type: text/markdown` + `Vary: Accept` ausgeliefert. `x-edge-bypass`-Header verhindert Rekursion; Static Assets sind via `excludedPath` ausgenommen.
- `netlify.toml` – setzt auf `/` `Link`-Header mit `rel="describedby"` auf `llms.txt`/`llms-full.txt` (RFC 8288) sowie Security-Header (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).
- `public/robots.txt` – Content-Signals (`ai-train=yes, search=yes, ai-input=yes`) plus explizite Allow-Blocks für GPTBot, ClaudeBot, PerplexityBot etc. Position: AI-Sichtbarkeit ist Asset, Content darf in Modelle einfliessen.
- `src/pages/.well-known/api-catalog.ts` – RFC-9727-Stub (`application/linkset+json`, aktuell leeres `linkset`). Wird gefüllt, sobald fumu echte APIs hat.

Beim Ändern dieser Schicht: Konsistenz wahren (neue Page → in `.md`-Route, llms.txt und ggf. Sitemap berücksichtigen).

### Markdown-Pipeline (`astro.config.mjs`)

Zwei eigene Plugins verarbeiten jedes Markdown vor dem Render:

- `remarkStripObsidianMarkers` (remark) – entfernt `%% … %%`-Inline-Kommentare (Obsidian-Kommentare, `@dieter`/`@jochen`-Mentions) und Legacy-`[!dieter]`/`[!jochen]`-Dialog-Blockquotes aus dem AST. **Belt-and-Suspenders**: Pendant zu `dialog_filter.py` im Akasha-Vault; die primäre Bereinigung passiert im `/fumu-web`-Skill beim Transform, das Plugin fängt Drift ab.
- `rehypeImgLazy` (rehype) – setzt `loading="lazy"` + `decoding="async"` auf alle `<img>` im Markdown-Output (Astro tut das nur für die `astro:assets`-Pipeline, nicht für `/public`-Pfade).

### Weitere generierte Routen

- `src/pages/rss.xml.ts` – RSS-Feed der veröffentlichten Perspektiven.
- `public/_redirects` – 301/404-Redirects aus der WordPress→Astro-Migration (alte `/author/*`, `/tag/*`, `/category/*`, `/wp-*`-URLs). Beim Umbenennen/Entfernen von URLs hier nachziehen.

## Design-System

### Farben

| Variable | Hex | Verwendung |
|----------|-----|------------|
| `--color-coral` | #C44540 | Primärfarbe (Logo, CTAs, Linien, Headlines, Links) |
| `--color-primary` | #223A5E | Tertiär (dunkle Akzente) |
| `--color-bg` | #F0EEE6 | Seitenhintergrund (ivory, warme Flächen-Palette) |
| `--color-sage` | #C3CFC7 | Karten-Pastell |
| `--color-lavender` | #C9C5DA | Karten-Pastell |
| `--color-text` | #414141 | Fliesstext |
| `--color-text-light` | #666 | Sekundärtext |
| `--color-neutral` | #F4F4F4 | Hintergrund-Akzent |
| `--color-white` | #FFFFFF | Buttons-/Kontrast-Flächen |

**Chart-Serienfarben** kommen nicht aus dieser Tabelle, sondern aus der Brand-Kategorien-Palette (Akasha-Vault: `var/templates/marken/fumu/brand.yaml` > `colors.categorical`, dataviz-validiert gegen ivory) – kanonische Kopie in `src/data/crawler-tracker.ts` > `categoryColors`. Keine ad-hoc Hexwerte in Chart-Komponenten.

### Typografie

- Body: `var(--font-sans)` – IBM Plex Sans, 16px, 400
- Headings: `var(--font-serif)` – Fraunces, 600
- H1/H2: 20px, H3: 17px, H4: 14px
- Hero-Titel: 48px, Fraunces, 400, Coral

### Spacing

`--space-xs` (0.25rem) → `--space-sm` (0.5rem) → `--space-md` (1rem) → `--space-lg` (2rem) → `--space-xl` (4rem)

### Layout

- `--max-width`: 1040px (Container)
- `--content-width`: 720px (Lesbreite)
- Breakpoint: 768px (Mobile)

## Konventionen

### Neue Artikel anlegen

1. Markdown-Datei in `src/content/perspektiven/` erstellen
2. Slug = Dateiname (Kleinbuchstaben, Bindestriche, kein Datum)
3. Frontmatter muss dem Zod-Schema entsprechen (title, description, date; optional category, image, authors)
4. `draft: true` für unveröffentlichte Artikel
5. Keine Obsidian-Syntax: keine `[[Wikilinks]]`, keine `#tags`, keine Callouts, keine `%% %%`-Kommentare
6. `npm run build` zur Verifikation laufen lassen

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
/about/                    → About (Autoren-Anker: /about/#<slug>)
/perspektiven/             → Artikelübersicht
/perspektiven/[slug]/      → Einzelartikel
/ai-crawler-radar/         → AI-Crawler-Radar (Daten-Seite aus src/data/ai-crawler-tracker.json; .md-Variante rendert Live-Daten via ai-crawler-radar.md.ts)
/kontakt/                  → Kontakt
/impressum/                → Impressum
/datenschutz/              → Datenschutz
/<seite>.md, /llms.txt     → Maschinen-/Agent-Varianten (siehe Agent-Readiness)
```
