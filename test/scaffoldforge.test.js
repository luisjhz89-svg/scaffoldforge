import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { generateProject } from '../src/generator.js';
import { listTemplates, sanitizeProjectName } from '../src/templates.js';

test('template list contains project starters', () => {
  const templates = listTemplates();
  assert.ok(templates.some((template) => template.id === 'react-vite'));
  assert.ok(templates.some((template) => template.id === 'node-express'));
  assert.ok(templates.some((template) => template.id === 'paypal-node-express'));
  assert.ok(templates.some((template) => template.id === 'fingerprint-sdk'));
});

test('project names are normalized', () => {
  assert.equal(sanitizeProjectName('My App!'), 'my-app');
  assert.equal(sanitizeProjectName('  demo_project  '), 'demo-project');
  assert.equal(sanitizeProjectName('___'), 'my-app');
});

test('PayPal template generates a configured project', async () => {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scaffoldforge-'));

  try {
    const project = await generateProject({
      projectName: 'PayPal Demo',
      templateName: 'paypal-node-express',
      description: 'PayPal API demo',
      outputDir
    });
    const packageJson = JSON.parse(
      await fs.readFile(path.join(project.projectDir, 'package.json'), 'utf8')
    );
    const server = await fs.readFile(path.join(project.projectDir, 'src/server.js'), 'utf8');
    const license = await fs.readFile(path.join(project.projectDir, 'LICENSE'), 'utf8');
    const checkoutPage = await fs.readFile(path.join(project.projectDir, 'public/index.html'), 'utf8');
    const checkoutScript = await fs.readFile(
      path.join(project.projectDir, 'public/checkout.js'),
      'utf8'
    );

    assert.equal(project.projectName, 'paypal-demo');
    assert.equal(packageJson.name, 'paypal-demo');
    assert.match(server, /PayPal API for Paypal Demo/);
    assert.match(server, /api-m\.sandbox\.paypal\.com/);
    assert.match(server, /\/api\/paypal\/config/);
    assert.match(checkoutPage, /PayPal Checkout demo/);
    assert.match(checkoutScript, /\/api\/paypal\/orders/);
    assert.match(checkoutScript, /window\.paypal\.Buttons/);
    assert.match(license, /^MIT License/);
    assert.match(license, /Permission is hereby granted/);
  } finally {
    await fs.rm(outputDir, { recursive: true, force: true });
  }
});

test('Fingerprint SDK template generates a private branded project with usable adapters', async () => {
  const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), 'scaffoldforge-'));

  try {
    const project = await generateProject({
      projectName: 'Fingerprint SDK',
      templateName: 'fingerprint-sdk',
      description: 'Cross-platform biometric authentication SDK',
      outputDir
    });
    const packageJson = JSON.parse(
      await fs.readFile(path.join(project.projectDir, 'package.json'), 'utf8')
    );
    const license = await fs.readFile(path.join(project.projectDir, 'LICENSE'), 'utf8');
    const readme = await fs.readFile(path.join(project.projectDir, 'README.md'), 'utf8');
    const sdk = await import(pathToFileURL(path.join(project.projectDir, 'src/index.js')));

    assert.equal(packageJson.name, 'fingerprint-sdk');
    assert.equal(packageJson.license, 'UNLICENSED');
    assert.match(license, /© 2026 Estudio Legal Mx/);
    assert.match(readme, /Fingerprint by Estudio Legal Mx/);

    const calls = [];
    const adapter = {
      platform: 'test',
      register: async (options) => {
        calls.push(['register', options]);
        return { verified: true };
      },
      authenticate: async (options) => {
        calls.push(['authenticate', options]);
        return { verified: true };
      }
    };
    const api = sdk.createFingerprintSDK({ adapter });
    assert.deepEqual(await api.register({ userId: 'user-1' }), { verified: true });
    assert.deepEqual(await api.authenticate({ reason: 'Sign in' }), { verified: true });
    assert.equal(api.platform, 'test');
    assert.deepEqual(calls, [
      ['register', { userId: 'user-1' }],
      ['authenticate', { reason: 'Sign in' }]
    ]);
  } finally {
    await fs.rm(outputDir, { recursive: true, force: true });
  }
});
