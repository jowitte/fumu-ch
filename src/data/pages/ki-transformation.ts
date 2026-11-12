import type { PageContent } from './types';

/**
 * Pillar 1. Quelle der Copy ist die Vault-Notiz «Pillar - KI-Transformation»
 * (Akasha-Vault, Aufwände/fumu Marketing/fumu.ch). Hier nie umformulieren –
 * nur aus dem Vault nachziehen.
 *
 * Bauplan (Referenz «Pillar-Architektur fumu.ch»): Lead fängt die Suchfrage
 * ein, dann belegte Analyse, Anlass-Brücke, Formate als Ausgang, FAQ und
 * verwandte Perspektiven.
 */
export const kiTransformation: PageContent = {
  title: 'KI-Transformation',
  heading: 'KI-Transformation: warum Pilotprojekte überzeugen und der ROI trotzdem ausbleibt',
  hero: {
    src: '/images/pillars/ki-transformation-organigramm.svg',
    alt: 'Oben, überschrieben mit ‹Punktlösung: Jeder hat ein Werkzeug, die Organisation bleibt, wie sie ist›, ein Organigramm mit Geschäftsleitung, drei Bereichen und sechs Teams, jedes Team mit eigenem KI-Werkzeug. Unten, überschrieben mit ‹Systemlösung: Dieselben Teams, eine Ebene weniger, entlang des Prozesses›, dieselben sechs Teams ohne die Ebene der Bereiche, nebeneinander vom Kundenwunsch bis zur Erfüllung, darunter die KI als gemeinsamer Prozess.',
    caption:
      'Punktlösung und Systemlösung an derselben Organisation: Oben bekommt jedes Team ein KI-Werkzeug, unten ändern sich Ebenen und Übergaben mit.',
  },
  description:
    'KI-Transformation. Pilotprojekte laufen, in der Erfolgsrechnung taucht davon wenig auf. Woran das liegt und welche drei Fragen zusammen zu klären sind.',
  // Direkt hinter /was-wir-tun/ (2) in llms-full.txt, Platz für die übrigen Pillars.
  order: 2.1,
  intro: [
    'In den meisten Unternehmen ist KI längst angekommen. Lizenzen sind gekauft, Pilotprojekte laufen, einzelne Teams sind spürbar schneller geworden. Nur in der Erfolgsrechnung taucht davon wenig auf: Die Kosten sind sichtbar, der Ertrag nicht.',
    'Das liegt selten an den gewählten KI-Tools und fast nie an den Mitarbeitern. Es liegt daran, dass ein Werkzeug in einen Prozess geschoben und der Prozess selbst nicht angepasst wurde. Wer schneller tippt, während die Freigaben, Rollen und Übergaben unverändert bleiben, produziert schneller dasselbe Ergebnis mit mehr Stau.',
    'KI-Transformation heisst, drei Fragen zugleich zu beantworten: was technisch machbar ist, ob sich der Umbau rechnet und welche Prozesse, Rollen und Zuständigkeiten sich dafür mitverändern müssen. Die letzte ist meist die schwerste. Sie fällt leicht zwischen IT und Geschäftsleitung hindurch, und wo jemand sie stellt, wird sie gern umgangen. Ihre Antwort verschiebt Zuständigkeiten, und solange die Pilotprojekte überzeugen, eröffnet kaum jemand diesen Streit.',
  ],
  sections: [
    {
      label: 'Was die Forschung zeigt',
      items: [
        {
          kind: 'item',
          body: [
            '2025 nutzten in den USA ',
            {
              label: '40 Prozent der Beschäftigten',
              href: 'https://www.gallup.com/workplace/691643/work-nearly-doubled-two-years.aspx',
              external: true,
            },
            ' KI bei der Arbeit, fast doppelt so viele wie 2023. Im selben Jahr sahen in einer ',
            {
              label: 'Studie des MIT-Projekts NANDA',
              href: 'https://fortune.com/2025/08/18/mit-report-95-percent-generative-ai-pilots-at-companies-failing-cfo',
              external: true,
            },
            ' 95 Prozent der untersuchten Organisationen keinen messbaren Ertrag aus generativer KI. Laut der Studie steigern die Werkzeuge die Produktivität Einzelner, nicht das Ergebnis des Unternehmens.',
          ],
        },
        {
          kind: 'item',
          body: [
            'In ',
            { em: 'Power and Prediction' },
            ' beschreiben die Ökonomen Ajay Agrawal, Joshua Gans und Avi Goldfarb, dass KI fast überall als ',
            { strong: 'Punktlösung' },
            " eingesetzt wird: ein besseres Werkzeug in einem unveränderten Prozess. Als Beleg verweisen sie auf eine Erhebung des US Census Bureau bei über 300'000 Firmen. Schon vor der generativen KI setzten Firmen KI vor allem ein, um bestehende Prozesse zu automatisieren, und ihre Produktivität stieg kaum. Produktivität entsteht erst, wenn sich auch die Prozesse davor und danach mitverändern; die Autoren nennen das die ",
            { strong: 'Systemlösung' },
            '. Sie kann bis zum Geschäftsmodell reichen: Ein Versicherer, der Schäden vorhersagen kann, kann sein Geschäftsfeld auf die Schadensvermeidung ausweiten, statt nur das Risiko abzusichern.',
          ],
        },
        {
          kind: 'item',
          body: [
            'Wo die Systemlösung ausbleibt, verändert sich die Organisation trotzdem, nur ungeplant: Rollen weiten sich aus, ohne dass jemand sie neu beschreibt, Kompetenzen wandern zwischen Funktionen, Arbeit sickert in Momente, die vorher Pausen waren. Das geschieht von unten und freiwillig, ohne dass es jemand beschlossen hat oder verantwortet. Der Artikel zur ',
            { label: 'unsichtbaren Reorganisation', href: '/perspektiven/unsichtbare-reorganisation/' },
            ' zeichnet das an vier unabhängigen Forschungsbefunden nach.',
          ],
        },
        {
          kind: 'item',
          body: [
            'Der Zeitgewinn, den die Werkzeuge bringen, kommt dabei oft nicht im Ergebnis an, er ist nur verschoben. Wer mit KI schneller wird, gibt die Urteilsarbeit an den Empfänger weiter: Ein KI-Entwurf sieht aus wie fertige Arbeit, aber niemand hat geurteilt und niemand haftet. Wenn ein erster Entwurf nichts mehr kostet, fällt zugleich der Filter weg, der schwache Ideen früher ',
            { label: 'aussortiert hat', href: '/perspektiven/mehr-output-weniger-wert/' },
            '.',
          ],
        },
        {
          kind: 'item',
          body: 'Eine Transformation wird entscheidbar, sobald die Frage lautet, welcher Prozess sich ändern muss, damit der Gewinn im Betriebsergebnis ankommt. Dazu gehören zwei weitere Fragen: ob das technisch machbar ist und ob sich die Änderung rechnet. Beantworten lassen sich alle drei nur zusammen.',
        },
      ],
    },
    {
      label: 'Wo Sie stehen',
      items: [
        {
          kind: 'item',
          body: 'Wo ein Unternehmen mit diesen Fragen steht, zeigt meist schon der erste Satz einer Anfrage. «Wie optimieren wir unsere Prozesse mit KI?» fragt, wer die Werkzeuge schon hat und den Prozess sucht, an dem sich der Umbau zuerst rechnet. Wer sagt «Bei uns laufen lauter KI-Initiativen, aber niemand hält sie zusammen», dem fehlt die Richtung: welche Prozesse sich im ganzen Unternehmen ändern sollen, in welcher Reihenfolge und wer das entscheidet.',
        },
        {
          kind: 'item',
          body: 'Ist entschieden, welche Prozesse sich ändern, steht der Umbau selbst an. Rollen und Zuständigkeiten verschieben sich, und jemand muss die neuen Prozesse neben dem laufenden Geschäft einführen.',
        },
      ],
    },
    {
      label: 'Wie wir arbeiten',
      id: 'formate',
      items: [
        {
          kind: 'item',
          title: 'KI-Wertstromanalyse',
          tag: 'vier Wochen',
          body: 'Ein Wertstrom reicht vom Kundenwunsch bis zu dessen Erfüllung und läuft dabei durch mehrere Prozesse und Abteilungen. Wir wählen mit Ihnen einen solchen Wertstrom aus, messen jeden Schritt und zeigen, wo KI Durchlaufzeit oder Fehler senken kann, was das einbringt und womit Sie am besten starten. Weil die Analyse über die Prozessgrenzen hinausgeht, sieht sie auch die Übergaben, an denen ein Zeitgewinn sonst hängen bleibt.',
        },
        {
          kind: 'image',
          src: '/images/pillars/ki-wertstromanalyse-zeitbalken.svg',
          alt: 'Zeitachse eines Prozesses mit fünf Schritten: Auftrag klären 1 Stunde, Planen 4 Stunden, Umsetzen 8 Stunden, Prüfen 3 Stunden, Abrechnen 1 Stunde. Dazwischen liegen Wartezeiten von 2, 5, 1 und 3 Tagen, die längste nach dem Planen ist hervorgehoben.',
          caption: 'Beispiel: 13 Tage Durchlaufzeit, davon 17 Stunden Arbeit.',
        },
        {
          kind: 'item',
          title: 'Strategische Begleitung',
          tag: '8 bis 16 Wochen',
          body: 'Wir holen die laufenden KI-Initiativen ins Gesamtportfolio des Unternehmens, denn sie konkurrieren mit allen anderen Vorhaben um dasselbe Budget und dieselben Leute. Mit der Geschäftsleitung bewerten wir jedes Vorhaben nach Nutzen, Aufwand und Risiko und entscheiden, welche ausgebaut, zusammengelegt oder gestoppt werden. Daraus entsteht der Umsetzungsplan: welche Prozesse sich in welcher Reihenfolge ändern, was das kostet, was es einbringt und wer künftig über neue Vorhaben entscheidet.',
        },
        {
          kind: 'item',
          title: 'KI-Implementierung',
          tag: 'nach Vorhaben',
          body: 'Wir setzen die beschlossenen KI-Anwendungen im Betrieb auf, zusammen mit den Teams, deren Prozesse sich ändern.',
        },
        {
          kind: 'item',
          body: [
            'Die Formate bauen aufeinander auf. Wo Sie einsteigen, klären wir in einem ersten Gespräch über Ihre Lage. Schreiben Sie uns über die ',
            { label: 'Kontaktseite', href: '/kontakt/' },
            ' oder an ',
            { label: 'hello@fumu.ch', href: 'mailto:hello@fumu.ch' },
            '.',
          ],
        },
      ],
    },
    {
      label: 'Häufige Fragen',
      id: 'faq',
      items: [
        {
          kind: 'item',
          title: 'Warum zeigen so viele KI-Piloten keinen Ertrag?',
          body: 'Meist, weil das Werkzeug in einen Prozess gesetzt wird, der derselbe bleibt. Der Einzelne arbeitet schneller, doch Freigaben, Übergaben und Rollen bleiben unverändert, und dort versickert der Zeitgewinn. In einer Studie des MIT-Projekts NANDA sahen 95 Prozent der untersuchten Organisationen 2025 keinen messbaren Ertrag aus generativer KI. Messbar wird der Ertrag in der Regel erst, wenn sich der Prozess mitverändert.',
        },
        {
          kind: 'item',
          title: 'Was heisst KI-Transformation konkret, wenn das Kerngeschäft weiterlaufen muss?',
          body: 'Es heisst, einen Prozess nach dem anderen umzubauen, während das Geschäft daneben weiterläuft. Begonnen wird dort, wo sich ein veränderter Prozess am klarsten rechnet. Jeder Umbau liefert die Zahlen, auf die sich der nächste Entscheid stützt.',
        },
        {
          kind: 'item',
          title: 'Wo fängt man an, wenn der grösste Ansatzpunkt nicht offensichtlich ist?',
          body: 'Bei den Prozessen: wo Arbeit wartet, wo sie doppelt geprüft wird, wo eine Übergabe hängt. An diesen Stellen entscheidet sich, ob ein Zeitgewinn im Ergebnis ankommt. Hinweise liefern auch die KI-Initiativen, die schon laufen, weil sie zeigen, wo die Mitarbeiter selbst den Engpass sehen. Unsere KI-Wertstromanalyse misst diese Stellen über einen ganzen Wertstrom, vom Kundenwunsch bis zu seiner Erfüllung, ordnet sie nach Zeitverlust und zeigt je Schritt, wo KI hilft und was sie voraussetzt.',
        },
        {
          kind: 'item',
          title: 'Woran erkennt man, ob eine KI-Transformation Prozesse ändert oder das Geschäftsmodell?',
          body: 'Daran, ob sich ändert, was die Kunden kaufen. Solange nur die interne Arbeit anders läuft, geht es um Prozesse: dieselbe Leistung zu anderen Kosten. Die Grenze ist fliessend, denn ein konsequenter Prozessumbau kann beim Angebot ankommen. Ein Versicherer, der Schäden vorhersagen kann, könnte neben der Police auch Schadensvermeidung verkaufen.',
        },
        {
          kind: 'item',
          title: 'Welche Rolle übernimmt die Geschäftsleitung, welche die IT?',
          body: 'Die Geschäftsleitung entscheidet, welche Prozesse sich ändern, was die Änderung einbringen muss und wer danach wofür zuständig ist. Die IT beurteilt, was technisch machbar ist, und baut es. Schwierig wird es, wenn KI als IT-Projekt läuft. Dann soll die IT auch den Geschäftsnutzen belegen und die neuen Zuständigkeiten regeln, über die sie nicht entscheidet.',
        },
        {
          kind: 'item',
          title: 'Wie lange dauert es, bis eine KI-Strategie im Tagesgeschäft wirkt?',
          body: 'Unsere KI-Wertstromanalyse dauert vier Wochen und benennt neben dem Umbau auch Quick Wins, die ohne eigenes Projekt starten. Bis feststeht, welche Prozesse sich im ganzen Unternehmen ändern, dauert die Strategische Begleitung acht bis sechzehn Wochen. Im Tagesgeschäft wirkt die Strategie, sobald der erste Prozess umgestellt ist. Wie schnell das geht, hängt vor allem daran, wann Rollen und Zuständigkeiten neu verteilt sind. Wer vorher festlegt, woran die Wirkung gemessen wird, sieht sie früher, weil der Streit über die Messgrösse entfällt.',
        },
        {
          kind: 'item',
          title: 'Was unterscheidet KI-Strategie-Beratung von einer KI-Schulung?',
          body: 'Eine Schulung macht die Mitarbeiter im Umgang mit dem Werkzeug sicher. Das ist nötig, denn ein umgebauter Prozess funktioniert nur mit Leuten, die das Werkzeug beherrschen. Welcher Prozess sich ändern muss und ob sich das rechnet, beantwortet die Schulung aber nicht, das klärt die Beratung mit der Geschäftsleitung. Schulungen bieten wir zusammen mit unserem Partner, der Akademie KI, an, ausgerichtet auf die Prozesse, die sich ändern.',
        },
      ],
    },
  ],
  relatedPerspektiven: {
    label: 'Weiterlesen',
    slugs: ['bring-your-own-agent', 'wer-bildet-noch-aus', 'wenn-maschinen-einkaufen', 'ende-der-billigen-kampagne'],
  },
};
