function assertFunction(value, name) {
  if (typeof value !== 'function') {
    throw new TypeError(`${name} must be a function`);
  }
}

export function createFingerprintSDK({ adapter } = {}) {
  if (!adapter || typeof adapter !== 'object') {
    throw new TypeError('An authentication adapter is required');
  }
  assertFunction(adapter.register, 'adapter.register');
  assertFunction(adapter.authenticate, 'adapter.authenticate');

  return Object.freeze({
    platform: adapter.platform || 'custom',
    register: (options) => adapter.register(options),
    authenticate: (options) => adapter.authenticate(options)
  });
}

function decodeBase64Url(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = globalThis.atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='));
  return Uint8Array.from(binary, (character) => character.charCodeAt(0)).buffer;
}

function encodeBase64Url(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return globalThis.btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeCredentialDescriptors(descriptors = []) {
  return descriptors.map((descriptor) => ({
    ...descriptor,
    id: typeof descriptor.id === 'string' ? decodeBase64Url(descriptor.id) : descriptor.id
  }));
}

function normalizeCreationOptions(options) {
  return {
    ...options,
    challenge: typeof options.challenge === 'string'
      ? decodeBase64Url(options.challenge)
      : options.challenge,
    user: {
      ...options.user,
      id: typeof options.user.id === 'string'
        ? decodeBase64Url(options.user.id)
        : options.user.id
    },
    excludeCredentials: normalizeCredentialDescriptors(options.excludeCredentials)
  };
}

function normalizeRequestOptions(options) {
  return {
    ...options,
    challenge: typeof options.challenge === 'string'
      ? decodeBase64Url(options.challenge)
      : options.challenge,
    allowCredentials: normalizeCredentialDescriptors(options.allowCredentials)
  };
}

function serializeCredential(credential) {
  const response = {};
  for (const key of [
    'attestationObject',
    'authenticatorData',
    'clientDataJSON',
    'signature',
    'userHandle'
  ]) {
    if (credential.response[key]) {
      response[key] = encodeBase64Url(credential.response[key]);
    }
  }

  return {
    id: credential.id,
    rawId: encodeBase64Url(credential.rawId),
    type: credential.type,
    response,
    authenticatorAttachment: credential.authenticatorAttachment,
    clientExtensionResults: credential.getClientExtensionResults()
  };
}

function requireCredential(credential) {
  if (!credential) {
    throw new Error('The authenticator did not return a credential');
  }
  return serializeCredential(credential);
}

export function createWebAuthnAdapter({
  getRegistrationOptions,
  verifyRegistration,
  getAuthenticationOptions,
  verifyAuthentication,
  credentials = globalThis.navigator?.credentials
} = {}) {
  assertFunction(getRegistrationOptions, 'getRegistrationOptions');
  assertFunction(verifyRegistration, 'verifyRegistration');
  assertFunction(getAuthenticationOptions, 'getAuthenticationOptions');
  assertFunction(verifyAuthentication, 'verifyAuthentication');

  if (!credentials || typeof credentials.create !== 'function' || typeof credentials.get !== 'function') {
    throw new Error('WebAuthn credentials API is not available in this environment');
  }

  return Object.freeze({
    platform: 'web',
    async register(options) {
      const publicKey = normalizeCreationOptions(await getRegistrationOptions(options));
      const credential = await credentials.create({ publicKey });
      return verifyRegistration(requireCredential(credential));
    },
    async authenticate(options) {
      const publicKey = normalizeRequestOptions(await getAuthenticationOptions(options));
      const credential = await credentials.get({ publicKey });
      return verifyAuthentication(requireCredential(credential));
    }
  });
}
