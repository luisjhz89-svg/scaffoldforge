import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);
const publicDir = fileURLToPath(new URL('../public', import.meta.url));
const PAYPAL_API_URLS = {
  sandbox: 'https://api-m.sandbox.paypal.com',
  live: 'https://api-m.paypal.com'
};

let cachedAccessToken;
let tokenExpiresAt = 0;

app.use(express.json());
app.use(express.static(publicDir));

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok', app: '{{projectName}}' });
});

app.get('/api/paypal/config', (request, response) => {
  const currency = process.env.PAYPAL_CURRENCY || 'USD';
  const clientId = process.env.PAYPAL_CLIENT_ID;

  if (!clientId || !/^[A-Z]{3}$/.test(currency)) {
    response.status(500).json({ error: 'PayPal client ID or currency is not configured correctly' });
    return;
  }

  response.json({ clientId, currency });
});

app.post('/api/paypal/orders', async (request, response) => {
  const amount = process.env.PAYPAL_ORDER_AMOUNT || '10.00';
  const currency = process.env.PAYPAL_CURRENCY || 'USD';

  if (!/^\d+(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || !/^[A-Z]{3}$/.test(currency)) {
    response.status(500).json({ error: 'Invalid PayPal order amount or currency configuration' });
    return;
  }

  try {
    const order = await paypalRequest('/v2/checkout/orders', {
      method: 'POST',
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [{ amount: { currency_code: currency, value: amount } }]
      })
    });
    response.status(201).json(order);
  } catch {
    response.status(502).json({ error: 'Unable to create PayPal order' });
  }
});

app.post('/api/paypal/orders/:orderId/capture', async (request, response) => {
  if (!/^[A-Za-z0-9-]{1,128}$/.test(request.params.orderId)) {
    response.status(400).json({ error: 'Invalid PayPal order ID' });
    return;
  }

  try {
    const capture = await paypalRequest(
      `/v2/checkout/orders/${request.params.orderId}/capture`,
      { method: 'POST', body: '{}' }
    );
    response.json(capture);
  } catch {
    response.status(502).json({ error: 'Unable to capture PayPal order' });
  }
});

async function paypalRequest(endpoint, options) {
  const apiUrl = PAYPAL_API_URLS[process.env.PAYPAL_ENVIRONMENT || 'sandbox'];
  if (!apiUrl) {
    throw new Error('PAYPAL_ENVIRONMENT must be sandbox or live');
  }

  const accessToken = await getAccessToken(apiUrl);
  const response = await fetch(`${apiUrl}${endpoint}`, {
    ...options,
    headers: {
      Authorization: 'Bearer ' + accessToken,
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  if (!response.ok) {
    throw new Error('PayPal API request failed');
  }

  return response.json();
}

async function getAccessToken(apiUrl) {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${apiUrl}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('PayPal OAuth request failed');
  }

  const token = await response.json();
  if (!token.access_token || !Number.isFinite(token.expires_in)) {
    throw new Error('PayPal OAuth response is invalid');
  }

  cachedAccessToken = token.access_token;
  tokenExpiresAt = Date.now() + Math.max(0, token.expires_in - 60) * 1000;
  return cachedAccessToken;
}

app.listen(PORT, () => {
  console.log(`PayPal API for {{appName}} is running on http://localhost:${PORT}`);
});
