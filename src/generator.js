import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TEMPLATE_DEFINITIONS, getTemplateById, sanitizeProjectName } from './templates.js';

const rootDir = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

function toTitleCase(value) {
  return String(value || 'My App')
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

export async function generateProject({
  projectName,
  templateName = 'react-vite',
  description = 'A project generated with ScaffoldForge',
  outputDir = process.cwd()
}) {
  const template = getTemplateById(templateName);
  if (!template) {
    const available = Object.keys(TEMPLATE_DEFINITIONS).join(', ');
    throw new Error(`Unknown template: "${templateName}". Available templates: ${available}`);
  }

  const safeProjectName = sanitizeProjectName(projectName);
  const resolvedOutputDir = path.resolve(outputDir);
  const templateDir = path.join(rootDir, 'templates', template.id);
  const projectDir = path.join(resolvedOutputDir, safeProjectName);

  await fs.mkdir(resolvedOutputDir, { recursive: true });
  await fs.mkdir(projectDir, { recursive: true });

  await copyTemplateDir(templateDir, projectDir, {
    projectName: safeProjectName,
    projectSlug: safeProjectName,
    description,
    appName: toTitleCase(safeProjectName)
  });

  return {
    projectName: safeProjectName,
    templateName: template.id,
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
