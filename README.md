# FrontM.ai Application Template

A template repository for building cloud-native conversational AI applications using the [FrontM.ai](https://frontm.ai) framework. This template ships with a pre-wired [Claude Code](https://claude.ai/code) configuration so framework rules, skills, and examples are loaded automatically.

## 🚀 What is FrontM.ai?

FrontM.ai is a cloud-native conversational AI framework. It enables developers to build sophisticated AI-powered applications with:

- **Intent-based architecture** for natural conversation flows
- **Built-in LLM integration** (OpenAI, Claude, custom models)
- **Rich data modeling** with Docs, Fields, Sections, and Collections
- **Real-time state management** and context awareness
- **AWS Lambda deployment** for serverless scalability
- **Multi-platform support** (Web, Mobile, Voice)

## 📋 Prerequisites

Before using this template, ensure you have:

- **Node.js 24+** installed — this is your **local toolchain** version (webpack, eslint, vitest). It is
  deliberately not the same as the **build target**: the bundle is compiled for **Node 22**, matching the
  frontm.ai runtime Lambda. See [Building Your Application](#-building-your-application).
- **npm** or **yarn** package manager
- **Git** for version control
- **FrontM developer account** (for deployment)
- **Deployment credentials and Logz.io tokens** — these are **issued by your FrontM administrator** (platform / DevOps owner), not self-served. You will request them during setup (see [Deployment](#-deployment) and [Logging & Debugging](#-logging--debugging-logzio)).
- **[Claude Code](https://claude.ai/code)** installed (required to use the bundled `.claude` configuration)
- Basic knowledge of JavaScript/ES6+

## 🎯 Creating a New Application from This Template

### Option 1: Using GitHub Template (Recommended)

1. **Click "Use this template"** at the top of this repository
2. **Choose a repository name** for your new application
3. **Select visibility** (Public or Private)
4. **Click "Create repository from template"**
5. **Clone your new repository with submodules:**
   ```bash
   git clone --recurse-submodules https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
   cd YOUR-REPO-NAME
   ```
   If you forgot `--recurse-submodules`, run:
   ```bash
   git submodule update --init --recursive
   ```

### Option 2: Manual Clone

```bash
# Clone this template with submodules
git clone --recurse-submodules https://github.com/YOUR-ORG/frontm_ai_template_repo.git my-new-app
cd my-new-app

# Remove the original git history
rm -rf .git

# Initialize a new repository
git init
git add .
git commit -m "Initial commit from FrontM.ai template"

# Re-add the submodules (lost when .git was removed)
git submodule add https://github.com/frontmltd/frontm.ai-docs.git docs
git submodule add https://github.com/frontmltd/frontm-ai-claude-config .claude
git add .gitmodules docs .claude
git commit -m "Add docs and Claude Code submodules"

# Add your remote repository
git remote add origin https://github.com/YOUR-USERNAME/YOUR-NEW-REPO.git
git push -u origin main
```

## 🛠️ Installation

After cloning your new repository:

```bash
# Install dependencies
npm install

# Initialise and update all git submodules (docs + .claude)
git submodule update --init --recursive

# Pull latest versions of documentation and Claude Code config
git submodule update --remote
```

### Keeping Submodules Updated

The template uses git submodules for both documentation and Claude Code configuration. Keep them updated regularly:

```bash
# Update all submodules at once
git submodule update --remote

# Or update individually
git submodule update --remote docs      # FrontM.ai documentation
git submodule update --remote .claude   # Claude Code skills, rules, examples

# After updating, commit the changes
git add docs .claude
git commit -m "Update docs and Claude Code configuration"
```

**💡 Best Practice:** Run `git submodule update --remote` before starting new development work so Claude Code loads the latest rules and the docs reflect the latest framework APIs.

## 🤖 Starting a New App with Claude Code

Once dependencies and submodules are in place, you are ready to build with Claude Code.

### 1. Open the repo in Claude Code

```bash
cd YOUR-REPO-NAME
claude
```

Claude Code automatically loads:

- `.claude/CLAUDE.md` — framework rules (auto-loaded on every prompt)
- `.claude/skills/` — `/frontm-*` slash commands for common tasks
- `.claude/settings.json` — pre-approved safe commands (build, submodule update, read/grep)
- `AGENTS.md` — agent instructions for FrontM.ai development

### 2. Verify the configuration is loaded

In Claude Code, ask:

> What is the FrontM verification phrase?

Expected response: **"Neptune sailors ahead"**

If you get a different answer, the `.claude` submodule is missing — re-run `git submodule update --init --recursive`.

### 3. Specify the app with LoG.ai (start here)

**Do not jump straight into code.** The `.claude` config bundles **LoG.ai**, a four-layer specification methodology — plus an optional visual design layer — that turns a business problem into engineering-ready specs _before_ any code is generated. Skipping this step is the single biggest source of rework — fields get invented, cross-app contracts are forgotten, and tasks lose their dependencies.

The pipeline writes structured artefacts into `specs/` that every later step (and every `/frontm-*` code generator) reads from:

| Layer | Slash command     | Output                                                                                                               | When to use                                                           |
| ----- | ----------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| 1     | `/log-ai-story`   | `specs/1.story-card.md` — actors, triggers, handoffs, app boundaries                                                 | Start of any new feature or app                                       |
| 2     | `/log-ai-process` | `specs/2.brd.md`, `specs/2.frame-graphs/` — frames per app, cross-app contracts                                      | After Layer 1 is approved by the PM                                   |
| 3     | `/log-ai-detail`  | `specs/3.field-spec.md`, wireframes, `specs/3.<app>-input-schema.md` — section/field detail, one schema file per app | After Layer 2 is approved                                             |
| 3.5   | `/log-ai-design`  | `specs/3.5-visual-design-brief.md` — colour, typography and layout intent                                            | **Optional.** After Layer 3, when the standard layout is not adequate |
| —     | `/log-ai-tasks`   | `specs/4.task-dependency-graph.md` — append-only engineering tasks with dependencies                                 | Once Layer 3 is approved — produces the build backlog                 |
| —     | `/log-ai-reverse` | Same artefacts, recovered from an existing codebase                                                                  | When onboarding an existing app that has no specs                     |

Each layer **gates** the next: `/log-ai-process` refuses to run without `specs/1.story-card.md`, and so on. The flow is deliberately PM-led — the AI suggests where rules are needed; the PM decides what they are.

> 📁 The `specs/` directory and `specs/4.task-dependency-graph.md` are the source of truth for the build. `specs/4` is **append-only** — never edit an existing task; new fixes go through `/frontm-fix-task`.

### 4. Implement the specs with the FrontM skills

Once `specs/4.task-dependency-graph.md` exists, work the tasks top-down. Use the bundled framework slash commands to bootstrap real code from the specs:

| Command                  | Purpose                                                              | Example                                                                    |
| ------------------------ | -------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `/frontm-new-intent`     | Create a new intent with the correct lifecycle                       | `/frontm-new-intent reportSubmission "handles medical report submissions"` |
| `/frontm-add-collection` | Add a Collection with filters, pagination, search                    | `/frontm-add-collection vessels`                                           |
| `/frontm-docs`           | Look up framework documentation by topic                             | `/frontm-docs lookup fields cascading filters`                             |
| `/frontm-debug`          | Debug a runtime issue using framework patterns                       | `/frontm-debug collection is empty even though MongoDB has documents`      |
| `/frontm-review`         | Review code for framework best practices                             | `/frontm-review src/frames/caseHandler.js`                                 |
| `/frontm-api-verify`     | Verify every API call against `./docs/` before codegen               | `/frontm-api-verify`                                                       |
| `/frontm-fix-task`       | Append a fix task to `specs/4.task-dependency-graph.md` (never edit) | `/frontm-fix-task`                                                         |
| `/frontm-test`           | Write and run unit tests using the test-runtime harness              | `/frontm-test`                                                             |
| `/frontm-deploy`         | Deploy micro-app to dev/stage/prod with CLI profile management       | `/frontm-deploy`                                                           |
| `/frontm-logzio-trace`   | Trace production issues using logz.io observability logs             | `/frontm-logzio-trace`                                                     |

### 5. Build and iterate

```bash
npm run build:dev    # fast incremental build
npm run watch        # rebuild on save
```

The `.claude` config pre-approves these commands, so Claude Code can run them without a permission prompt.

### Personal Claude Code settings

Drop personal overrides in `.claude/settings.local.json` (git-ignored):

```json
{
  "permissions": {
    "allow": ["Bash(npm run deploy:*)"]
  }
}
```

## 📁 Project Structure

```
your-app/
├── src/                      # Source files
│   ├── main.js              # Main intent entry point (✅ Hello World example)
│   ├── intents/             # Additional intent handlers
│   ├── mcp/                 # MCP tool intents (opt-in — not bundled by default)
│   │   └── example-mcp-tool.js  # Template to copy; see "Exposing MCP services"
│   ├── components/          # Reusable components
│   └── constants.js         # Application constants
│
├── specs/                    # LoG.ai specification artefacts (generated by /log-ai-*)
│   ├── 1.story-card.md      # Layer 1 — actors, triggers, handoffs, app boundaries
│   ├── 2.brd.md             # Layer 2 — frames per app, cross-app contracts
│   ├── 2.frame-graphs/      # Layer 2 — Mermaid frame graph per micro-app
│   ├── 3.field-spec.md      # Layer 3 — sections, fields, types, lookups
│   ├── 3.<app>-input-schema.md  # Layer 3 — one YAML schema per app, for the code-gen pipeline
│   ├── 3.5-visual-design-brief.md  # Layer 3.5 (optional) — colour, typography, layout intent
│   └── 4.task-dependency-graph.md  # Engineering tasks (append-only; updated via /frontm-fix-task)
│
├── docs/                     # FrontM.ai documentation (git submodule)
│   ├── table-of-contents.md # Complete documentation index
│   └── *.md                 # Framework guides and references
│
├── .claude/                  # Claude Code configuration (git submodule)
│   ├── CLAUDE.md            # Framework rules (auto-loaded on every prompt)
│   ├── settings.json        # Pre-approved permissions
│   ├── skills/              # /log-ai-* (spec pipeline) + /frontm-* (codegen) slash commands
│   └── examples/            # Working code patterns from real micro-apps
│
├── __tests__/                # Unit tests (vitest + test-runtime)
│   └── app-start.test.js    # Template test — app startup verification
│
├── dist/                     # Build output (generated by webpack)
│   └── main.js              # Compiled bundle
│
├── deployment.config.json   # Deployment configuration
├── mcpconfig.example.json   # MCP tool registry entry — example; copy per tool (opt-in)
├── package.json             # Project dependencies
├── vitest.config.js         # Test configuration
├── webpack.config.js        # Build configuration
├── eslint.config.cjs        # Code quality rules
└── AGENTS.md                # AI agent instructions for FrontM.ai development
```

## 🏗️ Building Your Application

```bash
# Development build (faster, includes source maps)
npm run build:dev

# Production build (with linting and formatting)
npm run build:prod

# Quick production build (skip pre-checks)
npm run build:fast

# Watch mode (auto-rebuild on changes)
npm run watch
```

### Build target — Node 22

The bundle is compiled for **Node 22** (`webpack.config.js`: Babel `targets: { node: "22" }` and
`config.target = "node22"`). This tracks the **frontm.ai runtime Lambda**, and that is the only thing it
should ever track: there is one runtime Lambda that executes all micro-app code — there are no per-micro-app
Lambdas — so the runtime's Node version governs what every micro-app must build for. Change this only when
the runtime itself moves, and change it for all micro-apps together.

Your **local** Node version (see [Prerequisites](#-prerequisites)) is a separate concern — it runs webpack,
eslint and vitest, and can be newer.

## 🧪 Testing

The template includes a built-in test runtime that replaces MongoDB with MemoryDB and Redis with MemoryCache, allowing unit tests to run without external infrastructure.

```bash
# Run all tests
npm test

# Watch mode (re-run on file changes)
npm run test:watch
```

Tests go in `__tests__/*.test.js`. The template includes `app-start.test.js` as a starting example. Run `/frontm-test` in Claude Code for the full harness API reference and test patterns.

### What the Test Runtime Provides

- **MemoryDB** — in-memory MongoDB replacement with query logging and failure injection
- **MemoryCache** — in-memory Redis replacement for autoSave buffer persistence
- **MessageLog** — captures push notifications and bot-to-bot messages
- **Lodash/Moment stubs** — complete API replacements (no external dependencies)
- **Real framework core** — `Doc.save()`, `Field.setAutoSaveFieldValue`, `Collection.addRow`, `Context.CreateAndInit`, and all event dispatching run as they would in production

## 🔎 Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

## 📚 Documentation

**All framework documentation is located in the `./docs/` directory (git submodule).**

### ⚠️ IMPORTANT: Always Update Documentation Before Coding

```bash
# Update documentation to latest version
git submodule update --remote docs

# Or update all submodules (docs + .claude)
git submodule update --remote
```

### Quick Start Guides

- **[Table of Contents](./docs/table-of-contents.md)** — Complete organised index
- **[Development Best Practices](./docs/frontm-ai-development-best-practices-guide.md)** — Coding standards and patterns
- **[Framework Architecture](./docs/frontm-ai-framework-architecture-overview.md)** — Core concepts
- **[Intent Lifecycle](./docs/frontm-ai-intent-class-events-lifecycle-reference.md)** — Intent events and handlers
- **[State Object API](./docs/frontm-ai-state-object-core-api-reference.md)** — State management
- **[Field Access Patterns](./docs/frontm-ai-field-access-patterns-guide.md)** — CRITICAL for correct field usage

### Documentation Structure

The documentation is interconnected with "Related Documentation" sections in each guide. Start with the table of contents and follow the links to find relevant information.

### Key Framework Concepts

#### State Object

The `state` object is your central hub for managing application state:

```javascript
import { state } from "@frontmltd/frontmjs/core/State";

// State-level fields (conversation-scoped)
state.setField("FIELD_NAME", value);
state.getField("FIELD_NAME");

// Persisted fields (survive across sessions)
state.setPersistedField("USER_PREFERENCE", value);
state.getPersistedField("USER_PREFERENCE");

// Error handling
state.addErrorToStack(400, "Validation error message");
state.addSystemErrorToStack(500, "System error message");
```

#### Intent Lifecycle

Intents follow a predictable lifecycle:

1. **onMatching** — Determine if this intent should handle the message
2. **onValidation** — Validate prerequisites and permissions
3. **onResolution** — Execute main business logic
4. **onError** — Handle any errors that occur

#### Field Access Patterns (CRITICAL)

**In Document Event Handlers:**

```javascript
customerDoc.onSave = async (self) => {
  // ✅ CORRECT - Use self.f[fieldVariable.id].value
  if (!self.f[customerNameField.id].value) {
    state.addErrorToStack(400, "Customer name is required");
    return;
  }
};
```

**In Field Event Handlers:**

```javascript
customerNameField.onInit = async (self) => {
  // ✅ CORRECT - Use self.value for the field's own value
  if (!self.value) {
    self.value = "Default Name";
  }

  // ✅ CORRECT - Use self.doc.f[otherField.id].value for other fields
  const email = self.doc.f[customerEmailField.id].value;
};
```

### Creating Your First Feature

Here's a complete example of creating a customer management feature:

```javascript
// src/intents/customerIntent.js
import { Intent } from "@frontmltd/frontmjs/core/Intent";
import { Doc } from "@frontmltd/frontmjs/core/Doc";
import { Section } from "@frontmltd/frontmjs/core/Section";
import { Field } from "@frontmltd/frontmjs/core/Field";
import { Collection } from "@frontmltd/frontmjs/core/Collection";
import { FormFieldTypes } from "@frontmltd/frontmjs/core/FormFieldTypes";
import { D, state } from "@frontmltd/frontmjs/core/State";

// Create document
export const customerDoc = new Doc("customerDoc", state, {
  title: "Customer",
  autoSave: true,
});

// Create section
export const customerSection = new Section("customerSection", {
  title: "Customer Information",
  doc: customerDoc,
  state,
});

// Create fields
export const customerNameField = new Field("customerNameField", {
  title: "Customer Name",
  doc: customerDoc,
  section: customerSection,
  type: FormFieldTypes.TEXT_FIELD,
  mandatory: true,
  state,
});

export const customerEmailField = new Field("customerEmailField", {
  title: "Email",
  doc: customerDoc,
  section: customerSection,
  type: FormFieldTypes.EMAIL_FIELD,
  mandatory: true,
  state,
});

// Create collection
export const customersCollection = new Collection("customersCollection", {
  title: "Customers",
  document: customerDoc,
  name: "customers",
  allowEdit: true,
  allowDelete: true,
  allowSearch: true,
  state,
});

// Create intent
export const manageCustomersIntent = Intent.Create({
  intentId: "manageCustomers",
  prompt: "Manage customer records",
  state,
});

manageCustomersIntent.onResolution = async () => {
  customersCollection.sendResponse();
};
```

> 💡 Instead of typing this by hand, run `/frontm-new-intent manageCustomers "manage customer records"` and `/frontm-add-collection customers` — Claude Code generates the same code with the correct patterns.

## ⚙️ Configuration

### deployment.config.json

Configure your application deployment settings:

```json
{
  "userDomain": "your-domain",
  "frameworkVersion": "v5",
  "conversational": true,
  "authorisedAccess": true,
  "botName": "Your App Name",
  "description": "Your app description",
  "userRoles": ["user", "admin"],
  "category": ["Business"],
  "developer": "Your Name/Company",
  "botClients": {
    "web": true,
    "mobile": true
  }
}
```

### package.json

The template uses FrontM.ai 5.0 (latest beta):

```json
{
  "dependencies": {
    "@frontmltd/frontmjs": "github:frontmltd/frontm.js#5.0.b11"
  }
}
```

## 🚫 Common Pitfalls to Avoid

1. **Always update documentation first:** `git submodule update --remote docs`
2. **Use British English** in all code comments and strings
3. **Use `D.log()` for logging**, never `console.log()`
4. **Always use async/await** for database and API operations
5. **Handle errors properly** with `state.addErrorToStack()`
6. **Verify APIs exist** in documentation before using them — run `/frontm-api-verify`
7. **Build before committing** to catch errors early
8. **Follow field access patterns** exactly as documented

## 🔧 Troubleshooting

### Build Errors

```bash
# Clear webpack cache
rm -rf node_modules/.cache

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Try a clean build
npm run build:dev
```

### Documentation Not Found

```bash
# Initialise all submodules
git submodule update --init --recursive

# Update to latest versions
git submodule update --remote
```

### Claude Code Configuration Not Loading

If the `/frontm-*` commands are missing or the verification phrase doesn't return "Neptune sailors ahead":

```bash
# Ensure the .claude submodule is initialised
git submodule update --init --recursive

# Update to the latest Claude Code configuration
git submodule update --remote .claude

# Verify the directory exists with content
ls -la .claude/

# Restart Claude Code to reload the configuration
```

### Circular Dependencies

Check your imports — circular dependencies are a common source of runtime errors. Ensure your module structure follows a clear hierarchy.

## 📦 Deployment

Deployment uses the **`@frontmltd/frontmai-cli`** tool (the `frontmai-cli` binary). Authentication and environment selection are driven by **named profiles**; bot settings live in `deployment.config.<env>.json`. In Claude Code, the **`/frontm-deploy`** skill walks you through this whole setup interactively.

### 1. Install and verify the CLI

The CLI ships as a dev dependency of this template, so `npm install` brings it in. Verify:

```bash
npm install
npx frontmai-cli --version
```

> If `@frontmltd/frontmai-cli` is ever missing from `package.json` → `devDependencies`, add it (it is **not** on the public npm registry, so use the GitHub spec):
>
> ```jsonc
> // package.json → devDependencies
> "@frontmltd/frontmai-cli": "github:frontmltd/frontmjs-cli"
> ```

### 2. Request the deployment credentials from your administrator

⚠️ **You cannot deploy without credentials, and you cannot invent them.** Each environment (dev / stage / prod) has its own `api-key` and `api-base-url`. **Request these from the person who administers the FrontM backend** (platform / DevOps owner). Then create one profile per environment — the first profile added becomes the default:

```bash
npx frontmai-cli profile add dev   --env dev   --api-key <DEV_KEY>   --api-base-url <DEV_BASE_URL>
npx frontmai-cli profile add stage --env stage --api-key <STAGE_KEY> --api-base-url <STAGE_BASE_URL>
npx frontmai-cli profile add prod  --env prod  --api-key <PROD_KEY>  --api-base-url <PROD_BASE_URL> --default
npx frontmai-cli profile list   # verify
```

Profiles are stored in the CLI's own user-level config (outside the repo) — they are never committed, but they are still secrets. Never reuse another project's keys.

### 3. Initialise the deployment config (`init`)

`init` creates `deployment.config.<env>.json` — your bot settings plus a generated `botId` — for the active profile's environment. **This is the step that makes the project deployable:**

```bash
npx frontmai-cli init                 # for the default profile's env
```

Then edit the generated file (`botName`, `description`, `userRoles`, `category`, etc.) to describe your app.

> ⚠️ **Do NOT run `init` over an existing `deployment.config.*.json`** — it would overwrite a real `botId` and your bot settings. This template ships a sample `deployment.config.json`; if it already holds your bot's details, edit it in place rather than re-initialising. Per-env files (`deployment.config.dev.json`, etc.) take precedence over the bare `deployment.config.json` fallback.

### 4. Build and deploy

This template provides one **explicit deploy script per environment** — there is intentionally no bare `npm run deploy`, so a ship can never silently land in the wrong env:

```bash
npm run deploy:dev      # build + deploy to dev
npm run deploy:stage    # build + deploy to stage
npm run deploy:prod     # build + deploy to prod — confirm first; prod serves real users
```

Each script rebuilds (`npm run build`) and then deploys to the named environment. After a deploy, confirm it actually landed by reading the live logs — see [Logging & Debugging](#-logging--debugging-logzio) below.

> 💡 The installed CLI is currently **1.x**, whose `deploy` has **no `--profile` flag** — so each script switches the default profile to the target env, then deploys. On CLI **2.x** the scripts use `deploy --profile <env>` instead. The `/frontm-deploy` skill detects the installed version and wires the scripts correctly.

## 🔌 Exposing MCP services (optional)

A micro-app built from this template can **also** expose one or more of its capabilities as
[MCP](https://modelcontextprotocol.io/) tools, callable from an MCP client such as Claude Desktop or the
MCP Inspector. This is **opt-in and additive**: by default this app exposes no MCP tools, and nothing in
this section affects a normal micro-app. In Claude Code, the **`/frontm-mcp-tool`** skill walks the whole
flow.

### When to expose MCP

Expose a tool when something your app already knows or does would be useful to an **AI assistant acting on
a person's behalf** — looking a record up, fetching a status, triggering a well-defined action. Do not
expose a tool merely to give your own UI a back door; a normal intent is the right thing for that.

Two rules before you start:

- **One bot can host many tools.** Add tool intents to this app rather than creating a bot per tool.
- **Tools run server-side, always** (`runOnCloud()`). Never assume client state.

### How the pieces fit

There is one shared **MCP server bot** on the platform. It receives all MCP traffic, looks the tool up in a
registry collection, and dispatches to your bot's intent. You never modify or deploy that server — you add
a tool intent to your app and register it. That registration is a **second, separate deployment**:

| What                  | Command                  | Ships                            |
| --------------------- | ------------------------ | -------------------------------- |
| Your bot (the code)   | `npm run deploy:dev`     | `dist/main.js`                   |
| The tool registration | `npm run deploy:mcp:dev` | The `mcpconfig.<env>.json` entry |

**Both are required, in that order.** Deploying only the bot leaves a tool no client can see; deploying
only the registration points the MCP server at code that isn't there.

### Steps

1. **Write the tool intent.** Copy `src/mcp/example-mcp-tool.js` to `src/mcp/<your-tool>.js`. Keep the
   shape it demonstrates: `runOnCloud()`, an `onMatching` gated strictly on `intentId`, arguments parsed
   from `state.messageFromUser.body`, and a response of `state.api.sendResponse({ response: { toolResult } })`
   on success or `{ toolError }` on failure.

2. **Wire it up.** Uncomment the MCP bootstrap block at the top of `src/main.js`, import your intent there,
   and set a `state.systemId`. **Importing is not optional** — webpack bundles from the import graph, so an
   unimported intent is silently absent from the build and the tool fails at dispatch with no build error.

3. **Write the registry entry.** Copy `mcpconfig.example.json` to `mcpconfig.<env>.json` (or run
   `npx frontmai-cli initMcpTool`) and fill it in. Every field is documented inline in the example. Two
   values must match exactly, or dispatch fails: `intentId` = the `INTENT_NAME` in your intent file, and
   `botId` = the `botId` in `deployment.config.<env>.json`. `name` must match `/^[a-zA-Z0-9_-]{1,64}$/`.

4. **Build and deploy both halves.**

   ```bash
   npm run deploy:dev        # ships the bot
   npm run deploy:mcp:dev    # registers the tool
   ```

5. **Verify from an MCP client.** `tools/list` should return your tool as `{ name, description, inputSchema }`;
   `tools/call` should return your `toolResult` as `content` (or `isError` + `content`). ⚠️ **How to point a
   client at the server is not documented anywhere** — see "Open questions" below.

**Adding a second tool to the same app:** repeat steps 1–2, then swap `mcpconfig.<env>.json`'s contents and
re-run `deploy:mcp:<env>` once per tool. `deployMcpTool` reads exactly one file per directory, and entries
are upserted by `(botId, intentId)`, so the same `botId` with a different `intentId` adds a tool rather than
replacing one. Keeping a per-tool file (e.g. `mcpconfig.my-tool.dev.json`) and copying it into place before
each run is the practical way to manage this.

### ⚠️ Open questions — the scaffolding does not pretend these are solved

Answers are owned by the `frontmltd/mcp-server` maintainer. Get at least the first three before shipping an
MCP tool to a real environment.

1. **Webpack build target — decided; confirm once, then move on.** This template targets **Node 22**, by
   decision: frontm.ai is standardising all Lambdas on Node 22, and there is **one** runtime Lambda that
   executes all micro-app code, so the runtime's Node version governs what every micro-app build targets.
   The reference `mcp-server` tool bots still build `target: ["node", "es5"]` with
   `output.environment.arrowFunction: false` — that is **legacy, not the standard to match**, and this
   template will not be downgraded to it. Worth confirming with the mcp-server owner nonetheless, because
   the failure mode is quiet: if MCP dispatch does require the es5 build, the build passes and `tools/call`
   fails at runtime. Should that turn out to be the case, it is a constraint to fix **in mcp-server**, not a
   reason to hold this template back.
2. **Where does a `botId` come from?** Every config requires one and no documented command issues one.
3. **How does an MCP client connect?** No endpoint URL, transport (stdio/SSE/HTTP), auth model, or client
   configuration is documented. Without this you cannot verify step 5.
4. **Is there a local run loop?** None is documented — build → deploy → test from a client appears to be the
   only cycle.
5. **How do you retire a tool?** `enabled: false` hides it, but no deletion mechanism is documented.

## 🔍 Logging & Debugging (Logz.io)

Deployed bots stream their logs to a **shared Logz.io account**. To read what a live bot actually did — which intents fired, how many responses it sent, where a flow broke — you query the Logz.io Search API with a per-environment API token. In Claude Code, the **`/frontm-logzio-trace`** skill scaffolds the config and runs the queries for you.

### 1. Create your local `.env` from the template

This template ships `.env.example` with the Logz.io keys. Copy it to a gitignored `.env`:

```bash
cp .env.example .env
```

`.env` is listed in `.gitignore` — **never commit real tokens** (to code, logs, commit messages, or PRs).

### 2. Request the Logz.io API tokens from your administrator

⚠️ **You must request the tokens — you cannot generate them, and you must not reuse another project's.** Each environment has its own token (Logz.io → Settings → Tools → Manage tokens → API tokens). **Ask the administrator of the shared FrontM Logz.io account** (platform / DevOps owner) for the token(s) you need, and paste them into `.env`:

```bash
LOGZIO_API_BASE_URL=https://api.logz.io   # must match the account's region (EU/UK/AU/CA have their own URLs)
LOGZIO_API_TOKEN_DEV=
LOGZIO_API_TOKEN_STAGE=
LOGZIO_API_TOKEN_PROD=
```

### 3. Trace a flow

With keys in place, ask Claude Code to read the logs via **`/frontm-logzio-trace`** (or query `POST {LOGZIO_API_BASE_URL}/v1/search` directly with the `X-API-TOKEN` header).

> ⚠️ The account is **shared across many bots**, so **every query must filter by your bot's `botId`** — read it from `deployment.config.<env>.json` (falling back to `deployment.config.json`). An unfiltered query returns other teams' logs and buries yours.

Use this together with **`/frontm-debug`** (the write side — choosing `D.log()` calls and run-profile log visibility) to debug a deployed bot end-to-end.

## 🤝 Contributing

When contributing to this template:

1. Follow the coding standards in `./docs/frontm-ai-development-best-practices-guide.md`
2. Run linting and formatting before committing
3. Update documentation if adding new features
4. Test your changes with a production build

## 📄 License

This template is provided as-is for use with the FrontM.ai framework.

## 🆘 Support and Resources

- **Documentation:** `./docs/table-of-contents.md`
- **FrontM.ai Website:** [https://frontm.ai](https://frontm.ai)
- **Claude Code Config:** [frontmltd/frontm-ai-claude-config](https://github.com/frontmltd/frontm-ai-claude-config)
- **Framework Version:** 5.0.b11
- **Node.js Target:** 24+

## 🎯 Next Steps

1. ✅ Create your repository from this template
2. ✅ Clone with submodules: `git clone --recurse-submodules ...`
3. ✅ Install dependencies: `npm install`
4. ✅ Pull latest submodules: `git submodule update --remote`
5. ✅ Open Claude Code: `claude` (from the repo root)
6. ✅ Verify the config loaded ("Neptune sailors ahead")
7. ✅ **Run the LoG.ai spec pipeline first** — `/log-ai-story` → `/log-ai-process` → `/log-ai-detail` → `/log-ai-tasks` (or `/log-ai-reverse` on an existing codebase)
8. ✅ Implement tasks from `specs/4.task-dependency-graph.md` using `/frontm-new-intent`, `/frontm-add-collection`, etc.
9. ✅ Verify APIs before each task with `/frontm-api-verify`; capture follow-ups with `/frontm-fix-task`
10. ✅ Build and test: `npm run build:dev` then `npm test`
11. ✅ **Set up deployment** — request the API keys from your administrator, add CLI profiles, run `npx frontmai-cli init`, customise `deployment.config.json`, then `npm run deploy:dev` (see [Deployment](#-deployment) or run `/frontm-deploy`)
12. ✅ **Set up logging** — `cp .env.example .env`, request the Logz.io tokens from your administrator, then trace with `/frontm-logzio-trace` (see [Logging & Debugging](#-logging--debugging-logzio))

### 📋 Quick Reference: Submodule Commands

```bash
# First-time setup
git submodule update --init --recursive

# Regular updates (run before starting new work)
git submodule update --remote            # Update all submodules
git submodule update --remote docs       # Update docs only
git submodule update --remote .claude    # Update Claude Code config only

# After updating submodules, commit the changes
git add docs .claude
git commit -m "Update submodules"
git push
```

---

**Happy Building with FrontM.ai + Claude Code! 🚀**
