import { describe, expect, it } from "vitest";
import {
  COMMENT_MAX_LENGTH,
  commentContent,
  nestComments,
  parseComment,
} from "./comments";

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

  it("counts a CRLF line break as one character", () => {
    const input = `${"a".repeat(COMMENT_MAX_LENGTH - 2)}\r\nb`;
    expect(commentContent.parse(input)).toBe(input.replace("\r\n", "\n"));
  });
});

describe("parseComment", () => {
  it("returns the trimmed content", () => {
    expect(parseComment("  Nice idea  ")).toEqual({ data: "Nice idea" });
  });

  it("treats a missing value as empty", () => {
    expect(parseComment(null)).toEqual({ error: "Can't be empty" });
  });
});

describe("nestComments", () => {
  it("groups replies under their parent, keeping order", () => {
    const rows = [
      { id: 1, parentId: null },
      { id: 2, parentId: null },
      { id: 3, parentId: 1 },
      { id: 4, parentId: 2 },
      { id: 5, parentId: 1 },
    ];
    expect(nestComments(rows)).toEqual([
      {
        id: 1,
        parentId: null,
        replies: [
          { id: 3, parentId: 1 },
          { id: 5, parentId: 1 },
        ],
      },
      { id: 2, parentId: null, replies: [{ id: 4, parentId: 2 }] },
    ]);
  });

  it("keeps a reply that arrives before its parent", () => {
    const rows = [
      { id: 2, parentId: 1 },
      { id: 1, parentId: null },
    ];
    expect(nestComments(rows)).toEqual([
      { id: 1, parentId: null, replies: [{ id: 2, parentId: 1 }] },
    ]);
  });

  it("drops replies whose parent is missing", () => {
    expect(nestComments([{ id: 2, parentId: 99 }])).toEqual([]);
  });

  it("returns an empty list for no rows", () => {
    expect(nestComments([])).toEqual([]);
  });
});
