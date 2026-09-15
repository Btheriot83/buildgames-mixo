import { test, expect } from "@playwright/test";

test("core loop: home → create → editor → export", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("http://127.0.0.1:3010/", { waitUntil: "networkidle" });
  await expect(
    page.getByRole("heading", { level: 1, name: /one brief/i })
  ).toBeVisible({ timeout: 30_000 });
  await expect(page.getByLabel("Product job in three steps")).toBeVisible();

  const field = page.locator("#brief-field");
  const next = page.getByTestId("create-next");
  await expect(next).toBeVisible({ timeout: 15_000 });

  await page.getByTestId("chip-diesel").click();
  await expect(field).toHaveValue(/Phoenix mobile diesel/i);

  await next.click();

  await expect(page).toHaveURL(/\/projects\//, { timeout: 90_000 });
  await expect(page.getByLabel("Project title")).toBeVisible({ timeout: 15_000 });

  const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
  await page.getByTestId("stamp-html").click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.html$/i);
});
