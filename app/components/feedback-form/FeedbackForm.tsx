"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { type Category, categories, categoryLabels } from "@/lib/categories";
import {
  type DeleteFeedbackState,
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
import { useBackLink, useReturnTo } from "../shared/back-navigation";
import { FormAlert } from "../shared/FormAlert";
import { FieldSelect } from "../shared/Select";
import { DeleteFeedbackDialog } from "./DeleteFeedbackDialog";
import { FormField } from "./FormField";
import { formCard, formCardIcon } from "./form-card-styles";
import { useFeedbackForm } from "./useFeedbackForm";
import { useResetWhenHidden } from "./useResetWhenHidden";

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
  returnHref: string;
} & (
  | { mode: "create" }
  | {
      mode: "edit";
      defaultValues: FeedbackUpdate;
      deleteAction: () => Promise<DeleteFeedbackState>;
    }
);

export function FeedbackForm(props: FeedbackFormProps) {
  const isEdit = props.mode === "edit";
  const defaultValues = isEdit ? props.defaultValues : undefined;
  const { returnHref } = props;

  const id = useId();
  const fieldId = (field: FeedbackField) => `${id}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const [categoryChoice, setCategory] = useState<Category | null>(null);
  const [statusChoice, setStatus] = useState<Status | null>(null);
  const category = categoryChoice ?? defaultValues?.category ?? "feature";
  const status = statusChoice ?? defaultValues?.status ?? "suggestion";
  const returnTo = useReturnTo(returnHref);
  const { errors, serverError, isSaving, handleSubmit, clearError, reset } =
    useFeedbackForm({
      submit: props.action,
      parse: isEdit ? parseFeedbackUpdate : parseFeedbackForm,
      fieldId,
      onSuccess: returnTo,
    });
  const handleCancel = useBackLink(returnHref);

  useResetWhenHidden(formRef, () => {
    setCategory(null);
    setStatus(null);
    reset();
  });

  return (
    <div className={formCard}>
      <Image
        src={
          isEdit
            ? "/assets/shared/icon-edit-feedback.svg"
            : "/assets/shared/icon-new-feedback.svg"
        }
        alt=""
        width={56}
        height={56}
        className={formCardIcon}
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
              <FieldSelect
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
                <FieldSelect
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

        <FormAlert className="mt-6">{serverError}</FormAlert>

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
            onNavigate={handleCancel}
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
