import { listTemplates, sanitizeProjectName } from './templates.js';
import { generateProject } from './generator.js';

function printHelp() {
  console.log(`
ScaffoldForge CLI

Usage:
  scaffoldforge list
  scaffoldforge init <project-name> --template <template-name> [--description "Project description"]

Templates:
${listTemplates().map((template) => `  - ${template.id}: ${template.description}`).join('\n')}

Examples:
  scaffoldforge list
  scaffoldforge init my-dashboard --template react-vite --description "Analytics dashboard"
  scaffoldforge init server-api --template node-express --description "Backend API starter"
`);
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.length === 0) {
    printHelp();
    return;
  }

  const [command, ...rest] = argv;

  if (command === 'list') {
    const templates = listTemplates();
    console.log('Available templates:');
    templates.forEach((template) => {
      console.log(`- ${template.id}: ${template.description}`);
    });
    return;
  }

  if (command === 'init') {
    const projectName = rest[0];
    if (!projectName) {
      console.error('Missing project name. Usage: scaffoldforge init <project-name>');
      process.exit(1);
    }

    let templateName = 'react-vite';
    let description = 'A project generated with ScaffoldForge';

    for (let index = 1; index < rest.length; index += 1) {
      const arg = rest[index];
      if ((arg === '--template' || arg === '-t') && rest[index + 1]) {
        templateName = rest[index + 1];
        index += 1;
      } else if ((arg === '--description' || arg === '-d') && rest[index + 1]) {
        description = rest[index + 1];
        index += 1;
      }
    }

    const safeName = sanitizeProjectName(projectName);

    try {
      const result = await generateProject({
        projectName: safeName,
        templateName,
        description,
        outputDir: process.cwd()
      });

      console.log(`Project generated successfully at: ${result.projectDir}`);
      console.log(`Template: ${result.templateName}`);
      console.log('Next steps:');
      console.log(`  cd ${result.projectName}`);
      if (result.templateName === 'react-vite') {
        console.log('  npm install');
        console.log('  npm run dev');
      } else {
        console.log('  npm install');
        console.log('  npm run dev');
      }
    } catch (error) {
      console.error(`Failed to generate project: ${error.message}`);
      process.exit(1);
    }

    return;
  }

  printHelp();
}
