# ScaffoldForge

ScaffoldForge is a CLI generator that creates product-ready starter projects for modern software stacks. It helps teams skip repetitive boilerplate setup and start building value faster.

## Why it exists
Most projects lose time in setup work:
- creating folders and configuration
- writing README files
- setting environment variables
- preparing a minimal app shell
- bootstrapping frontend or backend structure

ScaffoldForge turns that into a one-command workflow.

## Included templates
- React + Vite
- Node + Express
- Fullstack Node + React

## Product vision
The project is designed to grow into a real commercial product:
- free tier: basic templates
- pro tier: premium templates and export features
- enterprise tier: private templates and support
- custom services: onboarding, custom template creation, implementation support

## Installation

From the repo root:

```bash
npm install
node bin/scaffoldforge.js list
```

If you want it available globally:

```bash
npm install -g .
scaffoldforge list
```

## Usage

```bash
scaffoldforge init my-dashboard --template react-vite --description "Analytics dashboard"
scaffoldforge init service-api --template node-express --description "Backend API starter"
scaffoldforge init fullstack-app --template fullstack-node-react --output ./projects
```

## Commands

```bash
scaffoldforge list
scaffoldforge help
scaffoldforge version
scaffoldforge init my-app --template react-vite
```

## Roadmap

### MVP
- CLI project generator
- template listing
- React + Vite template
- Node + Express template
- basic validation and docs

### v1.0
- advanced templates
- template preview and metadata
- stronger CLI UX
- custom template library

### v2.0
- premium templates
- private templates for teams
- SaaS platform for template publishing
- dashboard and billing integration

## Monetization model

This project has a clear product path:

- basic tier: free open templates
- pro tier: premium templates and generator settings
- enterprise tier: private templates and support
- services: custom template development and onboarding

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
│   ├── node-express/
│   └── fullstack-node-react/
├── test/
│   └── scaffoldforge.test.js
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT
