# ScaffoldForge

ScaffoldForge is a CLI generator for modern starter projects. It helps teams skip repetitive setup and start building product value faster.

## What it does

ScaffoldForge generates ready-to-use starter projects for:
- React + Vite
- Node + Express
- PayPal Checkout + Node + Express
- Full-stack Node + React

## Quick install

From the repository root:

```bash
npm install
npm link
scaffoldforge list
```

You can also install globally directly:

```bash
npm install -g .
scaffoldforge list
```

## Create a project

```bash
scaffoldforge init demo-app --template react-vite --description "Analytics dashboard"
scaffoldforge init api-demo --template node-express --description "Backend API starter"
scaffoldforge init paypal-demo --template paypal-node-express --description "PayPal Checkout API"
scaffoldforge init fullstack-demo --template fullstack-node-react --description "Full-stack starter project"
```

Then:

```bash
cd demo-app
npm install
npm run dev
```

## Deploy the landing page to Vercel

This repository is ready to be deployed as a static site on Vercel.

### Steps

1. Open https://vercel.com
2. Sign in with GitHub
3. Click "Add New Project"
4. Import this repository
5. Use these settings:
   - Framework Preset: Other
   - Build Command: leave empty
   - Output Directory: .
6. Click "Deploy"

Vercel will serve the root `index.html` file and the `styles.css` file automatically.

## Product model

ScaffoldForge is designed as a real product with a clear monetization path:

- Free: basic templates
- Pro: premium templates and advanced generation options
- Enterprise: private templates, team workspaces, onboarding, and support

## Roadmap

### MVP done
- CLI generator
- template list
- React + Vite template
- Node + Express template
- full-stack starter template
- product landing page

### Next
- interactive template selection
- more premium templates
- support for custom metadata and export flows
- dashboard for template catalog and pricing

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
│   ├── paypal-node-express/
│   └── fullstack-node-react/
├── index.html
├── styles.css
├── vercel.json
├── package.json
├── README.md
├── LICENSE
└── .gitignore
```

## License

MIT
