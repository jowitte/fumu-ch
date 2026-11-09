# Pillar-Seiten als Seitentyp

Stand: 2026-11-08 (erstmals 2026-08-21) · Quelle: Akasha-Vault, Story «Pillar 1 und Kategorie-Seite live auf fumu.ch», Referenz «Pillar-Architektur fumu.ch», Copy in «Pillar - KI-Transformation». Die Copy liegt vor, siehe Übergabepunkt unten.

## Kontext

fumu.ch bekommt fünf Themenseiten («Pillars»), die je einen Suchraum einfangen und ins Angebot führen. Sie sind der offene Kern des SEO-Setups: die Site rankt heute über Perspektiven, hat aber keine Seite, auf der jemand mit Beratungsbedarf landet.

Dieser Plan baut den **Seitentyp** und die erste Seite (Pillar 1, KI-Transformation). Die vier weiteren folgen danach am erprobten Muster, ohne erneuten Plan.

Der Bauplan pro Seite steht im Vault und ist nicht verhandelbar, weil er aus der Anlass-Empirie folgt – vier Teile in dieser Reihenfolge:

1. **Suchfrage einfangen** (H1 und Lead greifen auf, wonach gesucht wurde)
2. **Belegte Analyse** (der lange Mittelteil, trägt den Grossteil der Seite)
3. **Anlass-Brücke** (wenige Sätze: aus welcher Lage heraus ruft man an)
4. **Format als Ausgang** (kurz und konkret, mit Kontakt-Weg)

Dazu FAQ und Cross-Links auf verwandte Perspektiven.

## Warum das ein Plan ist und kein Skill-Lauf

Der `/fumu-web`-Skill kennt zwar einen Pillar-Workflow, aber er beschreibt eine handgeschriebene `src/pages/<slug>.astro` mit hardcodiertem Inhalt. Genau dieses Muster hat der Umbau vom 2026-08-19 (`2026-08-19-seiteninhalt-eine-quelle.md`) für `about`, `kontakt` und `was-wir-tun` abgeschafft: Handgeschriebenes HTML neben einem Collection-Eintrag erzeugt Schattentext – Aussagen, die nur im Markdown-Kanal leben und dort unbemerkt falsch sein können (Anlass war die frei erfundene McKinsey-Behauptung in `about.md`).

Eine Pillar-Seite darf diesen Rückschritt nicht machen. Sie ist ausserdem die erste Seite mit **strukturierten Blöcken** (FAQ-Paare, Cross-Link-Leiste) und mit **JSON-LD, das aus dem Inhalt folgt** statt danebenzustehen. Beides betrifft `src/data/pages/types.ts`, `to-markdown.ts` und die Markdown-Route – also die Architektur, nicht den Inhalt.

**Der Skill-Abschnitt «Workflow: Neue Pillar-Page» ist damit überholt.** Er nennt zusätzlich `Aufwände/fumu Marketing/fumu.ch/SEO-Strategie fumu.ch.md` als Content-Quelle; diese Notiz existiert nicht mehr. Beides gehört nach Abschluss dieses Plans im Vault korrigiert (Rückkanal unten).

## Akzeptanzkriterien

- Ich rufe `/ki-transformation/` auf und lese eine Seite, die dem Vier-Teile-Bauplan folgt, im bestehenden Evans-Raster.
- Ich rufe `/ki-transformation.md` auf und finde denselben sichtbaren Text – kein Satz nur in einem der beiden Kanäle.
- Die Seite erscheint in `/llms.txt` und `/llms-full.txt` und in der Sitemap.
- Ich finde die Seite über die Navigation, ohne die URL zu kennen.
- Der FAQ-Block steht sichtbar auf der Seite **und** als `FAQPage`-JSON-LD im Head, aus derselben Quelle erzeugt.
- Eine zweite Pillar kostet ein neues Modul unter `src/data/pages/` plus einen Eintrag in der Pillar-Registry – keine Änderung an Komponenten oder Routen.

## Nicht Teil dieses Plans

- Die Seiten-Copy selbst (siehe Übergabepunkt).
- Der Ausbau von `/was-wir-tun/` zur Kategorie-Seite über den Pillars – eigener Schritt, die Pillar verlinkt vorerst auf die bestehende Seite zurück.
- Die vier weiteren Pillars.
- Die Entscheidung, ob die Sub-Navigation ein sichtbares Drop-down bekommt (inhaltlich, gehört in den Vault; dieser Plan baut die minimale Variante, siehe Schritte).

## Technische Eckpunkte

**Kein neuer Seiten-Mechanismus.** Eine Pillar ist ein `PageContent`-Modul unter `src/data/pages/<slug>.ts`, gerendert von einer eigenen `.astro`-Seite, serialisiert von `to-markdown.ts`, ausgeliefert über `[slug].md.ts` und `llms-full.txt.ts`. Alles, was `was-wir-tun` heute tut – nur mit drei Ergänzungen am Schema.

**Ergänzung 1 – FAQ ohne neuen Item-Typ.** Eine `Section` mit `id: 'faq'` gilt als FAQ-Block: Ihre `item`-Einträge tragen die Frage in `title` und die Antwort in `body`. Daraus entsteht beides – das sichtbare Markup und das `FAQPage`-JSON-LD. Kein zweiter Ort, an dem Fragen gepflegt werden.

Hinweis zum Nutzen, damit später niemand Aufwand hineinsteckt, der nicht zurückkommt: Google hat das FAQ-Rich-Result am 2026-05-07 abgeschaltet, und der eigene AI-Optimization-Guide sagt, für generative Antworten sei kein besonderes Schema nötig. Das Markup bleibt trotzdem drin – es kostet beim Bau fast nichts, und was Bing und die Chat-Engines daraus lesen, ist offen. Es ist eine Mitnahme, kein Abnahme-Gate.

**Ergänzung 2 – Cross-Links auf Perspektiven.** Neues optionales Feld auf `PageContent`: `relatedPerspektiven?: string[]` (Slugs). Die Seite löst sie zur Build-Zeit gegen die `perspektiven`-Collection auf und rendert Titel plus Teaser; `to-markdown.ts` serialisiert sie als Linkliste. Slugs statt Titel, damit ein umbenannter Artikel den Build bricht statt still ins Leere zu zeigen.

**Ergänzung 3 – Pillar-Registry.** `src/data/pillars.ts` exportiert die Liste der Pillars (Slug, Kurzlabel, Reihenfolge) – Quelle für die Sub-Navigation und für die gegenseitige Verlinkung der Pillars. Analog zu `src/data/series.ts`.

**JSON-LD.** Pro Pillar ein `ProfessionalService` mit eigenem `serviceType` und `hasOfferCatalog` aus den Formaten der Seite, plus das `FAQPage` aus Ergänzung 1. Vorlage steht in `was-wir-tun.astro`; die Service-Formate dort sind die Gesamtliste, eine Pillar führt nur ihre eigenen.

**Navigation.** Die Pillars hängen unter «Was wir tun». Minimale Variante zuerst: Die Pillar-Registry rendert eine Liste auf `/was-wir-tun/` und eine Geschwister-Leiste am Fuss jeder Pillar-Seite. Kein Drop-down im Header, solange nur eine Seite existiert – der Header-Eingriff lohnt erst, wenn mehrere live sind.

**Slug: `ki-transformation`** (bestätigt 2026-08-21, nah am Suchintent «KI-Transformation Unternehmen»). Der frühere Skill-Eintrag `kuenstliche-intelligenz` stammte aus dem alten Säulen-Schnitt und ist inzwischen aus `/fumu-web` entfernt.

**Was der Plan nicht anfasst:** `datenschutz` und `impressum` (rendern weiter aus `entry.body`), `ai-crawler-radar` (Live-Daten, eigene Markdown-Route).

## Übergabepunkt: die Seiten-Copy

Die Copy für Pillar 1 steht im Vault und ist gegengelesen: `/Users/jochen.witte/Data/Akasha/Aufwände/fumu Marketing/fumu.ch/Pillar - KI-Transformation.md`. Jochen liest sie parallel zum Bau ein letztes Mal, Änderungen sind danach Kleinigkeiten im Wortlaut. Der Vault ist die Quelle: Vor dem lokalen Review die Copy im Modul gegen den dann aktuellen Stand der Notiz abgleichen. Trägt eine Formulierung im Raster nicht, wird sie zurückgegeben, nicht im Repo umgeschrieben.

Was die Notiz enthält und wie es ins Modul geht:

- **Seitenrahmen:** Title-Tag, Meta-Description und die Labels der Abschnitte für die Coral-Spalte. Die Labels sind noch ein Vorschlag, den Jochen beim Lesen prüft.
- **Teil 1:** H1 und drei Lead-Absätze. Der H1 ist länger als der Title-Tag («KI-Transformation»), das Modul braucht deshalb ein eigenes Feld für den H1 neben `title`. `intro` ist heute ein einzelner String und muss die drei Absätze tragen, ohne den Lead zu kürzen.
- **Teil 2 bis 4:** je eine Section mit dem Label aus dem Seitenrahmen. Die Absätze sind Fliesstext mit Inline-Links (`Rich`). In Teil 4 ist jedes Format ein Item mit dem Format-Namen als Titel und der Dauer, danach ein Absatz mit dem Kontakt-Weg (Link auf `/kontakt/`).
- **FAQ:** sieben Paare, Section mit `id: 'faq'` (Ergänzung 1).
- **Cross-Links:** zwei sind Inline-Links in Teil 2, vier gehen als `relatedPerspektiven` in die Leiste (`bring-your-own-agent`, `wer-bildet-noch-aus`, `wenn-maschinen-einkaufen`, `ende-der-billigen-kampagne`).
- Nicht publiziert werden die Bauplan-Überschriften («## 1. Suchfrage einfangen» usw.), die Labels «**H1:**» und «**Lead:**», die `%%`-Marker sowie die Abschnitte «Cross-Links» und «Log».

## Schritte

- [x] `src/data/pillars.ts` anlegen (Slug `ki-transformation` steht fest)
- [x] `types.ts` erweitern: `id` auf `Section` ist vorhanden, `relatedPerspektiven` auf `PageContent` ergänzen, H1 getrennt vom `title`, `intro` mit mehreren Absätzen (bestehende Module mitziehen)
- [x] `to-markdown.ts` erweitern: FAQ-Section als Frage/Antwort-Paare, Cross-Link-Liste; Test in `to-markdown.test.ts` mitziehen
- [x] `src/data/pages/ki-transformation.ts` mit der Copy anlegen
- [x] `src/pages/ki-transformation.astro`: Evans-Raster über `EvansSection`, JSON-LD (`ProfessionalService` + `FAQPage`), Cross-Link-Auflösung gegen die Collection, Geschwister-Leiste aus der Registry
- [x] `[slug].md.ts` und `llms-full.txt.ts` um die Pillar erweitern (gleiche Stelle, an der `about`/`kontakt`/`was-wir-tun` behandelt werden)
- [x] Pillar-Liste auf `/was-wir-tun/` rendern
- [x] Copy im Modul gegen den aktuellen Stand der Vault-Notiz abgleichen
- [x] `npm run build` grün, `npx vitest run` grün
- [x] Gegenprobe: sichtbarer Text auf `/ki-transformation/`, `/ki-transformation.md` und in `/llms-full.txt` identisch
- [x] Schema via Google Rich Results Test prüfen (`ProfessionalService` muss valide sein; beim `FAQPage` genügt syntaktische Gültigkeit, ein Rich Result erscheint nicht mehr)
- [x] Lokales Review, dann Deploy nach Freigabe (freigegeben 2026-11-09)

## Entscheidungen

- **Datenmodul statt handgeschriebener Seite.** Der Skill-Workflow beschreibt den Stand vor dem 2026-08-19-Umbau. Eine Pillar mit hardcodiertem HTML hätte am ersten Tag zwei Quellen und würde den Schattentext-Fehler reproduzieren, den dieser Umbau gerade beseitigt hat.
- **FAQ als Section-Konvention statt neuem Item-Typ.** Ein eigener `faq`-Typ wäre sauberer im Schema und teurer in `to-markdown.ts`, `EvansSection.astro` und im Test. Die `id`-Konvention nutzt, was schon da ist.
- **Cross-Links über Slugs.** Ein Tippfehler bricht den Build, statt still auf eine 404 zu zeigen.
- **Eine Pillar zuerst, dann die anderen vier.** Dasselbe Vorgehen wie beim Vorgänger-Plan: Das Muster entsteht an einem Fall und wird erst danach vervielfacht.
- **Kein Header-Drop-down in diesem Schritt.** Eine Sub-Navigation für einen einzigen Eintrag ist Aufwand ohne Nutzen; die Entscheidung darüber steht im Vault noch offen.

## Rückkanal

Ergebnis und Abweichungen zurück in die Vault-Story «Pillar 1 und Kategorie-Seite live auf fumu.ch» (Log-Eintrag, Plan-Tasks). Zusätzlich im Vault zu korrigieren, sobald dieser Plan durch ist:

- `.claude/skills/fumu-web/SKILL.md` > «Workflow: Neue Pillar-Page» – beschreibt handgeschriebenes HTML und nennt mit `SEO-Strategie fumu.ch.md` eine Notiz, die es nicht mehr gibt.
- Die Live-URL gehört nach dem Deploy als `url:` in die Vault-Notiz zurück (Post-Deploy-Checklist des Skills).

Fällt beim Bau auf, dass die Copy nicht trägt – zu lang, zu kurz, falscher Ton für die Suchintention: nicht im Repo umschreiben, sondern zurückgeben. Der Vault ist die Quelle.
