# ScaffoldForge

ScaffoldForge is a CLI generator that creates ready-to-use starter projects for modern stacks. It helps teams skip the repetitive setup work and focus on product value.

## Why it exists
Most projects lose time in boilerplate:
- creating folders and configs
- writing README files
- setting up environment variables
- preparing a basic app shell

ScaffoldForge turns that work into a fast generator so developers can start coding immediately.

## Included templates
- React + Vite
- Node + Express

## Features
- generate a project in a single command
- fill in project metadata automatically
- create app skeletons with starter files
- keep a clean path for custom projects and premiums

## Installation

From the repo root:

```bash
node bin/scaffoldforge.js list
```

If you want the command available globally:

```bash
npm install -g .
scaffoldforge list
```

## Usage

```bash
scaffoldforge init my-dashboard --template react-vite --description "Analytics dashboard"
scaffoldforge init service-api --template node-express --description "Backend API starter"
```

## Project generation flow

```bash
node bin/scaffoldforge.js init my-app --template react-vite
```

This creates a folder named `my-app` in the current working directory with a starter project.

## Roadmap

### MVP
- support for React + Vite
- support for Node + Express
- project metadata templating
- list command and basic help

### Version 1.0
- additional templates
- live preview support
- export templates as git repositories
- better validation and error handling

### Version 2.0
- premium templates
- private enterprise templates
- team workspace and dashboard
- paid plans for SaaS and support

## Monetization model

ScaffoldForge was designed to support a real product path:

- free tier: basic templates
- pro tier: premium templates, custom metadata, export features
- enterprise tier: private templates and support
- services: onboarding, custom templates, implementation support

This makes it suitable for both OSS adoption and commercial momentum.

## Repository structure

```text
.
├── bin/
│   └── scaffoldforge.js
├── src/
│   ├── cli.js
│   ├── generator.js
│   └── templates.js
├── templates/
│   ├── react-vite/
│   └── node-express/
├── test/
│   └── scaffoldforge.test.js
├── package.json
├── README.md
└── LICENSE
```

## License

MIT
