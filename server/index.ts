import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";

const app = new Hono();

// CORS middleware - allow requests from Vite dev server
app.use(
  "*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Mount Better Auth routes
app.on(["POST", "GET"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

// Simple root route
app.get("/", (c) => {
  return c.json({
    message: "Hono server is running",
    timestamp: new Date().toISOString(),
  });
});

// Health check route
app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

// Mock data endpoint for React Query example
const mockItems = [
  {
    id: 1,
    name: "React",
    description: "A JavaScript library for building user interfaces",
  },
  {
    id: 2,
    name: "Hono",
    description: "Ultrafast web framework for the Edges",
  },
  {
    id: 3,
    name: "Drizzle ORM",
    description: "TypeScript ORM for SQL databases",
  },
  {
    id: 4,
    name: "TanStack Query",
    description: "Powerful asynchronous state management for TS/JS",
  },
];

app.get("/api/items", async (c) => {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 500));
  return c.json(mockItems);
});

// Helper to get current user from session
export async function getCurrentUser(c: Context) {
  const session = await auth.api.getSession({ headers: c.req.raw.headers });
  return session?.user ?? null;
}

const port = 3000;
console.log(`🚀 Hono server running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
