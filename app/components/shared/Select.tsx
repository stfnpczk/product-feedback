"use client";

import Image from "next/image";
import { fieldStyles } from "./field-styles";
import { type SelectOption, useSelect } from "./useSelect";

export type { SelectOption };

const arrowClasses =
  "h-1.75 w-2.5 shrink-0 mask-[url(/assets/shared/icon-arrow-down.svg)] mask-contain mask-center mask-no-repeat transition-[rotate] duration-300 group-aria-expanded:rotate-180 motion-reduce:transition-none";

type SelectBaseProps<T extends string> = {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
};

type ToolbarSelectProps<T extends string> = SelectBaseProps<T> & {
  label: string;
  disabled?: boolean;
};

export function ToolbarSelect<T extends string>({
  label,
  disabled,
  ...base
}: ToolbarSelectProps<T>) {
  const select = useSelect(base);

  return (
    <>
      <button
        {...select.triggerProps}
        role="combobox"
        aria-expanded={select.open}
        aria-controls={select.listboxId}
        aria-activedescendant={select.activeOptionId}
        aria-labelledby={`${select.labelId} ${select.valueId}`}
        disabled={disabled}
        className="group flex h-full items-center text-body-3 font-normal whitespace-nowrap outline-none md:text-sm"
      >
        <span className="-mx-3 flex h-10 items-center rounded-card px-3 group-focus-visible:outline-2 group-focus-visible:outline-lavender md:h-11">
          <span className="flex items-center gap-2 transition-opacity group-hover:opacity-75 group-aria-expanded:opacity-75">
            <span id={select.labelId} aria-hidden="true">
              {label}
            </span>
            <span id={select.valueId} className="font-bold">
              {base.options[select.selectedIndex].label}
            </span>
            <span
              aria-hidden="true"
              className={`${arrowClasses} bg-lavender`}
            />
          </span>
        </span>
      </button>
      <SelectListbox
        select={select}
        options={base.options}
        labelledBy={select.labelId}
        widthClass="w-63.75"
      />
    </>
  );
}

type FieldSelectProps<T extends string> = SelectBaseProps<T> & {
  id: string;
  name: string;
  labelledBy: string;
  describedBy?: string;
  invalid?: boolean;
};

export function FieldSelect<T extends string>({
  id,
  name,
  labelledBy,
  describedBy,
  invalid = false,
  ...base
}: FieldSelectProps<T>) {
  const select = useSelect(base);

  return (
    <>
      <input type="hidden" name={name} value={base.value} />
      <button
        {...select.triggerProps}
        role="combobox"
        aria-expanded={select.open}
        aria-controls={select.listboxId}
        aria-activedescendant={select.activeOptionId}
        id={id}
        aria-labelledby={labelledBy}
        aria-describedby={describedBy}
        aria-invalid={invalid || undefined}
        className={`group flex h-12 cursor-pointer items-center justify-between px-4 text-left md:px-6 ${fieldStyles(invalid)} ${invalid ? "" : "aria-expanded:border-blue"}`}
      >
        <span id={select.valueId}>
          {base.options[select.selectedIndex].label}
        </span>
        <span aria-hidden="true" className={`${arrowClasses} bg-blue`} />
      </button>
      <SelectListbox
        select={select}
        options={base.options}
        labelledBy={labelledBy}
        widthClass="w-[anchor-size(width)]"
      />
    </>
  );
}

function SelectListbox<T extends string>({
  select,
  options,
  labelledBy,
  widthClass,
}: {
  select: ReturnType<typeof useSelect<T>>;
  options: readonly SelectOption<T>[];
  labelledBy: string;
  widthClass: string;
}) {
  return (
    <ul
      {...select.listboxProps}
      aria-labelledby={labelledBy}
      className={`inset-auto m-0 mt-4 ${widthClass} divide-y divide-navy/15 overflow-visible rounded-card border-0 bg-white p-0 text-body-1 text-slate shadow-dropdown shutter [position-area:bottom_span-right] motion-reduce:transition-none`}
    >
      {options.map((option, index) => (
        <li
          key={option.value}
          {...select.optionProps(index)}
          className={`flex h-12 shutter-slat cursor-pointer items-center justify-between px-6 motion-reduce:transition-none ${
            select.open && index === select.activeIndex
              ? "text-purple forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:forced-color-adjust-none"
              : ""
          }`}
        >
          {option.label}
          {index === select.selectedIndex && (
            <Image
              src="/assets/shared/icon-check.svg"
              alt=""
              width={13}
              height={11}
            />
          )}
        </li>
      ))}
    </ul>
  );
}
