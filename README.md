# Full-Stack React Web Template

A full-stack web application template with React frontend and Hono backend, built on top of `npm create vite@latest`'s React+TS template.

## Features

### Frontend
- **React 19** with TypeScript and React Compiler
- **Vite** for fast development and HMR
- **React Router** for client-side routing
- **TanStack Query (React Query)** for data fetching and caching
- **Tailwind CSS v4** & **DaisyUI** for styling
- **Better Auth** React hooks for authentication
- **Vitest** for unit tests
- **Playwright** for e2e tests

### Backend
- **Hono** web framework running on Node.js
- **PostgreSQL** database with Drizzle ORM
- **Better Auth** for authentication (email/password)
- **CORS** configured for development
- Session-based authentication

### Development Experience
- Concurrent dev servers (frontend + backend)
- Hot reload for both client and server
- Type-safe database queries with Drizzle
- ESLint configured with additional rules

## Project Structure

```
.
├── src/                  # Frontend source
│   ├── components/      # React components
│   │   └── ItemsList.tsx
│   ├── lib/             # Shared utilities
│   │   └── auth-client.ts
│   ├── App.tsx
│   └── main.tsx
├── server/              # Backend source
│   ├── index.ts        # Hono server
│   ├── auth.ts         # Better Auth config
│   ├── db.ts           # Database connection
│   └── schema.ts       # Database schema
├── drizzle/            # Database migrations (generated)
├── e2e/                # Playwright tests
└── drizzle.config.ts   # Drizzle configuration
```

## Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local, Docker, or cloud-hosted)

### PostgreSQL Setup Options

**Local Installation:**
```bash
# Install PostgreSQL on your system
# Create a database for your project
```

**Using Docker Compose (Recommended):**
```bash
# A docker-compose.yml file is included for easy setup
docker compose up -d
```

**Using Docker (alternative):**
```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=vite_react_template \
  -p 5432:5432 \
  postgres:16
```

**Cloud Services:**
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)
- [Railway](https://railway.app)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy or edit `.env` and set your database connection:

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
BETTER_AUTH_SECRET=<automatically-generated>
BETTER_AUTH_URL=http://localhost:3000
```

### 3. Initialize Database

Run migrations to set up your PostgreSQL database:

```bash
npm run db:migrate
```

> **Note**: For rapid local development, you can use `npm run db:push` to sync schema changes directly without creating migration files.

### 4. Start Development

Run both frontend and backend servers concurrently:

```bash
npm run dev:all
```

This starts:
- **Frontend**: http://localhost:5173 (Vite dev server)
- **Backend**: http://localhost:3000 (Hono API server)

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend only (Vite dev server) |
| `npm run server:dev` | Start backend only (Hono server with watch mode) |
| `npm run dev:all` | Start both servers concurrently ⭐ |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run test:unit` | Run unit tests with Vitest |
| `npm run test:e2e` | Run e2e tests with Playwright |
| `npm run test:e2e:ui` | Run e2e tests with Playwright UI |
| `npm run db:generate` | Generate SQL migration files from schema changes |
| `npm run db:migrate` | Apply migrations to database |
| `npm run db:push` | Push schema changes directly (for rapid local dev) |
| `npm run db:studio` | Open Drizzle Studio to browse your database |

## Architecture

```
┌─────────────────────────────────────┐
│   Frontend (React + Vite)           │
│   http://localhost:5173             │
│   - React Router                    │
│   - Better Auth Client              │
└─────────────┬───────────────────────┘
              │
              │ fetch() API calls
              │
┌─────────────▼───────────────────────┐
│   Backend (Hono + Node.js)          │
│   http://localhost:3000             │
│   - CORS enabled                    │
│   - Better Auth (/api/auth/*)       │
│   - API routes                      │
└─────────────┬───────────────────────┘
              │
              │ Drizzle ORM
              │
┌─────────────▼───────────────────────┐
│   PostgreSQL Database               │
│   - User authentication tables      │
│   - Your application tables         │
└─────────────────────────────────────┘
```

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Server health check |
| GET | `/health` | Health status |
| GET | `/api/items` | Get mock items (demo endpoint) |
| POST/GET | `/api/auth/**` | Better Auth endpoints |

## Authentication

The template uses [Better Auth](https://www.better-auth.com) for authentication with:
- Email and password authentication
- Session-based auth (cookies)
- Database adapter for PostgreSQL via Drizzle

### Using Auth in Components

```tsx
import { useSession, signIn, signOut } from "./lib/auth-client";

function MyComponent() {
  const { data: session } = useSession();

  if (session) {
    return <div>Logged in as {session.user?.email}</div>;
  }

  return <button onClick={() => signIn.email({ /* ... */ })}>Login</button>;
}
```

## Data Fetching with TanStack Query

The template includes [TanStack Query (React Query)](https://tanstack.com/query) for efficient data fetching, caching, and state management.

### Setup

The `QueryClientProvider` is already configured in `src/main.tsx` with sensible defaults:
- 5-minute stale time for queries
- Disabled refetch on window focus (for development)

### Using Queries

Fetch data from your API with automatic caching and loading states:

```tsx
import { useQuery } from "@tanstack/react-query";

interface Item {
  id: number;
  name: string;
  description: string;
}

function MyComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch("http://localhost:3000/api/items");
      if (!response.ok) throw new Error("Failed to fetch");
      return response.json() as Promise<Item[]>;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.map((item) => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

### Using Mutations

Modify data and automatically invalidate related queries:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newItem: Omit<Item, "id">) => {
      const response = await fetch("http://localhost:3000/api/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch items query
      queryClient.invalidateQueries({ queryKey: ["items"] });
    },
  });

  return (
    <button onClick={() => mutation.mutate({ name: "New Item", description: "..." })}>
      Add Item
    </button>
  );
}
```

### Demo

Visit `/items` in the running app to see a working example of `useQuery` fetching data from the `/api/items` endpoint with loading states and error handling.

## Database Schema

The template includes Better Auth required tables:
- `user` - User accounts
- `session` - User sessions
- `account` - Authentication accounts (stores passwords)
- `verification` - Email verification tokens

Add your own tables to `server/schema.ts`, then generate and apply migrations:

```bash
npm run db:generate  # Generate migration file
npm run db:migrate   # Apply migration to database
```

## Database Migrations

We use the Option 4 as outlined in [Drizzle's docs](https://orm.drizzle.team/docs/migrations):

> I want to have database schema in my TypeScript codebase, I want Drizzle to generate SQL migration files for me and I will apply them to my database myself using the Drizzle migrator at runtime
>
> That's a codebase first approach with runtime migrations. You have your TypeScript Drizzle schema as a source of truth and Drizzle generates SQL migration files for you. You then apply them to the database programmatically using the `migrate()` function at runtime.

The steps are:

1. Change the schema via TypeScript schema files in `server/schema.ts`
2. Run `npm run db:generate`, which runs `drizzle-kit generate` to create a SQL migration file for the changes. These are placed in `drizzle/`.
3. Run `npm run db:migrate` to apply the migrations to your database (this uses the programmatic `migrate()` function in `server/migrate.ts`)

For production deployments, migrations are applied automatically as part of the build/deployment pipeline.

### Custom Migrations

To create custom SQL migrations for DDL alterations not supported by Drizzle Kit or data seeding, you should use the following command with a descriptive name:

```bash
npm run db:generate -- --custom --name=seed-users
```

We can use this for example to create empty migration files for seeding data or performing complex schema transformations with custom SQL.

### "Widen then Narrow" Strategy

Changes to the database schema should always be non-breaking. We use the "widen then narrow" strategy for schema migrations:

1. Widen app to consume A or B
2. Widen db to provide A and B and the app to write to both A and B
3. Narrow app to consume B and only write to B
4. Narrow db to provide B

Here's a specific example. Let's say our app allows users to provide a "name" and you want to change that to firstName and lastName instead. Here's how you'd do that (again, each of these steps end in a deploy):

1. **Widen app to consume firstName and lastName or name**. So all new code that references the firstName and lastName fields should fallback to the name field and not error if the firstName and lastName fields don't exist yet, which it won't at this point.
2. **Widen db to provide firstName and lastName and name**. So the name field should be populated with the firstName and lastName fields. You can do this as part of the migration SQL script that you run. The easiest way to do this is to generate the migration script to add the fields using `npm run db:generate -- --custom --name=split-name-field` and then modify the script to copy the existing data in the name field to the firstName field.
3. **Narrow app to consume firstName and lastName** by only writing to those fields and removing the fallback to the name field.
4. **Narrow db to provide firstName and lastName** by removing the name field. So now you can remove the name field from the db schema.

By following this strategy, we can ensure zero downtime deploys and schema migrations.

## Production Build

```bash
npm run build
```

This builds the frontend. For the backend, you can use:
- Deploy `server/` directory to Node.js hosting (Render, Railway, Fly.io)
- Ensure environment variables are set in production
- Run migrations before deploying

---

## Additional Configuration

The following is additional documentation from the Vite template...

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
