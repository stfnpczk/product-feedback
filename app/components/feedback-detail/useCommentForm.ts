"use client";

import {
  type SubmitEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { type CommentFormState, initialCommentFormState } from "@/lib/comments";

export function useCommentForm(
  submit: (formData: FormData) => Promise<CommentFormState>,
  onSuccess?: () => void,
) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState("");
  const [dismissed, setDismissed] = useState<CommentFormState | null>(null);
  const [state, dispatch, isPending] = useActionState(
    async (_prev: CommentFormState, formData: FormData) => {
      const result = await submit(formData);
      if (result.status === "success") {
        setContent("");
        onSuccess?.();
      } else if (result.status === "error") {
        textareaRef.current?.focus();
      }
      return result;
    },
    initialCommentFormState,
  );

  const error =
    state.status === "error" && dismissed !== state ? state.message : undefined;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  function handleChange(value: string) {
    setContent(value);
    setDismissed(state);
  }

  return {
    state,
    textareaRef,
    content,
    error,
    isPending,
    handleSubmit,
    handleChange,
  };
}
