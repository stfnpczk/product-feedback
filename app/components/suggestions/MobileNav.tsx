"use client";

import { useEffect, useRef, useState } from "react";
import { mobilePageWidth } from "../shared/layout-styles";

const bar =
  "origin-center transition-[translate,rotate,scale,opacity] duration-300 ease-in-out [transform-box:fill-box] motion-reduce:transition-none";

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="20"
      height="17"
      viewBox="0 0 20 17"
      fill="currentColor"
      aria-hidden="true"
      className="overflow-visible"
    >
      <rect
        y="0"
        width="20"
        height="3"
        className={`${bar} ${open ? "translate-y-1.75 scale-x-[1.2] rotate-45" : ""}`}
      />
      <rect
        y="7"
        width="20"
        height="3"
        className={`${bar} ${open ? "scale-x-0 opacity-0" : ""}`}
      />
      <rect
        y="14"
        width="20"
        height="3"
        className={`${bar} ${open ? "-translate-y-1.75 scale-x-[1.2] -rotate-45" : ""}`}
      />
    </svg>
  );
}

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  function close(returnFocus = true) {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }

  useEffect(() => {
    if (!open) return;

    const button = buttonRef.current;
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button?.focus();
    };
    // Matches Tailwind's md breakpoint, where the drawer is hidden
    const desktop = window.matchMedia("(min-width: 48rem)");
    const onResize = () => {
      if (desktop.matches) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-drawer"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((o) => !o)}
        className="flex size-8 items-center justify-center"
      >
        <MenuIcon open={open} />
      </button>

      <div
        aria-hidden="true"
        onClick={() => close()}
        className={`fixed inset-x-0 top-18 bottom-0 z-10 bg-black/50 transition-[opacity,backdrop-filter] duration-300 motion-reduce:transition-none ${
          open
            ? "opacity-100 backdrop-blur-xs"
            : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`pointer-events-none fixed inset-x-0 top-18 bottom-0 z-20 mx-auto overflow-clip ${mobilePageWidth}`}
      >
        <div
          ref={panelRef}
          id="mobile-drawer"
          role="region"
          aria-label="Menu"
          inert={!open}
          onClick={(e) => {
            if ((e.target as Element).closest("a")) close(false);
          }}
          className={`pointer-events-auto absolute inset-y-0 right-0 flex w-67.75 flex-col gap-6 overflow-y-auto bg-ghost p-6 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
