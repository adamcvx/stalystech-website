exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  if (!process.env.N8N_CONTACT_WEBHOOK_URL) {
    // Netlify Forms still stores the message. Treat forwarding as optional.
    return { statusCode: 200, body: JSON.stringify({ forwarded: false, reason: 'n8n webhook not configured' }) };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const response = await fetch(process.env.N8N_CONTACT_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.N8N_CONTACT_SECRET ? { 'x-stalystech-secret': process.env.N8N_CONTACT_SECRET } : {}),
      },
      body: JSON.stringify({
        source: 'stalystech.com',
        submitted_at: new Date().toISOString(),
        name: payload.name || '',
        email: payload.email || '',
        interest: payload.interest || '',
        message: payload.message || '',
      }),
    });

    if (!response.ok) {
      console.error('n8n contact forward failed', response.status, await response.text());
      return { statusCode: 502, body: JSON.stringify({ forwarded: false }) };
    }

    return { statusCode: 200, body: JSON.stringify({ forwarded: true }) };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ forwarded: false }) };
  }
};
