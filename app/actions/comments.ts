"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { insertComment, insertReply } from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import { type CommentFormState, commentContent } from "@/lib/comments";

const id = z.int().positive();

const failed: CommentFormState = {
  status: "error",
  message: "Something went wrong. Please try again.",
};

function parseContent(formData: FormData) {
  return commentContent.safeParse(formData.get("content") ?? "");
}

export async function addComment(
  feedbackId: number,
  formData: FormData,
): Promise<CommentFormState> {
  const content = parseContent(formData);
  if (!content.success) {
    return { status: "error", message: content.error.issues[0].message };
  }
  if (!id.safeParse(feedbackId).success) return failed;

  try {
    await insertComment(feedbackId, content.data);
  } catch {
    return failed;
  }
  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}

export async function addReply(
  commentId: number,
  formData: FormData,
): Promise<CommentFormState> {
  const content = parseContent(formData);
  if (!content.success) {
    return { status: "error", message: content.error.issues[0].message };
  }
  if (!id.safeParse(commentId).success) return failed;

  try {
    const saved = await insertReply(commentId, content.data);
    if (!saved) return failed;
  } catch {
    return failed;
  }
  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}
