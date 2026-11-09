"use client";

import {
  type SubmitEvent,
  startTransition,
  useActionState,
  useState,
} from "react";
import {
  type FeedbackField,
  type FeedbackFormState,
  type FieldErrors,
  initialFeedbackFormState,
  type ParsedFeedbackForm,
} from "@/lib/feedback-form";

const fieldOrder: FeedbackField[] = [
  "title",
  "category",
  "status",
  "description",
];

type UseFeedbackFormOptions = {
  submit: (formData: FormData) => Promise<FeedbackFormState>;
  parse: (formData: FormData) => ParsedFeedbackForm<unknown>;
  fieldId: (field: FeedbackField) => string;
  onSuccess?: () => void;
};

export function useFeedbackForm({
  submit,
  parse,
  fieldId,
  onSuccess,
}: UseFeedbackFormOptions) {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [succeeded, setSucceeded] = useState(false);
  const [dismissed, setDismissed] = useState<FeedbackFormState | null>(null);

  function showErrors(fieldErrors: FieldErrors) {
    setErrors(fieldErrors);
    const first = fieldOrder.find((field) => fieldErrors[field]);
    if (first) document.getElementById(fieldId(first))?.focus();
  }

  const [state, dispatch, isPending] = useActionState(
    async (_prev: FeedbackFormState, formData: FormData) => {
      const result = await submit(formData);
      if (result.status === "invalid") showErrors(result.fieldErrors);
      if (result.status === "success") {
        setSucceeded(true);
        onSuccess?.();
      }
      return result;
    },
    initialFeedbackFormState,
  );

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const parsed = parse(formData);
    if (parsed.fieldErrors) {
      showErrors(parsed.fieldErrors);
      return;
    }
    setErrors({});
    startTransition(() => dispatch(formData));
  }

  function clearError(field: FeedbackField) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function reset() {
    setErrors({});
    setSucceeded(false);
    setDismissed(state);
  }

  const serverError =
    state.status === "error" && !isPending && dismissed !== state
      ? state.message
      : undefined;
  const isSaving = isPending || succeeded;

  return { errors, serverError, isSaving, handleSubmit, clearError, reset };
}
