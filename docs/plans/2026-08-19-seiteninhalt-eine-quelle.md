# Seiteninhalt aus einer Quelle

Stand: 2026-08-19 · Quelle: Session aus dem Akasha-Vault, ausgelöst durch eine Falschangabe («bei McKinsey gelernt»), die nur im Markdown-Kanal lebte und dort unbemerkt blieb. Self-contained – alle nötigen Daten stehen hier.

## Kontext

Die Content-Collection `pages` speist heute drei Ausgänge:

1. `/[slug].md` – Markdown-Route (`src/pages/[slug].md.ts`)
2. `/llms-full.txt` – Volltext für Agents (`src/pages/llms-full.txt.ts`)
3. die HTML-Seite selbst – **nur** bei `datenschutz` und `impressum`, die ihren Collection-Eintrag via `render(page)` ausgeben

Bei `about`, `kontakt` und `was-wir-tun` ist das HTML handgeschrieben (Evans-Raster: Label-Spalte links, Content-Spalte rechts). Der Collection-Eintrag speist dort nur noch die Kanäle 1 und 2. Damit ist er ein Schattentext – ausgeliefert an Crawler und KI-Systeme, aber in keinem Browser sichtbar und beim Redigieren der Seite nicht im Blick.

Folge, beobachtet am 2026-08-19: `about.md` behauptete «bei McKinsey gelernt», `llms.txt` «strategische Disziplin (McKinsey)». Beides war frei erfunden, stand seit der WordPress-Migration live und wurde nie bemerkt, weil die gerenderte Seite es nie trug. Beide Stellen sind inzwischen entfernt (Commit `ebe9901`), die Ursache besteht fort.

`ai-crawler-radar` ist ein Sonderfall und bleibt aussen vor: Die Seite rendert Live-Daten, ihre Markdown-Variante entsteht in `ai-crawler-radar.md.ts` und ist in `[slug].md.ts` bewusst ausgefiltert.

## Akzeptanzkriterien

- Ich ändere einen Satz auf `/about/`, `/kontakt/` oder `/was-wir-tun/` an genau einer Stelle, und er ist danach in der HTML-Seite, unter `/<slug>.md` und in `/llms-full.txt` gleich.
- Ich kann keine Aussage mehr in einem Kanal stehen lassen, die in einem anderen fehlt – auch nicht versehentlich.
- Die drei Seiten sehen nach dem Umbau aus wie vorher; das Evans-Raster, die Coral-Labels und das Mobile-Verhalten bleiben unverändert.
- Ein neues Zitat oder eine neue Sektion kostet mich einen Eintrag in den Seitendaten, nicht drei Änderungen in drei Dateien.

## Nicht Teil dieses Plans

- Die Referenz-Sektion mit den acht Kundenlogos. Sie ist der Anwendungsfall, der von diesem Umbau profitiert, aber ein eigenes Vorhaben (Vault-Story «Kunden-Einwilligungen für Logos und Zitate einholen»).
- `ai-crawler-radar` (Live-Daten, eigene Markdown-Route).
- `home` und `perspektiven` – Collection-Einträge ohne handgeschriebene Zwillingsseite; hier existiert das Problem nicht.

## Technische Eckpunkte

**Quelle:** je Seite ein Modul unter `src/data/pages/<slug>.ts`, das ein typisiertes Objekt exportiert. Schema (in `src/data/pages/types.ts`):

```ts
type Cta = { label: string; href: string; external?: boolean };

type Item =
  | { kind: 'item'; tag?: string; title?: string; body: string; cta?: Cta }
  | { kind: 'person'; name: string; tag: string; image: string; body: string; links: Cta[]; anchor: string }
  | { kind: 'quote'; text: string; cite: string }
  | { kind: 'component'; name: 'newsletter' };

type Section = { label: string; id?: string; items: Item[] };

type PageContent = {
  title: string;
  description: string;
  order: number;
  intro: string;
  sections: Section[];
};
```

`body` ist Klartext, kein HTML. Wo heute Inline-Links im Fliesstext stehen (Lukas Görög: akademie-ki.ch; Daniel Tschudi: marketing-hub.online, hfexamplanner.com), tragen sie als `links` neben dem Body – der Markdown-Kanal serialisiert sie als Linkliste, das HTML als Absatz-Anhang. Kein Markdown-Parsing im Renderer.

**HTML-Rendering:** eine Komponente `src/components/EvansSection.astro`, die eine `Section` zu dem Markup rendert, das heute handgeschrieben in den drei Seiten steht. Das CSS zieht aus den drei `.astro`-Dateien in die Komponente um; die Seiten behalten nur Layout-Rahmen, Schema-Skripte (`ProfessionalService` auf was-wir-tun, `Person` auf about) und den `<hr class="section-divider">`-Rhythmus.

**Markdown-Rendering:** eine reine Funktion `src/data/pages/to-markdown.ts`, die `PageContent` zu Markdown serialisiert (H2 je Section-Label, Items als Fettname plus Absatz, Zitate als Guillemet-Block plus Em-Dash-Zeile – so wie `about.md` heute aussieht). `component`-Items rendern einen erklärenden Satz statt der Komponente.

**Collection-Anbindung:** `[slug].md.ts` und `llms-full.txt.ts` beziehen ihren Body für die drei Seiten aus `to-markdown.ts` statt aus `entry.body`. Die Collection-Einträge `about.md`, `kontakt.md`, `was-wir-tun.md` entfallen ersatzlos – damit kann kein Schattentext zurückkehren. `datenschutz` und `impressum` bleiben unverändert bei `entry.body`, ihr Ein-Quellen-Muster funktioniert bereits.

Für Frontmatter-Felder, die die Collection heute liefert (`title`, `description`, `order`), tritt `PageContent` an ihre Stelle; die Sortierung in `llms-full.txt.ts` und die Nav-Reihenfolge müssen beide Fälle bedienen.

**Test:** `src/data/pages/to-markdown.test.ts` (vitest ist bereits Dev-Dependency). Prüft, dass jeder `body`-, `quote`- und `title`-String aus `PageContent` im erzeugten Markdown vorkommt – die Regressionssicherung gegen genau den McKinsey-Fall in umgekehrter Richtung.

## Schritte

- [x] `types.ts` und `to-markdown.ts` anlegen, Test dazu
- [x] `about` überführen: `src/data/pages/about.ts` aus dem heutigen `about.astro` ziehen, `EvansSection.astro` dabei herausarbeiten, Seite auf die Komponente umstellen
- [x] `[slug].md.ts` und `llms-full.txt.ts` auf die neue Quelle umstellen, `about.md` löschen
- [x] Gegenprobe: `/about/`, `/about.md` und `/llms-full.txt` vor und nach dem Umbau vergleichen – der sichtbare Text muss identisch sein
- [x] `was-wir-tun` überführen (gleiches Muster, nur `item`-Typen)
- [x] `kontakt` überführen (Sonderfall `component: 'newsletter'`)
- [x] Build grün, lokales Review, Deploy (Commit 143ffca, live geprüft: HTML, .md und llms-full.txt für alle drei Seiten)

## Beobachtungen aus der Umsetzung

- Der Markdown-Kanal von `/about/` war nicht nur bei McKinsey ungenau: Stefan Roptes Satz «Business Requirements, Evaluationsmatrix, Prototypen.», die Inline-Links (akademie-ki.ch, marketing-hub.online, hfexamplanner.com) und «Timeline Education» fehlten dort ebenfalls. Alle sind jetzt drin, weil sie aus derselben Quelle stammen wie die Seite.
- `component` sitzt als optionales Feld am `TextItem`, nicht als eigener Item-Typ – sonst wäre der Newsletter-Absatz auf `/kontakt/` in zwei `.evans-item`-Blöcke zerfallen und hätte einen zusätzlichen Abstand bekommen.
- `.evans-item p` stand auf `/kontakt/` bei 16px, auf den beiden anderen Seiten bei 17px. Die Komponente vereinheitlicht auf 17px – die einzige beabsichtigte optische Änderung dieses Umbaus.
- Der Tag «Laufend» heisst in den Daten jetzt «laufend»: Im HTML setzt ihn `text-transform: uppercase` ohnehin in Versalien, im Markdown steht er mitten im Satz.

## Entscheidungen

- **Strukturierte Daten statt HTML-zu-Markdown-Konvertierung.** Ein Parser über das gerenderte HTML würde den LLM-Kanal zum Abfallprodukt des Layouts machen: Nav- und Footer-Rauschen filtern, Layout-Artefakte mitschleppen, bei jeder CSS-Änderung neu justieren. Die Daten-Richtung ist deterministisch und testbar.
- **Kein blosser Drift-Test.** Ein Vitest, der `.md` gegen gerendertes HTML vergleicht, wäre in einer Stunde gebaut, lässt aber die zwei Quellen bestehen und meldet sich erst, wenn der Fehler schon geschrieben ist.
- **Markdown nicht als Quelle.** Der naheliegende Weg – die `.md` zur Wahrheit machen und das Evans-Raster daraus ableiten – scheitert an der Struktur: Personen mit Bild, Tag und mehreren Links, CTA-Buttons, die eingebettete Newsletter-Komponente. Das bräuchte eine eigene Direktiven-Syntax über Markdown, also eine Mini-Sprache mit eigenen Fehlerquellen.
- **Seitenweise, nicht in einem Rutsch.** `about` etabliert das Muster und ist die Seite, an der der Schaden auftrat. Erst wenn dort HTML und Markdown nachweislich identisch sind, folgen die anderen beiden.

## Rückkanal

Ergebnis und Abweichungen zurück in die Vault-Session; ein Log-Eintrag gehört in die Story, aus der dieser Plan entstanden ist. Falls beim Umbau weitere Aussagen auffallen, die nur in einem Kanal stehen: nicht stillschweigend angleichen, sondern einzeln vorlegen – der McKinsey-Satz war nicht die einzige denkbare Erfindung.
