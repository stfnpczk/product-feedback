import { describe, expect, it } from "vitest";
import {
  defaultSort,
  parseSuggestionFilters,
  suggestionsHref,
} from "./suggestion-filters";

const defaults = { sort: defaultSort, category: "all" };

function queryOf(href: string) {
  const params = new URL(href, "http://localhost").searchParams;
  return Object.fromEntries(params);
}

describe("parseSuggestionFilters", () => {
  it("returns defaults for empty search params", () => {
    expect(parseSuggestionFilters({})).toEqual(defaults);
  });

  it("parses valid values", () => {
    expect(
      parseSuggestionFilters({ sort: "least-comments", category: "ux" }),
    ).toEqual({ sort: "least-comments", category: "ux" });
  });

  it("falls back to defaults for unknown values", () => {
    expect(
      parseSuggestionFilters({ sort: "newest", category: "design" }),
    ).toEqual(defaults);
  });

  it("falls back to defaults for repeated params", () => {
    expect(
      parseSuggestionFilters({
        sort: ["most-comments", "least-comments"],
        category: ["ui", "ux"],
      }),
    ).toEqual(defaults);
  });
});

describe("suggestionsHref", () => {
  it("omits defaults", () => {
    expect(suggestionsHref({ sort: defaultSort, category: "all" })).toBe("/");
  });

  it("sets only non-default params", () => {
    expect(suggestionsHref({ sort: defaultSort, category: "bug" })).toBe(
      "/?category=bug",
    );
    expect(suggestionsHref({ sort: "least-upvotes", category: "all" })).toBe(
      "/?sort=least-upvotes",
    );
  });

  it("round-trips through parseSuggestionFilters", () => {
    const filters = { sort: "most-comments", category: "feature" } as const;
    expect(parseSuggestionFilters(queryOf(suggestionsHref(filters)))).toEqual(
      filters,
    );
  });
});
