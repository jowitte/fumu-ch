# Riss an Sockelkante und Knöpfen – Entwurf

Stand: 2026-11-23 · Status: freigegeben von Jochen am 2026-11-23, samt den vier Entscheiden unten · Bezug: Redesign «Mischung 4» (`docs/plans/2026-11-22-neues-design-entwurf.md`), live seit `ead9782`. Referenz-Mockup: `docs/plans/assets/2026-11-23-riss/kante-und-knopf.html` (im Browser öffnen, Abschnitt D), Bild der gewählten Variante: `riss-gewaehlt.png`.

## Absicht

Nach dem Go-live wirken zwei Stellen zu «zackig» und damit digital neben den Bleistiftbildern: die Oberkante des Pflaumensockels (gleichmässige Zacken aus `tornEdge`) und die Knöpfe (Papier-Ecken `--radius-cut`). Jochen hat in zwei Mockup-Runden gewählt: **D – echt gerissen**. Ein feiner, unregelmässiger Riss in allen Grössenordnungen, mit hellem Faserrand nur an einzelnen Stellen. Sein Urteil: wirkt natürlicher als ein von Hand geschnittener Bogen (Variante C).

## Ziele, Nicht-Ziele, Anti-Ziele

**Ziele**

- Die Oberkante des Sockels auf jeder Seite wird zum feinen Riss mit stellenweise hellem Faserrand, wenigen kurzen Fasern und einem weichen Schatten zur weissen Seite hin (Papier liegt auf Papier).
- Alle Knöpfe – `.btn` (Kopfzeile, Startseite, Abschluss im Sockel) und der Knopf «Anmelden» im Newsletter-Formular – werden zu ausgerissenen Streifen: oben und unten feiner Riss, die Seiten leicht unregelmässig, oben ein stellenweise heller Faserrand, Schatten wie heute.
- Die Papierkante im Standard-OG-Bild (`scripts/brand-assets.mjs`) zieht mit, damit sie dieselbe Kante zeigt.

**Nicht-Ziele**

- Die Papierformen hinter den Bildern (`--torn-1…3`, Startbild, Illustrationen und Loop-Videos) bleiben, wie sie sind. Entscheid Jochen am 23.11.: Der feine Rand direkt neben den Bleistiftlinien macht die Bilder unruhig.
- Karten, Blätter, Thema-Streifen und die übrigen Flächen mit `--radius-cut` bleiben.
- Die PDF-Vorlagen sind nicht Teil dieses Plans. Die Session «fumu-brand-angleichen» hat den Riss dort am 23.11. nach derselben Rezeptur gebaut (`.claude/lib/publish/scripts/papierriss.py` im Akasha-Vault, Branch fumu-vorlagen); ihre Startwerte und Zufallsfunktion treffen das Mockup exakt. Site und PDF nutzen dieselbe Rezeptur und dieselbe Zufallsfunktion (mulberry32 wie in `torn-paper.ts`). Weil die Sockelkante nahtlos kachelbar sein muss (Entscheid 2), ist der Riss der Site im Detail nicht identisch mit dem PDF-Streifen, im Charakter aber gleich.

**Anti-Ziele** – verfehlt, auch wenn es funktioniert, wenn:

- ein Effekt gleichmässig über die ganze Länge liegt. Schraffur (A), Pinselstreifen (B) und Gouache (E) wurden genau deshalb als künstlich verworfen.
- der Riss gestreckt aussieht, weil eine Form auf die Breite gezogen wird.
- die Schrift im Knopf schlechter lesbar wird oder der Knopf seinen Fokusring verliert.

## Ansätze

| Ansatz | Kern | Ergebnis |
|---|---|---|
| **Kacheln beim Build, als Maske bzw. Hintergrund** | Ein nahtlos kachelbares Stück Riss als SVG, deterministisch erzeugt wie `torn-paper.ts`, als Data-URI im generierten `torn-paper.css`. Sockel: Kachel wiederholt sich über die Breite. Knopf: Fläche in ein Pseudo-Element, zugeschnitten durch Masken aus Riss-Streifen oben, unten und an den Seiten; Schatten per `drop-shadow` am Knopf selbst. | **gewählt** – passt auf jede Breite ohne Strecken, kein Client-JS, ein gecachtes Stylesheet |
| SVG pro Element im Markup | Pfad beim Build für jedes Element erzeugen | verworfen: Breite von Fenster und Knopf steht erst im Browser fest |
| Zeichnen im Browser (Script) | Pfad zur Laufzeit messen und erzeugen | verworfen: widerspricht der Linie ohne Client-JS, flackert beim Laden |
| Eine Form, auf die Breite gestreckt | ein SVG mit `preserveAspectRatio="none"` | verworfen: der feine Riss verzerrt sich (Anti-Ziel) |

## Rezeptur (aus dem Mockup, Variante D)

- Wertrauschen mit weicher Interpolation (s = t²(3−2t)), Stützwerte aus mulberry32 in [−1, 1], als fbm gestapelt.
- **Riss:** e(x) = Basis + 9 px · fbm(x / 220), 8 Oktaven, Gain 0.56. Punkte alle 1.5 px, als Polylinie (nicht geglättet).
- **Faserrand:** zweite Fläche hinter der Hauptfläche, um max(0, 2.6 · fbm₂(x / 55) + 0.4) px nach aussen versetzt (fbm₂: 6 Oktaven, Gain 0.6), im Faserton.
- **Fasern:** rund 55 pro 1100 px, Länge 1–3.6 px, Strich 0.3–0.6 px, Deckkraft 0.25–0.6, nach aussen (±60°), leicht gekrümmt, im Faserton.
- **Knopf:** Riss oben und unten mit 3 px · fbm(x / 60), 7 Oktaven, Gain 0.55; Seiten nur leicht unregelmässig (±1.5 px); Faserrand oben um max(0, 1.8 · fbm(x / 25) + 0.3) px.
- **Schatten:** Sockelkante zur weissen Seite: 0 −1 px 0 rgb(43 26 39 / .10), 0 −5 px 7 px rgb(43 26 39 / .12). Knopf: wie heute (`--shadow-layer` als `drop-shadow`).
- **Startwerte im Mockup:** Riss 21, Faserrand 33, Fasern 5.

## Entscheide in diesem Entwurf

Vorschläge aus der Session, zur Freigabe mit diesem Dokument:

1. **Faserton** = Pflaume bzw. Coral, gemischt mit 37 % Weiss, berechnet aus den Tokens (keine neue Grundfarbe; Regel 5 des Redesigns bleibt). Gleicher Wert wie in den PDF-Vorlagen (Pflaume → #897484).
2. **Nahtlos kachelbar:** Das Rauschen wird periodisch über die Kachelbreite gebaut (Frequenzfaktor genau 2 statt 2.03), damit sich die Sockelkante ohne Naht wiederholt. Das sieht nicht anders aus als im Mockup.
3. Die alte Funktion `tornEdge` entfällt, `--torn-edge` wird durch die neue Kante ersetzt; `--torn-1…3` bleiben.
4. Der Fokusring der Knöpfe bleibt der heutige `outline` um das Rechteck; er folgt nicht dem Riss.

## Verifikation

`npm run build` und `npx vitest run` grün; Tests für Determinismus und Nahtlosigkeit der Kachel; Sichtprüfung Desktop und 400 px (Sockel auf mehreren Seiten, alle Knöpfe, Formular, Safari); Text- und Markdown-Vergleich unverändert; Lokal-Review mit Jochen, Push nur auf seine Ansage.
