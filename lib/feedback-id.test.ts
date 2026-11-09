import { describe, expect, it } from "vitest";
import { parseFeedbackId } from "./feedback-id";

describe("parseFeedbackId", () => {
  it.each([
    ["1", 1],
    ["12", 12],
    ["2147483647", 2147483647],
  ])("accepts %j", (input, expected) => {
    expect(parseFeedbackId(input)).toBe(expected);
  });

  it.each(["2147483648", "0", "-1", "1.5", "abc", ""])(
    "rejects %j",
    (input) => {
      expect(parseFeedbackId(input)).toBeNull();
    },
  );

  it("coerces numeric strings that Number() accepts", () => {
    expect(parseFeedbackId(" 12 ")).toBe(12);
    expect(parseFeedbackId("1e2")).toBe(100);
  });
});
