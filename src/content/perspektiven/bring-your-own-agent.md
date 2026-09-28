---
title: "Bring your own Agent"
description: "Bring your own Agent. 78 Prozent der Wissensarbeiter bringen eigene KI-Werkzeuge mit, und in ihren Setups sammelt sich das Wissen der Organisation. Wem gehört es?"
date: 2026-09-22
category: "KI & Arbeit"
image: "/images/perspektiven/bring-your-own-agent-hero.webp"
icon: "/images/perspektiven/icons/bring-your-own-agent.webp"
draft: false
series: "ki-und-arbeit"
---

«Welches KI-Tool sollen wir einführen?» Wie so oft steht auch bei KI-Projekten die Frage nach dem besten Tool ganz am Anfang. Welches Tool das beste ist, entscheidet in der Praxis aber oft der Wissensarbeiter selbst, der sich die Nutzung aus Neugier beibringt und dabei sein eigenes Toolset aufbaut. [78 Prozent](https://blogs.microsoft.com/blog/2024/05/08/microsoft-and-linkedin-release-the-2024-work-trend-index-on-the-state-of-ai-at-work/) der Wissensarbeiter, die KI nutzen, bringen ihre eigenen Werkzeuge mit; Microsoft und LinkedIn nennen das «Bring Your Own AI».

![Punkte-Raster mit 100 Wissensarbeitern, 78 davon in Coral: der Anteil der KI-Nutzer, die eigene KI-Werkzeuge zur Arbeit mitbringen (Microsoft/LinkedIn Work Trend Index 2024, 31'000 Befragte in 31 Märkten).](/images/perspektiven/bring-your-own-agent-byoai-anteil.svg)

*Quelle: Microsoft und LinkedIn, Work Trend Index 2024, 31'000 Befragte in 31 Märkten.*

Die übliche und abwertende Lesart dafür heisst Schatten-KI: Daten fliessen ab, niemand weiss, wohin. Global geben [57 Prozent](https://kpmg.com/xx/en/media/press-releases/2025/04/trust-of-ai-remains-a-critical-challenge.html) der Angestellten an, ihre KI-Nutzung vor dem Arbeitgeber zu verbergen, und die tatsächliche Zahl dürfte höher liegen. In den KI-Werkzeugen sammelt sich zunehmend das Arbeitswissen der Organisation, zum ersten Mal in einer Form, die eine Maschine ausführen kann.

## Was in den privaten Setups liegt

Wer einen KI-Agenten länger als ein paar Wochen benutzt, hört auf, ihm jedes Mal alles zu erklären. Er schreibt es auf: wie eine Offerte für einen Stammkunden aufgebaut ist, welche Formulierungen die Rechtsabteilung streicht, was ein guter Mediaplan ist, wie das Quartalsreporting an die Geschäftsleitung aussieht, welche Fehler vom letzten Mal nicht wieder passieren dürfen. Aus Prompts werden Anleitungen, aus Anleitungen Regeln mit Beispielen. Entwickler nennen dieses System den *Harness*: alles, was ein Agent liest, bevor er arbeitet. Der Harness gehört dem, der ihn gebaut hat, und er enthält nie nur Firmenwissen. Neben den Regeln für Offerte und Mediaplan liegen darin die eigene Art zu denken, die Checkliste gegen die eigenen Schwächen und die Abkürzungen, die man sich über Jahre angewöhnt hat. Ein Teil davon macht das Werkzeug zu einem Mitarbeiter dieser Firma. Der andere Teil macht es zu diesem Mitarbeiter.

Der erste Teil hat in den meisten Organisationen kein Zuhause. Er liegt in einem Ordner auf dem Laptop, in einem privaten Konto, in einem Chat-Verlauf. Niemand prüft ihn, niemand versioniert ihn, und wenn die Person kündigt, verschwindet er. Ich kenne keine Studie, die das misst; die Befragungen fragen nach Nutzung, nicht nach dem, was sich dabei ansammelt. Aber ein Mediaplaner kann seinem Agenten in drei Monaten beibringen, was die Agentur in zehn Jahren gelernt hat. In meinen Projekten stellt sich deshalb oft die Frage, wie die Organisation dieses Wissen halten kann, ohne die Mitarbeiter unnötig einzuschränken.

## Von Software-Entwicklern lernen

Software-Teams haben für dieses Problem seit Langem Abläufe, die der Rest der Wissensarbeit nie gebraucht hat. Jeder bringt seine eigene Umgebung mit, den Editor, das Betriebssystem, die Handgriffe. Aber alle arbeiten an einem Repository, das der Firma gehört, mit Review, Versionsgeschichte und Tests. Inzwischen gilt das auch für die Anleitungen der Agenten: Was das Team braucht, liegt im Repository neben dem Code, wird wie Code geprüft und wie Code weitergegeben. Der Entwickler installiert es in seinen eigenen Harness, aus einem Marketplace oder aus einem geteilten Ordner, und daneben behält er, was nur ihm gehört. Seit Dezember 2025 ist diese Schicht herstellerneutral. Anthropic hat sein Skill-Format als [offenen Standard](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) publiziert, OpenAI, GitHub und Cursor lesen dieselben Dateien, und das Protokoll, über das Agenten auf Daten zugreifen, liegt seither bei der [Linux Foundation](https://www.anthropic.com/news/donating-the-model-context-protocol-and-establishing-of-the-agentic-ai-foundation). Der Agent ist austauschbar geworden, und der Teil des Harness, der der Firma gehört, lässt sich als Paket in jeden dieser Agenten laden.

Die Wissensarbeit hat diesen Schnitt schon einmal gemacht, mit dem Gerät statt mit dem Agenten. *Bring your own Device* hiess, dass die Firma auf dem privaten Telefon einen abgegrenzten Bereich bekommt, den sie verwaltet, während der Rest sie nichts angeht. Die Firma musste dafür sagen, was ihr gehört. *Bring your own Agent* verlangt dasselbe für die KI-Nutzung: Der Harness bleibt der des Mitarbeiters, ob er mit Claude, Copilot oder Gemini läuft. Die Organisation bekommt darin ihr Paket, die Skills, Regeln und Beispiele, die aus einem generischen Modell einen Mitarbeiter dieser Firma machen.

![Aufgeklappter Werkzeugkoffer eines Handwerkers voller eigener, über Jahre gesammelter Werkzeuge, darin ein einzelner coral-roter Einsatz mit den Werkzeugen der Firma: Der Harness gehört dem Mitarbeiter, die Organisation bekommt darin ihr Paket.](/images/perspektiven/bring-your-own-agent-hero.webp)

Die Grenze ist weniger scharf als beim Telefon. Ein Skill, der festhält, wie ich einen Mediaplan aufbaue, ist Firmenprozess und persönliches Handwerk zugleich, und was ich auf Kosten der Firma über meine Arbeit gelernt habe, lässt sich nicht sauber in zwei Dateien teilen. Entwickler ziehen die Linie deshalb nicht am Inhalt, sondern am Gebrauch: Was das Team benutzt, gehört ins Repository und wird dort geprüft; was nur ich benutze, bleibt bei mir. Die Organisation kann damit nur beanspruchen, was sie auch pflegt, und die Grenze ziehen und überwachen muss sie selbst.

## Wem gehört das Skill-Repository?

Ein Skill, der festlegt, was ein guter Mediaplan ist, codiert eine Entscheidung, die bisher ein Senior im Kopf hatte, im besten Fall auch in einer Vorlage. Ein Skill, der die Unterlagen für die Verwaltungsratssitzung aufbereitet, codiert, was der Verwaltungsrat sehen soll und was nicht. Wer das Paket der Firma pflegt, entscheidet über Prozesse und Qualität der Arbeit. Damit ist die Frage nach dem Repository eine Frage der Macht, und aus demselben Grund [bleibt sie meistens unbeantwortet](/perspektiven/unsichtbare-reorganisation/): Wer Macht hält, hat wenig Anreiz, sich selbst in eine Datei zu schreiben, die andere lesen und ändern können.

Entwickler haben dieses Problem nicht über Anreize gelöst, sondern über Gewohnheiten, die das Werkzeug erzwingt: Code, der nicht im Repository liegt, existiert nicht, und Code, den niemand geprüft hat, nimmt das Repository gar nicht an. Unter dem Namen [InnerSource](https://innersourcecommons.org/documents/books/AdoptingInnerSource.pdf) haben Firmen wie Bosch oder PayPal diese Gewohnheiten aus der Open-Source-Welt in Konzerne getragen, mit gemischtem Erfolg und immer gegen dieselbe Reibung: Teilen kostet den Einzelnen Sichtbarkeit, der Nutzen kommt erst, wenn alle es tun.

Ein privater Harness kennt nur die Fehler, die sein Besitzer selbst gemacht hat. Ein geteilter bringt die Fehler der anderen mit. Der Junior, der den Skill des Seniors nutzt, arbeitet mit dessen Regeln, ohne die zehn Jahre dafür investiert zu haben. So steigt das Niveau im ganzen Team, die Obergrenze aber bleibt, wo sie war: Die Regel lässt sich weitergeben, das Urteil dahinter nicht, und wer nie selbst einen Mediaplan in den Sand gesetzt hat, wird auch mit dem besten Skill keinen Kunden davon überzeugen, dass der Plan gut ist.

## Der Agent aus der Suite

Es gibt einen Weg, sich die Frage zu ersparen: die Suite. Microsoft, Google und Salesforce liefern den Agenten mit dem Firmenpaket im Bündel, und in den meisten Grossunternehmen laufen inzwischen zwei oder drei davon parallel. Für viele Organisationen dürfte das der Weg sein. [Kai Waehner](https://www.kai-waehner.de/blog/2026/04/06/enterprise-agentic-ai-landscape-2026-trust-flexibility-and-vendor-lock-in) nennt die Suiten «trusted but captured»: leistungsfähig, aber das Paket liegt beim Anbieter, in dessen Format, in dessen Konto.

Gibt es ein Repository mit den Anleitungen für die Agenten, das ein zweiter Agent eines anderen Herstellers lesen könnte? Wenn ja, kann die Firma den Anbieter wechseln, ohne ihr Wissen ein zweites Mal aufzuschreiben. Wenn nein, kostet der Wechsel so viel wie der Aufbau, und der Anbieter weiss das bei der nächsten Lizenzverhandlung. Denselben Preis zahlt die Firma, wenn die Leute gehen, in deren Konten das Wissen liegt.

Für ein Schweizer KMU wiegt das schwerer als für einen Konzern, weil das Wissen auf weniger Köpfe verteilt ist. Angenommen, bei einem Vermarkter hat ein Innendienst-Mitarbeiter seinem Agenten beigebracht, wie eine Kombi-Offerte über drei Titel gerechnet wird, mit den Rabattstufen und den Ausnahmen für die zwei grössten Kunden, die in keinem CRM stehen. Kündigt er, kennt der Agent seines Nachfolgers weder die Rabattstufen noch die Ausnahmen.

Die Frage nach dem Tool kommt damit an zweiter Stelle. Vorher steht die Abmachung zwischen Organisation und Mitarbeitern: Was von dem, was sie ihren Agenten beibringen, gehört wem?
