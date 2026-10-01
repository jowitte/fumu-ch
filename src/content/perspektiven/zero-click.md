---
title: "93 Prozent Zero-Click"
description: "24'000 Crawls pro Referral bei Anthropic – und das ist schon eine Verbesserung. Was die Cloudflare-Zahlen über das zweite Unbundling verraten."
date: 2026-04-16
updated: 2026-10-01
category: "KI & AdTech"
image: "/images/perspektiven/zero-click-crawl-to-refer.webp"
icon: "/images/perspektiven/icons/zero-click.webp"
draft: false
series: "ai-digitale-werbung"
---

Knapp 24'000-mal crawlte ein Anthropic-Bot im ersten Quartal 2026 eine Website für einen Besucher, der an den Publisher zurückgeschickt wurde. So steht es in einer Auswertung von Cloudflare-Radar-Daten durch [SEOmator](https://seomator.com/blog/crawl-to-refer-ratio-ai-crawlers-llm-bots) mit Stand März 2026. [Im Januar 2025](https://blog.cloudflare.com/crawlers-click-ai-bots-training/) waren es noch 286'000. Das Verhältnis wird besser und lag trotzdem knapp 5'000-mal über dem von Google.

Wer ChatGPT eine Frage stellt, klickt selten weiter, weil die Antwort schon dasteht. Publisher, deren Geschäft auf Traffic gebaut ist, verlieren damit im laufenden Quartal die Grundlage ihrer Erlösstruktur.

## Wie weit das schon geht

Bei klassischen Google-Suchen blieben in den USA von Januar bis April 2026 [68% ohne Klick](https://sparktoro.com/blog/in-2026-less-than-one-third-of-google-searches-still-send-a-click), 2024 waren es noch 60%. In Googles AI Mode, der die Trefferliste durch eine Antwort ersetzt, führen nur 6 bis 8% der Sitzungen auf eine fremde Website; [93% bleiben ohne Klick](https://www.semrush.com/blog/google-ai-mode-seo-impact/). Für ChatGPT gibt es keine vergleichbare Messung, aber Ahrefs misst dort eine um [96% tiefere Klickrate](https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/) auf externe Websites als bei Google.

AI Overviews, die Zusammenfassungen über den Google-Treffern, erscheinen in den USA bei [rund 60% aller Suchanfragen](https://xponent21.com/insights/google-ai-overviews-surpass-60-percent/). Auf Suchen mit einem solchen Überblick fiel die [organische Klickrate](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update) zwischen Juni 2024 und September 2025 von 1,76% auf 0,61%. Publisher erwarten laut einer [Reuters-Erhebung](https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2026), dass der Suchmaschinen-Traffic in den nächsten drei Jahren um über 40% zurückgeht.

## Wo der Default schon kippt

In den USA verarbeitet ChatGPT bereits [17,1% aller digitalen Queries](https://firstpagesage.com/seo-blog/google-vs-chatgpt-market-share-report/). Bei der Gen Z liegt die Plattform fast gleichauf mit Google: [66% nutzen ChatGPT, 69% Google](https://www.frac.tl/ai-vs-seo-how-generative-search-is-reshaping-discovery-content-strategy-and-consumer-trust-in-2025/).

Diese Zahlen stammen aus US-Erhebungen. Für den deutschsprachigen Raum gibt es seit Mai einen ersten Datenpunkt. Die Agentur Seokratie hat für [69 deutschsprachige Websites](https://www.seokratie.de/unternehmensnews/traffic-bleibt-aber-loest-sich-von-google/) aus Handel, Industrie und Dienstleistung die GA4-Zahlen für den April 2024, 2025 und 2026 verglichen. Der Gesamtverkehr steht still, bei rund 6,4 Millionen Sitzungen. Der Google-Anteil fällt von gut 40% auf 22%. Der Verkehr aus KI-Tools verdreissigfacht sich und liegt danach bei 0,4%. Auf jede gewonnene KI-Sitzung kommen 41 verlorene Google-Sitzungen.

Repräsentativ ist das nicht, und die Autoren sagen es selbst: 69 Kunden derselben SEO-Agentur, ohne offengelegte Methodik, wie KI-Verkehr überhaupt erkannt wird. Klicks aus ChatGPT kommen je nach Client ohne Referrer an und landen in der Statistik unter Direct; die 0,4% sind eine Untergrenze. Was auch dann hält, ist die stillstehende Summe. Ein Reporting, das nur den Gesamtverkehr ausweist, schlägt nicht an, obwohl sich der Google-Anteil fast halbiert hat.

## Was Cloudflare sieht

Cloudflare schützt rund 20% aller Websites weltweit und sieht deshalb, wer crawlt und wer im Gegenzug Traffic zurückschickt. Das Verhältnis zählt, wie viele Seiten ein Bot abruft, bis einmal ein Besucher auf die Quelle zurückkommt.

![Gecrawlte Seiten pro zurückgeschicktem Besucher nach AI-Plattform, Durchschnitt Q1 2026, logarithmische Skala: Google 5, Perplexity 111, OpenAI 1'276, Anthropic 23'951.](/images/perspektiven/zero-click-crawl-to-refer.svg)

*Quelle: Cloudflare Radar, ausgewertet von [SEOmator](https://seomator.com/blog/crawl-to-refer-ratio-ai-crawlers-llm-bots), Durchschnitt Q1 2026, Stand März 2026. Die Auswertung wird laufend aktualisiert.*

Bei Anthropic bewegt sich das Verhältnis in die richtige Richtung: von 286'000 zu 1 im Januar 2025 auf knapp 12'000 im März 2026 und laut der aktualisierten SEOmator-Auswertung auf rund 2'200 im Juli 2026. Auslöser war Claudes Web-Suche mit klickbaren Quellen, seit Mai 2025 für alle Nutzer. Auch 2'200 zu 1 liegt noch weit über Googles 5 zu 1. Für Verlage und News-Sites misst Cloudflare bei Anthropic [2'500 zu 1](https://blog.cloudflare.com/ai-crawler-traffic-by-purpose-and-industry/), deutlich besser als im Schnitt. Google crawlt viel, generiert über die klassische Indexierung aber weiterhin den Grossteil seines Referral-Traffics.

Wie Publisher und Brands darauf reagieren, steht in ihrer robots.txt. Dort entscheidet sich, welcher Crawler überhaupt hereingelassen wird. Ich erhebe das alle 14 Tage über gut 100 Sites, Schwerpunkt Schweiz: [AI-Crawler-Radar](/ai-crawler-radar/).

## Der nächste Integrator

Yahoo verlor an Google, weil ein neuer Integrator auf einer neuen Ebene entstand: Suchqualität statt Verzeichnis. Heute läuft dieselbe Bewegung eine Stufe weiter, zur fertigen Antwort. Wer am Ende dominiert, ob OpenAI, Google mit AI Mode oder Perplexity, ist offen. Google hat Distribution, Cashflow und 25 Jahre Index und kannibalisiert sich lieber selbst, als das Feld zu räumen. Verschoben hat sich trotzdem, wer zwischen Leser und Quelle steht, und für Publisher zählt das unabhängig vom Sieger.

## Wo Sichtbarkeit jetzt entsteht

Was ChatGPT in seiner Antwort nicht nennt, findet ein wachsender Teil der Nutzer gar nicht erst.

SXO und AIO, Search Experience Optimization und AI Optimization, messen andere Grössen als klassisches SEO. Share of Voice in AI-Antworten, Sentiment der Erwähnungen, Zitierungshäufigkeit: daran misst sich Markenaufbau künftig. Wer jetzt keine Baseline aufbaut, hat in zwei Jahren nichts zu vergleichen.

## Was Publisher daraus machen können

Keine Strategie erhält den Status quo. Weiter helfen Schritte, die nicht am Algorithmus hängen.

Die naheliegende ist technisch: Inhalte maschinenlesbar machen, Metadaten und Taxonomien sauber halten, strukturierte Daten konsequent ausspielen. Generative Engine Optimization ist SEO mit einem anderen Ziel: der Erwähnung in einer Antwort statt der Position in der Trefferliste.

Robuster ist der Aufbau direkter Beziehungen. Newsletter-Abonnenten, App-Nutzer, zahlende Leser sind Reichweite, die kein Algorithmus-Update kassiert.

Content-Licensing bleibt der Sonderfall: Reddit hat Datenlizenzen an Google, OpenAI und weitere Abnehmer verkauft, keine davon exklusiv, und kommt damit auf [rund 5 bis 6% des Umsatzes](https://www.cnbc.com/2026/07/30/reddit-rddt-q2-2026-earnings-report.html), trotz zwei Jahrzehnten einzigartiger nutzergenerierter Inhalte. Für Schweizer Publisher ohne globale Reichweite taugt Licensing höchstens als Versuch.

**Mehr aus diesem Thema:** Der Text greift einen von fünf Trends aus dem Rahmen-Artikel [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/) heraus. Dort erkläre ich, warum diese Entwicklungen kein Zufall sind und welches Muster dahinter steht.

<a href="/downloads/ai-trends-2026.pdf" class="cta">Whitepaper herunterladen &rarr;</a>
