"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useEffectEvent, useId, useRef, useState } from "react";
import type { DeleteFeedbackState } from "@/app/actions/feedback";
import { type Category, categories, categoryLabels } from "@/lib/categories";
import {
  DESCRIPTION_MAX_LENGTH,
  type FeedbackField,
  type FeedbackFormState,
  type FeedbackUpdate,
  parseFeedbackForm,
  parseFeedbackUpdate,
  TITLE_MAX_LENGTH,
} from "@/lib/feedback-form";
import { type Status, statuses, statusLabels } from "@/lib/statuses";
import { buttonStyles } from "../shared/button-styles";
import { fieldStyles } from "../shared/field-styles";
import { Select } from "../shared/Select";
import {
  useBackNavigation,
  useNavigateBack,
} from "../shared/useBackNavigation";
import { DeleteFeedbackDialog } from "./DeleteFeedbackDialog";
import { FormField } from "./FormField";
import { useFeedbackForm } from "./useFeedbackForm";

const categoryOptions = categories.map((value) => ({
  value,
  label: categoryLabels[value],
}));

const statusOptions = statuses.map((value) => ({
  value,
  label: statusLabels[value],
}));

type FeedbackFormProps = {
  action: (formData: FormData) => Promise<FeedbackFormState>;
} & (
  | { mode: "create" }
  | {
      mode: "edit";
      feedbackId: number;
      defaultValues: FeedbackUpdate;
      deleteAction: () => Promise<DeleteFeedbackState>;
    }
);

export function FeedbackForm(props: FeedbackFormProps) {
  const isEdit = props.mode === "edit";
  const defaultValues = isEdit ? props.defaultValues : undefined;
  const returnHref = isEdit ? `/feedback/${props.feedbackId}` : "/";

  const id = useId();
  const fieldId = (field: FeedbackField) => `${id}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [categoryChoice, setCategory] = useState<Category | null>(null);
  const [statusChoice, setStatus] = useState<Status | null>(null);
  const category = categoryChoice ?? defaultValues?.category ?? "feature";
  const status = statusChoice ?? defaultValues?.status ?? "suggestion";
  const navigateBack = useNavigateBack(returnHref);
  const { errors, serverError, isSaving, handleSubmit, clearError, reset } =
    useFeedbackForm({
      submit: props.action,
      parse: isEdit ? parseFeedbackUpdate : parseFeedbackForm,
      fieldId,
      onSuccess: navigateBack,
    });
  const handleCancel = useBackNavigation(returnHref);

  const resetForm = useEffectEvent((form: HTMLFormElement | null) => {
    form?.reset();
    setCategory(null);
    setStatus(null);
    reset();
  });

  useEffect(() => {
    const form = formRef.current;
    return () => resetForm(form);
  }, []);

  return (
    <div className="mt-11 flow-root rounded-card bg-white px-6 pb-6 md:mt-14 md:px-10.5 md:pb-10">
      <Image
        src={
          isEdit
            ? "/assets/shared/icon-edit-feedback.svg"
            : "/assets/shared/icon-new-feedback.svg"
        }
        alt=""
        width={56}
        height={56}
        className="-mt-5 size-10 md:-mt-7 md:size-14"
      />
      <h1 className="mt-6 text-h3 text-navy md:text-h1">
        {defaultValues
          ? `Editing ‘${defaultValues.title}’`
          : "Create New Feedback"}
      </h1>

      <form
        ref={formRef}
        noValidate
        onSubmit={handleSubmit}
        className="mt-6 md:mt-10"
      >
        <div className="flex flex-col gap-6">
          <FormField
            id={fieldId("title")}
            label="Feedback Title"
            hint="Add a short, descriptive headline"
            error={errors.title}
          >
            {(control) => (
              <input
                id={control.id}
                name="title"
                type="text"
                maxLength={TITLE_MAX_LENGTH}
                defaultValue={defaultValues?.title}
                aria-describedby={control.describedBy}
                aria-invalid={control.invalid || undefined}
                onChange={() => clearError("title")}
                className={`block h-12 px-4 md:px-6 ${fieldStyles(control.invalid)}`}
              />
            )}
          </FormField>

          <FormField
            id={fieldId("category")}
            label="Category"
            hint="Choose a category for your feedback"
            error={errors.category}
          >
            {(control) => (
              <Select
                variant="field"
                id={control.id}
                name="category"
                labelledBy={control.labelId}
                describedBy={control.describedBy}
                invalid={control.invalid}
                options={categoryOptions}
                value={category}
                onChange={(next) => {
                  setCategory(next);
                  clearError("category");
                }}
              />
            )}
          </FormField>

          {isEdit && (
            <FormField
              id={fieldId("status")}
              label="Update Status"
              hint="Change feature state"
              error={errors.status}
            >
              {(control) => (
                <Select
                  variant="field"
                  id={control.id}
                  name="status"
                  labelledBy={control.labelId}
                  describedBy={control.describedBy}
                  invalid={control.invalid}
                  options={statusOptions}
                  value={status}
                  onChange={(next) => {
                    setStatus(next);
                    clearError("status");
                  }}
                />
              )}
            </FormField>
          )}

          <FormField
            id={fieldId("description")}
            label="Feedback Detail"
            hint="Include any specific comments on what should be improved, added, etc."
            error={errors.description}
          >
            {(control) => (
              <textarea
                id={control.id}
                name="description"
                maxLength={DESCRIPTION_MAX_LENGTH}
                defaultValue={defaultValues?.description}
                aria-describedby={control.describedBy}
                aria-invalid={control.invalid || undefined}
                onChange={() => clearError("description")}
                className={`block h-30 resize-none p-4 md:h-24 md:px-6 ${fieldStyles(control.invalid)}`}
              />
            )}
          </FormField>
        </div>

        {serverError && (
          <p role="alert" className="mt-6 text-sm text-red">
            {serverError}
          </p>
        )}

        <div className="mt-10 flex flex-col-reverse gap-4 md:mt-8 md:flex-row md:justify-end">
          {isEdit && (
            <DeleteFeedbackDialog
              title={props.defaultValues.title}
              action={props.deleteAction}
              className="md:mr-auto"
            />
          )}
          <Link
            href={returnHref}
            onClick={handleCancel}
            className={buttonStyles("tertiary")}
          >
            Cancel
          </Link>
          <button type="submit" disabled={isSaving} className={buttonStyles()}>
            {isEdit ? "Save Changes" : "Add Feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
