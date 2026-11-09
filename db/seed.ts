// Resets the database to the Frontend Mentor sample data: `pnpm db:seed`
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/neon-http";
import { CURRENT_USER } from "../lib/current-user.ts";
import * as schema from "./schema.ts";

type SeedUser = { image: string; name: string; username: string };
type SeedReply = { content: string; replyingTo: string; user: SeedUser };
type SeedComment = {
  id: number;
  content: string;
  user: SeedUser;
  replies?: SeedReply[];
};
type SeedFeedback = {
  id: number;
  title: string;
  category: (typeof schema.categoryEnum.enumValues)[number];
  status: (typeof schema.statusEnum.enumValues)[number];
  upvotes: number;
  description: string;
  comments?: SeedComment[];
};
type SeedData = { productRequests: SeedFeedback[] };

const data: SeedData = JSON.parse(
  readFileSync(new URL("./seed-data.json", import.meta.url), "utf8"),
);

const db = drizzle({
  client: neon(process.env.DATABASE_URL!),
  schema,
  casing: "snake_case",
});

async function seed() {
  await db.execute(
    sql`truncate ${schema.votes}, ${schema.comments}, ${schema.feedback}, ${schema.users} restart identity cascade`,
  );

  // Users: current user plus everyone who commented or replied
  const seedUsers = new Map<string, SeedUser>([
    [CURRENT_USER.username, CURRENT_USER],
  ]);
  for (const request of data.productRequests) {
    for (const comment of request.comments ?? []) {
      seedUsers.set(comment.user.username, comment.user);
      for (const reply of comment.replies ?? []) {
        seedUsers.set(reply.user.username, reply.user);
      }
    }
  }
  const insertedUsers = await db
    .insert(schema.users)
    .values(
      [...seedUsers.values()].map((user) => ({
        ...user,
        image: user.image.replace(/^\.\//, "/"),
      })),
    )
    .returning();
  const userId = new Map(insertedUsers.map((u) => [u.username, u.id]));

  const insertedFeedback = await db
    .insert(schema.feedback)
    .values(
      data.productRequests.map(
        ({ title, category, status, upvotes, description }) => ({
          title,
          category,
          status,
          upvotes,
          description,
        }),
      ),
    )
    .returning({ id: schema.feedback.id });

  // Top-level comments first, then replies pointing at their parent
  const topLevel = data.productRequests.flatMap((request, i) =>
    (request.comments ?? []).map((comment) => ({
      feedbackId: insertedFeedback[i].id,
      comment,
    })),
  );
  const insertedComments = await db
    .insert(schema.comments)
    .values(
      topLevel.map(({ feedbackId, comment }) => ({
        feedbackId,
        userId: userId.get(comment.user.username)!,
        content: comment.content,
      })),
    )
    .returning({ id: schema.comments.id });

  const replies = topLevel.flatMap(({ feedbackId, comment }, i) =>
    (comment.replies ?? []).map((reply) => ({
      feedbackId,
      parentId: insertedComments[i].id,
      userId: userId.get(reply.user.username)!,
      replyingTo: reply.replyingTo,
      content: reply.content,
    })),
  );
  if (replies.length) await db.insert(schema.comments).values(replies);

  console.log(
    `Seeded ${insertedUsers.length} users, ${insertedFeedback.length} feedback, ${insertedComments.length} comments, ${replies.length} replies`,
  );
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
