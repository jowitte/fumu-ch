---
title: "Wenn robots.txt zur Vertragsklausel wird"
description: "SRF und RTS sperren Trainings-Crawler aus, die NZZ hält alles zu, 20 Minuten lässt alles rein – was die robots.txt über die AI-Strategie der Verlage verrät."
date: 2026-08-18
updated: 2026-09-28
category: "KI & AdTech"
series: "ai-medien"
image: "/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp"
icon: "/images/perspektiven/icons/robots-txt-vertragsklausel.webp"
draft: false
---

Im August haben SRF und RTS je acht Trainings-Crawler ausgesperrt, von OpenAI über Google bis Meta. Die NZZ sperrt 14 der 20 AI-Bots, die ich messe, der Tages-Anzeiger 13. 20 Minuten, Blick und Watson deklarieren keine einzige Regel. Die robots.txt, seit drei Jahrzehnten eine Höflichkeitsvereinbarung zwischen Websites und Suchmaschinen, zeigt heute, wie ein Verlag sein Verhältnis zu den Plattformen ordnet, die seine Inhalte inzwischen selbst zu Antworten verarbeiten. Wo Lizenzverträge existieren, bildet sie auch diese ab; im US-Markt lässt sich das bereits nachlesen.

Ich beobachte das über ein eigenes Monitoring: Alle 14 Tage liest ein automatischer Lauf die robots.txt von 108 Sites mit Schwerpunkt Schweiz und Europa und wertet sie gegen 20 AI-Crawler aus. Die Ergebnisse stehen im [AI-Crawler-Radar](/ai-crawler-radar/) auf fumu.ch.

![Heatmap der Sperrquote pro Site-Kategorie und Bot-Typ: Paywall-Publisher sperren Trainings-Crawler zu 81 Prozent, Plattformen blockieren breit über alle Bot-Typen, Brands und E-Commerce sperren praktisch nichts. 108 Sites × 20 AI-Crawler, Snapshot 17. August 2026, fumu Eigenerhebung.](/images/perspektiven/robots-txt-vertragsklausel-heatmap.webp)

*Quelle: fumu Eigenerhebung, 108 Sites und 20 AI-Crawler, Snapshot 17. August 2026.*

Gesperrt wird nach Bot-Typ. Trainings-Crawler, die Inhalte grossflächig als Lernmaterial für die Modelle sammeln, sind bei Publishern grösstenteils gesperrt, bei Paywall-Titeln zu 81 Prozent. Citation-Bots, die Inhalte indexieren, um sie in KI-Antworten als Quelle zu zitieren, kommen deutlich öfter durch; hier öffnen Sites selektiv, voran die mit einem Lizenzvertrag. Die Bot-Typen erklärt die [Methodik des Radars](/ai-crawler-radar/).

## Was der US-Markt vormacht

Das Muster kommt aus den USA. Im Frühjahr 2026 bauten das Wall Street Journal und Reuters ihre Dateien kurz nacheinander identisch um: alles sperren, gezielt reinlassen. Ausnahmen gibt es für genau die zwei OpenAI-Bots, die zitieren statt trainieren. Beide Verlage haben Lizenzverträge mit OpenAI, und wer einen Vertrag hat, muss den Citation-Bot freischalten, sonst kann der Partner das Produkt nicht liefern, das er lizenziert hat. Die robots.txt setzt damit den Vertrag technisch um.

News Corp hat im Mai 2024 mit OpenAI einen Fünfjahresvertrag über [mehr als USD 250 Mio.](https://variety.com/2024/digital/news/news-corp-openai-licensing-deal-1236013734/) abgeschlossen und im März 2026 mit Meta ein Dreijahresabkommen über [bis zu USD 150 Mio.](https://www.engadget.com/ai/meta-signs-a-multimillion-dollar-ai-licensing-deal-with-news-corp-234157902.html) Reuters-CEO Steve Hasker hat laut [Press Gazette](https://pressgazette.co.uk/publishers/wires_and_agencies/thomson-reuters-boss-says-ai-licensing-deals-only-involve-archive-text/) bewusst nur wenige Deals abgeschlossen, um sich Neuverhandlungen offenzuhalten. Die Financial Times lizenziert seit April 2024. Möglich ist die Steuerung nach Vertrag, weil OpenAI seine Bots nach Funktion trennt: GPTBot sammelt Trainingsdaten, OAI-SearchBot indexiert für die Suche, ChatGPT-User holt live die Antwort auf eine Nutzerfrage. Diese Trennung macht Zugang verhandelbar und grenzt OpenAI von Google ab.

Andere Verlage ziehen nach. Time hat im Juni 2026 auf eine [Whitelist](https://digiday.com/media/reuters-and-time-adopt-bot-blocking-whitelists-to-rein-in-ai-crawlers/) umgestellt und verwaltet rund 70 erlaubte Bots über den Dienstleister ScalePost; für Bot-Politik ist ein eigener Dienstleistungsmarkt entstanden. FT Strategies hat im Juli die [robots.txt von 70 grossen Publishern](https://www.ftstrategies.com/en-gb/insights/robots.txt-as-strategic-intent-analysis-of-large-publishers-practices-and-policies) ausgewertet: 60 blockieren mindestens einen AI-Crawler, 39 sperren Trainings-Crawler, aber nur 16 sperren die Bots, die Suchantworten mit Quellen versorgen.

## Google und Meta: die Macht des Bündels

Google und Meta gehen den umgekehrten Weg und bündeln, was OpenAI getrennt hat. Googles Suche und Googles AI-Antworten hängen am selben Crawler-Zugriff: Wer seine Inhalte nicht in den AI Overviews sehen will, muss auch die Suche aussperren, und das kann sich kein Publisher leisten. Meta führt Training und Indexierung laut eigener [Dokumentation](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers) ebenfalls in einem Crawler. Das Bündel verschafft beiden Verhandlungsmacht: Solange Publisher die AI-Nutzung nicht getrennt sperren können, gibt es keinen Zugang, den Google oder Meta einzeln bezahlen müssten.

Dagegen klagen Verlage, und Wettbewerbsbehörden ermitteln; für den europäischen Markt dürfte das mehr bewegen als jede Einzelverhandlung. Penske Media (Rolling Stone, Variety) [klagt seit September 2025](https://www.axios.com/2025/09/14/penske-media-sues-google-ai) gegen Google: Die Wahl, Inhalte für AI Overviews herzugeben oder in der Suche unterzugehen, sei Missbrauch der Monopolstellung. Die EU-Kommission [untersucht seit Dezember formell](https://searchengineland.com/google-vs-publishers-what-the-eu-probe-means-for-seo-ai-answers-and-content-rights-466431), ob diese Kopplung Marktmissbrauch ist. Die britische CMA hat Google im Juni 2026 als weltweit erste Behörde [verpflichtet](https://www.gov.uk/government/news/cma-secures-fairer-deal-for-publishers-and-improves-google-search-services-in-uk), Publishern ein Opt-out aus den AI-Features der Suche zu geben, ohne sie dafür im Ranking abzustrafen. Damit erzwingt sie per Auflage die Trennung, die OpenAI freiwillig vollzogen hat. Kommt die EU zum selben Schluss, dürfte das auch den Schweizer Traffic betreffen, der über Google läuft.

## Europa sortiert sich

Die österreichische Tageszeitung Der Standard sperrt seit Juli fünf Trainings-Crawler ausdrücklich und öffnet zugleich den Suchbot von OpenAI; Heidi.News und Le Temps haben Ende Juni gezielt für OpenAIs Such- und Assistenz-Bots geöffnet. Keiner der drei hat einen öffentlich bekannten Deal. Das selektive Öffnen für Citation-Bots lässt sich als Vorleistung lesen, auf der später ein Vertrag aufbauen kann. In Deutschland haben Spiegel und Manager Magazin im August ihre Sperren ausgedehnt, neu auch auf die Such- und Assistenz-Bots von Anthropic und Mistral. Dort gilt die Sperre als Normalfall gegenüber Anbietern, mit denen keine Beziehung besteht.

In der Schweiz folgt die Trennlinie weitgehend dem Geschäftsmodell. Wer Inhalte verkauft, sperrt: neben NZZ und Tages-Anzeiger auch die Republik mit 8 gesperrten Crawlern. 20 Minuten, Blick, Watson und Cash dagegen verkaufen Reichweite und haben für keinen der gemessenen Crawler eine Regel. Für sie sind AI-Antworten ein Vertriebsweg; die Logik dahinter beschreibt [93 Prozent Zero-Click](/perspektiven/zero-click/).

Die TX Group fährt beide Politiken im selben Konzern: Der Tages-Anzeiger sperrt, 20 Minuten lässt rein. SRF und RTS trennen seit August nach Funktion und sperren die Trainings-Crawler, während die zitierenden Bots offen bleiben. Am weitesten geht die NZZ, die auch OpenAIs zitierende Bots sperrt. Das lässt sich als Verhandlungsposition lesen: Wer alles zuhält, hat am meisten anzubieten, wenn ein Deal auf den Tisch kommt.

Dass sich das Muster über Märkte hinweg durchsetzt, liegt auch an einer eigenen Schicht zwischen Publishern und AI-Anbietern, die Zugang bepreist. Am sichtbarsten ist das bei Cloudflare, das [Pay-per-Crawl verworfen](https://ppc.land/cloudflare-stops-charging-ai-per-crawl-and-starts-paying-per-answer/) hat und auf Pay-per-Answer umstellt: Bezahlt wird, wenn ein Inhalt in einer generierten Antwort erscheint, nicht pro Abruf. Seit dem [15. September 2026](https://blog.cloudflare.com/content-independence-day-ai-options) sperrt Cloudflare zudem Agenten- und Trainings-Zugriffe auf werbefinanzierten Seiten standardmässig; das gilt für neue Domains und für Gratis-Kunden ohne eigene Einstellung. Dienstleister wie ScalePost oder TollBit besetzen dieselbe Schicht. Wer Zugang bepreisen will, braucht dafür keinen eigenen Deal mehr.

## Was die robots.txt nicht durchsetzt

Wie viel die Datei tatsächlich steuert, hat HasData im Juli an fast [11'000 Domains](https://hasdata.com/blog/ai-crawler-block-index) gemessen. Bei vier von zehn Sites, die OpenAIs Trainings-Crawler sperren, liefert der Server die Inhalte trotzdem aus. Nur gut ein Fünftel der Sites blockiert technisch hart, gut jede zehnte verlangt Bezahlung pro Zugriff. Für seinen Live-Bot ChatGPT-User hat OpenAI im Dezember 2025 die [Zusage gestrichen](https://ppc.land/openai-revises-chatgpt-crawler-documentation-with-significant-policy-changes/), sich an die robots.txt zu halten, mit der Begründung, dass ein Nutzer die Abfrage auslöse. Laut [TollBit](https://ppc.land/15-of-ai-page-fetchers-in-europe-reached-disallowed-urls-tollbit-finds/) erreichte dieser Bot im ersten Halbjahr 2026 gesperrte Seiten auf fast der Hälfte der europäischen Sites, die ihn ausdrücklich ausschliessen. Wo Crawler sich tarnen, wird die Datei zum Beweisstück: News Corp wirft Brave in einer [Gegenklage](https://www.semafor.com/article/07/21/2026/newscorp-accuses-search-engine-brave-of-ai-copyright-infringement) vor, seine Crawler getarnt zu haben, um die Sperren zu umgehen, und fordert bis zu USD 150'000 pro Verstoss.

## Was das für Schweizer Publisher bedeutet

Für die Schweiz ist Schibsted der passendere Vergleich als News Corp: ein mittelgrosser Sprachraum, nationale Titel und trotzdem ein Deal. Die [Partnerschaft mit OpenAI](https://openai.com/index/openai-partners-with-schibsted-media-group) läuft seit Februar 2025: VG, Aftenposten, Aftonbladet und Svenska Dagbladet liefern Echtzeit-Artikel mit Attribution in ChatGPT. Die finanziellen Konditionen sind nicht offengelegt. Im deutschsprachigen Raum lizenziert Axel Springer seit Ende 2023; NZZ, TX Group und Ringier haben bisher keine öffentlich bekannten Deals.

Für Verlage ohne Deal hält eine vollständige Sperre Trainings-Crawler fern, verhindert Citations aber nicht und wird oft nicht einmal technisch respektiert. Wer alles offen lässt, verschenkt die Verhandlungsposition für einen späteren Deal. Ein Exklusivdeal wiederum setzt Marktmacht voraus, die in der Schweiz kaum ein Verlag allein aufbringt.

Cloudflares Pay-per-Answer könnte der Mittelweg werden: ein Tarif statt eines exklusiven Mehrjahresvertrags, zugänglich auch für Verlage, die allein keinen Deal aushandeln könnten. Bis dahin bleibt der Weg, den Der Standard, Heidi.News und Le Temps bereits gehen: für Citation-Bots ohne Trainingsfunktion selektiv öffnen.

## Was als nächstes in der robots.txt steht

Die robots.txt kennt nur erlauben oder verbieten, keine Bedingungen, keine Preise und keine Durchsetzung. An dieser Lücke setzen zwei Initiativen an. Die IETF [erweitert die robots.txt](https://www.ietf.org/blog/aipref-wg/) um maschinenlesbare Kategorien der Nutzung, sodass die Frage, ob Inhalte fürs Training verwendet werden dürfen, Teil des Standards wird. RSL, seit Dezember 2025 offizieller [Industriestandard](https://rslstandard.org/press/rsl-standard) mit über 50 Partnern, geht weiter und macht die Lizenzbedingungen selbst maschinenlesbar. Weil [Cloudflare, Akamai und Fastly](https://wan-ifra.org/2026/04/rsls-ai-use-compensation-plan-for-news-we-think-this-is-a-100-billion-opportunity-for-publishers/) den Standard nutzen wollen, um Crawler zu prüfen, liesse sich damit erstmals auch die Durchsetzung lösen.

Im Moment deutet mehr darauf hin, dass die Datei aufgerüstet statt abgelöst wird: Sie bekommt maschinenlesbare Lizenzbedingungen und über Dienstleister wie Cloudflare eine Durchsetzung; beides war 1994 nicht vorgesehen. Wie die Datei zu dieser Rolle kam, beschreibt [Das doppelte Unbundling](/perspektiven/das-doppelte-unbundling/).
