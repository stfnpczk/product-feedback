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
      className="cursor-pointer text-body-3 text-blue focus-ring focus-ring-offset-4 hover:underline"
    >
      Reply<span className="sr-only"> to {authorName}</span>
    </button>
  );
}
