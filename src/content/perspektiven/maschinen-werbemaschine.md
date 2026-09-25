---
title: "Maschinen steuern die Werbemaschine"
description: "Agentic Advertising. Zwei Konsortien schreiben gerade Standards, und der Mainstream wird sie ignorieren, aus demselben Grund, aus dem heute niemand mehr nach IMAP fragt."
date: 2026-05-03
category: "KI & AdTech"
image: "/images/perspektiven/maschinen-werbemaschine-hero.webp"
icon: "/images/perspektiven/icons/maschinen-werbemaschine.webp"
draft: false
series: "ai-digitale-werbung"
---

Ich gehöre zur schrumpfenden Minderheit, die Email weiterhin als offenen Standard nutzt: IMAP und SMTP in einem klassischen Mail-Client, gehostet bei einem unabhängigen Provider statt bei einer der grossen Plattformen. Das hat zunehmend etwas von einer Schallplatten-Sammlung, charmant, aber nicht mehr Mainstream.

IMAP und SMTP sind nicht verschwunden. Zwischen Gmail und Outlook wird weiterhin SMTP gesprochen, und IMAP kann jeder Nutzer freischalten, der will. Für die Mehrheit sind die Standards aber unsichtbar geworden, weil Gmail proprietäre Schichten darübergelegt hat: Conversation View, Smart Compose, Categories, Spam-Erkennung, Inbox AI und jetzt die Gemini-Integration. Outlook und Apple Mail folgen demselben Muster. Die offenen Protokolle bleiben der Minimalkonsens zwischen den grossen Anbietern.

Dieses Muster wiederholt sich in fast allem, was in den letzten 30 Jahren im offenen Internet gebaut wurde, und im aktuellen Hype um Agentic Advertising läuft es deutlich schneller ab. Zwei Industrie-Koalitionen schreiben gerade Standards dafür, wie KI-Agenten Werbung kaufen und verkaufen: AdCP (Ad Context Protocol) auf der einen Seite, AAMP (Agentic Advertising Management Protocols) auf der anderen. Beide werden technisch funktionieren, und einer wird sich auf dem Papier durchsetzen. Im Mainstream werden beide kaum genutzt werden, weil Meta und Google bereits eigene Agenten in Advantage+ und Performance Max bauen und die Mehrheit der Werbetreibenden dort bleibt, wo es bequem ist.

![Google und Meta als zwei separate Mega-Stores mit eigenen Welten, gegenüber drei Einzelhändler (PubMatic, Magnite, Yahoo) unter einem gemeinsamen "AdCP – Open Standard"-Banner.](/images/perspektiven/maschinen-werbemaschine-hero.webp)

## Wer baut und warum aus der Defensive

AdCP wurde im Oktober 2025 von Brian O'Kelley und Scope3 als [Industrie-Koalition](https://www.samba.tv/press-releases/industry-coalition-launches-ad-context-protocol-adcp-open-standard-for-agentic-advertising-infrastructure) gestartet. O'Kelley hat AppNexus mitgegründet und führt heute Scope3, was der Initiative Glaubwürdigkeit gibt.

Getragen wird AdCP von der unabhängigen AdTech-Industrie. Zu den Gründungsmitgliedern gehören Yahoo, PubMatic und Magnite (als Launch Member). Damit sitzen die zwei grössten unabhängigen SSPs drin, also die Plattformen, über die Publisher ihr Inventar verkaufen. Beide sind in derselben Lage: Ohne offenen Standard verliert ihr Geschäftsmodell den Boden. AAMP ist umgekehrt gebaut. Träger ist das IAB Tech Lab, dahinter stehen Google, Meta, die grossen DSPs (die Einkaufsplattformen der Werbetreibenden) und die Ad Networks. Sie verteidigen, was unter OpenRTB, dem Protokoll der heutigen Echtzeit-Auktion, bereits Marktstandard ist.

Die grossen Publisher fehlen in beiden Lagern: WBD, Disney, NBCU und News Corp sind nirgends Mitglied. Ihr Bestandsgeschäft trägt sie auch ohne neuen Standard, über Direktbeziehungen, Reichweite und Markenmacht, und der Druck ist für sie nicht existenziell. The Trade Desk ist ein Sonderfall und bei keinem der beiden dabei. TTD will lieber Plattform sein als unabhängige AdTech, und dazu passt keines der Lager ganz. Im März 2026 kam der [Publicis-Schock](https://adage.com/agencies/aa-publicis-stops-recommending-the-trade-desk-after-audit/) hinzu: Nach einem Audit von FirmDecisions stoppte Publicis die Buchungen, und die Aktie lag seit Jahresbeginn 33 Prozent im Minus. Wenn drei der sechs grossen Holding Groups draussen sind, bleibt für die Arbeit an Standards kein Kopf frei.

Wer die Werkzeuge baut und überleben will, braucht offene Standards. Die Werkzeugbauer treiben deshalb die Standardsetzung, während sich zurückhält, wer eigene Grösse hat wie die Plattformen oder eigene Direktbeziehungen wie die Premium-Publisher. Mit AdCP sichert die unabhängige AdTech ihr eigenes Geschäft. Das macht die Standards nicht schlechter, verändert aber die Erwartung an ihre Verbreitung. Wer aus Notwendigkeit baut, baut, was er selbst braucht.

## Was die Protokolle unterscheiden

AdCP und AAMP verfolgen dasselbe Ziel, nämlich dass Agenten Werbung kaufen und verkaufen, und wählen gegensätzliche Wege. AdCP verbindet Buyer-Agent und Seller-Agent direkt, ohne DSP dazwischen, und lässt die Auktion weg. Das ist *Agent as Automation*: Der Mensch greift nur noch strategisch ein. AAMP behält die OpenRTB-Auktion und legt eine Schicht für Agenten darüber. Das ist *Agent as Optimizer*: Der Agent steuert Gebotslogik und Targeting, die Architektur der Auktion bleibt.

Bei einer Direktverbindung läuft kein Budget mehr über eine DSP, und an genau dieser Stelle verdienen Google und Meta heute. Ihr Engagement bei AAMP schützt deshalb die Marge.

Daneben läuft eine dritte Schiene, die sich um Standards gar nicht kümmert: die Agenten der Plattformen in Performance Max und Advantage+. Das ist *Agent as UI*: Der Marketer bedient einen Agenten als Self-Service-Werkzeug, und die Auktion darunter bleibt verborgen.

Eine Pipe, die technisch offen steht, wird noch lange nicht genutzt. Den Mainstream führt der Default-Pfad, wie bei der Email.

![Vier Pipes im Vergleich. OpenRTB (heute, kein Agent) hat zwei Margen-Stationen: an DSP und SSP. AAMP (Agent as Optimizer) behält die gleiche Pipe und ergänzt Buyer- und Seller-Agent an beiden Enden; die Margen-Stationen bleiben, die Agents optimieren die Bid-Logik. AdCP (Agent as Automation) setzt auf eine Direktverbindung zwischen Buyer-Agent und Seller-Agent, beide Margen-Stationen entfallen. Plattformen (Agent as UI) reduzieren die Pipe auf eine Plattform-Marge, ohne sichtbare Auktion; die Plattform ist Buyer und Seller in einem.](/images/perspektiven/maschinen-werbemaschine-pipes.svg)

## Sieben Monate AdCP, drei Prototypen

AdCP ist seit Oktober 2025 öffentlich. Sieben Monate später, im Mai 2026, finden sich weltweit drei dokumentierte Cases mit einer Marke als Endkunde, alle in den USA. [CNN](https://digiday.com/media/cnn-builds-in-house-agent-infrastructure-as-it-prepares-for-ai-driven-media-trading/) baut eine eigene Infrastruktur und peilt den vollen Handelsbetrieb für Q1 2027 an. [Warner Bros. Discovery](https://www.magnite.com/blog/why-magnite-built-a-seller-agent-and-what-it-signals-for-adcp/) testete im Dezember 2025 einen Seller-Agent mit Magnite und Scope3. Im selben Monat lief der [erste vollautonome AdCP-Lauf](https://www.marketingdive.com/news/beverage-marketer-sees-cost-savings-with-agentic-media-buying-test/814905/) einer kanadischen Getränkemarke über PubMatic AgenticOS. Daneben laufen [Infrastruktur-Tests bei Magnite](https://www.magnite.com/press/magnite-unveils-new-ai-capabilities/) mit Disney Advertising und Publicis Media Exchange (April 2026), beide ohne Marke als Endkunde.

In einem Markt, in dem neue Modelle im Zwei-Wochen-Takt erscheinen und ganze Werkzeugschichten in einem Quartal entstehen, sind sieben Monate eine lange Zeit.

Im DACH-Markt ist die Lage noch dünner. Kein DACH-Akteur steht in der Mitgliederliste von AdCP, und es gibt keinen dokumentierten Pilot. Der BVDW hat ein [Lab «Agentic Media Buying»](https://www.bvdw.org/en/committees/programmatic-advertising-ecosystem/) gestartet, eine institutionelle Sondierung ohne eigenes Protokoll. Auf der [ADZINE CONNECT 26](https://www.adzine.de/2026/03/adzine-connect-26-open-media-im-stresstest/) im Februar 2026 lautete der Konsens «Evolution, kein Big Bang».

Die Pipes funktionieren technisch, sieben Monate nach dem Start nutzt sie kaum jemand. Email funktioniert technisch ebenfalls und ist trotzdem eine Nische.

## Plattformen sind schon weiter

Während AdCP und AAMP in Komitees verhandeln, bauen die Plattformen ausserhalb beider Lager ihre eigene Schiene. Bei *Agent as UI* ist der Agent die Oberfläche, über die der Marketer bucht. Wer Performance Max öffnet, spricht mit einem Agenten, der die Auktion verbirgt. Hier bewegt sich der Markt.

Meta Advantage+ Sales Campaigns läuft seit 2024, vollautomatisierte Kampagnen sind für Ende 2026 angekündigt. Google Performance Max bekam Anfang 2026 Google Ads MCP dazu. Im April 2026 folgte [Meta Ads CLI](https://developers.facebook.com/blog/post/2026/04/29/introducing-ads-cli/), und damit verliert jede Drittanbieter-Schicht nach dem Muster «AI for Meta Ads» ihre Grundlage. Amazon DSP fährt eine eigene Agentic-Roadmap. Alle vier sind proprietär, alle laufen ausserhalb von AdCP und AAMP, und alle sind bereits verfügbar statt im Pilot.

Eine Etage weiter wiederholt sich hier das Gmail-Muster. Pro forma sitzen Google und Meta im IAB Tech Lab und verteidigen mit AAMP die Infrastruktur der OpenRTB-Auktion. Operativ bauen sie in den eigenen Systemen Komfort und Voreinstellungen aus. Wer Performance Max nutzt und gute Ergebnisse sieht, fragt so wenig nach AdCP-Compliance wie der Gmail-Nutzer nach IMAP.

Dazu kommt, dass die Einhaltung von Standards teuer ist und am Ende oft den Grossen nützt. Wer eigene Engineering-Kapazität hat, trägt die Kosten leicht. Ein unabhängiger Akteur zweigt dafür Ressourcen ab, die ihm für die Entwicklung fehlen. So hat die DSGVO den Grossen genützt.

Weder die Politik um Standards noch Antitrust entscheidet die Frage. Selbst wenn die laufenden Verfahren in den USA und der EU Google zur [Aufspaltung zwingen](https://www.adexchanger.com/antitrust/2025-the-year-google-lost-in-court-and-won-anyway/), wechseln Werbetreibende nicht aus juristischer Sympathie von Performance Max zu offenen AdCP-Pipes.

## Was gewinnt und was übrig bleibt

Die Walled Gardens, also die geschlossenen Plattformen, dominieren den Mainstream: Performance Max, Advantage+ und Meta Ads CLI halten den Volumenmarkt, weil Komfort und Resultate die Wahl der Pipe bestimmen. AdCP wird zur Premium-Nische. PubMatic und Magnite bauen ihre Pipes, Premium-Publisher wie CNN und WBD experimentieren, und fortgeschrittene Werbetreibende und Holding Groups, die Transparenz über die Margen verlangen, nutzen die offene Schiene.

Für Publisher gibt es erstmals seit dem Programmatic-Durchbruch einen technischen Weg an DV360, der Einkaufsplattform von Google, vorbei. Konkret heisst das, die Metadaten des Inventars so aufzubereiten, dass Agenten Schemas lesen statt Sales-Decks; die Infrastruktur für Direct Deals über Newsletter, Apps und First-Party-Daten zu stärken; und intern Kompetenz für Agenten aufzubauen, samt einer eigenen Haltung zu den Standards. Wer ohne eigenes Verständnis auf den Ausgang zwischen AdCP und AAMP wartet, kann auf das Ergebnis nur noch reagieren. Und das Protokoll, auf dem die eigene Pipe läuft, wird in den nächsten zwölf Monaten entschieden.

Ein Werbetreibender, der Kompetenz für Buyer-Agenten aufbaut, kann die Wahl der Pipe strategisch treffen. Wer bei den Voreinstellungen der Plattform bleibt, beantwortet die Frage nach den Standards stillschweigend mit «egal, ich bin sowieso im Walled Garden».

Im DACH-Markt fehlt diese Wende bisher. Der Markt muss sich noch finden und ist an der Diskussion nicht beteiligt; Pilots sind realistisch ab 2027.

## Wo der nächste Klick fällt

Offen ist, ob die Werbebranche im Mainstream aus dem Komfort der Walled Gardens herausfindet, solange der nächste Klick auf Performance Max funktioniert. Das Email-Muster legt eine eher zurückhaltende Antwort nahe: Solche Entscheidungen fallen nicht in den Komitees, sondern dort, wo der Mainstream den nächsten Klick setzt.

**Mehr aus diesem Thema:** Der Text greift einen von fünf Trends aus dem Rahmen-Artikel [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/) heraus. Dort erkläre ich, warum diese Entwicklungen kein Zufall sind und welches Muster dahinter steht.

<a href="/downloads/ai-trends-2026.pdf" class="cta">Whitepaper herunterladen &rarr;</a>
