import { describe, expect, it } from "vitest";
import { parseIdParam, recordId } from "./ids";

describe("parseIdParam", () => {
  it.each([
    ["1", 1],
    ["12", 12],
    ["2147483647", 2147483647],
  ])("accepts %j", (input, expected) => {
    expect(parseIdParam(input)).toBe(expected);
  });

  it.each(["2147483648", "0", "-1", "1.5", "abc", ""])(
    "rejects %j",
    (input) => {
      expect(parseIdParam(input)).toBeNull();
    },
  );

  it("coerces numeric strings that Number() accepts", () => {
    expect(parseIdParam(" 12 ")).toBe(12);
    expect(parseIdParam("1e2")).toBe(100);
  });
});

describe("recordId", () => {
  it.each([1, 2147483647])("accepts %i", (value) => {
    expect(recordId.safeParse(value).success).toBe(true);
  });

  it.each([0, -1, 1.5, 2147483648, "1"])("rejects %j", (value) => {
    expect(recordId.safeParse(value).success).toBe(false);
  });
});
