"use client";

import { type ComponentProps, useId } from "react";
import { COMMENT_MAX_LENGTH } from "@/lib/comments";

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
        className={`block h-20 w-full resize-none rounded-[5px] border bg-ghost p-4 text-body-3 font-normal text-navy placeholder:text-steel focus:outline-none md:px-6 md:text-body-2 ${
          error ? "border-red" : "border-transparent focus:border-blue"
        }`}
        {...props}
      />
      {error && (
        <p id={errorId} className="mt-1 text-sm text-red">
          {error}
        </p>
      )}
    </div>
  );
}
