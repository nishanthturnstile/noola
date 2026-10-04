import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("foundation connects through the same-origin API and supports accessible themes", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Space for what",
  );
  await expect(page.getByRole("status")).toHaveText("Connected");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Use dark theme" }).click();
  await expect(page.locator("html")).toHaveClass("dark");
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "Check connection" }).click();
  await expect(page.getByRole("status")).toHaveText("Connected");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
test("unavailable database is visible and can be retried", async ({ page }) => {
  await page.route("**/api/health/ready", (route) =>
    route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({ status: "unavailable" }),
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("status")).toHaveText("Connection unavailable");
  await page.unroute("**/api/health/ready");
  await page.getByRole("button", { name: "Check connection" }).click();
  await expect(page.getByRole("status")).toHaveText("Connected");
});
