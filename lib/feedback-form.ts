import { z } from "zod";
import type { ActionError } from "./action-state";
import { categories } from "./categories";
import { statuses } from "./statuses";
import { requiredText } from "./text";

export const TITLE_MAX_LENGTH = 100;
export const DESCRIPTION_MAX_LENGTH = 500;

export const feedbackInput = z.object({
  title: requiredText(TITLE_MAX_LENGTH),
  category: z.enum(categories, "Please choose a category"),
  description: requiredText(DESCRIPTION_MAX_LENGTH),
});

export const feedbackUpdate = feedbackInput.extend({
  status: z.enum(statuses, "Please choose a status"),
});

export type FeedbackInput = z.infer<typeof feedbackInput>;
export type FeedbackUpdate = z.infer<typeof feedbackUpdate>;
export type FeedbackField = keyof FeedbackUpdate;
export type FieldErrors = Partial<Record<FeedbackField, string>>;

export type FeedbackFormState =
  | { status: "idle" }
  | { status: "invalid"; fieldErrors: FieldErrors }
  | ActionError
  | { status: "success" };

export const initialFeedbackFormState: FeedbackFormState = { status: "idle" };

export type DeleteFeedbackState = { status: "idle" } | ActionError;

export type ParsedFeedbackForm<T> =
  | { data: T; fieldErrors?: undefined }
  | { data?: undefined; fieldErrors: FieldErrors };

function firstFieldErrors(error: z.ZodError): FieldErrors {
  const { fieldErrors } = z.flattenError(error) as {
    fieldErrors: Partial<Record<FeedbackField, string[]>>;
  };
  const firstErrors: FieldErrors = {};
  for (const field of Object.keys(fieldErrors) as FeedbackField[]) {
    firstErrors[field] = fieldErrors[field]?.[0];
  }
  return firstErrors;
}

function readFields(formData: FormData) {
  return {
    title: formData.get("title") ?? "",
    category: formData.get("category"),
    description: formData.get("description") ?? "",
  };
}

export function parseFeedbackForm(
  formData: FormData,
): ParsedFeedbackForm<FeedbackInput> {
  const result = feedbackInput.safeParse(readFields(formData));
  return result.success
    ? { data: result.data }
    : { fieldErrors: firstFieldErrors(result.error) };
}

export function parseFeedbackUpdate(
  formData: FormData,
): ParsedFeedbackForm<FeedbackUpdate> {
  const result = feedbackUpdate.safeParse({
    ...readFields(formData),
    status: formData.get("status"),
  });
  return result.success
    ? { data: result.data }
    : { fieldErrors: firstFieldErrors(result.error) };
}
