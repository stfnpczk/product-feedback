import type { ReactNode } from "react";
import { FieldError } from "../shared/FieldError";

export type FieldControl = {
  id: string;
  labelId: string;
  describedBy: string;
  invalid: boolean;
};

type FormFieldProps = {
  id: string;
  label: string;
  hint: string;
  error?: string;
  children: (control: FieldControl) => ReactNode;
};

export function FormField({
  id,
  label,
  hint,
  error,
  children,
}: FormFieldProps) {
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label
        id={labelId}
        htmlFor={id}
        className="block text-body-3 font-bold text-navy md:text-h4"
      >
        {label}
      </label>
      <p
        id={hintId}
        className="mt-0.75 text-body-3 font-normal md:mt-0.5 md:text-sm"
      >
        {hint}
      </p>
      <div className="mt-4">
        {children({
          id,
          labelId,
          describedBy: error ? `${hintId} ${errorId}` : hintId,
          invalid: Boolean(error),
        })}
      </div>
      <FieldError id={errorId}>{error}</FieldError>
    </div>
  );
}
