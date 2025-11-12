import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite React Template/);
});

test("get started link", async ({ page }) => {
  await page.goto("/");

  // Expects page to have a heading with name
  await expect(
    page.getByRole("heading", {
      name: "Full-Stack React Template",
    }),
  ).toBeVisible();
});

test("items page loads data from API", async ({ page }) => {
  await page.goto("/items");

  // Wait for the heading to be visible
  await expect(
    page.getByRole("heading", { name: "Tech Stack Items" }),
  ).toBeVisible();

  // Verify that items from the backend API are displayed
  await expect(page.getByRole("heading", { name: "React" })).toBeVisible();
  await expect(
    page.getByText("A JavaScript library for building user interfaces"),
  ).toBeVisible();

  await expect(page.getByRole("heading", { name: "Hono" })).toBeVisible();
  await expect(
    page.getByText("Ultrafast web framework for the Edges"),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Drizzle ORM" }),
  ).toBeVisible();
  await expect(
    page.getByText("TypeScript ORM for SQL databases"),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "TanStack Query" }),
  ).toBeVisible();
  await expect(
    page.getByText("Powerful asynchronous state management for TS/JS"),
  ).toBeVisible();
});

test("items page navigation from home", async ({ page }) => {
  await page.goto("/");

  // Click on the navigation link to items page
  await page.getByRole("link", { name: "Items (Query Demo)" }).click();

  // Should navigate to /items and display content
  await expect(page).toHaveURL(/\/items/);
  await expect(
    page.getByRole("heading", { name: "Tech Stack Items" }),
  ).toBeVisible();
});
