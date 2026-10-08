import { getTemplateById, listTemplates, sanitizeProjectName } from './templates.js';
import { generateProject } from './generator.js';

function printHeader() {
  console.log(`
╔══════════════════════════════════════╗
║        ScaffoldForge CLI           ║
╚══════════════════════════════════════╝
`);
}

function printHelp() {
  printHeader();
  console.log(`Usage:
  scaffoldforge list
  scaffoldforge init <project-name> --template <template-name> [--description "Project description"] [--output <path>]
  scaffoldforge help
  scaffoldforge version

Available templates:
${listTemplates().map((template) => `  - ${template.id}: ${template.description}`).join('\n')}

Examples:
  scaffoldforge init my-dashboard --template react-vite --description "Analytics dashboard"
  scaffoldforge init service-api --template node-express --description "Backend API starter"
  scaffoldforge init fullstack-app --template fullstack-node-react --output ./projects
`);
}

function parseArgs(args) {
  const options = {
    template: 'react-vite',
    description: 'A project generated with ScaffoldForge',
    output: process.cwd()
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    const next = args[index + 1];

    if ((arg === '--template' || arg === '-t') && next) {
      options.template = next;
      index += 1;
    } else if ((arg === '--description' || arg === '-d') && next) {
      options.description = next;
      index += 1;
    } else if ((arg === '--output' || arg === '-o') && next) {
      options.output = next;
      index += 1;
    }
  }

  return options;
}

export async function main(argv = process.argv.slice(2)) {
  if (argv.length === 0 || argv[0] === 'help' || argv[0] === '--help' || argv[0] === '-h') {
    printHelp();
    return;
  }

  const [command, ...rest] = argv;

  if (command === 'list') {
    printHeader();
    console.log('Available templates:');
    listTemplates().forEach((template) => {
      console.log(`- ${template.id}: ${template.description}`);
    });
    return;
  }

  if (command === 'version' || command === '--version' || command === '-v') {
    console.log('ScaffoldForge v1.0.0');
    return;
  }

  if (command === 'init') {
    const projectName = rest[0];
    if (!projectName) {
      console.error('Missing project name. Usage: scaffoldforge init <project-name>');
      process.exit(1);
    }

    const options = parseArgs(rest.slice(1));
    const template = getTemplateById(options.template);
    if (!template) {
      console.error(`Unknown template: "${options.template}"`);
      console.error('Run: scaffoldforge list');
      process.exit(1);
    }

    const safeName = sanitizeProjectName(projectName);

    try {
      const result = await generateProject({
        projectName: safeName,
        templateName: template.id,
        description: options.description,
        outputDir: options.output
      });

      console.log(`\nProject generated successfully: ${result.projectName}`);
      console.log(`Path: ${result.projectDir}`);
      console.log(`Template: ${result.templateName}`);
      console.log('\nNext steps:');
      console.log(`  cd ${result.projectName}`);
      console.log('  npm install');
      console.log('  npm run dev');
    } catch (error) {
      console.error(`Failed to generate project: ${error.message}`);
      process.exit(1);
    }

    return;
  }

  console.error(`Unknown command: "${command}"`);
  printHelp();
  process.exit(1);
}
