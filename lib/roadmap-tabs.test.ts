import { describe, expect, it } from "vitest";
import {
  defaultRoadmapTab,
  parseRoadmapTab,
  roadmapColumnLabel,
  roadmapHref,
} from "./roadmap-tabs";

describe("parseRoadmapTab", () => {
  it("parses a valid status", () => {
    expect(parseRoadmapTab({ status: "live" })).toBe("live");
  });

  it.each([{}, { status: "suggestion" }, { status: ["live", "planned"] }])(
    "falls back to the default for %j",
    (searchParams) => {
      expect(parseRoadmapTab(searchParams)).toBe(defaultRoadmapTab);
    },
  );
});

describe("roadmapHref", () => {
  it("omits the default tab", () => {
    expect(roadmapHref(defaultRoadmapTab)).toBe("/roadmap");
  });

  it("adds other tabs as a status param", () => {
    expect(roadmapHref("planned")).toBe("/roadmap?status=planned");
  });

  it("round-trips through parseRoadmapTab", () => {
    const params = new URL(roadmapHref("live"), "http://localhost")
      .searchParams;
    expect(parseRoadmapTab(Object.fromEntries(params))).toBe("live");
  });
});

describe("roadmapColumnLabel", () => {
  it("shows the label alone without a count", () => {
    expect(roadmapColumnLabel("in-progress")).toBe("In-Progress");
  });

  it.each([
    [0, "Live (0)"],
    [3, "Live (3)"],
  ])("appends a count of %i", (count, expected) => {
    expect(roadmapColumnLabel("live", count)).toBe(expected);
  });
});
