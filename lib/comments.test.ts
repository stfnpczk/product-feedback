import { describe, expect, it } from "vitest";
import { COMMENT_MAX_LENGTH, commentContent } from "./comments";

describe("commentContent", () => {
  it("trims surrounding whitespace", () => {
    expect(commentContent.parse("  Nice idea  ")).toBe("Nice idea");
  });

  it.each(["", "   "])("rejects %j", (input) => {
    const result = commentContent.safeParse(input);
    expect(result.error?.issues[0].message).toBe("Can't be empty");
  });

  it("accepts exactly the maximum length", () => {
    expect(
      commentContent.safeParse("a".repeat(COMMENT_MAX_LENGTH)).success,
    ).toBe(true);
  });

  it("rejects one character over the maximum", () => {
    const result = commentContent.safeParse("a".repeat(COMMENT_MAX_LENGTH + 1));
    expect(result.error?.issues[0].message).toBe(
      `Can't be longer than ${COMMENT_MAX_LENGTH} characters`,
    );
  });
});
