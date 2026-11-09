"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useState } from "react";
import { type Category, categories, categoryLabels } from "@/lib/categories";
import {
  DESCRIPTION_MAX_LENGTH,
  type FeedbackField,
  type FeedbackFormState,
  type FeedbackInput,
  TITLE_MAX_LENGTH,
} from "@/lib/feedback-form";
import { buttonStyles } from "../shared/button-styles";
import { fieldStyles } from "../shared/field-styles";
import { Select } from "../shared/Select";
import { useBackNavigation } from "../shared/useBackNavigation";
import { FormField } from "./FormField";
import { useFeedbackForm } from "./useFeedbackForm";

const categoryOptions = categories.map((value) => ({
  value,
  label: categoryLabels[value],
}));

type FeedbackFormProps = {
  heading: string;
  icon: string;
  submitLabel: string;
  cancelHref: string;
  action: (formData: FormData) => Promise<FeedbackFormState>;
  defaultValues?: FeedbackInput;
};

export function FeedbackForm({
  heading,
  icon,
  submitLabel,
  cancelHref,
  action,
  defaultValues,
}: FeedbackFormProps) {
  const id = useId();
  const fieldId = (field: FeedbackField) => `${id}-${field}`;
  const [category, setCategory] = useState<Category>(
    defaultValues?.category ?? "feature",
  );
  const { errors, serverError, isPending, handleSubmit, clearError } =
    useFeedbackForm(action, fieldId);
  const handleCancel = useBackNavigation(cancelHref);

  return (
    <div className="mt-11 flow-root rounded-card bg-white px-6 pb-6 md:mt-14 md:px-10.5 md:pb-10">
      <Image
        src={icon}
        alt=""
        width={56}
        height={56}
        className="-mt-5 size-10 md:-mt-7 md:size-14"
      />
      <h1 className="mt-6 text-h3 text-navy md:text-h1">{heading}</h1>

      <form noValidate onSubmit={handleSubmit} className="mt-6 md:mt-10">
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
          <Link
            href={cancelHref}
            onClick={handleCancel}
            className={buttonStyles("tertiary")}
          >
            Cancel
          </Link>
          <button type="submit" disabled={isPending} className={buttonStyles()}>
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}
