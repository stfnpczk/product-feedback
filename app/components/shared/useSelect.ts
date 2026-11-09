"use client";

import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ToggleEvent,
  useId,
  useRef,
  useState,
} from "react";
import { useTypeahead } from "./useTypeahead";

export type SelectOption<T extends string> = { value: T; label: string };

function isTypeaheadKey(e: KeyboardEvent) {
  return e.key.length === 1 && e.key !== " " && !e.ctrlKey && !e.metaKey;
}

function focusTriggerOnClick(e: MouseEvent<HTMLButtonElement>) {
  e.currentTarget.focus();
}

function preventSpaceKeyUpClick(e: KeyboardEvent<HTMLButtonElement>) {
  if (e.key === " ") e.preventDefault();
}

function keepFocusOnTrigger(e: MouseEvent) {
  e.preventDefault();
}

export function useSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: readonly SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  const id = useId();
  const labelId = `${id}-label`;
  const valueId = `${id}-value`;
  const listboxId = `${id}-listbox`;
  const optionId = (index: number) => `${id}-option-${index}`;
  const anchorName = `--${id.replace(/[^\w-]/g, "")}-anchor`;

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listboxRef = useRef<HTMLUListElement>(null);
  const pendingOpenIndex = useRef<number | null>(null);
  const matchTypeahead = useTypeahead(options.map((option) => option.label));

  const selectedIndex = Math.max(
    0,
    options.findIndex((option) => option.value === value),
  );
  const last = options.length - 1;

  function openAt(index: number) {
    pendingOpenIndex.current = index;
    listboxRef.current?.showPopover();
  }

  function select(index: number) {
    listboxRef.current?.hidePopover();
    const next = options[index].value;
    if (next !== value) onChange(next);
  }

  function handleClosedKey(e: KeyboardEvent<HTMLButtonElement>) {
    if (["ArrowDown", "ArrowUp", " "].includes(e.key)) {
      e.preventDefault();
      openAt(selectedIndex);
    } else if (e.key === "Home" || e.key === "End") {
      e.preventDefault();
      openAt(e.key === "Home" ? 0 : last);
    } else if (isTypeaheadKey(e)) {
      const match = matchTypeahead(e.key, selectedIndex);
      openAt(match === -1 ? selectedIndex : match);
    }
  }

  function handleOpenKey(e: KeyboardEvent<HTMLButtonElement>) {
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
        if (isTypeaheadKey(e)) {
          const match = matchTypeahead(e.key, activeIndex);
          if (match !== -1) setActiveIndex(match);
        }
    }
  }

  function handleBeforeToggle(e: ToggleEvent<HTMLUListElement>) {
    const isOpening = e.newState === "open";
    setOpen(isOpening);
    if (isOpening) {
      setActiveIndex(pendingOpenIndex.current ?? selectedIndex);
      pendingOpenIndex.current = null;
    }
  }

  return {
    open,
    activeIndex,
    selectedIndex,
    labelId,
    valueId,
    listboxId,
    activeOptionId: open ? optionId(activeIndex) : undefined,
    triggerProps: {
      type: "button",
      popoverTarget: listboxId,
      onClick: focusTriggerOnClick,
      onKeyDown: open ? handleOpenKey : handleClosedKey,
      onKeyUp: preventSpaceKeyUpClick,
      style: { anchorName },
    } as const,
    listboxProps: {
      ref: listboxRef,
      id: listboxId,
      popover: "auto",
      role: "listbox",
      onBeforeToggle: handleBeforeToggle,
      onMouseDown: keepFocusOnTrigger,
      style: { positionAnchor: anchorName },
    } as const,
    optionProps: (index: number) => ({
      id: optionId(index),
      role: "option",
      "aria-selected": index === selectedIndex,
      onClick: () => select(index),
      onPointerMove: () => setActiveIndex(index),
      style: { "--index": index } as CSSProperties,
    }),
  };
}
