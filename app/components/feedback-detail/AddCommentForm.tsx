"use client";

import { useId } from "react";
import { addComment } from "@/app/actions/comments";
import { COMMENT_MAX_LENGTH } from "@/lib/comments";
import { buttonStyles } from "../shared/button-styles";
import { FormAlert } from "../shared/FormAlert";
import { CommentTextarea } from "./CommentTextarea";
import { useCommentForm } from "./useCommentForm";

export function AddCommentForm({ feedbackId }: { feedbackId: number }) {
  const headingId = useId();
  const counterId = useId();
  const {
    state,
    textareaRef,
    content,
    fieldError,
    serverError,
    isPending,
    handleSubmit,
    handleChange,
  } = useCommentForm((formData) => addComment(feedbackId, formData));
  const charactersLeft = COMMENT_MAX_LENGTH - content.length;

  return (
    <section
      aria-labelledby={headingId}
      className="rounded-card bg-white p-6 md:px-8 md:pb-8"
    >
      <h2 id={headingId} className="text-h3 text-navy">
        Add Comment
      </h2>
      <form onSubmit={handleSubmit} noValidate className="mt-6">
        <CommentTextarea
          ref={textareaRef}
          value={content}
          onChange={(event) => handleChange(event.target.value)}
          aria-labelledby={headingId}
          describedBy={counterId}
          placeholder="Type your comment here"
          error={fieldError}
        />
        <div className="mt-4 flex items-center justify-between gap-4">
          <p id={counterId} className="text-body-3 font-normal md:text-body-2">
            {charactersLeft} {charactersLeft === 1 ? "Character" : "Characters"}{" "}
            left
          </p>
          <button type="submit" disabled={isPending} className={buttonStyles()}>
            Post Comment
          </button>
        </div>
        <FormAlert className="mt-4">{serverError}</FormAlert>
        <p role="status" className="sr-only">
          {state.status === "success" ? "Comment posted" : ""}
        </p>
      </form>
    </section>
  );
}
