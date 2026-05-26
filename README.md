# OneAtlas — AI-Native Runtime App Platform

OneAtlas is an AI-native workspace and metadata-driven platform that matches natural-language prompts to predefined templates, designs complete database schemas and UI layouts, and allows conversational modifications in a secure runtime environment.

---

## Quick Start

Get your local copy running in under 5 commands:

```bash
# 1. Clone the repository
git clone https://github.com/Jana23jk/OneAtlas.git && cd OneAtlas

# 2. Install dependencies
npm install

# 3. Setup environment configuration
cp .env.example .env.local

# 4. Push database schema and populate seed data
npx prisma db push && npx prisma db seed

# 5. Run the local development server
npm run dev
```

---

## Environment Variables

Configure the following variables inside your `.env.local` or environment config:

* **`DATABASE_URL`**: PostgreSQL connection string (optimised for Neon poolers).
* **`DIRECT_URL`**: Non-pooled direct database connection string (used for running migrations).
* **`NEXT_PUBLIC_BASE_URL`**: The deployment public URL of the application, used to generate shareable preview URLs (defaults to `http://localhost:3000` in dev).

---

## Architecture Decisions

### 1. Separate SchemaVersion DB Relation
We model each snapshot version inside a separate `SchemaVersion` database table rather than appending schemas to a JSON array column within the `App` record. This achieves $O(1)$ version lookups by referencing `(appId, version)` tuples directly, enforces complete relational foreign-key database integrity, and prevents single-record size limits (e.g., PostgreSQL row limits) from throttling application version limits.

### 2. Atomic Writes in Prisma Transactions
When creating apps or applying mutations (edits/undos), the operation runs within a structured Prisma `$transaction`. This guarantees atomic operations — if updating the mutable runtime schema, pushing a version snapshot, incrementing version metadata, or compiling the audit log encounters a failure, the entire sequence rolls back. This keeps the workspace immune to partial schema corruption.

### 3. Single Source of Truth Types
The shared [types/app.ts](file:///c:/Users/janak/OneDrive/Desktop/Intern_task/types/app.ts) contains all typescript definitions (such as `AppSchema`, `SchemaComponent`, `SchemaField`, `MutationLogEntry`) and functions as the project's single source of truth. Both backend API logic and client-side Zustand store states import from this module, ensuring that the frontend rendering engine and backend parsing services never drift on schema expectations.

### 4. Pure Functional Mutations
The core schema change service `applyMutation` is designed as a pure function. It accepts a previous schema and a structured mutation payload, returning a brand new mutated schema without side-effects. This design decouples database state and HTTP request lifecycle from business logic, allowing us to unit test mutation transformations independently in isolation.

---

## Project Structure

```
├── app/
│   ├── api/                  # API routes (Generate, Edit, Preview, Undo, History, Health)
│   ├── builder/[appId]/      # App builder workspace routes
│   ├── docs/                 # Documentation views
│   ├── generate/             # AI generation flow views
│   ├── preview/[token]/      # Public schema snapshot previews
│   ├── runtime/              # App runtime environment views
│   ├── templates/            # Templates explorer views
│   ├── globals.css           # Styling system
│   ├── layout.tsx            # App-wide layout
│   └── page.tsx              # Homepage
├── components/
│   ├── builder/              # Builder sub-components (Canvas, TopBar, sidebar tree, properties)
│   ├── home/                 # Home page section mocks
│   ├── layout/               # Global components (Navbar, MobileNav)
│   ├── preview/              # Error previews (NotFound, Expired)
│   ├── templates/            # Templates (FilterBar, Card, Modal)
│   └── ui/                   # Generic elements (Button)
├── config/                   # Configuration lists (site, templates)
├── lib/                      # Shared instances (prisma client, JSON converters)
├── prisma/                   # Prisma models, migrations, and seeds
├── services/                 # Business logic services (matcher, mutations, parsers)
├── store/                    # Zustand stores (generatorStore, builderStore)
└── types/                    # Shared TypeScript declarations
```

---

## API Endpoints

### 1. App Generation
Generates a new app instance by matching a natural language prompt to templates.
```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A CRM with contacts and deal pipeline"}'
```

### 2. Conversational Edits
Modifies an existing schema by interpreting commands (e.g., adding/removing fields).
```bash
curl -X POST http://localhost:3000/api/apps/[appId]/edit \
  -H "Content-Type: application/json" \
  -d '{"instruction": "Add field status to Contacts table"}'
```

### 3. Version Undo
Rolls the app schema back to the previous version snapshot.
```bash
curl -X POST http://localhost:3000/api/apps/[appId]/undo
```

### 4. Create Preview Snapshot
Generates a tokenized public read-only preview URL.
```bash
curl -X POST http://localhost:3000/api/apps/[appId]/preview
```

### 5. Fetch Mutation Logs
Retrieves the list of edit operations made on the app.
```bash
curl -X GET http://localhost:3000/api/apps/[appId]/history
```

### 6. Rename App Detail
Updates the application name.
```bash
curl -X PATCH http://localhost:3000/api/apps/[appId] \
  -H "Content-Type: application/json" \
  -d '{"name": "New App Name"}'
```

---

## What Would Come Next

If given more time, future roadmap milestones would include:
1. **Real AI Embeddings Model:** Replacing the current keyword matcher in `templateMatcher` with an vector search/embeddings service (e.g. OpenAI or Cohere) to handle complex, semantic prompt structures.
2. **WebSockets Collaboration:** Syncing workspace edits in real-time across multiple editors using WebSockets.
3. **Multi-page Application Generates:** Allowing prompts to declare separate dashboards and pages, generating nested routing schemas.
4. **Template Inheritance UI:** Enabling builders to branch and extend base templates directly inside the settings canvas.
