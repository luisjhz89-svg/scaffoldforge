# {{projectName}}

{{description}}

Node.js and Express starter for PayPal Checkout, including a browser checkout page and server-side order endpoints. PayPal credentials stay on the server; the Sandbox environment is selected by default.

## Setup

1. Create a REST app in the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Copy its Sandbox client ID and secret into `.env` (start from `.env.example`).
3. Set `PAYPAL_ORDER_AMOUNT` and `PAYPAL_CURRENCY` to the amount and currency your server will charge.
4. Install dependencies and start the app:

```bash
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:3000` to try the checkout page. Never commit `.env` or expose `PAYPAL_CLIENT_SECRET` in a browser or client application. The client ID is public and is sent to the browser to load the PayPal JavaScript SDK.

## Checkout API

- `GET /` — browser checkout example using the PayPal JavaScript SDK.
- `GET /api/health` — health check.
- `GET /api/paypal/config` — exposes the public client ID and configured currency for the checkout page.
- `POST /api/paypal/orders` — creates a PayPal order using the server-configured amount and currency. Follow the `approve` link in the response to approve the order in the Sandbox.
- `POST /api/paypal/orders/:orderId/capture` — captures an approved order and displays its returned status.

The API obtains and caches OAuth 2.0 access tokens on the server. The default environment is PayPal Sandbox; set `PAYPAL_ENVIRONMENT=live` to use the production API with production credentials.

This starter uses one configured amount as a demo. The checkout page is an example, not a production storefront. Before going live, calculate prices from trusted server-side product data, authenticate and authorize callers, add appropriate abuse protections, implement and verify PayPal webhooks, and fulfill orders only after independently verifying the completed capture. Production integrations and testing outside the US require a PayPal Business account.

## License

The generated starter code is distributed under the MIT License; see `LICENSE`. This license does not grant rights to PayPal trademarks or services, or replace PayPal's own API and account terms. Review PayPal's terms before using the integration.
