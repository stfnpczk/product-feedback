"use server";

import { updateTag } from "next/cache";
import { insertComment, insertReply } from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import { serverError } from "@/lib/action-state";
import { type CommentFormState, parseComment } from "@/lib/comments";
import { recordId } from "@/lib/ids";

async function saveComment(
  formData: FormData,
  insert: (content: string) => Promise<boolean>,
): Promise<CommentFormState> {
  const content = parseComment(formData.get("content"));
  if (content.error !== undefined) {
    return { status: "invalid", fieldError: content.error };
  }

  try {
    const saved = await insert(content.data);
    if (!saved) return serverError;
  } catch {
    return serverError;
  }
  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}

export async function addComment(
  feedbackId: number,
  formData: FormData,
): Promise<CommentFormState> {
  if (!recordId.safeParse(feedbackId).success) return serverError;
  return saveComment(formData, (content) => insertComment(feedbackId, content));
}

export async function addReply(
  commentId: number,
  formData: FormData,
): Promise<CommentFormState> {
  if (!recordId.safeParse(commentId).success) return serverError;
  return saveComment(formData, (content) => insertReply(commentId, content));
}
