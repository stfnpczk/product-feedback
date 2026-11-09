"use client";

import {
  type SubmitEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import {
  type CommentFormState,
  initialCommentFormState,
  parseComment,
} from "@/lib/comments";

export function useCommentForm(
  submit: (formData: FormData) => Promise<CommentFormState>,
  onSuccess?: () => void,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [clientError, setClientError] = useState<string>();
  const [dismissed, setDismissed] = useState<CommentFormState | null>(null);
  const [state, dispatch, isPending] = useActionState(
    async (_prev: CommentFormState, formData: FormData) => {
      const result = await submit(formData);
      if (result.status === "success") {
        setContent("");
        onSuccess?.();
      } else if (result.status === "invalid") {
        textareaRef.current?.focus();
      }
      return result;
    },
    initialCommentFormState,
  );

  const visibleState = dismissed === state ? initialCommentFormState : state;
  const fieldError =
    clientError ??
    (visibleState.status === "invalid" ? visibleState.fieldError : undefined);
  const serverError =
    visibleState.status === "error" && !isPending
      ? visibleState.message
      : undefined;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsed = parseComment(content);
    if (parsed.error !== undefined) {
      setClientError(parsed.error);
      setDismissed(state);
      textareaRef.current?.focus();
      return;
    }
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  function handleChange(value: string) {
    setContent(value);
    setClientError(undefined);
    setDismissed(state);
  }

  return {
    state,
    textareaRef,
    content,
    fieldError,
    serverError,
    isPending,
    handleSubmit,
    handleChange,
  };
}
