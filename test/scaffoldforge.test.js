import test from 'node:test';
import assert from 'node:assert/strict';
import { listTemplates, sanitizeProjectName } from '../src/templates.js';

test('template list contains project starters', () => {
  const templates = listTemplates();
  assert.ok(templates.some((template) => template.id === 'react-vite'));
  assert.ok(templates.some((template) => template.id === 'node-express'));
});

test('project names are normalized', () => {
  assert.equal(sanitizeProjectName('My App!'), 'my-app');
  assert.equal(sanitizeProjectName('  demo_project  '), 'demo-project');
  assert.equal(sanitizeProjectName('___'), 'my-app');
});
