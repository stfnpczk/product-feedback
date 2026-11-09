import { expect, type Page, test } from "@playwright/test";

async function chooseOption(page: Page, combobox: string, option: string) {
  await page.getByRole("combobox", { name: combobox }).click();
  await page.getByRole("option", { name: option }).click();
}

async function openEditPage(page: Page, title: string) {
  await page.getByRole("link", { name: "Edit Feedback" }).click();
  await expect(
    page.getByRole("heading", { name: `Editing ‘${title}’` }),
  ).toBeVisible();
}

async function createFeedback(page: Page, title: string) {
  await page.goto("/feedback/new");
  await page.getByRole("textbox", { name: "Feedback Title" }).fill(title);
  await chooseOption(page, "Category", "Enhancement");
  await page
    .getByRole("textbox", { name: "Feedback Detail" })
    .fill("Created by an E2E test.");
  await page.getByRole("button", { name: "Add Feedback" }).click();
  await expect(page).toHaveURL(/\/feedback\/\d+$/);
  return page.url();
}

test("shows errors and focuses the first invalid field", async ({ page }) => {
  await page.goto("/feedback/new");
  await page.getByRole("button", { name: "Add Feedback" }).click();

  await expect(
    page.getByRole("textbox", { name: "Feedback Title" }),
  ).toBeFocused();
  await expect(
    page.getByRole("textbox", { name: "Feedback Title" }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect(page.getByText("Can't be empty")).toHaveCount(2);
  await expect(page).toHaveURL("/feedback/new");
});

test("creates feedback and shows its detail page", async ({ page }) => {
  const title = `Test create ${Date.now()}`;
  await createFeedback(page, title);

  await expect(page.getByRole("heading", { name: title })).toBeVisible();
  await expect(
    page.getByRole("article").getByText("Enhancement"),
  ).toBeVisible();
});

test("edits and deletes feedback", async ({ page }) => {
  const title = `Test edit ${Date.now()}`;
  const detailUrl = await createFeedback(page, title);

  await page.getByRole("link", { name: "Edit Feedback" }).click();
  await page
    .getByRole("textbox", { name: "Feedback Title" })
    .fill(`${title} (edited)`);
  await page.getByRole("button", { name: "Save Changes" }).click();

  await expect(page).toHaveURL(detailUrl);
  await expect(
    page.getByRole("heading", { name: `${title} (edited)` }),
  ).toBeVisible();

  await openEditPage(page, `${title} (edited)`);
  await page.getByRole("button", { name: "Delete" }).click();
  const dialog = page.getByRole("dialog", { name: "Delete feedback?" });
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Delete" }).click();

  await expect(page).toHaveURL("/");
  await expect(page.getByRole("link", { name: title })).toHaveCount(0);
});

test("moves feedback to the roadmap when its status changes", async ({
  page,
}) => {
  const title = `Test status ${Date.now()}`;
  await createFeedback(page, title);

  await openEditPage(page, title);
  await chooseOption(page, "Update Status", "Planned");
  await page.getByRole("button", { name: "Save Changes" }).click();
  await expect(page).toHaveURL(/\/feedback\/\d+$/);

  await page.goto("/roadmap");
  await expect(page.getByRole("link", { name: title })).toBeVisible();
});
