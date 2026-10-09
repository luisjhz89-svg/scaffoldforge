import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { generateProject } from '../src/generator.js';
import { listTemplates, sanitizeProjectName } from '../src/templates.js';

test('template list contains project starters', () => {
  const templates = listTemplates();
  assert.ok(templates.some((template) => template.id === 'react-vite'));
  assert.ok(templates.some((template) => template.id === 'node-express'));
  assert.ok(templates.some((template) => template.id === 'paypal-node-express'));
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

    assert.equal(project.projectName, 'paypal-demo');
    assert.equal(packageJson.name, 'paypal-demo');
    assert.match(server, /PayPal API for Paypal Demo/);
    assert.match(server, /api-m\.sandbox\.paypal\.com/);
  } finally {
    await fs.rm(outputDir, { recursive: true, force: true });
  }
});
