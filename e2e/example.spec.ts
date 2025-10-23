import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Vite React Template/);
});

test("get started link", async ({ page }) => {
  await page.goto("/");

  // Expects page to have a heading with the name of Installation.
  await expect(
    page.getByRole("heading", {
      name: "Garlic bread with cheese: What the science tells us",
    }),
  ).toBeVisible();
});
