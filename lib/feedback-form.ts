import { z } from "zod";
import { categories } from "./categories";

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

function requiredText(max: number) {
  return z
    .string()
    .trim()
    .min(1, "Can't be empty")
    .max(max, `Can't be longer than ${max} characters`);
}

export const feedbackInput = z.object({
  title: requiredText(TITLE_MAX_LENGTH),
  category: z.enum(categories, "Please choose a category"),
  description: requiredText(DESCRIPTION_MAX_LENGTH),
});

export type FeedbackInput = z.infer<typeof feedbackInput>;
export type FeedbackField = keyof FeedbackInput;
export type FieldErrors = Partial<Record<FeedbackField, string>>;

export type FeedbackFormState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: FieldErrors }
  | { status: "error"; message: string };

export const initialFeedbackFormState: FeedbackFormState = { status: "idle" };

export function parseFeedbackForm(formData: FormData) {
  const result = feedbackInput.safeParse({
    title: formData.get("title") ?? "",
    category: formData.get("category"),
    description: formData.get("description") ?? "",
  });
  if (result.success) return { data: result.data } as const;

  const { fieldErrors } = z.flattenError(result.error);
  const firstErrors: FieldErrors = {};
  for (const field of Object.keys(fieldErrors) as FeedbackField[]) {
    firstErrors[field] = fieldErrors[field]?.[0];
  }
  return { fieldErrors: firstErrors } as const;
}
