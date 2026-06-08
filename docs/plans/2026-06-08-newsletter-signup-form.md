# Newsletter Signup-Form (MailerLite)

Stand: 2026-06-08 · Quelle: Akasha-Vault, Story «fumu.ch Newsletter – Signup-Form» (Epic «fumu.ch Newsletter – Einführung»). Self-contained – alle nötigen Daten stehen hier.

## Kontext

fumu.ch bekommt einen Newsletter über MailerLite (EU-Hosting, Double-Opt-in). Erster Baustein ist ein Anmeldeformular – damit Subscriber sich eintragen, bevor Template und Versand-Skill stehen. Bewusst **kein** MailerLite-Embed-Snippet (iframe, Fremd-Branding, Token-Frage), sondern eine eigene Form im editorialen fumu-Layout, die über eine serverseitige Funktion an die MailerLite-Subscribers-API postet. MailerLite ist bereits versandbereit: Domain verifiziert, DKIM/SPF/DMARC gesetzt, Sender `jochen.witte@fumu.ch`.

## Akzeptanzkriterien (aus der Vault-Story)

- Custom-Astro-Form, die über eine serverseitige Funktion an die MailerLite-Subscribers-API postet – kein Embed, Token nie im Browser.
- Double-Opt-in-Flow funktioniert: Confirmation-Mail kommt an, Link führt den Subscriber auf `confirmed`-Status.
- Datenschutz-Erklärung auf fumu.ch um einen Newsletter-Passus ergänzt.
- Die eigene `/newsletter`-Landingpage ist **Inkrement 2** und nicht Teil dieses Plans.

## Technische Eckpunkte

- **DOI über die API:** Die Subscribers-API verschickt die Confirmation-Mail nur, wenn (a) der Account-Toggle «Double opt-in for API and integrations» aktiv ist **und** (b) der Subscriber mit `status: unconfirmed` angelegt wird. Niemals `status: active` setzen (DSGVO-widrig) – der Kontakt wird erst nach Klick auf den Bestätigungslink aktiv. Es gibt **eine** gemeinsame DOI-Mail für alle API-Signups. Quelle: MailerLite Help, «How to use double opt-in when collecting subscribers». Der Toggle und die DOI-Mail werden in der MailerLite-UI eingerichtet (kein Repo-Task, siehe Rückkanal).
- **Token:** `MAILERLITE_API_TOKEN` als Netlify Environment Variable, nur serverseitig gelesen. Subscribers-Endpoint und Feldnamen gegen `developers.mailerlite.com` prüfen (POST an die Subscribers-Ressource, Bearer-Auth, `status: unconfirmed`, optional Group-Zuordnung).
- **Funktion:** Als Edge Function (Deno) konsistent zur bestehenden `netlify/edge-functions/markdown-negotiation.ts` – oder der im Repo etablierten Funktions-Konvention folgen. Honeypot-Feld gegen Bots, definierter Erfolgs-/Fehler-Rückgabeweg (Redirect oder JSON, je nach Form-Variante).
- **Platzierung (final, 2026-06-08):** Zwei Iterationen in der lokalen Abnahme:
  1. Erst Form direkt am Ende jeder Perspektive **und** im Footer → wirkte doppelt (zwei identische Formulare kurz hintereinander).
  2. Dann eine dedizierte `/newsletter`-Landingpage (Vorbild ben-evans.com/newsletter), Post-Ende und Footer nur verlinkt.
  3. **Final:** Newsletter mit der Kontaktseite zusammengelegt. Die Form ist ein Abschnitt auf `/kontakt` (Anker `#newsletter`), die Seite heisst **«Kontakt & Newsletter»** (H1, `<title>`, Haupt-Nav-Label, `kontakt.md`-Titel). Post-Ende (`src/pages/perspektiven/[...slug].astro`) und Footer (`src/components/Footer.astro`) zeigen einen dezenten CTA-Link auf `/kontakt/#newsletter`. Eigene `/newsletter`-Seite wieder entfernt.
- **Datenschutz:** `src/content/pages/datenschutz.md` um den MailerLite-Passus (Anbieter, EU-Hosting DE/NL, gespeicherte Daten, Widerrufsweg).
- **Styling:** fumu-Custom-Properties aus `src/styles/global.css`, kein Framework.

## Schritte

- [x] 1. Serverseitige Funktion (Edge Function) als Proxy: nimmt E-Mail + Honeypot entgegen, postet an die MailerLite-Subscribers-API mit `status: unconfirmed` und Group-Zuordnung, Token aus `MAILERLITE_API_TOKEN`. Erfolg/Fehler sauber zurückgeben. → `netlify/edge-functions/newsletter-signup.ts` (Pfad `/api/newsletter-signup`); `/api/*` in `markdown-negotiation.ts` ausgenommen. Group-ID kommt aus optionaler Env-Var `MAILERLITE_GROUP_ID` (kein Hardcoding).
- [x] 2. `NewsletterSignup.astro`-Komponente: E-Mail-Feld, Consent-Hinweis mit Link auf die Datenschutz-Seite, Honeypot, POST an die Funktion. fumu-Styling. → Progressive Enhancement (Inline-Feedback per fetch, Fallback klassischer POST); `heading`/`lead` optional.
- [x] 3. Einbinden (final): Form ist ein Abschnitt auf `/kontakt` (`src/pages/kontakt.astro`, Anker `#newsletter`); Seite umbenannt zu «Kontakt & Newsletter» (auch `kontakt.md`-Zwilling und Haupt-Nav-Label in `Header.astro`). Post-Ende in `[...slug].astro` und Footer in `Footer.astro` verlinken auf `/kontakt/#newsletter`. `llms.txt`-Kontaktzeile angepasst (`llms-full.txt` zieht über die pages-Collection automatisch nach).
- [x] 4. Newsletter-Passus in `datenschutz.md` ergänzen. → neuer Abschnitt 2.5, plus Einträge in Drittweitergabe (3) und Speicherdauer (5).
- [x] 5. `npm run build` grün. → 18 Seiten, Build-Output verifiziert (Form auf Posts doppelt, sonst nur Footer; Script gebündelt).
- [ ] 6. DOI-Flow end-to-end testen (setzt den MailerLite-Toggle **und** die Netlify-Env-Vars voraus, siehe Rückkanal): echte Test-Mail eintragen, Confirmation klicken, Subscriber erscheint in MailerLite als `confirmed`.

## Entscheidungen

- Custom-Form statt Embed – volle Gestaltung im editorialen Layout, kein iframe-Branding, keine Token-Exposition im Browser.
- DOI läuft über MailerLites eigenen API-DOI-Mechanismus, kein eigener Bestätigungs-Schritt im Code.
- ~~`/newsletter`-Landingpage erst als Inkrement 2.~~ **Final 2026-06-08:** Keine separate Newsletter-Seite. Newsletter wurde mit der Kontaktseite zusammengelegt («Kontakt & Newsletter», Form-Abschnitt unter `/kontakt/#newsletter`), Post-Ende und Footer verlinken dorthin. Damit ist auch das Haupt-Nav-Label angepasst (vorher nur «Kontakt»).
- Offen für den Vault: finaler Wortlaut des Newsletter-Abschnitts auf der Kontaktseite, des Consent-Texts in der Form und der CTA-Microcopy («Newsletter abonnieren»). Aktuell stehen sachliche Defaults.

## Rückkanal

- **MailerLite-UI-Config macht Jochen:** Toggle «Double opt-in for API and integrations» aktivieren, DOI-Mail texten, Group für die Newsletter-Subscriber anlegen. Ohne den Toggle testet sich Schritt 6 nicht. Status zurück in die Vault-Story «fumu.ch Newsletter – Signup-Form».
- **Netlify-Env-Vars (Jochen) – nötig, bevor Schritt 6 testbar ist:**
  - `MAILERLITE_API_TOKEN` = API-Token aus MailerLite (Integrations → API). Nur serverseitig, nie ins Repo.
  - `MAILERLITE_GROUP_ID` = `189718879025497454` (von Jochen geliefert, 2026-06-08). Optional – fehlt sie, wird der Subscriber ohne Group angelegt.
  Beide unter Netlify → Site configuration → Environment variables setzen, danach Redeploy.
- Inhaltliche Fragen (Consent-Text, Datenschutz-Wortlaut) gehören in den Vault, nicht hier entscheiden.
- Checkboxen beim Abarbeiten direkt in diesem File pflegen.
