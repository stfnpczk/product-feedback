"use client";

import { addReply } from "@/app/actions/comments";
import { buttonStyles } from "../shared/button-styles";
import { CommentTextarea } from "./CommentTextarea";
import { replyFormId, useReply } from "./ReplyProvider";
import { useCommentForm } from "./useCommentForm";

type ReplyFormProps = {
  commentId: number;
  authorName: string;
  className?: string;
};

export function ReplyForm(props: ReplyFormProps) {
  const { openId } = useReply();
  if (openId !== props.commentId) return null;
  return <OpenReplyForm {...props} />;
}

function OpenReplyForm({
  commentId,
  authorName,
  className = "",
}: ReplyFormProps) {
  const { close } = useReply();
  const { textareaRef, content, error, isPending, handleSubmit, handleChange } =
    useCommentForm(
      (formData) => addReply(commentId, formData),
      () => close(commentId),
    );

  return (
    <form
      id={replyFormId(commentId)}
      onSubmit={handleSubmit}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close(commentId);
        }
      }}
      noValidate
      className={`flex flex-col gap-4 md:flex-row md:items-start ${className}`}
    >
      <CommentTextarea
        ref={textareaRef}
        value={content}
        onChange={(event) => handleChange(event.target.value)}
        aria-label={`Reply to ${authorName}`}
        error={error}
        autoFocus
        className="md:flex-1"
      />
      <button
        type="submit"
        disabled={isPending}
        className={`${buttonStyles()} self-end md:self-start`}
      >
        Post Reply
      </button>
    </form>
  );
}
