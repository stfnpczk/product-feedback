import { expect, test } from "@playwright/test";

const heading = { level: 1, name: "This page doesn’t exist." } as const;

test("an unknown URL returns 404 with the not-found page", async ({ page }) => {
  const response = await page.goto("/no-such-page");

  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", heading)).toBeVisible();

  await page.getByRole("link", { name: "Go to Suggestions" }).click();
  await expect(page).toHaveURL("/");
});

for (const path of ["/feedback/999999", "/feedback/abc/edit"]) {
  test(`${path} shows the not-found page and is not indexed`, async ({
    page,
  }) => {
    await page.goto(path);

    await expect(page.getByRole("heading", heading)).toBeVisible();
    await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute(
      "content",
      /noindex/,
    );
  });
}
