---
title: "Maschinen steuern die Werbemaschine"
description: "Zwei Konsortien schreiben gerade Standards für Agentic Advertising. Mainstream wird sie ignorieren – aus genau dem Grund, aus dem heute keiner mehr nach IMAP fragt."
date: 2026-05-03
category: "KI & AdTech"
image: "/images/perspektiven/maschinen-werbemaschine-hero.png"
draft: false
---

Ich gehöre zur schrumpfenden Minderheit, die Email weiterhin als offenen Standard lebt – IMAP und SMTP in einem klassischen Mail-Client, Hosting bei einem unabhängigen Provider statt einer der grossen Plattformen. Das ist zunehmend Schallplatten-Sammlung: charmant, aber nicht mehr Mainstream.

IMAP und SMTP sind nicht verschwunden. Zwischen Gmail und Outlook wird weiterhin SMTP gesprochen, IMAP kann jeder Nutzer freischalten, der will. Aber für die Mehrheit der Nutzer sind die Standards unsichtbar geworden – weil Gmail darüber proprietäre Schichten gebaut hat: Conversation View, Smart Compose, Categories, Spam-Erkennung, Inbox AI, jetzt Gemini-Integration. Outlook und Apple Mail folgen demselben Muster. Die offenen Protokolle bleiben der Minimalkonsens zwischen den grossen Playern. Sie sind nicht abgeschafft. Im Nutzer-Alltag aber sind sie ein Detail unter der Oberfläche.

Dieses Muster wiederholt sich in fast allem, was in den letzten 30 Jahren im offenen Internet gebaut wurde, im aktuellen Agentic-Advertising-Hype-Cycle nur deutlich schneller. Zwei Industrie-Koalitionen schreiben gerade Standards: **AdCP** (Ad Context Protocol) auf der einen Seite, **AAMP** (Agentic Advertising Management Protocols) auf der anderen. Beide werden technisch funktionieren. Eine wird sich auf dem Papier durchsetzen. Und beide werden im Mainstream-Markt kaum benutzt werden, weil Meta und Google bereits proprietäre Agentic-Layer in Advantage+ und Performance Max bauen und die Mehrheit der Werbetreibenden dort bleiben wird, weil es bequem ist.

Das ist kein Pessimismus, sondern Mustererkennung.

![Google und Meta als zwei separate Mega-Stores mit eigenen Welten – gegenüber drei Einzelhändler (PubMatic, Magnite, Yahoo) unter einem gemeinsamen "AdCP – Open Standard"-Banner. Die Plattformen brauchen kein Banner, weil sie ihren eigenen Standard sind.](/images/perspektiven/maschinen-werbemaschine-hero.png)

## Wer baut – und warum das ein Defensiv-Manöver ist

AdCP wurde im Oktober 2025 von **Brian O'Kelley** und **Scope3** als [Industrie-Koalition](https://www.samba.tv/press-releases/industry-coalition-launches-ad-context-protocol-adcp-open-standard-for-agentic-advertising-infrastructure) gestartet. O'Kelley ist AppNexus-Mitgründer und heute Scope3-CEO. Das gibt der Initiative Glaubwürdigkeit. Die Mitgliederliste sagt aber mehr über die Kräfteverhältnisse als jedes Manifest.

AdCP wird von der unabhängigen AdTech-Industrie getragen. Zu den Founding Members gehören Yahoo, PubMatic und Magnite (als Launch Member). Die zwei grössten unabhängigen SSPs sitzen damit beide drin, mit identischer strategischer Lage: ohne offenen Standard verschwindet ihr Geschäftsmodell-Boden. AAMP läuft umgekehrt: IAB Tech Lab als Träger, dahinter Google, Meta, die grossen DSPs und Ad Networks. Hier wird verteidigt, was unter OpenRTB bereits Marktstandard ist.

Die grossen Publisher fehlen in beiden Lagern: WBD, Disney, NBCU und News Corp sind nirgends Member. Ihr Bestandsgeschäft trägt sie auch ohne neuen Standard durch: Direktbeziehungen, Reichweite, Markenmacht. Der Druck ist nicht existenziell. Trade Desk wiederum ist Sonderfall: bei keinem von beiden. TTD will lieber Plattform sein als unabhängige AdTech, beide Lager passen nur halb. Dazu kam im März 2026 der [Publicis-Schock](https://adage.com/agencies/aa-publicis-stops-recommending-the-trade-desk-after-audit/): nach einem FirmDecisions-Audit Buchungs-Stop, die Aktie minus 33 Prozent seit Jahresbeginn. Drei der sechs grossen Holding Groups draussen; für Standards-Politik bleibt da kein Kopf.

Das Muster ist klar: **Wer die Werkzeuge baut und überleben will, braucht offene Standards.** Die Werkzeugbauer treiben die Standardsetzung. Wer eigene Scale hat (Plattformen) oder eigene Direktbeziehungen (Premium-Publisher), liefert kein Engagement. Wichtige Konsequenz für die These: AdCP ist kein Markt-Sieger-Signal, AdCP ist Selbsterhaltung der unabhängigen AdTech. Das macht die Standards nicht weniger gut, aber es ändert die Erwartung an ihre Adoption. Wer aus Notwendigkeit baut, baut, was er braucht. Ob die Mainstream-Buy-Side mitkommt, ist eine ganz andere Frage.

## Was die Protokolle unterscheiden

AdCP und AAMP beschreiben dasselbe Ziel – Agenten kaufen und verkaufen Werbung – wählen aber gegensätzliche Wege. AdCP geht direkt: Buyer-Agent und Seller-Agent reden ohne DSP-Mittelsmann miteinander, die Auktion entfällt. **Agent as Automation** – der Mensch greift nur noch strategisch ein. AAMP behält die OpenRTB-Auktion und legt eine Agentic-Schicht darüber: **Agent as Optimizer** – der Agent steuert Bid-Logik und Targeting, die Auktions-Architektur bleibt.

Der Unterschied trifft den Margen-Hebel der Plattformen. Eine Direktverbindung braucht keine DSP-Wallet, und genau dort verdienen Google und Meta heute. Deshalb ihr AAMP-Engagement: keine Defensive gegen Innovation, sondern Schutz der Marge.

Daneben läuft eine dritte Schiene, die sich gar nicht erst um Standards kümmert: die Plattform-Agenten in Performance Max und Advantage+. **Agent as UI** – der Marketer interagiert mit einem Agenten als Self-Service-Tool, die Auktion darunter bleibt verborgen.

Technisch optional bedeutet aber nicht praktisch genutzt. Eine offene Pipe ersetzt nicht den Default-Pfad, der den Mainstream führt. Genau das ist die Email-Lehre.

![Vier Pipes im Vergleich. OpenRTB (heute, kein Agent) hat zwei Margen-Stationen: an DSP und SSP. AAMP (Agent as Optimizer) behält die gleiche Pipe und ergänzt Buyer-/Seller-Agent an beiden Enden – Margen-Stationen unverändert, Agents optimieren Bid-Logik. AdCP (Agent as Automation) setzt auf eine Direktverbindung zwischen Buyer-Agent und Seller-Agent, beide Margen-Stationen entfallen. Plattformen (Agent as UI) reduzieren die Pipe auf eine Plattform-Marge – keine sichtbare Auktion, Plattform ist Buyer und Seller in einem.](/images/perspektiven/maschinen-werbemaschine-pipes.svg)

## Sieben Monate AdCP – drei Prototypen

AdCP ist seit Oktober 2025 öffentlich. Sieben Monate später, im Mai 2026, sind weltweit drei dokumentierte Cases mit Endkunden-Brand zu finden, alle in den USA. [CNN](https://digiday.com/media/cnn-builds-in-house-agent-infrastructure-as-it-prepares-for-ai-driven-media-trading/) baut eine eigene In-House-Infrastruktur und peilt den vollen Trading-Mode für Q1 2027 an. [Warner Bros. Discovery](https://www.magnite.com/blog/why-magnite-built-a-seller-agent-and-what-it-signals-for-adcp/) fuhr im Dezember 2025 einen Seller-Agent-Test mit Magnite und Scope3. Plus ein [erster vollautonomer AdCP-Lauf](https://www.marketingdive.com/news/beverage-marketer-sees-cost-savings-with-agentic-media-buying-test/814905/) einer kanadischen Beverage-Brand mit PubMatic AgenticOS, ebenfalls Dezember 2025. Daneben laufen [Infrastruktur-Tests bei Magnite](https://www.magnite.com/press/magnite-unveils-new-ai-capabilities/) mit Disney Advertising und Publicis Media Exchange (April 2026), beide ohne Endkunden-Brand. Das sind Prototypen, keine Adoption. Und in einem Markt, in dem Modell-Releases im Zwei-Wochen-Takt kommen und ganze Tool-Schichten in einem Quartal entstehen, sind sieben Monate keine kurze Anlaufzeit. Sieben Monate sind hier eine Ewigkeit.

Im DACH-Markt ist die Lage entsprechend dünner: kein DACH-Akteur in der AdCP-Mitgliederliste, kein dokumentierter Pilot. Der BVDW hat ein [Lab "Agentic Media Buying"](https://www.bvdw.org/en/committees/programmatic-advertising-ecosystem/) lanciert – institutionelle Sondierung, kein Protokoll. Auf der [ADZINE CONNECT 26](https://www.adzine.de/2026/03/adzine-connect-26-open-media-im-stresstest/) im Februar 2026 lautete der Konsens "Evolution, kein Big Bang".

Die Pipes tragen technisch. Die Frage ist nicht, ob AdCP funktioniert, sondern wie schmal die Adoption sieben Monate nach Launch ist. Email funktioniert technisch ebenfalls, und ist trotzdem Nische. Was ein Konsortium auf dem Papier durchsetzt, ist noch keine Marktbewegung.

## Plattformen sind schon weiter

Während AdCP und AAMP in Standardisierungs-Komitees verhandeln, bauen die Plattformen ihre eigene Schiene – ausserhalb beider Lager. **Agent as UI**: Der Agent ist nicht mehr Werkzeug zwischen Marketer und Auktion, sondern die Oberfläche selbst. Wer Performance Max öffnet, redet nicht mit der Auktion, sondern mit einem Agenten, der die Auktion verbirgt. Das ist nicht Begleiterscheinung der Standards-Debatte, sondern die eigentliche Markt-Bewegung.

Meta Advantage+ Sales Campaigns läuft seit 2024, vollautomatisierte Kampagnen sind für Ende 2026 angekündigt. Google Performance Max bekam Anfang 2026 Google Ads MCP dazu. Im April 2026 kam [Meta Ads CLI](https://developers.facebook.com/blog/post/2026/04/29/introducing-ads-cli/) – das Ende jeder *"AI for Meta Ads"*-Drittanbieter-Schicht. Amazon DSP fährt eine eigene Agentic-Roadmap. Alle vier proprietär, alle ausserhalb von AdCP und AAMP, alle bereits verfügbar statt im Pilot.

Hier wiederholt sich das Gmail-Muster, eine Etage weiter. Pro forma sitzen Google und Meta im IAB Tech Lab und verteidigen mit AAMP die OpenRTB-Auktions-Infrastruktur. Operativ bauen sie in den eigenen Stacks Convenience und Default-Settings. Wer Performance Max nutzt und gute Ergebnisse sieht, fragt nicht nach AdCP-Compliance – genauso wenig wie der Gmail-Nutzer nach IMAP fragt.

Hinzu kommt eine zweite, oft übersehene Dynamik: Standards-Compliance ist teuer und nutzt am Ende oft den Grossen. Wer eigene Engineering-Kapazität hat, trägt die Kosten für Compliance leicht. Wer als unabhängiger Akteur compliant sein will, zweigt Ressourcen ab, die er für Innovation bräuchte. Dasselbe Muster, das die DSGVO den Grossen geschenkt und die Kleinen erstickt hat.

Daraus folgt: Politik rund um Standards allein entscheidet nichts. Auch nicht Antitrust: selbst wenn die laufenden Verfahren in den USA und der EU Google strukturell zur [Aufspaltung zwingen](https://www.adexchanger.com/antitrust/2025-the-year-google-lost-in-court-and-won-anyway/), wechseln Werbetreibende auf Performance Max nicht aus juristischer Sympathie zu offenen AdCP-Pipes; Convenience wird nicht juristisch entschieden. Wer Plattform-Defaults akzeptiert, hat das Standardisierungs-Spielfeld verlassen, bevor das Spiel beginnt.

## Was gewinnt – und was übrigbleibt

Die ehrliche Diagnose: Beides passiert gleichzeitig, aber nicht symmetrisch. Walled Gardens dominieren den Mainstream: Performance Max, Advantage+ und Meta Ads CLI halten den Volumen-Markt, nicht weil die Marktarchitektur sie dort hält, sondern weil Komfort und Resultate die Pipe-Entscheidung treiben. AdCP wird Premium-Nische. PubMatic und Magnite bauen ihre Pipes, Premium-Publisher wie CNN und WBD experimentieren, fortgeschrittene Werbetreibende und Holding Groups mit Margen-Transparenz-Anspruch nutzen die offene Schiene. Das ist ein gesundes Geschäft, aber es ist nicht der Mainstream.

Für Publisher gibt es erstmals seit dem Programmatic-Durchbruch einen technischen Weg um DV360 herum. Konkret heisst das, Inventar-Metadaten so aufzubereiten, dass Agenten Schemas lesen können statt Sales-Decks; die Direct-Deals-Infrastruktur zu stärken über Newsletter, Apps und First-Party-Daten; und intern Agentic-Skills aufzubauen samt einer eigenen Standards-Strategie. Beobachten reicht nicht. Wer ohne eigenes Verständnis auf den AdCP/AAMP-Showdown wartet, kommt mit der Antwort, nicht mit der Frage. Und das Protokoll, auf dem die eigene Pipe läuft, wird in den nächsten zwölf Monaten entschieden.

Für Werbetreibende ist die Frage einfacher gestellt, und damit auch knapper zu beantworten. Wer Buyer-Agent-Kompetenz aufbaut, kann die Pipe-Wahl strategisch treffen. Wer auf Plattform-Defaults bleibt, beantwortet die Standards-Frage stillschweigend mit *"egal – ich bin sowieso im Walled Garden"*.

Im DACH-Markt fehlt der Pivot bisher: Der Markt muss sich noch finden und ist an der Diskussion nicht beteiligt; Pilots realistisch ab 2027.

## Wo der nächste Klick fällt

Die Frage ist nicht, ob AdCP funktioniert. Das tut es. Die Frage ist, ob die Mainstream-Werbebranche aus dem Walled-Garden-Komfort herausfindet, wenn der nächste Klick auf Performance Max immer noch funktioniert. Das Email-Muster legt eine eher zurückhaltende Antwort nahe: Solche Entscheidungen fallen nicht in den Standardisierungs-Komitees, sondern dort, wo der Mainstream den nächsten Klick setzt.

**Diese Serie auf fumu.ch:** Dieser Text greift einen von fünf Trends aus dem Rahmen-Artikel [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/) heraus. Dort erkläre ich, warum diese Entwicklungen kein Zufall sind – und was das strukturelle Muster dahinter ist.

<a href="/downloads/ai-trends-2026.pdf" class="cta">Whitepaper herunterladen &rarr;</a>
