"""Mischung 4: weiss oben (Bleistift auf gerissenem Papier), Pflaume unten."""
import math
import pathlib
import random
import sys

c = pathlib.Path(sys.argv[1])


def torn(seed, cx, cy, rx, ry, n=90, jitter=0.035):
    """Polygon für clip-path: unregelmässige Ellipse mit gerissener Kante."""
    rnd = random.Random(seed)
    pts = []
    wobble = [rnd.uniform(-0.08, 0.08) for _ in range(7)]
    for i in range(n):
        t = 2 * math.pi * i / n
        # grosse Wellen (Form) plus feines Zittern (Riss)
        r = 1 + sum(w * math.sin((k + 2) * t + k) for k, w in enumerate(wobble))
        r += rnd.uniform(-jitter, jitter)
        x = cx + rx * r * math.cos(t)
        y = cy + ry * r * math.sin(t)
        pts.append(f'{x:.1f}% {y:.1f}%')
    return 'polygon(' + ', '.join(pts) + ')'


rose = torn(7, 52, 52, 47, 44)
safran = torn(11, 50, 50, 46, 45, n=70, jitter=0.05)

html = f'''<!DOCTYPE html>
<html lang="de-CH">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>fumu · Mischung 4 – Weiss oben, Pflaume unten</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  /* Mischung 4: Basis aus C, Bleistift aus A. Oben weisses Papier, damit
     Bleistiftbilder und die Loop-Videos mit weissem Grund nahtlos stehen.
     Die Pflaume trägt unten als Sockel: Zitat, Perspektiven, Abschluss, Fuss. */
  :root {{
    --white: #FFFFFF;
    --plum: #43233B;
    --plum-soft: #6B4A63;
    --plum-line: rgb(243 217 196 / .22);
    --coral: #C44540;
    --saffron: #E9A23B;
    --blush: #F3D9C4;
    --blush-light: #F8EADF;
    --ink: #2B1A27;
    --serif: 'Instrument Serif', Georgia, serif;
    --sans: 'Instrument Sans', system-ui, sans-serif;
    --wrap: 1200px;
    --cut: 22px 8px 26px 10px / 10px 24px 8px 20px;
    --layer: 0 1px 0 rgb(0 0 0 / .06), 0 14px 24px -18px rgb(43 26 39 / .5);
  }}
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{ background: var(--white); color: var(--ink); font: 400 17px/1.6 var(--sans); -webkit-font-smoothing: antialiased; }}
  a {{ color: inherit; text-decoration: none; }}
  .wrap {{ max-width: var(--wrap); margin: 0 auto; padding: 0 40px; }}

  header .wrap {{ display: flex; align-items: center; justify-content: space-between; height: 88px; }}
  .logo {{ font: 400 40px/1 var(--serif); color: var(--plum); letter-spacing: -0.01em; }}
  .logo span {{ color: var(--coral); }}
  nav {{ display: flex; align-items: center; gap: 34px; font: 500 15px/1 var(--sans); color: var(--plum); }}
  nav a:not(.btn):hover {{ color: var(--coral); }}
  .btn {{ display: inline-block; background: var(--coral); color: #fff; font: 600 15px/1 var(--sans); padding: 15px 24px; border-radius: var(--cut); box-shadow: var(--layer); }}
  .btn:hover {{ background: #B23C37; }}
  nav .btn {{ padding: 12px 18px; }}

  .hero .wrap {{ display: grid; grid-template-columns: 1fr 1.15fr; gap: 24px; align-items: center; padding-top: 24px; padding-bottom: 88px; }}
  h1 {{ font: 400 96px/0.98 var(--serif); letter-spacing: -0.02em; color: var(--plum); }}
  .lead {{ font-size: 19px; line-height: 1.55; color: var(--plum-soft); margin: 30px 0 36px; max-width: 29em; }}
  .cta-row {{ display: flex; align-items: center; gap: 22px; flex-wrap: wrap; }}
  .cta-note {{ font-size: 14px; color: var(--plum-soft); }}

  /* Bleistift auf gerissenem Papier: zwei Papierformen in CSS, darüber die
     Zeichnung mit multiply – ihr Weiss wird durchsichtig, die Striche
     liegen auf dem Papier. Funktioniert mit jedem Bild auf weissem Grund. */
  .collage {{ position: relative; aspect-ratio: 1200 / 896; }}
  .collage .papier {{ position: absolute; box-shadow: var(--layer); }}
  .collage .rose {{ inset: 4% 2% 8% 6%; background: var(--blush); clip-path: {rose}; }}
  .collage .safran {{ width: 30%; aspect-ratio: 1; right: 4%; top: 10%; background: var(--saffron); clip-path: {safran}; }}
  .collage img {{ position: relative; width: 100%; height: auto; display: block; mix-blend-mode: multiply; }}

  section {{ padding: 80px 0; }}
  .sec-head {{ display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 36px; }}
  h2 {{ font: 400 60px/1 var(--serif); letter-spacing: -0.015em; color: var(--plum); }}
  .sec-link {{ font-weight: 600; font-size: 15px; color: var(--coral); text-decoration: underline; text-underline-offset: 5px; text-decoration-thickness: 2px; }}

  .themen {{ display: grid; grid-template-columns: 1fr 1fr; gap: 28px; margin-bottom: 28px; }}
  .thema {{ position: relative; padding: 40px 40px 44px; border-radius: var(--cut); box-shadow: var(--layer); min-height: 300px; display: flex; flex-direction: column; overflow: hidden; }}
  .thema.coral {{ background: var(--coral); color: #fff; }}
  .thema.safran {{ background: var(--saffron); color: var(--ink); }}
  .thema::after {{ content: ''; position: absolute; right: -30px; top: -30px; width: 150px; height: 150px; border-radius: 60% 40% 55% 45% / 50% 60% 40% 50%; box-shadow: var(--layer); }}
  .thema.coral::after {{ background: var(--saffron); }}
  .thema.safran::after {{ background: var(--blush); }}
  .kind {{ font: 600 13px/1 var(--sans); letter-spacing: .06em; text-transform: uppercase; opacity: .85; }}
  .thema h3 {{ font: 400 52px/1 var(--serif); letter-spacing: -0.01em; margin: 18px 0 14px; max-width: 9em; position: relative; z-index: 1; }}
  .thema p {{ font-size: 17px; max-width: 26em; }}
  .thema .more {{ margin-top: auto; padding-top: 26px; font-weight: 600; font-size: 15px; text-decoration: underline; text-underline-offset: 5px; }}

  .formate {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }}
  .format {{ padding: 32px 30px 34px; border-radius: var(--cut); background: var(--blush-light); box-shadow: var(--layer); }}
  .dauer {{ font: italic 400 26px/1 var(--serif); color: var(--coral); }}
  .format h3 {{ font: 400 34px/1.05 var(--serif); margin: 14px 0 10px; color: var(--plum); }}
  .format p {{ font-size: 15.5px; color: var(--plum-soft); }}

  /* Sockel in Pflaume: alles ab hier. Die obere Kante ist gerissen. */
  .sockel {{ position: relative; background: var(--plum); color: var(--blush); margin-top: 40px; padding-top: 40px; }}
  .sockel::before {{ content: ''; position: absolute; left: 0; right: 0; top: -22px; height: 24px; background: var(--plum);
    clip-path: polygon(0 60%, 4% 40%, 9% 55%, 14% 35%, 19% 52%, 25% 30%, 31% 50%, 36% 38%, 42% 58%, 48% 34%, 54% 52%, 60% 36%, 66% 56%, 72% 32%, 78% 50%, 84% 38%, 90% 56%, 95% 40%, 100% 50%, 100% 100%, 0 100%); }}
  .zitat .wrap {{ display: grid; grid-template-columns: 120px 1fr; gap: 24px; align-items: start; }}
  .zitat .mark {{ width: 110px; height: 110px; background: var(--saffron); border-radius: 55% 45% 50% 50% / 45% 55% 45% 55%; display: grid; place-items: center; font: 400 90px/1 var(--serif); color: var(--plum); padding-top: 30px; }}
  .zitat blockquote {{ font: italic 400 46px/1.15 var(--serif); letter-spacing: -0.01em; max-width: 20em; color: #fff; }}
  .zitat cite {{ display: block; margin-top: 20px; font: 500 15px/1.4 var(--sans); font-style: normal; color: var(--blush); }}

  .sockel h2 {{ color: #fff; }}
  .perspektiven ul {{ list-style: none; display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }}
  .perspektiven li a {{ display: block; background: var(--white); color: var(--ink); padding: 28px 28px 32px; border-radius: var(--cut); box-shadow: 0 18px 30px -20px rgb(0 0 0 / .7); height: 100%; }}
  .perspektiven li:nth-child(1) a {{ transform: rotate(-0.8deg); }}
  .perspektiven li:nth-child(3) a {{ transform: rotate(0.7deg); }}
  .perspektiven .datum {{ font: 600 13px/1 var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--coral); }}
  .perspektiven h3 {{ font: 400 32px/1.05 var(--serif); margin: 14px 0 10px; color: var(--plum); }}
  .perspektiven li a:hover h3 {{ text-decoration: underline; text-decoration-color: var(--coral); text-underline-offset: 5px; text-decoration-thickness: 2px; }}
  .perspektiven p {{ color: var(--plum-soft); font-size: 15.5px; }}
  .sockel .sec-link {{ color: var(--saffron); }}

  .abschluss .wrap {{ display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; border-top: 1px solid var(--plum-line); padding-top: 64px; }}
  .abschluss h2 {{ font-size: 56px; max-width: 12em; }}
  .abschluss p {{ color: var(--blush); margin-top: 10px; }}

  footer {{ padding: 32px 0 48px; font-size: 14px; color: var(--blush); }}
  footer .wrap {{ display: flex; justify-content: space-between; gap: 24px; flex-wrap: wrap; border-top: 1px solid var(--plum-line); padding-top: 28px; }}
  footer nav {{ gap: 24px; font-size: 14px; font-weight: 400; color: var(--blush); }}

  .back {{ position: fixed; left: 16px; bottom: 16px; z-index: 20; background: #fff; border: 1px solid #ccc; font: 12px/1 system-ui; padding: 8px 10px; color: #555; }}

  @media (max-width: 860px) {{
    .wrap {{ padding: 0 20px; }}
    nav a:not(.btn) {{ display: none; }}
    .hero .wrap, .themen, .formate, .perspektiven ul {{ grid-template-columns: 1fr; }}
    h1 {{ font-size: 58px; }}
    h2, .abschluss h2 {{ font-size: 44px; }}
    .thema h3 {{ font-size: 40px; }}
    .zitat .wrap {{ grid-template-columns: 1fr; }}
    .zitat blockquote {{ font-size: 32px; }}
  }}
</style>
</head>
<body>
<header>
  <div class="wrap">
    <a class="logo" href="#">fumu<span>.</span></a>
    <nav>
      <a href="#">Was wir tun</a>
      <a href="#">Perspektiven</a>
      <a href="#">Über fumu</a>
      <a class="btn" href="#">Termin vereinbaren</a>
    </nav>
  </div>
</header>

<section class="hero" style="padding:0">
  <div class="wrap">
    <div>
      <h1>Technologie in Wirkung übersetzen.</h1>
      <p class="lead">Beratung für KI-Transformation in Medien, Marketing und Werbung. Man holt uns, wenn aus einem Verkaufsgeschäft ein Produktgeschäft werden soll und die Richtung davon abhängt, was technisch geht und sich rechnet.</p>
      <div class="cta-row">
        <a class="btn" href="#">Termin vereinbaren</a>
        <span class="cta-note">25 Minuten Kennenlernen. Kein Pitch.</span>
      </div>
    </div>
    <figure class="collage">
      <div class="papier rose"></div>
      <div class="papier safran"></div>
      <img src="hero-a.jpg" alt="Drei Menschen über einem grossen Blatt: Einer zeichnet einen klaren Weg durch ein Gewirr von Linien.">
    </figure>
  </div>
</section>

<section style="padding-top:24px">
  <div class="wrap">
    <div class="sec-head">
      <h2>Was wir tun</h2>
      <a class="sec-link" href="#">Alle Leistungen</a>
    </div>
    <div class="themen">
      <a class="thema coral" href="#">
        <span class="kind">Thema</span>
        <h3>KI-Transformation</h3>
        <p>Pilotprojekte laufen, in der Erfolgsrechnung taucht davon wenig auf. Woran das liegt und welche drei Fragen zusammen zu klären sind.</p>
        <span class="more">Zur Leistung</span>
      </a>
      <a class="thema safran" href="#">
        <span class="kind">Thema</span>
        <h3>Medien, Werbung und AdTech</h3>
        <p>Retail Media aufbauen, agentic buchbar werden, eigene Daten in Werbung aktivieren.</p>
        <span class="more">Zur Leistung</span>
      </a>
    </div>
    <div class="formate">
      <div class="format">
        <span class="dauer">8–16 Wochen</span>
        <h3>Strategische Begleitung</h3>
        <p>Von der ersten Hypothese bis zur boardreifen Empfehlung.</p>
      </div>
      <div class="format">
        <span class="dauer">6–18 Monate</span>
        <h3>Interim Leadership</h3>
        <p>Verantwortung auf Zeit: Strukturen aufbauen, Teams befähigen, Ergebnisse liefern.</p>
      </div>
      <div class="format">
        <span class="dauer">1–5 Tage</span>
        <h3>KI-Schulungen</h3>
        <p>Praxisnahe Befähigung für Teams und Führungskräfte.</p>
      </div>
    </div>
  </div>
</section>

<div class="sockel">
  <section class="zitat">
    <div class="wrap">
      <div class="mark">«</div>
      <div>
        <blockquote>In einer Allianz von vier Medienhäusern ist er der Externe, dem alle vertrauen.</blockquote>
        <cite>Silvano Oeschger, ehem. CEO OneLog AG</cite>
      </div>
    </div>
  </section>

  <section class="perspektiven" style="padding-top:24px">
    <div class="wrap">
      <div class="sec-head">
        <h2>Perspektiven</h2>
        <a class="sec-link" href="#">Alle Perspektiven</a>
      </div>
      <ul>
        <li><a href="#"><span class="datum">1. Nov. 2026</span><h3>Wer bildet noch aus</h3><p>KI verkürzt die Zeit, bis ein Junior Output liefert, kaum aber die, bis er Urteilsfähigkeit hat.</p></a></li>
        <li><a href="#"><span class="datum">23. Sept. 2026</span><h3>Wenn Maschinen einkaufen</h3><p>Retail Media überschreitet dieses Jahr 200 Milliarden Dollar und zieht an der Fernsehwerbung vorbei.</p></a></li>
        <li><a href="#"><span class="datum">22. Sept. 2026</span><h3>Bring your own Agent</h3><p>78 Prozent der Wissensarbeiter bringen eigene KI-Werkzeuge mit. Wem gehört das Wissen?</p></a></li>
      </ul>
    </div>
  </section>

  <section class="abschluss" style="padding-top:8px">
    <div class="wrap">
      <div>
        <h2>25 Minuten Kennenlernen</h2>
        <p>Kein Pitch, kein Verkaufsgespräch – wir schauen gemeinsam, ob und wie wir helfen können.</p>
      </div>
      <a class="btn" href="#">Termin vereinbaren</a>
    </div>
  </section>

  <footer>
    <div class="wrap">
      <span>© 2026 fumu GmbH, Zürich</span>
      <nav><a href="#">Impressum</a><a href="#">Datenschutz</a><a href="#">hello@fumu.ch</a></nav>
    </div>
  </footer>
</div>
<a class="back" href="/">← Übersicht</a>
</body>
</html>
'''
(c / 'mischung-4.html').write_text(html)
print('ok')
