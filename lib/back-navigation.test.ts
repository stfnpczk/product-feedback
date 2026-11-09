import { describe, expect, it } from "vitest";
import { isBackTarget } from "./back-navigation";

const origin = "https://app.test";

function check(previous: string | null, current: string, href: string) {
  return isBackTarget({
    previousUrl: previous === null ? null : `${origin}${previous}`,
    currentUrl: `${origin}${current}`,
    href,
  });
}

describe("isBackTarget", () => {
  it("is false without a previous entry", () => {
    expect(check(null, "/feedback/1", "/")).toBe(false);
  });

  it("matches the target path and ignores the query", () => {
    expect(check("/?category=ux&sort=least-upvotes", "/feedback/1", "/")).toBe(
      true,
    );
  });

  it("treats the roadmap as a list page when going home", () => {
    expect(check("/roadmap?status=live", "/feedback/1", "/")).toBe(true);
  });

  it("matches a detail page as the target of the edit page", () => {
    expect(check("/feedback/1", "/feedback/1/edit", "/feedback/1")).toBe(true);
  });

  it("rejects a different detail page", () => {
    expect(check("/feedback/2", "/feedback/1/edit", "/feedback/1")).toBe(false);
  });

  it("rejects the roadmap when the target is not home", () => {
    expect(check("/roadmap", "/feedback/1/edit", "/feedback/1")).toBe(false);
  });

  it("rejects a previous entry on the current path", () => {
    expect(check("/feedback/new", "/feedback/new", "/")).toBe(false);
  });

  it("rejects a previous entry from another origin", () => {
    expect(
      isBackTarget({
        previousUrl: "https://elsewhere.test/",
        currentUrl: `${origin}/feedback/1`,
        href: "/",
      }),
    ).toBe(false);
  });
});
