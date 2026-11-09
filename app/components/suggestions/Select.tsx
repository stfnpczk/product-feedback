"use client";

import Image from "next/image";
import {
  type CSSProperties,
  type KeyboardEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useTypeahead } from "./useTypeahead";

export type SelectOption<T extends string> = { value: T; label: string };

type SelectProps<T extends string> = {
  label: string;
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
};

export function Select<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
}: SelectProps<T>) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const anchorName = `--${id.replace(/[^\w-]/g, "")}-anchor`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const openIndex = useRef<number | null>(null);
  const matchTypeahead = useTypeahead(options.map((option) => option.label));

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const last = options.length - 1;

  function openAt(index: number) {
    openIndex.current = index;
    listboxRef.current?.showPopover();
  }

  function select(index: number) {
    listboxRef.current?.hidePopover();
    const next = options[index].value;
    if (next !== value) onChange(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>) {
    const isChar =
      e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey;

    if (!open) {
      if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
        e.preventDefault();
        openAt(selectedIndex);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        openAt(e.key === "Home" ? 0 : last);
      } else if (isChar) {
        const match = matchTypeahead(e.key, selectedIndex);
        openAt(match === -1 ? selectedIndex : match);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, last));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (e.altKey) select(activeIndex);
        else setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
      case "PageUp":
        e.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
      case "PageDown":
        e.preventDefault();
        setActiveIndex(last);
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        select(activeIndex);
        break;
      case "Tab":
        select(activeIndex);
        break;
      default:
        if (isChar) {
          const match = matchTypeahead(e.key, activeIndex);
          if (match !== -1) setActiveIndex(match);
        }
    }
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-activedescendant={open ? optionId(activeIndex) : undefined}
        popoverTarget={listboxId}
        disabled={disabled}
        onClick={() => buttonRef.current?.focus()}
        onKeyDown={onKeyDown}
        onKeyUp={(e) => e.key === " " && e.preventDefault()}
        style={{ anchorName }}
        className="group flex h-full items-center text-body-3 font-normal whitespace-nowrap outline-none md:text-sm"
      >
        <span className="-mx-3 flex h-10 items-center rounded-[10px] px-3 group-focus-visible:outline-2 group-focus-visible:outline-lavender md:h-11">
          <span className="flex items-center gap-2 transition-opacity group-hover:opacity-75 group-aria-expanded:opacity-75">
            <span id={labelId} aria-hidden="true">
              {label}
            </span>
            <span id={valueId} className="font-bold">
              {options[selectedIndex].label}
            </span>
            <span
              aria-hidden="true"
              className="h-1.75 w-2.5 bg-lavender mask-[url(/assets/shared/icon-arrow-down.svg)] mask-contain mask-center mask-no-repeat transition-[rotate] duration-300 group-aria-expanded:rotate-180 motion-reduce:transition-none"
            />
          </span>
        </span>
      </button>

      <ul
        ref={listboxRef}
        id={listboxId}
        popover="auto"
        role="listbox"
        aria-labelledby={labelId}
        onBeforeToggle={(e) => {
          const isOpening = e.newState === "open";
          setOpen(isOpening);
          if (isOpening) {
            setActiveIndex(openIndex.current ?? selectedIndex);
            openIndex.current = null;
          }
        }}
        onMouseDown={(e) => e.preventDefault()}
        style={{ positionAnchor: anchorName }}
        className="inset-auto m-0 mt-4 w-63.75 divide-y divide-navy/15 overflow-visible rounded-[10px] border-0 bg-white p-0 text-body-1 text-slate shadow-dropdown shutter [position-area:bottom_span-right] motion-reduce:transition-none"
      >
        {options.map((option, index) => {
          const isSelected = index === selectedIndex;
          return (
            <li
              key={option.value}
              id={optionId(index)}
              role="option"
              aria-selected={isSelected}
              onClick={() => select(index)}
              onPointerMove={() => setActiveIndex(index)}
              style={{ "--index": index } as CSSProperties}
              className={`flex h-12 shutter-slat cursor-pointer items-center justify-between px-6 motion-reduce:transition-none ${
                open && index === activeIndex
                  ? "text-purple forced-colors:bg-[Highlight] forced-colors:text-[HighlightText] forced-colors:forced-color-adjust-none"
                  : ""
              }`}
            >
              {option.label}
              {isSelected && (
                <Image
                  src="/assets/shared/icon-check.svg"
                  alt=""
                  width={13}
                  height={11}
                />
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
