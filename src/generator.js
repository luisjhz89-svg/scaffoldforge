import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

function normalizeProjectName(value) {
  return String(value || 'my-app')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-app';
}

export const templates = {
  'react-vite': {
    label: 'React + Vite',
    description: 'A lightweight React app with Vite, JSX and CSS starter files.'
  },
  'node-express': {
    label: 'Node + Express',
    description: 'A REST API starter with Express, environment config and health-check route.'
  }
};

export function listTemplates() {
  return Object.entries(templates).map(([id, meta]) => ({ id, ...meta }));
}

export function sanitizeProjectName(name) {
  return normalizeProjectName(name);
}

export async function generateProject({
  projectName,
  templateName = 'react-vite',
  description = 'A project generated with ScaffoldForge',
  outputDir = process.cwd()
}) {
  const safeTemplate = templates[templateName] ? templateName : 'react-vite';
  const safeProjectName = sanitizeProjectName(projectName);
  const templateDir = path.join(rootDir, 'templates', safeTemplate);
  const projectDir = path.join(outputDir, safeProjectName);

  await fs.mkdir(projectDir, { recursive: true });

  await copyTemplateDir(templateDir, projectDir, {
    projectName: safeProjectName,
    projectSlug: safeProjectName,
    description,
    appName: safeProjectName.replace(/-/g, ' ')
      .split(' ')
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(' ')
  });

  return {
    projectName: safeProjectName,
    templateName: safeTemplate,
    projectDir
  };
}

async function copyTemplateDir(sourceDir, targetDir, variables) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true });

  for (const entry of entries) {
    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);

    if (entry.isDirectory()) {
      await fs.mkdir(targetPath, { recursive: true });
      await copyTemplateDir(sourcePath, targetPath, variables);
      continue;
    }

    const content = await fs.readFile(sourcePath, 'utf8');
    const rendered = renderTemplate(content, variables);
    await fs.writeFile(targetPath, rendered, 'utf8');
  }
}

function renderTemplate(content, variables) {
  return content.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (match, key) => {
    return Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match;
  });
}
