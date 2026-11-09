import { and, eq, inArray, sql } from "drizzle-orm";
import { CURRENT_USERNAME } from "@/lib/current-user";
import type { FeedbackInput } from "@/lib/feedback-form";
import { db } from "./index";
import { comments, feedback, users, votes } from "./schema";

const currentUserId = db
  .select({ id: users.id })
  .from(users)
  .where(eq(users.username, CURRENT_USERNAME));

export async function saveUpvote(feedbackId: number, upvoted: boolean) {
  const changed = db.$with("changed").as(
    upvoted
      ? db
          .insert(votes)
          .select(
            db
              .select({ userId: users.id, feedbackId: feedback.id })
              .from(users)
              .innerJoin(feedback, eq(feedback.id, feedbackId))
              .where(eq(users.username, CURRENT_USERNAME)),
          )
          .onConflictDoNothing()
          .returning({ feedbackId: votes.feedbackId })
      : db
          .delete(votes)
          .where(
            and(
              eq(votes.feedbackId, feedbackId),
              inArray(votes.userId, currentUserId),
            ),
          )
          .returning({ feedbackId: votes.feedbackId }),
  );

  await db
    .with(changed)
    .update(feedback)
    .set({
      upvotes: upvoted
        ? sql`${feedback.upvotes} + 1`
        : sql`${feedback.upvotes} - 1`,
    })
    .where(
      inArray(feedback.id, db.select({ id: changed.feedbackId }).from(changed)),
    );
}

export async function insertComment(feedbackId: number, content: string) {
  await db.insert(comments).values({
    feedbackId,
    userId: sql`(${currentUserId})`,
    content,
  });
}

export async function insertReply(targetCommentId: number, content: string) {
  const [target] = await db
    .select({
      feedbackId: comments.feedbackId,
      parentId: sql<number>`coalesce(${comments.parentId}, ${comments.id})`,
      replyingTo: users.username,
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId))
    .where(eq(comments.id, targetCommentId));

  if (!target) return false;

  await db.insert(comments).values({
    ...target,
    userId: sql`(${currentUserId})`,
    content,
  });
  return true;
}

export async function insertFeedback(input: FeedbackInput) {
  const [created] = await db
    .insert(feedback)
    .values(input)
    .returning({ id: feedback.id });
  return created.id;
}
