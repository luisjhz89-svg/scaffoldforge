const status = document.querySelector('#status');
const buttonContainer = document.querySelector('#paypal-button-container');

function showError(message) {
  status.textContent = message;
}

async function loadCheckout() {
  try {
    const configResponse = await fetch('/api/paypal/config');
    const config = await configResponse.json();
    if (!configResponse.ok) {
      throw new Error(config.error || 'Unable to load PayPal configuration');
    }

    const sdkUrl = new URL('https://www.paypal.com/sdk/js');
    sdkUrl.search = new URLSearchParams({
      'client-id': config.clientId,
      currency: config.currency,
      intent: 'capture'
    });

    const sdkScript = document.createElement('script');
    sdkScript.src = sdkUrl.toString();
    sdkScript.onload = () => {
      window.paypal.Buttons({
        createOrder: async () => {
          const response = await fetch('/api/paypal/orders', { method: 'POST' });
          const order = await response.json();
          if (!response.ok || !order.id) {
            throw new Error(order.error || 'Unable to create PayPal order');
          }
          return order.id;
        },
        onApprove: async (data) => {
          status.textContent = 'Processing payment…';
          const response = await fetch(
            `/api/paypal/orders/${encodeURIComponent(data.orderID)}/capture`,
            { method: 'POST' }
          );
          const capture = await response.json();
          if (!response.ok) {
            throw new Error(capture.error || 'Unable to capture PayPal order');
          }
          status.textContent = capture.status === 'COMPLETED'
            ? 'Payment completed successfully.'
            : `Payment status: ${capture.status || 'unknown'}`;
        },
        onError: () => showError('PayPal checkout failed. Please try again.')
      }).render(buttonContainer).catch(() => {
        showError('Unable to display PayPal checkout.');
      });
      status.textContent = '';
    };
    sdkScript.onerror = () => showError('Unable to load PayPal. Check your connection and configuration.');
    document.head.append(sdkScript);
  } catch (error) {
    showError(error.message || 'Unable to initialize PayPal checkout.');
  }
}

loadCheckout();
