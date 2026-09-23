# Geplantes Publizieren und Überarbeitungsdatum

Stand: 2026-09-23 · Quelle: Vault-Session nach dem Live-Gang von «Wenn Maschinen einkaufen», einen Tag nach «Bring your own Agent». Self-contained – alle nötigen Daten stehen hier. Der zweite Teil (Überarbeitungsdatum) hat seine Akzeptanzkriterien in der Vault-Story «Updated-Feld für fumu.ch-Content»; sie sind hier wiederholt, weil beide Teile dieselben Dateien berühren und in einer Session billiger sind als in zwei.

## Kontext

Perspektiven entstehen, wenn der Gedanke da ist, und gehen heute im selben Moment live: `draft: false`, Push, Netlify baut. Zwei Stücke an zwei Tagen (2026-09-22 und 2026-09-23) haben gezeigt, was das kostet: Jedes Stück braucht seinen eigenen LinkedIn-Anlass und seinen Newsletter-Slot, und zwei Anlässe an zwei Tagen sind einer zu viel. Für die Suche ist der Abstand egal; der Hebel ist die Distribution.

Gewünscht ist eine Warteschlange: Der Autor setzt beim Publizieren ein Datum in der Zukunft, alles andere (Review, Assets, Commit) läuft wie heute, und die Website gibt das Stück an diesem Tag von selbst aus.

Zwei Dinge fehlen dafür. Erstens filtert jede Ausgabe nur auf `draft`; ein Stück mit Datum in der Zukunft erscheint sofort, mit falschem Datum. Zweitens ist die Site statisch: Ohne einen Build am Stichtag bleibt ein künftiges Datum ein künftiges Datum. Netlify baut nur bei Push.

Der Hintergrund für den zweiten Teil: Google und die AI-Suchen lesen `dateModified` und Sitemap-`lastmod`. Heute schreibt `astro.config.mjs` für jede Seite das Build-Datum als `lastmod` (Zeile 42), was bei täglichen Builds jede Seite jeden Tag als geändert meldet, und das strukturierte Markup kennt nur `datePublished`. Ein tägliches Rebuild macht diesen Fehler sichtbar, deshalb gehören beide Teile zusammen.

## Akzeptanzkriterien

Teil 1, geplantes Publizieren:

- Ich setze in einer Perspektive `date: 2026-10-27` bei `draft: false`, pushe heute, und die Seite ist bis zum 27.10. weder unter ihrer URL noch in Übersicht, Themenseite, RSS, `llms.txt`, `llms-full.txt` oder Sitemap zu finden. Am 27.10. ist sie ohne mein Zutun bis 08:00 Schweizer Zeit live.
- Im Dev-Server sehe ich das Stück trotzdem, damit die Lokal-Review vor dem Push funktioniert; ein Hinweis auf der Seite zeigt mir, dass es geplant ist.
- Ein Stück mit heutigem oder vergangenem Datum verhält sich wie heute; kein bestehender Post ändert sein Verhalten.

Teil 2, Überarbeitungsdatum:

- Ich kann in einer Post-Datei ein Überarbeitungsdatum setzen, und der Post zeigt es dem Leser an, ohne dass die Sortierung der Übersicht (nach `date`) durcheinandergerät.
- Ein Post ohne dieses Datum sieht aus wie heute; kein leeres Feld, keine Dopplung.
- Die ausgelieferte Seite trägt `dateModified` im strukturierten Markup, die Sitemap ein `lastmod`, das dem tatsächlichen Stand entspricht (Überarbeitungsdatum, sonst Publikationsdatum), nicht dem Build-Datum.
- `zero-click.md` trägt das Datum 2026-08-26 und ist der erste Beleg.

## Nicht Teil dieses Plans

- Zurückziehen bereits publizierter Stücke; «Wenn Maschinen einkaufen» bleibt live, die Schlange gilt ab dem nächsten Stück.
- Eine Redaktionsplan-Ansicht im Repo oder auf der Site. Der Plan lebt im Vault (Story-Tasks mit `⏳`).
- Ein automatischer Abgleich des Überarbeitungsdatums mit dem Git-Datum; ob eine Änderung als Überarbeitung zählt, bleibt ein Urteil.
- Statische Seiten (`pages`-Collection, Datenmodule); die Schlange betrifft nur Perspektiven.

## Technische Eckpunkte

**Sichtbarkeits-Regel an einer Stelle.** Neues Modul `src/lib/published.ts`:

```ts
import type { CollectionEntry } from 'astro:content';

// Ein Stück ist sichtbar, wenn es nicht Entwurf ist und sein Datum erreicht ist.
// Im Dev-Server sind geplante Stücke sichtbar (Lokal-Review vor dem Push).
export function isPublished(
  entry: CollectionEntry<'perspektiven'>,
  now: Date = new Date(),
): boolean {
  if (entry.data.draft) return false;
  if (import.meta.env.DEV) return true;
  return entry.data.date.getTime() <= now.getTime();
}

export const isScheduled = (entry: CollectionEntry<'perspektiven'>, now = new Date()) =>
  !entry.data.draft && entry.data.date.getTime() > now.getTime();
```

`date: 2026-10-27` wird von `z.coerce.date()` als Mitternacht UTC gelesen; ein Build um 04:00 UTC am 27.10. liegt danach. Kein Zeitzonen-Feld nötig.

**Elf Filter-Stellen** ersetzen `({ data }) => !data.draft` durch `isPublished`:

| Datei | Zeile heute |
|---|---|
| `src/pages/index.astro` | 7 |
| `src/pages/perspektiven/index.astro` | 8 |
| `src/pages/perspektiven/[...slug].astro` | 8 und 31 (Serienteile) |
| `src/pages/perspektiven/[slug].md.ts` | 6 |
| `src/pages/perspektiven/themen/index.astro` | 8 |
| `src/pages/perspektiven/themen/[slug].astro` | 18 |
| `src/pages/perspektiven/themen/[slug].md.ts` | 18 |
| `src/pages/rss.xml.ts` | 6 |
| `src/pages/llms.txt.ts` | 6 |
| `src/pages/llms-full.txt.ts` | 8 |

Die Sitemap (`@astrojs/sitemap`) listet, was gebaut wird; fällt die Seite aus `getStaticPaths`, fällt sie aus der Sitemap. Gegenprobe im Build: `dist/perspektiven/<slug>/` darf nicht existieren.

**Dev-Hinweis.** In `[...slug].astro` bei `isScheduled(post)` eine schmale Zeile über dem Titel («Geplant für 27. Okt. 2026, nur lokal sichtbar»), nur im Dev-Modus gerendert; im Build kommt der Fall nie vor.

**Täglicher Build.** Netlify-Build-Hook (Site settings → Build & deploy → Build hooks, Name `scheduled-publish`) als Repo-Secret `NETLIFY_BUILD_HOOK`, dazu `.github/workflows/scheduled-build.yml`:

```yaml
name: Scheduled build
on:
  schedule:
    - cron: '0 4 * * *'   # 04:00 UTC = 06:00 CEST / 05:00 CET
  workflow_dispatch:
jobs:
  trigger:
    runs-on: ubuntu-latest
    steps:
      - run: curl -fsS -X POST -d '{}' "${{ secrets.NETLIFY_BUILD_HOOK }}"
```

Ein Build pro Tag kostet rund eine Minute Netlify-Build-Zeit; das Kontingent des Free-Plans (300 min/Monat) reicht. `workflow_dispatch` erlaubt den Test von Hand. Alternative ohne GitHub Actions wäre eine Netlify Scheduled Function; sie braucht ein zusätzliches Paket und bringt nichts, was der Cron nicht hat.

**Überarbeitungsdatum.** In `src/content.config.ts` ergänzen: `updated: z.coerce.date().optional()`. Ausgabe:

- `[...slug].astro` Zeile 45: neben dem Publikationsdatum «Überarbeitet 26. Aug. 2026», nur wenn gesetzt, gleicher `formatDate`.
- `BaseLayout.astro` Zeile 109: `dateModified: (article.updated ?? article.date).toISOString()`; das `article`-Objekt in `[...slug].astro` Zeile 39 um `updated` erweitern.
- `astro.config.mjs` Zeile 41–43: `serialize` liest das Datum pro Perspektive statt `new Date()`. Der Sitemap-Hook kennt nur die URL; deshalb beim Build eine Map `url → lastmod` aus der Collection bauen (in `astro.config.mjs` per `getCollection` nicht verfügbar; stattdessen die Frontmatter der Perspektiven mit `gray-matter` oder einem kleinen Reader aus `src/content/perspektiven/*.md` lesen und aus `slug` die URL ableiten). Für alle übrigen Seiten bleibt `lastmod` weg, statt ein falsches Datum zu tragen.

**Sortierung.** Übersicht und Themenseiten sortieren weiter nach `date`; `updated` beeinflusst keine Reihenfolge (Akzeptanzkriterium der Vault-Story).

## Schritte

1. `src/lib/published.ts` anlegen, die elf Stellen umstellen, `npm run build && npx vitest run`. Test: eine Kopie einer bestehenden Perspektive mit `date` in einem Jahr anlegen, bauen, `dist/` prüfen (Seite, `perspektiven/index.html`, `rss.xml`, `llms.txt`, `sitemap-0.xml` ohne den Slug), Kopie wieder löschen. Der Test gehört als Vitest-Fall dazu: `isPublished` mit festem `now` gegen drei Daten (gestern, heute, morgen).
2. Dev-Hinweis in `[...slug].astro`.
3. Build-Hook in Netlify anlegen, Secret im GitHub-Repo setzen, Workflow committen, einmal per `workflow_dispatch` auslösen und im Netlify-Deploy-Log den Trigger «Build hook» sehen.
4. `updated` im Schema, Layout, Markup und Sitemap. `zero-click.md` mit `updated: 2026-08-26` als erster Fall.
5. Live prüfen: `curl -s https://fumu.ch/perspektiven/zero-click/ | grep dateModified`, `curl -s https://fumu.ch/sitemap-0.xml | grep -A2 zero-click`.
6. Skill nachziehen (Vault, `.claude/skills/fumu-web/SKILL.md` > Workflow Neue Perspektive, Schritt 5): `date` ist der geplante Termin, nicht «heute»; die Story bekommt zwei Tasks, `⏳ Termin minus 3 Tage` Frische-Check bei Stücken an der Nachrichtenlage und `⏳ Termin` Nachziehen (Themenbereich, Rahmen-Post, LinkedIn). Repo-CLAUDE.md > `perspektiven`-Schema um `updated` und die Datums-Regel ergänzen.

## Offene Punkte

- Frische: Ein Stück, das drei Wochen in der Schlange liegt, altert dort genauso wie eines, das im Vault liegt («Wenn Maschinen einkaufen» wurde nach zehn Wochen neu geschrieben). Die Schlange taugt für evergreen Stücke; bei Stücken an der Nachrichtenlage entscheidet der Frische-Check-Task, nicht die Technik. Horizont als Faustregel zwei bis drei Wochen.
- RSS-Leser bekommen ein Stück am Erscheinungstag mit dem geplanten Datum; das ist gewollt.
