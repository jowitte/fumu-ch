# fumu.ch Website

Astro-basierte statische Website für fumu – Technologie in Wirkung übersetzen. Strategie, Organisation, Prozesse und Technologie für das Medien- und Werbe-Ökosystem.

## Stack

| Komponente | Wahl | Details |
|------------|------|---------|
| Framework | Astro 6 (Static) | `output: 'static'`, kein JS-Framework |
| Hosting | Netlify Free | Auto-Deploy via GitHub, native Forms |
| Fonts | Fraunces + IBM Plex | Headings (Fraunces), Body (IBM Plex Sans), Mono (IBM Plex Mono) |
| CSS | Custom Properties | Kein Framework, reines CSS |
| Content | Astro Content Collections | Markdown mit Zod-Schema |
| Preview | https://fumu-ch.netlify.app | Staging-URL |

## Content Collections

### `pages` – Statische Seiten

Pfad: `src/content/pages/*.md`

```yaml
title: string       # Seitentitel
description: string  # Meta-Description
order: number        # Navigationsreihenfolge
```

Seiten: home, was-wir-tun, about, perspektiven, kontakt, impressum, datenschutz

### `perspektiven` – Blog/Artikel

Pfad: `src/content/perspektiven/*.md`

```yaml
title: string              # Artikeltitel
description: string        # Meta-Description / Teaser
date: date                 # Publikationsdatum (YYYY-MM-DD)
category: string?          # z.B. "KI & AdTech"
draft: boolean (false)     # true = wird nicht gebaut
```

Slug = Dateiname (ohne .md). URL: `/perspektiven/[slug]/`

## Design-System

### Farben

| Variable | Hex | Verwendung |
|----------|-----|------------|
| `--color-coral` | #C44540 | Primärfarbe (Logo, CTAs, Linien, Headlines, Links) |
| `--color-primary` | #223A5E | Tertiär (komplexe Charts, dunkle Akzente) |
| `--color-text` | #414141 | Fliesstext |
| `--color-text-light` | #666 | Sekundärtext |
| `--color-neutral` | #F4F4F4 | Hintergrund-Akzent |
| `--color-white` | #FFFFFF | Seitenhintergrund |

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
- Breakpoints: 768px (Mobile)

## Projektstruktur

```
src/
├── content/
│   ├── pages/          # Statische Seiten (Markdown)
│   └── perspektiven/   # Artikel (Markdown)
├── components/
│   ├── Header.astro    # Navigation mit Mobile-Toggle
│   └── Footer.astro    # Links, Copyright
├── layouts/
│   └── BaseLayout.astro # HTML-Shell, SEO-Meta, Fonts
├── pages/              # Astro-Routen (laden Content Collections)
│   ├── index.astro
│   ├── perspektiven/
│   │   ├── index.astro
│   │   └── [...slug].astro
│   └── [seite].astro
└── styles/
    └── global.css      # CSS-Variablen, Reset, Utilities
```

## Konventionen

### Neue Artikel anlegen

1. Markdown-Datei in `src/content/perspektiven/` erstellen
2. Slug = Dateiname (Kleinbuchstaben, Bindestriche, kein Datum)
3. Frontmatter muss dem Zod-Schema entsprechen (title, description, date, optional category)
4. `draft: true` für unveröffentlichte Artikel
5. Keine Obsidian-Syntax: keine `[[Wikilinks]]`, keine `#tags`, keine Callouts

### Obsidian → Astro Transformation

Wenn Content aus dem Akasha-Vault übernommen wird:

- `[[Wikilinks]]` → Klartext oder HTML-Link
- `#tags` in Navigationszeile → entfernen
- Obsidian-Frontmatter → Astro-Schema-Frontmatter
- Mermaid-Codeblöcke → Pre-gerenderte SVGs
- Callouts (`> [!note]`) → HTML oder entfernen
- Interne Vault-Links → entfernen oder durch externe URLs ersetzen

### Seiten bearbeiten

Statische Seiten: Content in `src/content/pages/*.md`, Layout in `src/pages/*.astro`. Für inhaltliche Änderungen nur die Markdown-Datei editieren.

## Befehle

```bash
cd ~/Data/fumu-ch
npm run dev      # Lokaler Dev-Server (localhost:4321)
npm run build    # Production Build → dist/
npm run preview  # Preview des Builds
```

## Deploy

Push auf `main` → Netlify baut automatisch. Kein manueller Deploy nötig.

## Navigation

```
/                          → Home (Hero)
/was-wir-tun/              → Was wir tun
/about/                    → About
/perspektiven/             → Artikelübersicht
/perspektiven/[slug]/      → Einzelartikel
/kontakt/                  → Kontakt
/impressum/                → Impressum
/datenschutz/              → Datenschutz
```
