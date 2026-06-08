import type { Config, Context } from '@netlify/edge-functions';

// Proxy zwischen der NewsletterSignup-Form und der MailerLite-Subscribers-API.
// Der API-Token verlässt nie den Server: Browser → diese Funktion → MailerLite.
//
// DOI-Flow: Der Subscriber wird mit status `unconfirmed` angelegt. MailerLite
// verschickt die Confirmation-Mail nur, wenn der Account-Toggle «Double opt-in
// for API and integrations» aktiv ist UND der Status `unconfirmed` lautet.
// Niemals `active` setzen – der Kontakt wird erst nach Klick auf den
// Bestätigungslink aktiv (DSGVO/DSG).

const MAILERLITE_ENDPOINT = 'https://connect.mailerlite.com/api/subscribers';

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export default async (request: Request, _context: Context) => {
  if (request.method !== 'POST') {
    return json(405, { ok: false, error: 'method_not_allowed' });
  }

  let payload: { email?: unknown; website?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json(400, { ok: false, error: 'invalid_body' });
  }

  // Honeypot: echte Menschen lassen das Feld leer. Gefüllt = Bot → still ok.
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json(200, { ok: true });
  }

  const email = typeof payload.email === 'string' ? payload.email.trim() : '';
  // Bewusst nachsichtige Validierung – die strikte Prüfung macht MailerLite.
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { ok: false, error: 'invalid_email' });
  }

  const token = Deno.env.get('MAILERLITE_API_TOKEN');
  if (!token) {
    console.error('newsletter-signup: MAILERLITE_API_TOKEN fehlt');
    return json(500, { ok: false, error: 'server_misconfigured' });
  }

  // Group-ID entsteht erst in der MailerLite-UI; bis dahin ohne Group posten.
  const groupId = Deno.env.get('MAILERLITE_GROUP_ID');

  const body: Record<string, unknown> = { email, status: 'unconfirmed' };
  if (groupId) body.groups = [groupId];

  let mlResponse: Response;
  try {
    mlResponse = await fetch(MAILERLITE_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error('newsletter-signup: MailerLite unreachable', err);
    return json(502, { ok: false, error: 'upstream_unreachable' });
  }

  // 200 = bestehender Subscriber aktualisiert, 201 = neu angelegt.
  if (mlResponse.ok) {
    return json(200, { ok: true });
  }

  if (mlResponse.status === 422) {
    return json(422, { ok: false, error: 'invalid_email' });
  }

  const detail = await mlResponse.text();
  console.error(`newsletter-signup: MailerLite ${mlResponse.status}`, detail);
  return json(502, { ok: false, error: 'upstream_error' });
};

export const config: Config = {
  path: '/api/newsletter-signup',
};
