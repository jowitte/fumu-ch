---
title: "99 Prozent Zero-Click"
description: "24'000 Crawls pro Referral bei Anthropic – und das ist schon eine Verbesserung. Was die Cloudflare-Zahlen über das zweite Unbundling verraten."
date: 2026-04-16
category: "KI & AdTech"
image: "/images/perspektiven/zero-click-crawl-to-refer.webp"
icon: "/images/perspektiven/icons/zero-click.webp"
draft: false
series: "ai-digitale-werbung"
---

Knapp 24'000 mal crawlt ein Anthropic-Bot eine Website für einen Besucher, der an den Publisher zurückgeschickt wird. Durchschnitt erstes Quartal 2026, [Cloudflare Radar](https://blog.cloudflare.com/crawlers-click-ai-bots-training/). Vor einem Jahr waren es 286'000. Die Richtung stimmt, die Grössenordnung nicht.

Auf der Nutzerseite zeigt sich dieselbe Bewegung. Wer ChatGPT eine Frage stellt, klickt fast nie weiter: die Antwort ist da, der Klick erübrigt sich. Publisher, deren Geschäft auf Traffic gebaut ist, verlieren damit im laufenden Quartal die Grundlage ihrer Erlösstruktur.

## Wie weit das schon geht

Bei klassischen Google-Suchergebnissen bleiben heute 65% der Anfragen ohne Klick. Bei AI Overviews, die in den USA bei [rund 60% aller Suchanfragen](https://xponent21.com/insights/google-ai-overviews-surpass-60-percent/) erscheinen, steigt der Wert auf 95%. Bei ChatGPT auf 99%. Das ist eine andere Art, an Information zu kommen, keine Variante der Suchmaschine.

Die Publisher rechnen damit. Eine [Reuters-Erhebung](https://reutersinstitute.politics.ox.ac.uk/journalism-media-and-technology-trends-and-predictions-2026) beziffert den erwarteten Rückgang des Suchmaschinen-Traffics in den nächsten drei Jahren auf über 40%. Und selbst wenn ein Klick kommt, geht er selten zum Publisher: Google Discover leitet 77% seiner AI-Zusammenfassungen auf YouTube, also auf Google-Eigeninhalt. Die [organische Click-through-Rate](https://www.seerinteractive.com/insights/aio-impact-on-google-ctr-september-2025-update) bei AI-Overview-Zitierungen fiel bis September 2025 auf 0,7%, fast eine Halbierung innerhalb eines Jahres. Die Quellenangabe ist eine Formalie, keine Traffic-Quelle.

## Wo der Default schon kippt

In den USA verarbeitet ChatGPT bereits [17,1% aller digitalen Queries](https://firstpagesage.com/seo-blog/google-vs-chatgpt-market-share-report/). Bei der Gen Z liegt die Plattform fast gleichauf mit Google: [66% nutzen ChatGPT, 69% Google](https://www.frac.tl/ai-vs-seo-how-generative-search-is-reshaping-discovery-content-strategy-and-consumer-trust-in-2025/). Interessanter als die Marktanteile ist der Reflex dahinter. Wer jünger als 25 etwas wissen will, geht nicht mehr automatisch zu Google.

Diese Zahlen stammen aus US-Erhebungen. Für den deutschsprachigen Raum gibt es seit Mai einen ersten Datenpunkt, und er zeigt dieselbe Verschiebung von der anderen Seite. Die Agentur Seokratie hat für [69 deutschsprachige Websites](https://www.seokratie.de/unternehmensnews/traffic-bleibt-aber-loest-sich-von-google/) aus Handel, Industrie und Dienstleistung die GA4-Zahlen für den April 2024, 2025 und 2026 verglichen. Der Gesamtverkehr steht still, bei rund 6,4 Millionen Sitzungen. Der Google-Anteil fällt von gut 40% auf 22%. Der Verkehr aus KI-Tools verdreissigfacht sich und liegt danach bei 0,4%. Auf jede gewonnene KI-Sitzung kommen 41 verlorene Google-Sitzungen.

Repräsentativ ist das nicht, und die Autoren sagen es selbst: 69 Kunden derselben SEO-Agentur, ohne offengelegte Methodik, wie KI-Verkehr überhaupt erkannt wird. Klicks aus ChatGPT kommen je nach Client ohne Referrer an und landen in der Statistik unter Direct; die 0,4% sind eine Untergrenze. Was auch dann hält, ist die stillstehende Summe. Der Verkehr bleibt, die Herkunft verschiebt sich. Wer auf die Gesamtzahl schaut, sieht nichts passieren.

## Was Cloudflare sieht

Cloudflare schützt rund 20% aller Websites weltweit und sieht deshalb, wer crawlt und wer im Gegenzug Traffic zurückschickt. Jeder Crawl ist eine Seite, die gelesen, verarbeitet und in eine Antwort eingebaut wird, ohne dass der Leser je beim Ursprung landet. [Durchschnitt Q1 2026](https://seomator.com/blog/crawl-to-refer-ratio-ai-crawlers-llm-bots):

- **Google:** 5 gecrawlte Seiten pro Referral
- **Perplexity:** 111 zu 1
- **OpenAI:** 1'276 zu 1
- **Anthropic:** 23'951 zu 1

![Crawl-zu-Referral-Verhältnis pro Plattform, Durchschnitt Q1 2026. Google, Perplexity und OpenAI auf der unteren Skala; Anthropic bricht die Y-Achse mit 23'951 zu 1.](/images/perspektiven/zero-click-crawl-to-refer.webp)

Bei Anthropic bewegt sich das Verhältnis in die richtige Richtung: von 286'000 zu 1 im Januar 2025 auf knapp 12'000 im März 2026, dem letzten Monat des Quartals. Auslöser war Claudes Web-Suche mit klickbaren Quellen, seit Mai 2025 für alle Nutzer. 96% Verbesserung in 14 Monaten, und immer noch 12'000 zu 1 gegen Googles 5 zu 1. Für Verlage und News-Sites misst Cloudflare bei Anthropic [2'500 zu 1](https://blog.cloudflare.com/ai-crawler-traffic-by-purpose-and-industry/), deutlich besser als im Schnitt. Google crawlt viel, generiert über die klassische Indexierung aber weiterhin den Grossteil seines Referral-Traffics. Genau dieses Gleichgewicht verschiebt sich.

Wie Publisher und Brands darauf reagieren, steht in ihrer robots.txt. Dort entscheidet sich, welcher Crawler überhaupt hereingelassen wird. Wir erheben das alle 14 Tage über gut 100 Sites, Schwerpunkt Schweiz: [AI-Crawler-Radar](/ai-crawler-radar/).

## Was sich strukturell verschiebt

Das ist nicht der erste Wechsel des Standards im Web. Yahoo verlor an Google, weil ein neuer Integrator auf einer neuen Ebene entstand: Suchqualität statt Verzeichnis. Heute läuft dieselbe Bewegung eine Stufe weiter, zur Antwort statt zur Linksammlung. Wer am Ende dominiert, ob OpenAI, Google mit AI Mode oder Perplexity, ist offen. Google hat Distribution, Cashflow und 25 Jahre Index und kannibalisiert sich lieber selbst, als das Feld zu räumen. Verschoben hat sich die Integrationsschicht trotzdem, und für Publisher zählt das unabhängig vom Sieger.

## Wo Sichtbarkeit jetzt entsteht

Sichtbarkeit entsteht nicht mehr primär auf der eigenen Website, sondern in der AI-Antwort. Wenn ChatGPT ein Produkt nicht erwähnt, existiert es für einen wachsenden Teil der Nutzer nicht.

SXO und AIO, Search Experience Optimization und AI Optimization, verschieben die Prioritäten des klassischen SEO. Share of Voice in AI-Antworten, Sentiment der Erwähnungen, Zitierungshäufigkeit: daran misst sich Markenaufbau künftig. Wer jetzt keine Baseline aufbaut, hat in zwei Jahren nichts zu vergleichen.

## Was Publisher daraus machen können

Keine Strategie erhält den Status quo. Was trägt, sind Bewegungen, die nicht am Algorithmus hängen.

Die naheliegende ist technisch: Inhalte maschinenlesbar machen, Metadaten und Taxonomien sauber halten, strukturierte Daten konsequent ausspielen. Generative Engine Optimization ist die operative Verlängerung von SEO, mit der Erwähnung in einer Antwort als Ziel statt der Position in der Trefferliste.

Robuster ist der Aufbau direkter Beziehungen. Newsletter-Abonnenten, App-Nutzer, zahlende Leser sind Reichweite, die kein Algorithmus-Update kassiert. Ein Abonnent ist mehr wert als zehntausend Besucher, die nicht wiederkommen.

Content-Licensing bleibt der Sonderfall: Reddit erzielt mit Exklusivdeals an Google und OpenAI rund 10% des Umsatzes, und das trotz 18 Jahren einzigartiger nutzergenerierter Inhalte. Für Schweizer Publisher ohne globale Reichweite ist das kein Hauptmodell, sondern höchstens ein Versuch.

Das zweite Unbundling ist keine Prognose mehr.

**Diese Serie auf fumu.ch:** Dieser Text greift einen von fünf Trends aus dem Rahmen-Artikel [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/) heraus. Dort erkläre ich, warum diese Entwicklungen kein Zufall sind und was das strukturelle Muster dahinter ist.

<a href="/downloads/ai-trends-2026.pdf" class="cta">Whitepaper herunterladen &rarr;</a>
