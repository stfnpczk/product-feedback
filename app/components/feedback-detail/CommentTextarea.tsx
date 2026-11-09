"use client";

import { type ComponentProps, useId } from "react";
import { COMMENT_MAX_LENGTH } from "@/lib/comments";
import { fieldStyles } from "../shared/field-styles";
import { FieldError } from "../shared/FieldError";

type CommentTextareaProps = ComponentProps<"textarea"> & {
  error?: string;
  describedBy?: string;
};

export function CommentTextarea({
  error,
  describedBy,
  className = "",
  ...props
}: CommentTextareaProps) {
  const errorId = useId();
  const describedByIds =
    [error && errorId, describedBy].filter(Boolean).join(" ") || undefined;

  return (
    <div className={className}>
      <textarea
        name="content"
        maxLength={COMMENT_MAX_LENGTH}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedByIds}
        className={`block h-20 resize-none p-4 md:px-6 ${fieldStyles(!!error)}`}
        {...props}
      />
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
