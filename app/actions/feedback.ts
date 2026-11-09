"use server";

import { updateTag } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import {
  deleteFeedbackRow,
  insertFeedback,
  updateFeedbackRow,
} from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import { feedbackNotFound, serverError } from "@/lib/action-state";
import {
  type DeleteFeedbackState,
  type FeedbackFormState,
  parseFeedbackForm,
  parseFeedbackUpdate,
} from "@/lib/feedback-form";
import { recordId } from "@/lib/ids";
import { feedbackHref } from "@/lib/routes";

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
    return serverError;
  }

  updateTag(FEEDBACK_TAG);
  redirect(feedbackHref(id), RedirectType.replace);
}

export async function updateFeedback(
  id: number,
  formData: FormData,
): Promise<FeedbackFormState> {
  if (!recordId.safeParse(id).success) return feedbackNotFound;

  const parsed = parseFeedbackUpdate(formData);
  if (!parsed.data) {
    return { status: "invalid", fieldErrors: parsed.fieldErrors };
  }

  let updated: boolean;
  try {
    updated = await updateFeedbackRow(id, parsed.data);
  } catch {
    return serverError;
  }
  if (!updated) return feedbackNotFound;

  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}

export async function deleteFeedback(id: number): Promise<DeleteFeedbackState> {
  if (!recordId.safeParse(id).success) return feedbackNotFound;

  let deleted: boolean;
  try {
    deleted = await deleteFeedbackRow(id);
  } catch {
    return serverError;
  }
  if (!deleted) return feedbackNotFound;

  updateTag(FEEDBACK_TAG);
  redirect("/", RedirectType.replace);
}
