import { serve } from "@hono/node-server";
import { Context, Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./auth";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { product } from "./schema";

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
app.on(["POST", "GET"], "/api/auth/*", (c) => {
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

app.get("/api/products", async (c) => {
  let products = await db.query.product.findMany({ orderBy: product.id });

  if (!products.length) {
    // Seed with fakestoreapi
    const response = await fetch("https://fakestoreapi.com/products");
    products = await response.json();
    await db.insert(product).values(products);
  }

  return c.json(products);
});

app.get("/api/products/:productID", async (c) => {
  const productID = c.req.param("productID");

  const productRes = await db.query.product.findFirst({
    where: eq(product.id, parseInt(productID)),
  });

  return c.json(productRes);
});

app.put("/api/products/:productID", async (c) => {
  const productID = c.req.param("productID");

  const payload = await c.req.json();
  // TODO: verify payload

  const updatedProduct = await db
    .update(product)
    .set(payload)
    .where(eq(product.id, parseInt(productID)));
  return c.json(updatedProduct);
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
