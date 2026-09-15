import { test, expect } from "@playwright/test";

test("core loop: home → create → editor → export", async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto("http://127.0.0.1:3010/", { waitUntil: "networkidle" });
  await expect(page.getByRole("heading", { name: /pull a proof/i })).toBeVisible({
    timeout: 30_000,
  });

  const field = page.locator("#brief-field");
  const next = page.getByTestId("create-next");
  await expect(next).toBeVisible({ timeout: 15_000 });

  const lines = [
    "Smoke Press",
    "Inked pages that ship",
    "Contest judges and indie builders",
    "Editorial confident",
    "Brief to editable sections to ZIP export",
  ];

  for (let i = 0; i < lines.length; i++) {
    await expect(field).toBeVisible();
    await field.click();
    await field.fill("");
    await field.pressSequentially(lines[i], { delay: 15 });
    await expect(field).toHaveValue(lines[i]);
    await next.click();
  }

  await expect(page).toHaveURL(/\/projects\//, { timeout: 60_000 });
  await expect(page.getByLabel("Project title")).toBeVisible({ timeout: 15_000 });

  const downloadPromise = page.waitForEvent("download", { timeout: 30_000 });
  await page.getByRole("button", { name: /stamp zip/i }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.zip$/i);
});
