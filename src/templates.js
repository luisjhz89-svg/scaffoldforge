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

export function sanitizeProjectName(value) {
  return String(value || 'my-app')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'my-app';
}
