"use server";

import { updateTag } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { z } from "zod";
import {
  deleteFeedback as deleteFeedbackRow,
  insertFeedback,
  updateFeedback as updateFeedbackRow,
} from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import {
  type FeedbackFormState,
  parseFeedbackForm,
  parseFeedbackUpdate,
} from "@/lib/feedback-form";

const feedbackId = z.int().positive();

const failed = {
  status: "error",
  message: "Something went wrong. Please try again.",
} as const;

const notFound = {
  status: "error",
  message: "This feedback no longer exists.",
} as const;

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
    return failed;
  }

  updateTag(FEEDBACK_TAG);
  redirect(`/feedback/${id}`, RedirectType.replace);
}

export async function updateFeedback(
  id: number,
  formData: FormData,
): Promise<FeedbackFormState> {
  if (!feedbackId.safeParse(id).success) return notFound;

  const parsed = parseFeedbackUpdate(formData);
  if (!parsed.data) {
    return { status: "invalid", fieldErrors: parsed.fieldErrors };
  }

  let updated: boolean;
  try {
    updated = await updateFeedbackRow(id, parsed.data);
  } catch {
    return failed;
  }
  if (!updated) return notFound;

  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}

export type DeleteFeedbackState = { status: "idle" } | typeof failed;

export async function deleteFeedback(id: number): Promise<DeleteFeedbackState> {
  if (!feedbackId.safeParse(id).success) return failed;

  try {
    await deleteFeedbackRow(id);
  } catch {
    return failed;
  }

  updateTag(FEEDBACK_TAG);
  redirect("/", RedirectType.replace);
}
