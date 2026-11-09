import {
  and,
  asc,
  count,
  desc,
  eq,
  exists,
  ne,
  type SQL,
  sql,
} from "drizzle-orm";
import { cacheTag } from "next/cache";
import { nestComments } from "@/lib/comments";
import { CURRENT_USER } from "@/lib/current-user";
import type { RoadmapStatus } from "@/lib/statuses";
import type { Sort, SuggestionFilters } from "@/lib/suggestion-filters";
import { db } from "./index";
import { comments, feedback, users, votes } from "./schema";

export const FEEDBACK_TAG = "feedback";

const commentCount = count(comments.id);

const upvoted = sql<boolean>`${exists(
  db
    .select({ one: sql`1` })
    .from(votes)
    .innerJoin(users, eq(users.id, votes.userId))
    .where(
      and(
        eq(votes.feedbackId, feedback.id),
        eq(users.username, CURRENT_USER.username),
      ),
    ),
)}`;

const orderBy: Record<Sort, SQL[]> = {
  "most-upvotes": [desc(feedback.upvotes)],
  "least-upvotes": [asc(feedback.upvotes)],
  "most-comments": [desc(commentCount)],
  "least-comments": [asc(commentCount)],
};

const feedbackSummaryFields = {
  id: feedback.id,
  title: feedback.title,
  description: feedback.description,
  category: feedback.category,
  status: feedback.status,
  upvotes: feedback.upvotes,
  upvoted,
  commentCount,
};

function selectFeedbackSummaries() {
  return db
    .select(feedbackSummaryFields)
    .from(feedback)
    .leftJoin(comments, eq(comments.feedbackId, feedback.id))
    .groupBy(feedback.id);
}

export async function getSuggestions({ sort, category }: SuggestionFilters) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  return selectFeedbackSummaries()
    .where(
      and(
        eq(feedback.status, "suggestion"),
        category === "all" ? undefined : eq(feedback.category, category),
      ),
    )
    .orderBy(...orderBy[sort], asc(feedback.id));
}

export type FeedbackSummary = Awaited<
  ReturnType<typeof getSuggestions>
>[number];

export async function getFeedback(id: number) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  const [row] = await selectFeedbackSummaries().where(eq(feedback.id, id));
  return row;
}

export async function getComments(feedbackId: number) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  const rows = await db
    .select({
      id: comments.id,
      parentId: comments.parentId,
      replyingTo: comments.replyingTo,
      content: comments.content,
      author: {
        name: users.name,
        username: users.username,
        image: users.image,
      },
    })
    .from(comments)
    .innerJoin(users, eq(users.id, comments.userId))
    .where(eq(comments.feedbackId, feedbackId))
    .orderBy(asc(comments.createdAt), asc(comments.id));

  return nestComments(rows);
}

export type CommentNode = Awaited<ReturnType<typeof getComments>>[number];
export type CommentData = CommentNode["replies"][number];

export async function getRoadmapCounts() {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  const rows = await db
    .select({ status: feedback.status, count: count() })
    .from(feedback)
    .where(ne(feedback.status, "suggestion"))
    .groupBy(feedback.status);

  const counts: Record<RoadmapStatus, number> = {
    planned: 0,
    "in-progress": 0,
    live: 0,
  };
  for (const { status, count } of rows) {
    if (status !== "suggestion") counts[status] = count;
  }
  return counts;
}

export async function getRoadmapFeedback() {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  const rows = await selectFeedbackSummaries()
    .where(ne(feedback.status, "suggestion"))
    .orderBy(desc(feedback.upvotes), asc(feedback.id));

  const board: Record<RoadmapStatus, FeedbackSummary[]> = {
    planned: [],
    "in-progress": [],
    live: [],
  };
  for (const row of rows) {
    if (row.status !== "suggestion") board[row.status].push(row);
  }
  return board;
}
