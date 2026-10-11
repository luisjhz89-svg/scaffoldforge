# Fingerprint by Estudio Legal Mx

{{description}}

Copyright © 2026 Estudio Legal Mx. All rights reserved. See `LICENSE`.

## Scope

This is a cross-platform SDK starter, not a finished biometric product. It provides a platform-neutral API, a browser WebAuthn adapter, and a contract for native adapters. WebAuthn/passkeys let the device's authenticator perform local user verification; a site cannot assume that verification used a fingerprint rather than a PIN or another supported method. Android, iOS, Windows, and Linux integrations must use their supported system authentication APIs through platform-specific adapters.

The SDK never reads or stores fingerprint images or biometric templates. Biometric verification remains on the user's device. WebAuthn challenges, registration, and authentication responses must be verified by a trusted server; this starter does not include that server.

## Quick start

```js
import { createFingerprintSDK, createWebAuthnAdapter } from './src/index.js';

const adapter = createWebAuthnAdapter({
  getRegistrationOptions: async () => {
    const response = await fetch('/webauthn/registration/options', {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Could not get registration options');
    return response.json();
  },
  verifyRegistration: async (credential) => {
    const response = await fetch('/webauthn/registration/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credential)
    });
    if (!response.ok) throw new Error('Registration verification failed');
    return response.json();
  },
  getAuthenticationOptions: async () => {
    const response = await fetch('/webauthn/authentication/options', {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Could not get authentication options');
    return response.json();
  },
  verifyAuthentication: async (credential) => {
    const response = await fetch('/webauthn/authentication/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credential)
    });
    if (!response.ok) throw new Error('Authentication verification failed');
    return response.json();
  }
});

const fingerprint = createFingerprintSDK({ adapter });
const result = await fingerprint.authenticate();
```

The server must issue fresh, unpredictable challenges; validate the relying-party ID, origin, challenge, and credential; and enforce session and rate-limit policies. Serve browser flows over HTTPS (except localhost in development). Never treat a client-side result as proof until the server verifies it.

## Platform adapter contract

Provide an adapter with `register(options)` and `authenticate(options)` methods, then pass it to `createFingerprintSDK({ adapter })`. Native adapters should delegate user verification to platform APIs (for example, Android `BiometricPrompt`, Apple `LocalAuthentication`, and the supported Windows/Linux authentication mechanism), and return only the minimum result needed by the application. Do not add biometric capture, template storage, or a custom matching implementation.

## Development

```bash
npm test
```

The proprietary license notice is a starter notice, not legal advice. Confirm ownership and licensing terms with counsel before distribution.
