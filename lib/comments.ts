import { z } from "zod";
import type { ActionError } from "./action-state";

export const COMMENT_MAX_LENGTH = 250;

export const commentContent = z
  .string()
  .trim()
  .min(1, "Can't be empty")
  .max(
    COMMENT_MAX_LENGTH,
    `Can't be longer than ${COMMENT_MAX_LENGTH} characters`,
  );

export function parseComment(content: FormDataEntryValue | null) {
  const result = commentContent.safeParse(content ?? "");
  return result.success
    ? { data: result.data }
    : { error: result.error.issues[0].message };
}

export type CommentFormState =
  | { status: "idle" | "success" }
  | { status: "invalid"; fieldError: string }
  | ActionError;

export const initialCommentFormState: CommentFormState = { status: "idle" };

type NestableComment = { id: number; parentId: number | null };

export function nestComments<T extends NestableComment>(rows: T[]) {
  const topLevel = new Map<number, T & { replies: T[] }>();
  for (const row of rows) {
    if (row.parentId === null) topLevel.set(row.id, { ...row, replies: [] });
  }
  for (const row of rows) {
    if (row.parentId !== null) topLevel.get(row.parentId)?.replies.push(row);
  }
  return [...topLevel.values()];
}
