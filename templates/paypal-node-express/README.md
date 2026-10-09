# {{projectName}}

{{description}}

Node.js and Express API starter for PayPal Checkout. PayPal credentials stay on the server; the Sandbox environment is selected by default.

## Setup

1. Create a REST app in the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Copy its Sandbox client ID and secret into `.env` (start from `.env.example`).
3. Set `PAYPAL_ORDER_AMOUNT` and `PAYPAL_CURRENCY` to the amount and currency your server will charge.
4. Install dependencies and start the API:

```bash
cp .env.example .env
npm install
npm run dev
```

Never commit `.env` or expose `PAYPAL_CLIENT_SECRET` in a browser or client application.

## Checkout API

- `GET /api/health` — health check.
- `POST /api/paypal/orders` — creates a PayPal order using the server-configured amount and currency. Follow the `approve` link in the response to approve the order in the Sandbox.
- `POST /api/paypal/orders/:orderId/capture` — captures an approved order.

The API obtains and caches OAuth 2.0 access tokens on the server. The default environment is PayPal Sandbox; set `PAYPAL_ENVIRONMENT=live` to use the production API with production credentials.

This starter uses one configured amount as a demo. Before going live, calculate prices from trusted server-side product data, authenticate and authorize callers, add appropriate abuse protections, and verify payment state before fulfilling orders. Production integrations and testing outside the US require a PayPal Business account.

## License

The generated starter code is distributed under the MIT License; see `LICENSE`. This license does not grant rights to PayPal trademarks or services, or replace PayPal's own API and account terms. Review PayPal's terms before using the integration.
