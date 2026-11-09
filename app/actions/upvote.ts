"use server";

import { updateTag } from "next/cache";
import { z } from "zod";
import { saveUpvote } from "@/db/mutations";
import { FEEDBACK_TAG } from "@/db/queries";

const schema = z.object({
  feedbackId: z.int().positive(),
  upvoted: z.boolean(),
});

export async function setUpvote(feedbackId: number, upvoted: boolean) {
  const input = schema.parse({ feedbackId, upvoted });
  await saveUpvote(input.feedbackId, input.upvoted);
  updateTag(FEEDBACK_TAG);
}
