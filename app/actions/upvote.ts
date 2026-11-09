"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { saveUpvote } from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";
import { type ActionResult, serverError } from "@/lib/action-state";
import { recordId } from "@/lib/ids";

const upvoteInput = z.object({
  feedbackId: recordId,
  upvoted: z.boolean(),
});

export async function setUpvote(
  feedbackId: number,
  upvoted: boolean,
): Promise<ActionResult> {
  const input = upvoteInput.safeParse({ feedbackId, upvoted });
  if (!input.success) return serverError;

  try {
    await saveUpvote(input.data.feedbackId, input.data.upvoted);
  } catch {
    return serverError;
  }
  updateTag(FEEDBACK_TAG);
  return { status: "success" };
}
