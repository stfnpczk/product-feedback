import { and, asc, count, desc, eq, ne, type SQL } from "drizzle-orm";
import { cacheTag } from "next/cache";
import type { Sort, SuggestionFilters } from "@/lib/suggestion-filters";
import { db } from "./index";
import { comments, feedback, statusEnum } from "./schema";

export const FEEDBACK_TAG = "feedback";

const commentCount = count(comments.id);

const orderBy: Record<Sort, SQL[]> = {
  "most-upvotes": [desc(feedback.upvotes)],
  "least-upvotes": [asc(feedback.upvotes)],
  "most-comments": [desc(commentCount)],
  "least-comments": [asc(commentCount)],
};

export async function getSuggestions({ sort, category }: SuggestionFilters) {
  "use cache";
  cacheTag(FEEDBACK_TAG);

  return db
    .select({
      id: feedback.id,
      title: feedback.title,
      description: feedback.description,
      category: feedback.category,
      upvotes: feedback.upvotes,
      commentCount,
    })
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

export type Suggestion = Awaited<ReturnType<typeof getSuggestions>>[number];

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
