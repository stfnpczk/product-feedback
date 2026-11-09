"use client";

import {
  type FormEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import {
  type FeedbackField,
  type FeedbackFormState,
  type FieldErrors,
  initialFeedbackFormState,
  parseFeedbackForm,
} from "@/lib/feedback-form";

const fieldOrder: FeedbackField[] = ["title", "category", "description"];

export function useFeedbackForm(
  submit: (formData: FormData) => Promise<FeedbackFormState>,
  fieldId: (field: FeedbackField) => string,
) {
  const [errors, setErrors] = useState<FieldErrors>({});

  function showErrors(fieldErrors: FieldErrors) {
    setErrors(fieldErrors);
    const first = fieldOrder.find((field) => fieldErrors[field]);
    if (first) document.getElementById(fieldId(first))?.focus();
  }

  const [state, dispatch, isPending] = useActionState(
    async (_prev: FeedbackFormState, formData: FormData) => {
      const result = await submit(formData);
      if (result.status === "invalid") showErrors(result.fieldErrors);
      return result;
    },
    initialFeedbackFormState,
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = parseFeedbackForm(formData);
    if (!parsed.data) {
      showErrors(parsed.fieldErrors);
      return;
    }
    setErrors({});
    startTransition(() => dispatch(formData));
  }

  function clearError(field: FeedbackField) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const serverError =
    state.status === "error" && !isPending ? state.message : undefined;

  return { errors, serverError, isPending, handleSubmit, clearError };
}
