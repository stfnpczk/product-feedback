import { describe, expect, it } from "vitest";
import {
  DESCRIPTION_MAX_LENGTH,
  TITLE_MAX_LENGTH,
  parseFeedbackForm,
  parseFeedbackUpdate,
} from "./feedback-form";

const valid = {
  title: "Dark mode",
  category: "feature",
  description: "Please add a dark theme.",
};

function formData(fields: Record<string, string | undefined>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) data.set(key, value);
  }
  return data;
}

describe("parseFeedbackForm", () => {
  it("returns trimmed data for valid input", () => {
    expect(
      parseFeedbackForm(
        formData({ ...valid, title: "  Dark mode  ", description: " Hi " }),
      ),
    ).toEqual({ data: { ...valid, description: "Hi" } });
  });

  it.each(["", "   "])("rejects a title of %j", (title) => {
    expect(
      parseFeedbackForm(formData({ ...valid, title })).fieldErrors,
    ).toEqual({ title: "Can't be empty" });
  });

  it("treats a missing title as empty", () => {
    expect(
      parseFeedbackForm(formData({ ...valid, title: undefined })).fieldErrors,
    ).toEqual({
      title: "Can't be empty",
    });
  });

  it.each([
    ["title", TITLE_MAX_LENGTH],
    ["description", DESCRIPTION_MAX_LENGTH],
  ])("accepts a %s of exactly %i characters", (field, max) => {
    const result = parseFeedbackForm(
      formData({ ...valid, [field]: "a".repeat(max) }),
    );
    expect(result.fieldErrors).toBeUndefined();
  });

  it.each([
    ["title", TITLE_MAX_LENGTH],
    ["description", DESCRIPTION_MAX_LENGTH],
  ])("rejects a %s longer than %i characters", (field, max) => {
    const result = parseFeedbackForm(
      formData({ ...valid, [field]: "a".repeat(max + 1) }),
    );
    expect(result.fieldErrors).toEqual({
      [field]: `Can't be longer than ${max} characters`,
    });
  });

  it("counts CRLF line breaks in the description as one character", () => {
    const description = `${"a".repeat(DESCRIPTION_MAX_LENGTH - 2)}\r\nb`;
    expect(parseFeedbackForm(formData({ ...valid, description }))).toEqual({
      data: { ...valid, description: description.replace("\r\n", "\n") },
    });
  });

  it("measures length after trimming", () => {
    const title = ` ${"a".repeat(TITLE_MAX_LENGTH)} `;
    expect(parseFeedbackForm(formData({ ...valid, title })).data?.title).toBe(
      "a".repeat(TITLE_MAX_LENGTH),
    );
  });

  it.each([
    ["missing", undefined],
    ["unknown", "design"],
  ])("rejects a %s category", (_, category) => {
    expect(
      parseFeedbackForm(formData({ ...valid, category })).fieldErrors,
    ).toEqual({
      category: "Please choose a category",
    });
  });

  it("reports one message per invalid field", () => {
    expect(
      parseFeedbackForm(formData({ title: "", category: "", description: "" }))
        .fieldErrors,
    ).toEqual({
      title: "Can't be empty",
      category: "Please choose a category",
      description: "Can't be empty",
    });
  });
});

describe("parseFeedbackUpdate", () => {
  it("returns data including the status", () => {
    expect(
      parseFeedbackUpdate(formData({ ...valid, status: "planned" })),
    ).toEqual({ data: { ...valid, status: "planned" } });
  });

  it.each([
    ["missing", undefined],
    ["unknown", "done"],
  ])("rejects a %s status", (_, status) => {
    expect(
      parseFeedbackUpdate(formData({ ...valid, status })).fieldErrors,
    ).toEqual({
      status: "Please choose a status",
    });
  });
});
