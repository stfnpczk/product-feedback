import { and, eq, inArray, sql } from "drizzle-orm";
import { CURRENT_USERNAME } from "@/lib/current-user";
import { db } from "./index";
import { feedback, users, votes } from "./schema";

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
