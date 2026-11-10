import { expect, test } from "@playwright/test";

test.use({ viewport: { width: 375, height: 667 } });

test("opens the menu drawer and closes it with Escape", async ({ page }) => {
  await page.goto("/");
  const menuButton = page.getByRole("button", { name: "Open menu" });

  await menuButton.click();
  const drawer = page.getByRole("region", { name: "Menu" });
  await expect(drawer).toBeInViewport({ ratio: 1 });
  await expect(drawer.getByRole("link", { name: "All" })).toBeFocused();
  await expect(
    page.getByRole("button", { name: "Close menu" }),
  ).toHaveAttribute("aria-expanded", "true");

  await page.keyboard.press("Escape");
  await expect(drawer).not.toBeInViewport();
  await expect(menuButton).toBeFocused();
  await expect(menuButton).toHaveAttribute("aria-expanded", "false");
});

test("closes the menu drawer when focus tabs out of it", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  const drawer = page.getByRole("region", { name: "Menu" });
  await expect(drawer).toBeInViewport({ ratio: 1 });

  await drawer.getByRole("link", { name: "View" }).focus();
  await page.keyboard.press("Tab");

  await expect(page.getByRole("button", { name: "Open menu" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(drawer).not.toBeInViewport();
});

test("switches roadmap tabs through the URL", async ({ page }) => {
  await page.goto("/roadmap");
  const tabs = page.getByRole("navigation", { name: "Roadmap status" });

  await expect(
    tabs.getByRole("link", { name: /^In-Progress/ }),
  ).toHaveAttribute("aria-current", "page");

  await tabs.getByRole("link", { name: /^Planned/ }).click();
  await expect(page).toHaveURL("/roadmap?status=planned");
  await expect(tabs.getByRole("link", { name: /^Planned/ })).toHaveAttribute(
    "aria-current",
    "page",
  );
});
