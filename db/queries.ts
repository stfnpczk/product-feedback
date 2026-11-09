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
import { CURRENT_USERNAME } from "@/lib/current-user";
import type { Sort, SuggestionFilters } from "@/lib/suggestion-filters";
import { db } from "./index";
import { comments, feedback, statusEnum, users, votes } from "./schema";

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
        eq(users.username, CURRENT_USERNAME),
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
  upvotes: feedback.upvotes,
  upvoted,
  commentCount,
};

export async function getSuggestions({ sort, category }: SuggestionFilters) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  return db
    .select(feedbackSummaryFields)
    .from(feedback)
    .leftJoin(comments, eq(comments.feedbackId, feedback.id))
    .where(
      and(
        eq(feedback.status, "suggestion"),
        category === "all" ? undefined : eq(feedback.category, category),
      ),
    )
    .groupBy(feedback.id)
    .orderBy(...orderBy[sort], asc(feedback.id));
}

export type FeedbackSummary = Awaited<
  ReturnType<typeof getSuggestions>
>[number];

export async function getFeedback(id: number) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  const [row] = await db
    .select({ ...feedbackSummaryFields, status: feedback.status })
    .from(feedback)
    .leftJoin(comments, eq(comments.feedbackId, feedback.id))
    .where(eq(feedback.id, id))
    .groupBy(feedback.id);
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

export type CommentData = {
  id: number;
  parentId: number | null;
  replyingTo: string | null;
  content: string;
  author: { name: string; username: string; image: string };
};

export type CommentNode = CommentData & { replies: CommentData[] };

function nestComments(rows: CommentData[]): CommentNode[] {
  const topLevel = new Map<number, CommentNode>();
  for (const row of rows) {
    if (row.parentId === null) topLevel.set(row.id, { ...row, replies: [] });
  }
  for (const row of rows) {
    if (row.parentId !== null) topLevel.get(row.parentId)?.replies.push(row);
  }
  return [...topLevel.values()];
}

type RoadmapStatus = Exclude<
  (typeof statusEnum.enumValues)[number],
  "suggestion"
>;

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
