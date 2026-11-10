import {
  type AnyPgColumn,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { categories } from "../lib/categories.ts";
import { statuses } from "../lib/statuses.ts";

export const categoryEnum = pgEnum("category", categories);

export const statusEnum = pgEnum("status", statuses);

export const users = pgTable("users", {
  id: serial().primaryKey(),
  username: text().notNull().unique(),
  name: text().notNull(),
  image: text().notNull(),
});

export const feedback = pgTable("feedback", {
  id: serial().primaryKey(),
  title: text().notNull(),
  category: categoryEnum().notNull(),
  status: statusEnum().notNull().default("suggestion"),
  description: text().notNull(),
  upvotes: integer().notNull().default(0),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const comments = pgTable("comments", {
  id: serial().primaryKey(),
  feedbackId: integer()
    .notNull()
    .references(() => feedback.id, { onDelete: "cascade" }),
  userId: integer()
    .notNull()
    .references(() => users.id),
  parentId: integer().references((): AnyPgColumn => comments.id, {
    onDelete: "cascade",
  }),
  replyingTo: text(),
  content: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export const votes = pgTable(
  "votes",
  {
    userId: integer()
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    feedbackId: integer()
      .notNull()
      .references(() => feedback.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.userId, t.feedbackId] })],
);
