"use server";

import { updateTag } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { insertFeedback } from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import { type FeedbackFormState, parseFeedbackForm } from "@/lib/feedback-form";

export async function createFeedback(
  formData: FormData,
): Promise<FeedbackFormState> {
  const parsed = parseFeedbackForm(formData);
  if (!parsed.data) {
    return { status: "invalid", fieldErrors: parsed.fieldErrors };
  }

  let id: number;
  try {
    id = await insertFeedback(parsed.data);
  } catch {
    return {
      status: "error",
      message: "Something went wrong. Please try again.",
    };
  }

  updateTag(FEEDBACK_TAG);
  redirect(`/feedback/${id}`, RedirectType.replace);
}
