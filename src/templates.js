export const TEMPLATE_DEFINITIONS = {
  'react-vite': {
    id: 'react-vite',
    label: 'React + Vite',
    description: 'Frontend starter for React apps with Vite, CSS, and a minimal landing page.'
  },
  'node-express': {
    id: 'node-express',
    label: 'Node + Express',
    description: 'API starter for Express with environment config and health-check endpoints.'
  },
  'fullstack-node-react': {
    id: 'fullstack-node-react',
    label: 'Fullstack Node + React',
    description: 'A simple full-stack app with a Node API and a React client shell.'
  }
};

export function listTemplates() {
  return Object.values(TEMPLATE_DEFINITIONS);
}

export function getTemplateById(templateId) {
  return TEMPLATE_DEFINITIONS[templateId] || null;
}

export function sanitizeProjectName(value) {
  const cleaned = String(value || 'my-app')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return cleaned || 'my-app';
}
