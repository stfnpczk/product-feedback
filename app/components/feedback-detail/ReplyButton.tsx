"use client";

import { replyButtonId, replyFormId, useReply } from "./ReplyProvider";

export function ReplyButton({
  commentId,
  authorName,
}: {
  commentId: number;
  authorName: string;
}) {
  const { openId, toggle } = useReply();
  const open = openId === commentId;

  return (
    <button
      type="button"
      id={replyButtonId(commentId)}
      aria-expanded={open}
      aria-controls={open ? replyFormId(commentId) : undefined}
      onClick={() => toggle(commentId)}
      className="cursor-pointer text-body-3 text-blue hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
    >
      Reply<span className="sr-only"> to {authorName}</span>
    </button>
  );
}
