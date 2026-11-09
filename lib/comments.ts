import { z } from "zod";

export const COMMENT_MAX_LENGTH = 250;

export const commentContent = z
  .string()
  .trim()
  .min(1, "Can't be empty")
  .max(
    COMMENT_MAX_LENGTH,
    `Can't be longer than ${COMMENT_MAX_LENGTH} characters`,
  );

export type CommentFormState =
  { status: "idle" | "success" } | { status: "error"; message: string };

export const initialCommentFormState: CommentFormState = { status: "idle" };
