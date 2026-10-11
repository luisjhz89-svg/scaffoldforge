import test from 'node:test';
import assert from 'node:assert/strict';
import { createFingerprintSDK, createWebAuthnAdapter } from '../src/index.js';

test('platform-neutral SDK delegates registration and authentication', async () => {
  const calls = [];
  const sdk = createFingerprintSDK({
    adapter: {
      platform: 'native',
      register: async (options) => calls.push(['register', options]),
      authenticate: async (options) => calls.push(['authenticate', options])
    }
  });

  assert.equal(sdk.platform, 'native');
  await sdk.register({ account: 'demo' });
  await sdk.authenticate({ reason: 'Sign in' });
  assert.deepEqual(calls, [
    ['register', { account: 'demo' }],
    ['authenticate', { reason: 'Sign in' }]
  ]);
  assert.throws(() => createFingerprintSDK(), /adapter is required/);
});

test('WebAuthn adapter converts server options and serializes credentials', async () => {
  const bytes = new Uint8Array([1, 2, 3]).buffer;
  const verified = [];
  const adapter = createWebAuthnAdapter({
    getRegistrationOptions: async () => ({
      challenge: 'AQID',
      user: { id: 'BAUG', name: 'demo', displayName: 'Demo' }
    }),
    verifyRegistration: async (credential) => verified.push(credential),
    getAuthenticationOptions: async () => ({
      challenge: 'AQID',
      allowCredentials: [{ id: 'BAUG', type: 'public-key' }]
    }),
    verifyAuthentication: async (credential) => verified.push(credential),
    credentials: {
      create: async ({ publicKey }) => {
        assert.ok(publicKey.challenge instanceof ArrayBuffer);
        assert.ok(publicKey.user.id instanceof ArrayBuffer);
        return {
          id: 'credential',
          rawId: bytes,
          type: 'public-key',
          response: { attestationObject: bytes, clientDataJSON: bytes },
          getClientExtensionResults: () => ({})
        };
      },
      get: async ({ publicKey }) => {
        assert.ok(publicKey.challenge instanceof ArrayBuffer);
        assert.ok(publicKey.allowCredentials[0].id instanceof ArrayBuffer);
        return {
          id: 'credential',
          rawId: bytes,
          type: 'public-key',
          response: { authenticatorData: bytes, clientDataJSON: bytes, signature: bytes },
          getClientExtensionResults: () => ({})
        };
      }
    }
  });

  await adapter.register();
  await adapter.authenticate();
  assert.equal(verified[0].rawId, 'AQID');
  assert.equal(verified[0].response.attestationObject, 'AQID');
  assert.equal(verified[1].response.signature, 'AQID');
});
