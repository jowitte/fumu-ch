# Über fumu grafisch – Entwurf

Stand: 2026-11-24 · Status: Variante B von Jochen am Mockup gewählt (24.11.), die Textfragen 1 bis 3 entschieden, Frage 4 bewusst offen gelassen · Entstanden in der Session ueber-fumu-grafisch (Ableger der Vault-Session was-wir-tun-diagramm). Umsetzungsplan: `docs/plans/2026-11-24-ueber-fumu-grafisch-umsetzung.md`. Bezug im Vault: Folder Note «fumu.ch», Task «`/about/` («Über fumu») grafisch ausbauen wie `/was-wir-tun/`».

Screenshots und Mockup-Quelle liegen unter `docs/plans/assets/2026-11-24-ueber-fumu-grafisch/`:

- `heute.png` – die Seite, wie sie am 24.11. live war
- `b-stimme.png`, `b-mobil.png` – die gewählte Variante, Desktop (1280 px) und mobil (400 px)
- `a-portraet.png`, `c-gesichter.png` – die beiden nicht gewählten Varianten
- `mockup/AboutMockup.astro` – die Wegwerf-Skizze aller drei Varianten, die im Worktree `.claude/worktrees/ueber-fumu-grafisch` lief. Massstab für Aufbau, Grössen und Wirkung, nicht für Code.

## Absicht

`/about/` ist die letzte Hauptseite, die noch ganz über `Sektion.astro` in der Spalte von 760 px rendert. Startseite und `/was-wir-tun/` sind seit dem 23.11. als Seiten gesetzt, `/about/` sieht daneben aus wie ein Dokument:

- Die rechten 40 Prozent des Containers bleiben von oben bis unten leer.
- Die vier Porträts sind kleine runde Fotos am Rand des Texts, das Gesicht des Gründers ist so gross wie das jedes Partners.
- Die beiden Kundenzitate stehen als lange kursive Blöcke mitten in der Spalte, eines davon zwischen Gründer und Netzwerk.
- Die vier Arbeitsprinzipien stehen als Liste untereinander, jedes mit Titel und einem Satz.

Ziel wie bei `/was-wir-tun/`: dieselben Texte, aber als Seite gesetzt statt als Dokument, im Muster der Schwesterseite.

## Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**

- Der Kopf ist gebaut wie der Kopf von `/was-wir-tun/`: links Titel und Lead, rechts eine Karte in Rosé-hell. Auf der Karte steht hier statt eines Diagramms die Stimme eines Kunden.
- Die Seite nutzt die volle Containerbreite (1200 px).
- Porträts stehen auf gerissenem Papier wie die Bilder der Startseite, der Gründer gross, das Netzwerk in einer Reihe.
- Jedes der beiden Zitate steht einmal, an einem eigenen Ort: eines im Kopf, eines im Sockel.

**Nicht-Ziele**

- Wortlaut, Reihenfolge der Sektionen und Auswahl der Inhalte bleiben (Vault-Sache). Ausnahme sind die zwei Textänderungen, die Jochen am 24.11. entschieden hat (Entscheide 2 und 3).
- Markdown-Zwilling, `llms-full.txt` und JSON-LD bleiben bis auf diese zwei Textänderungen unverändert. Die Zitate stehen im Markdown weiter unter «Gründer» und «Wie wir arbeiten».
- Wo die Formate künftig leben, entscheidet die Story «Serviceangebote auf fumu.ch abbilden» (Entscheid 5).
- Die Profilseite für Jochen mit dem Link «Mehr über Jochen →» ist eine eigene Story («fumu.ch Profilseite Jochen»). Der Entwurf lässt ihr rechts neben Jochens Text Platz, baut den Link aber nicht.

**Anti-Ziele** – verfehlt, auch wenn alles funktioniert, wenn:

- die Seite zum Kartenbaukasten wird. Karten tragen nur das Kopfzitat und die Formate; Personen und Prinzipien stehen auf Weiss.
- die Fotos wie ausgeschnittene Kleckse wirken. Die grossen Wellen von `--torn-*` sind für Illustrationen gemacht, auf Gesichtern wirken sie wie Tintenflecke (im Mockup ausprobiert und verworfen).
- eine grosse Coral-Fläche dazukommt. Die Seite hat keine; Coral steht nur auf Links und der Dauer der Formate.

## Ansätze

Drei ganze Seiten wurden gebaut, alle mit denselben Bausteinen (Porträts auf Papier, volle Breite, Netzwerk in drei Spalten, ein Zitat im Sockel):

| Variante | Kern | Ergebnis |
|---|---|---|
| A «Porträt» | Kopf wie die Startseite mit Jochens Foto gross auf Papier; Oeschger neben dem Gründer-Text; Prinzipien 2 × 2; Formate zu viert in einer Reihe; Schoch/Wehrle im Sockel | nicht gewählt: Die Seite hängt am Gesicht des Gründers; käme die Profilseite, müsste der Kopf umgebaut werden. Formate zu viert werden mit rund 25 Zeichen pro Zeile zu schmal |
| **B «Stimme»** | Kopf wie `/was-wir-tun/`, das Oeschger-Zitat auf einer Rosé-hell-Karte; darunter der Gründer gross mit Foto; Prinzipien in vier Spalten; Formate 2 × 2; Schoch/Wehrle im Sockel | **gewählt** (Jochen, 24.11.: «B finde ich ganz cool») |
| C «Gesichter» | Kopf ohne Bild; alle vier Personen gleich gross in einer Reihe; Schoch/Wehrle neben den Prinzipien; Oeschger im Sockel | nicht gewählt: Stellt das Netzwerk gleich gross neben den Gründer und sagt damit mehr, als die Seite behauptet |

Warum B: Der Kopf folgt dem Muster der Schwesterseite, wie es der Auftrag verlangt. Ein Kunde spricht, bevor fumu sich selbst beschreibt. Und kommt die Profilseite, wird nur der Gründer-Block kleiner, der Kopf bleibt.

Einwand gegen B, bewusst in Kauf genommen: Das Netzwerk beginnt erst auf der zweiten Bildschirmhöhe, nach Kopfzitat und grossem Gründer-Block. Und im Kopf liest man «begleitet uns Jochen», bevor man Jochen gesehen hat; sein Foto folgt direkt darunter.

## Der Entwurf, Abschnitt für Abschnitt

Massstab sind `b-stimme.png` und `b-mobil.png`; die Werte stehen im Mockup unter `variante-b`. Farben, Schriften und Formen nach dem Design-Entwurf vom 22.11. (Tokens in `global.css`).

**1. Kopf.** Raster wie auf `/was-wir-tun/`: zwei Spalten (`0.9fr` / `1.1fr`), vertikal mittig, Abstand 56 px. Links H1 «Über fumu» (76 px) und der Lead (19 px, Pflaume-soft, höchstens 30em breit). Rechts eine `Karte` in Rosé-hell (Innenabstand 34 / 40 / 36 px) mit dem Oeschger-Zitat:

- oben ein Safran-Fleck mit «, 64 px, wie der Fleck im Sockel, nur kleiner
- das Zitat in Serif kursiv, 25 px, Pflaume, ohne Anführungszeichen (die trägt der Fleck)
- die Quelle in Sans, 14 px, Pflaume-soft

Der Fleck ist die einzige Safran-Fläche auf der ersten Bildschirmhöhe; die nächste steht im Sockel (Regel 2).

**Porträt** (gilt für alle vier Personen). Zwei Ebenen in einem quadratischen Rahmen:

- hinten ein Stück Papier in Rosé (`--color-blush`, Form `--torn-2`), leicht nach rechts unten versetzt (im Mockup `inset: 7% -5% -3% 9%`)
- vorn das Foto, beschnitten auf eine fast runde Form mit feinem Riss: dieselbe Rechnung wie `tornPolygon`, aber mit fünf flachen Wellen (± 3 Prozent) statt sieben grosser (± 8 Prozent) und feinem Zittern (± 1,2 Prozent)
- das Foto in Graustufen auf Rosé-hell mit `mix-blend-mode: multiply`: Weiss und Grautöne werden warm, alle vier Fotos sehen aus wie aus einer Serie, auch wenn sie es nicht sind

**2. Gründer.** H2 «Gründer» (44 px). Darunter ein Raster aus Porträt (360 px) und Text, Abstand 64 px, vertikal mittig. Name als H3 in Serif 44 px, Etikett in Versalien 13 px (Pflaume-soft), Text 19 px, darunter der Link «LinkedIn» (15 px, 600, Coral auf Weiss). Der Anker `jochen-witte` bleibt (Autorenlinks führen auf `/about/#jochen-witte`).

**3. Netzwerk.** H2 «Netzwerk». Drei Spalten, Abstand 48 / 56 px. Pro Person: Porträt 200 px, Name als H3 in Serif 30 px, Etikett, Text 16 px, Link. Die Anker `stefan-ropte`, `lukas-goeroeg`, `daniel-tschudi` bleiben.

**4. Wie wir arbeiten.** H2 wie oben. Die vier Prinzipien in vier Spalten (Abstand 40 px), jedes mit einer Haarlinie in Rosé oben, Titel als H3 in Serif 28 px, Text 17 px. Keine Karten, keine Icons, keine Nummern. Das Zitat von Schoch und Wehrle steht nicht hier.

**5. Typische Formate.** H2 wie oben. Die vier Formate als Karten in Rosé-hell, 2 × 2 über die volle Breite, Abstand 24 px. Dauer in Serif kursiv 26 px Coral (Regel 3: auf Rosé-hell erst ab 24 px), Titel als H3 in Serif 34 px, Text 15,5 px Pflaume-soft.

**6. Sockel.** Das Zitat von Bettina Schoch und Marcel Wehrle über `SockelZitat.astro`, ohne `titel`, wie auf `/was-wir-tun/`. Darauf folgen wie überall Abschluss, Newsletter und Fuss.

**Mobil (unter 860 px).** Alles einspaltig: Kopf (Titel, Lead, darunter die Zitat-Karte), Gründer-Porträt höchstens 280 px über dem Text, Netzwerk-Porträts 180 px, Prinzipien und Formate untereinander; H1 46 px, H2 36 px, Gründer-Name 36 px, Prinzip-Titel 28 px. Bei 400 px läuft nichts über (`scripts/overflow-check.mjs`; im Mockup geprüft).

## Entscheide in diesem Entwurf

Von Jochen am 2026-11-24 entschieden:

1. **Variante B.**
2. **«Digital seit 1998» statt «20+ Jahre Digital»** in Jochens Text (`about.ts`) und in der `description` des Person-JSON-LD (`about.astro`). Im Vault seit 2026-08-25 so; der offene Task dazu steht in «fumu Sprachstil definiert und ausgerollt».
3. **Etikett «Akademie KI» statt «KI Akademie»** bei Lukas Görög, wie im Format-Text und in der Domain akademie-ki.ch.
4. **Oeschger im Kopf, Schoch/Wehrle im Sockel** (Textfrage 3, folgt aus Variante B). Oeschger spricht über Jochen und steht direkt über dem Gründer, Schoch/Wehrle über die Art der Begleitung und steht unter Prinzipien und Formaten.

Vorschläge der Session, im Lokal-Review zu bestätigen:

5. **Formate bleiben, wo sie sind** (Textfrage 4). Sie stehen auch auf der Pillar-Seite; ob sie auf `/about/` bleiben, entscheidet die Story «Serviceangebote auf fumu.ch abbilden». Der Entwurf setzt sie nur neu.
6. **Eigene Porträt-Form** statt `--torn-*` (siehe Porträt oben). `tornPolygon` bekommt dafür zwei Optionen (Anzahl und Stärke der Wellen); die bestehenden `--torn-*` bleiben byte-gleich.
7. **Partner-Porträts als WebP mit 800 px.** Heute liegen sie als PNG vor: Lukas Görög 2000 px und 1,9 MB, Stefan Ropte 800 px und 320 KB, Daniel Tschudi 400 px (bleibt in seiner Grösse). 800 px reichen für 200 px Darstellung auch auf Retina. Jochens JPG (600 px, 25 KB) bleibt, weil das JSON-LD darauf zeigt; bei 360 px Darstellung ist es etwas unter doppelter Auflösung. Ein grösseres Original gibt es im Vault nicht (gesucht in `var/marken/`).

## Technische Eckpunkte

- **Ort:** Worktree `.claude/worktrees/ueber-fumu-grafisch` (Branch `worktree-ueber-fumu-grafisch`, abgezweigt bei `13845dc`). Nach dem Lokal-Review kommt der Branch nach `main`; der Push ist der Deploy und braucht Jochens Freigabe. Die Wegwerf-Seiten `about-a/b/c` und `src/mockup/` kommen nicht mit.
- **Daten (`src/data/pages/about.ts`):** Die vier Sektionen bekommen `id`s: `gruender`, `netzwerk`, `arbeit`, `formate` (die letzte gibt es schon). Das sind HTML-Anker, keine Textänderung. Dazu die zwei Textänderungen und die neuen Bildpfade (Entscheid 7).
- **Seite (`src/pages/about.astro`):** rendert die Sektionen selbst wie `was-wir-tun.astro`: `sectionsByIds(about, ['gruender', 'netzwerk', 'arbeit', 'formate'])`, dazu ein Wächter, der den Build bricht, wenn eine Sektion eine Item-Art trägt, die die Seite nicht rendert, oder wenn «Gründer» und «Wie wir arbeiten» nicht genau ein Zitat haben. `PageIntro` und `Sektion.astro` entfallen hier; `Sektion.astro` rendert weiter Kontakt und die Pillars. Das Person-JSON-LD bleibt bis auf die `description` gleich.
- **Wächter teilen:** Den Item-Wächter `nur()` aus `was-wir-tun.astro` nach `types.ts` holen (`itemsOfKinds`), damit beide Seiten denselben benutzen.
- **Porträt-Baustein (`src/components/Portraet.astro`):** Props `src`, `alt`, `form` (Startwert), `groesse`, `eager`. Die Form entsteht beim Build über `tornPolygon` und steht als `--form` im `style`-Attribut, nur auf `/about/`; `torn-paper.css` wächst nicht.
- **Alt-Texte:** wie heute der Name der Person.
- **Verifikation:** `npm run build` und `npx vitest run` grün. `scripts/text-diff.mjs` gegen einen Baseline-Build zeigt nur auf `/about/` Unterschiede, und zwar genau die Textänderung aus Entscheid 2 (fehlt «20», «Jahre»; neu «seit», «1998»). Entscheid 3 ändert die Wortmenge nicht und wird im Markdown-Zwilling geprüft. `scripts/overflow-check.mjs` ohne Befund. Ansicht Desktop und 400 px gegen die Screenshots, Autorenlink `/about/#lukas-goeroeg` springt an die richtige Stelle. Lokal-Review mit Jochen. Live erst nach seiner Freigabe.

## Rückkanal in den Vault

- Folder Note «fumu.ch»: Task «`/about/` grafisch ausbauen» abhaken, Umsetzungs-Task in den Plan, Log-Eintrag mit diesem Entwurf.
- «fumu Sprachstil definiert und ausgerollt»: den Task zu «20+ Jahre Digital» abhaken, sobald die Seite live ist.
- «fumu.ch Profilseite Jochen»: Hinweis, dass der Link «Mehr über Jochen →» rechts neben Jochens Text im Gründer-Block Platz hat.
