import { expect, type Page, test } from "@playwright/test";

async function upvoteCounts(page: Page) {
  const texts = await page
    .getByRole("main")
    .getByRole("listitem")
    .locator("button[aria-pressed]")
    .allInnerTexts();
  return texts.map((text) => parseInt(text, 10));
}

test.describe("category filter", () => {
  test("filters the list and updates the URL", async ({ page }) => {
    await page.goto("/");
    const filter = page.getByRole("navigation", { name: "Filter by category" });

    await filter.getByRole("link", { name: "Bug" }).click();

    await expect(page).toHaveURL("/?category=bug");
    await expect(filter.getByRole("link", { name: "Bug" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    await expect(
      page.getByRole("link", { name: "Preview images not loading" }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Add tags for solutions" }),
    ).toHaveCount(0);
  });

  test("shows the empty state for a category without feedback", async ({
    page,
  }) => {
    await page.goto("/?category=ui");
    await expect(
      page.getByRole("heading", { name: "There is no feedback yet." }),
    ).toBeVisible();
  });
});

test.describe("sort select", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await expect(sortSelect(page)).toBeEnabled();
  });

  function sortSelect(page: Page) {
    return page.getByRole("combobox", { name: /Sort by/ });
  }

  async function optionId(page: Page, name: string) {
    return page.getByRole("option", { name }).getAttribute("id");
  }

  test("shows the current sort when closed", async ({ page }) => {
    await expect(sortSelect(page)).toHaveAttribute("aria-expanded", "false");
    await expect(sortSelect(page)).toHaveAccessibleName(
      "Sort by : Most Upvotes",
    );
  });

  test("opens with the keyboard on the selected option", async ({ page }) => {
    const select = sortSelect(page);
    await select.focus();
    await page.keyboard.press("ArrowDown");

    await expect(select).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("listbox")).toBeVisible();
    await expect(select).toHaveAttribute(
      "aria-activedescendant",
      (await optionId(page, "Most Upvotes"))!,
    );
  });

  test("moves the active option with End, Home and typeahead", async ({
    page,
  }) => {
    const select = sortSelect(page);
    await select.focus();
    await page.keyboard.press("Space");

    await page.keyboard.press("End");
    await expect(select).toHaveAttribute(
      "aria-activedescendant",
      (await optionId(page, "Least Comments"))!,
    );

    await page.keyboard.press("Home");
    await expect(select).toHaveAttribute(
      "aria-activedescendant",
      (await optionId(page, "Most Upvotes"))!,
    );

    await page.keyboard.press("l");
    await expect(select).toHaveAttribute(
      "aria-activedescendant",
      (await optionId(page, "Least Upvotes"))!,
    );
  });

  test("Enter selects and sorts the list", async ({ page }) => {
    const select = sortSelect(page);
    await select.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    await expect(page).toHaveURL("/?sort=least-upvotes");
    await expect(select).toHaveAttribute("aria-expanded", "false");
    await expect(select).toBeFocused();
    await expect(select).toHaveAccessibleName("Sort by : Least Upvotes");

    const counts = await upvoteCounts(page);
    expect(counts.length).toBeGreaterThan(1);
    expect(counts).toEqual(counts.toSorted((a, b) => a - b));
  });

  test("Escape closes without changing the sort", async ({ page }) => {
    const select = sortSelect(page);
    await select.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Escape");

    await expect(select).toHaveAttribute("aria-expanded", "false");
    await expect(select).toBeFocused();
    await expect(page).toHaveURL("/");
  });

  test("reselecting the current option keeps the URL", async ({ page }) => {
    await sortSelect(page).click();
    await page.getByRole("option", { name: "Most Upvotes" }).click();

    await expect(sortSelect(page)).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL("/");
  });
});
