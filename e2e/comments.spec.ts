import { expect, test } from "@playwright/test";

test("posts a comment and a reply as the demo user", async ({ page }) => {
  await page.goto("/feedback/6");
  const comment = `Test comment ${Date.now()}`;
  const reply = `Test reply ${Date.now()}`;

  const textbox = page.getByRole("textbox", { name: "Add Comment" });
  await textbox.fill(comment);
  await expect(
    page.getByText(`${250 - comment.length} Characters left`),
  ).toBeVisible();
  await page.getByRole("button", { name: "Post Comment" }).click();

  const posted = page.getByRole("article").filter({ hasText: comment });
  await expect(posted).toBeVisible();
  await expect(
    posted.getByRole("heading", { name: "Demo User" }),
  ).toBeVisible();
  await expect(posted.getByText("@demo")).toBeVisible();
  await expect(textbox).toHaveValue("");

  await posted.getByRole("button", { name: "Reply to Demo User" }).click();
  await page.getByRole("textbox", { name: "Reply to Demo User" }).fill(reply);
  await page.getByRole("button", { name: "Post Reply" }).click();

  const postedReply = page.getByRole("article").filter({ hasText: reply });
  await expect(postedReply).toBeVisible();
  await expect(postedReply.getByText("@demo").first()).toBeVisible();
});

test("rejects an empty comment without a round trip", async ({ page }) => {
  await page.goto("/feedback/6");
  const textbox = page.getByRole("textbox", { name: "Add Comment" });

  await page.getByRole("button", { name: "Post Comment" }).click();

  await expect(textbox).toBeFocused();
  await expect(textbox).toHaveAttribute("aria-invalid", "true");
  await expect(textbox).toHaveAccessibleDescription(/Can't be empty/);
  await expect(page.getByRole("main").getByRole("alert")).toHaveCount(0);

  await textbox.fill("x");
  await expect(textbox).not.toHaveAttribute("aria-invalid");
});
