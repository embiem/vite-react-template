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

## Common Development Workflows

This section provides practical, copy-paste-ready examples for typical development tasks you'll encounter when building features.

### 1. Adding a New Component with Tailwind & DaisyUI

Create a new component in `src/components/`:

```tsx
// src/components/UserCard.tsx
interface UserCardProps {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

export function UserCard({ name, email, avatar, role }: UserCardProps) {
  return (
    <div className="card bg-base-200 shadow-xl">
      <div className="card-body">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content w-16 rounded-full">
              {avatar ? (
                <img src={avatar} alt={name} />
              ) : (
                <span className="text-xl">{name.charAt(0).toUpperCase()}</span>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="flex-1">
            <h2 className="card-title">{name}</h2>
            <p className="text-sm opacity-70">{email}</p>
            {role && (
              <div className="badge badge-primary badge-sm mt-2">{role}</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm">View Profile</button>
          <button className="btn btn-ghost btn-sm">Message</button>
        </div>
      </div>
    </div>
  );
}
```

**DaisyUI Components Used:**
- `card`, `card-body`, `card-title`, `card-actions` - Card container
- `avatar`, `placeholder` - Avatar component
- `badge` - Small status indicators
- `btn`, `btn-primary`, `btn-ghost`, `btn-sm` - Button variants

**Responsive Design:**
```tsx
// Responsive grid layout example
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <UserCard {...props} />
  <UserCard {...props} />
  <UserCard {...props} />
</div>
```

### 2. Adding a New Route

**Step 1:** Create a page component in `src/components/`:

```tsx
// src/components/UsersPage.tsx
import { UserCard } from "./UserCard";

export function UsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

**Step 2:** Add the route to `src/App.tsx`:

```tsx
import { UsersPage } from "./components/UsersPage";

// Inside the <Routes> component:
<Route path="/users" element={<UsersPage />} />
```

**Step 3:** Add navigation link to the navbar in `src/App.tsx`:

```tsx
function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <nav className="navbar bg-base-300">
        <div className="navbar-start">
          <Link to="/" className="btn btn-ghost text-xl">Home</Link>
        </div>
        <div className="navbar-center gap-2">
          <Link to="/items" className="btn btn-ghost">Items</Link>
          <Link to="/users" className="btn btn-ghost">Users</Link>
        </div>
        <div className="navbar-end">
          {/* Auth buttons */}
        </div>
      </nav>
      <div className="container mx-auto p-8">{children}</div>
    </div>
  );
}
```

### 3. Adding a Query with TanStack Query

**Step 1:** Create a fetch function and type:

```tsx
// src/components/UsersPage.tsx
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

async function fetchUsers(): Promise<User[]> {
  const response = await fetch("http://localhost:3000/api/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  return response.json();
}
```

**Step 2:** Use `useQuery` in your component:

```tsx
import { useQuery } from "@tanstack/react-query";
import { UserCard } from "./UserCard";

export function UsersPage() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error.message}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Team Members</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users?.map((user) => (
          <UserCard key={user.id} {...user} />
        ))}
      </div>
    </div>
  );
}
```

**DaisyUI Loading & Error Components Used:**
- `loading loading-spinner loading-lg` - Loading spinner
- `alert alert-error` - Error message container

### 4. Adding a Mutation with TanStack Query

**Step 1:** Create a mutation function:

```tsx
// src/components/CreateUserForm.tsx
interface CreateUserData {
  name: string;
  email: string;
  role: string;
}

async function createUser(data: CreateUserData): Promise<User> {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // Include cookies for auth
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create user");
  }

  return response.json();
}
```

**Step 2:** Use `useMutation` with cache invalidation:

```tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function CreateUserForm() {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: "", email: "", role: "member" });

  const mutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      // Invalidate and refetch users query
      queryClient.invalidateQueries({ queryKey: ["users"] });
      // Reset form
      setFormData({ name: "", email: "", role: "member" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card bg-base-200 shadow-xl p-6">
      <h2 className="card-title mb-4">Add New User</h2>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Name</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="input input-bordered"
          required
        />
      </div>

      <div className="form-control mb-4">
        <label className="label">
          <span className="label-text">Role</span>
        </label>
        <select
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="select select-bordered"
        >
          <option value="member">Member</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {mutation.error && (
        <div className="alert alert-error mb-4">
          <span>{mutation.error.message}</span>
        </div>
      )}

      {mutation.isSuccess && (
        <div className="alert alert-success mb-4">
          <span>User created successfully!</span>
        </div>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Creating...
          </>
        ) : (
          "Create User"
        )}
      </button>
    </form>
  );
}
```

**Optimistic Updates (Advanced):**

For instant UI feedback before server response:

```tsx
const mutation = useMutation({
  mutationFn: createUser,
  onMutate: async (newUser) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["users"] });

    // Snapshot previous value
    const previousUsers = queryClient.getQueryData(["users"]);

    // Optimistically update
    queryClient.setQueryData(["users"], (old: User[]) => [
      ...old,
      { ...newUser, id: "temp-id" },
    ]);

    return { previousUsers };
  },
  onError: (err, newUser, context) => {
    // Rollback on error
    queryClient.setQueryData(["users"], context?.previousUsers);
  },
  onSettled: () => {
    // Refetch after success or error
    queryClient.invalidateQueries({ queryKey: ["users"] });
  },
});
```

### 5. Adding a Database Table & Migration

**Step 1:** Define your schema in `server/schema.ts`:

```typescript
import { pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core";
import { user } from "./schema"; // Import existing user table

export const post = pgTable("post", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  content: text("content").notNull(),
  published: boolean("published").default(false).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// TypeScript type inference
export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;
```

**Step 2:** Generate migration file:

```bash
npm run db:generate
```

This creates a SQL migration file in `drizzle/` directory like `0001_friendly_name.sql`.

**Step 3:** Apply migration to database:

```bash
npm run db:migrate
```

**Step 4:** Use the new table in your API (see next section).

**Custom Migration with Data Seeding:**

```bash
npm run db:generate -- --custom --name=seed-posts
```

Then edit the generated SQL file to add seed data:

```sql
-- drizzle/0002_seed_posts.sql
INSERT INTO post (id, title, content, published, author_id, created_at, updated_at)
VALUES
  ('1', 'Welcome Post', 'Welcome to our blog!', true, 'user-id-here', NOW(), NOW()),
  ('2', 'Getting Started', 'Here is how to get started...', true, 'user-id-here', NOW(), NOW());
```

### 6. Adding a New API Route

**Step 1:** Add Hono endpoint in `server/index.ts`:

```typescript
import { db } from "./db";
import { post } from "./schema";
import { eq, desc } from "drizzle-orm";
import { getCurrentUser } from "./index"; // Import helper

// GET all posts
app.get("/api/posts", async (c) => {
  try {
    const posts = await db
      .select()
      .from(post)
      .where(eq(post.published, true))
      .orderBy(desc(post.createdAt));

    return c.json(posts);
  } catch (error) {
    return c.json({ error: "Failed to fetch posts" }, 500);
  }
});

// GET single post
app.get("/api/posts/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const [postData] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));

    if (!postData) {
      return c.json({ error: "Post not found" }, 404);
    }

    return c.json(postData);
  } catch (error) {
    return c.json({ error: "Failed to fetch post" }, 500);
  }
});

// POST new post (protected)
app.post("/api/posts", async (c) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const body = await c.req.json<{ title: string; content: string }>();

    // Validation
    if (!body.title || !body.content) {
      return c.json({ error: "Title and content are required" }, 400);
    }

    const [newPost] = await db
      .insert(post)
      .values({
        title: body.title,
        content: body.content,
        authorId: currentUser.id,
      })
      .returning();

    return c.json(newPost, 201);
  } catch (error) {
    return c.json({ error: "Failed to create post" }, 500);
  }
});

// PATCH update post (protected)
app.patch("/api/posts/:id", async (c) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  try {
    const body = await c.req.json<{ title?: string; content?: string; published?: boolean }>();

    // Check ownership
    const [existingPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));

    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.authorId !== currentUser.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const [updatedPost] = await db
      .update(post)
      .set(body)
      .where(eq(post.id, id))
      .returning();

    return c.json(updatedPost);
  } catch (error) {
    return c.json({ error: "Failed to update post" }, 500);
  }
});

// DELETE post (protected)
app.delete("/api/posts/:id", async (c) => {
  const currentUser = await getCurrentUser(c);
  if (!currentUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const id = c.req.param("id");

  try {
    // Check ownership
    const [existingPost] = await db
      .select()
      .from(post)
      .where(eq(post.id, id));

    if (!existingPost) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (existingPost.authorId !== currentUser.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    await db.delete(post).where(eq(post.id, id));

    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to delete post" }, 500);
  }
});
```

**Common Drizzle Query Patterns:**

```typescript
// Select with join
const postsWithAuthors = await db
  .select({
    post: post,
    author: user,
  })
  .from(post)
  .leftJoin(user, eq(post.authorId, user.id));

// Count
const [{ count }] = await db
  .select({ count: sql<number>`count(*)` })
  .from(post);

// Pagination
const posts = await db
  .select()
  .from(post)
  .limit(10)
  .offset(page * 10);

// Search
import { like } from "drizzle-orm";
const results = await db
  .select()
  .from(post)
  .where(like(post.title, `%${searchTerm}%`));
```

### 7. Creating a Protected Route

**Backend:** Use the `getCurrentUser()` helper:

```typescript
// server/index.ts
app.get("/api/profile", async (c) => {
  const currentUser = await getCurrentUser(c);

  if (!currentUser) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  return c.json(currentUser);
});
```

**Frontend:** Check session and redirect:

```tsx
// src/components/ProfilePage.tsx
import { useSession } from "../lib/auth-client";
import { useNavigate } from "react-router";
import { useEffect } from "react";

export function ProfilePage() {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isPending && !session) {
      navigate("/login");
    }
  }, [session, isPending, navigate]);

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Name:</strong> {session.user?.name}</p>
        </div>
      </div>
    </div>
  );
}
```

**Alternative:** Create a `ProtectedRoute` wrapper component:

```tsx
// src/components/ProtectedRoute.tsx
import { useSession } from "../lib/auth-client";
import { Navigate } from "react-router";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Usage in App.tsx:
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

### 8. Type-Safe API Pattern

Share types between frontend and backend by creating a shared types file:

**Step 1:** Create shared types (in `server/schema.ts` or separate file):

```typescript
// server/schema.ts
export type Post = typeof post.$inferSelect;
export type NewPost = typeof post.$inferInsert;

// API response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

**Step 2:** Import types in frontend:

```tsx
// src/components/PostsPage.tsx
import type { Post } from "../../server/schema";

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("http://localhost:3000/api/posts");
  if (!response.ok) throw new Error("Failed to fetch");
  return response.json();
}

export function PostsPage() {
  const { data: posts } = useQuery<Post[]>({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });

  return (
    <div>
      {posts?.map((post: Post) => (
        <div key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
```

**Step 3:** Create a type-safe API client (advanced):

```typescript
// src/lib/api-client.ts
import type { Post, NewPost } from "../../server/schema";

const API_BASE = "http://localhost:3000/api";

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Request failed");
  }

  return response.json();
}

export const api = {
  posts: {
    list: () => request<Post[]>("/posts"),
    get: (id: string) => request<Post>(`/posts/${id}`),
    create: (data: Omit<NewPost, "id" | "authorId" | "createdAt" | "updatedAt">) =>
      request<Post>("/posts", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Post>) =>
      request<Post>(`/posts/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
    delete: (id: string) =>
      request<{ success: boolean }>(`/posts/${id}`, { method: "DELETE" }),
  },
};

// Usage:
const { data } = useQuery({
  queryKey: ["posts"],
  queryFn: () => api.posts.list(),
});
```

### 9. Writing Tests

**Unit Test with Vitest:**

```typescript
// src/utils/formatDate.ts
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

// src/utils/formatDate.test.ts
import { expect, test, describe } from "vitest";
import { formatDate } from "./formatDate";

describe("formatDate", () => {
  test("formats date correctly", () => {
    const date = new Date("2024-01-15");
    expect(formatDate(date)).toBe("January 15, 2024");
  });

  test("handles current date", () => {
    const result = formatDate(new Date());
    expect(result).toMatch(/\w+ \d{1,2}, \d{4}/);
  });
});
```

Run tests:
```bash
npm run test:unit
```

**E2E Test with Playwright:**

```typescript
// e2e/posts.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Posts Page", () => {
  test("should display list of posts", async ({ page }) => {
    await page.goto("/posts");

    // Wait for posts to load
    await expect(page.getByRole("heading", { name: "Posts" })).toBeVisible();

    // Check if posts are displayed
    const posts = page.locator('[data-testid="post-card"]');
    await expect(posts).toHaveCount(3);
  });

  test("should create a new post when logged in", async ({ page }) => {
    // Login first
    await page.goto("/login");
    await page.getByLabel("Email").fill("test@example.com");
    await page.getByLabel("Password").fill("password123");
    await page.getByRole("button", { name: "Sign In" }).click();

    // Navigate to create post page
    await page.goto("/posts/new");

    // Fill form
    await page.getByLabel("Title").fill("Test Post");
    await page.getByLabel("Content").fill("This is a test post");
    await page.getByRole("button", { name: "Create Post" }).click();

    // Verify success
    await expect(page.getByText("Post created successfully")).toBeVisible();
  });

  test("should show error for unauthorized user", async ({ page }) => {
    await page.goto("/posts/new");

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/);
  });
});
```

Run E2E tests:
```bash
npm run test:e2e
npm run test:e2e:ui  # With UI mode
```

**Test Component with React Testing Library (optional):**

```bash
npm install -D @testing-library/react @testing-library/user-event jsdom
```

```typescript
// src/components/UserCard.test.tsx
import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { UserCard } from "./UserCard";

test("renders user information", () => {
  render(
    <UserCard
      name="John Doe"
      email="john@example.com"
      role="admin"
    />
  );

  expect(screen.getByText("John Doe")).toBeInTheDocument();
  expect(screen.getByText("john@example.com")).toBeInTheDocument();
  expect(screen.getByText("admin")).toBeInTheDocument();
});
```

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
