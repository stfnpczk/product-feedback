import { expect, test } from "@playwright/test";

test("toggles an upvote and keeps it after a reload", async ({ page }) => {
  await page.goto("/feedback/6");
  const upvote = page.getByRole("main").locator("button[aria-pressed]");
  const before = parseInt(await upvote.innerText(), 10);

  await expect(upvote).toHaveAttribute("aria-pressed", "false");
  await upvote.click();
  await expect(upvote).toHaveAttribute("aria-pressed", "true");
  await expect(upvote).toHaveText(new RegExp(`^${before + 1}\\b`));

  await page.reload();
  await expect(upvote).toHaveAttribute("aria-pressed", "true");
  await expect(upvote).toHaveText(new RegExp(`^${before + 1}\\b`));

  await upvote.click();
  await expect(upvote).toHaveAttribute("aria-pressed", "false");
  await expect(upvote).toHaveText(new RegExp(`^${before}\\b`));
});
