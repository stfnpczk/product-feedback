"use client";

import {
  type CSSProperties,
  startTransition,
  useOptimistic,
  useState,
} from "react";
import { setUpvote } from "@/app/actions/upvote";

type UpvoteButtonProps = {
  feedbackId: number;
  upvotes: number;
  upvoted: boolean;
  className?: string;
};

type Bump = { id: number; dir: 1 | -1; from: number | null };

export function UpvoteButton({
  feedbackId,
  upvotes,
  upvoted,
  className = "",
}: UpvoteButtonProps) {
  const [optimistic, setOptimistic] = useOptimistic({ upvotes, upvoted });
  const [bump, setBump] = useState<Bump>({ id: 0, dir: 1, from: null });
  const animate = bump.id > 0;

  function toggle() {
    const next = !optimistic.upvoted;
    setBump((b) => ({
      id: b.id + 1,
      dir: next ? 1 : -1,
      from: optimistic.upvotes,
    }));
    startTransition(async () => {
      setOptimistic({
        upvoted: next,
        upvotes: optimistic.upvotes + (next ? 1 : -1),
      });
      await setUpvote(feedbackId, next);
    });
  }

  return (
    <button
      type="button"
      aria-pressed={optimistic.upvoted}
      onClick={toggle}
      style={{ "--dir": bump.dir } as CSSProperties}
      className={`group/upvote relative flex cursor-pointer items-center rounded-card bg-lavender text-body-3 font-bold tracking-[-0.18px] text-navy transition-colors hover:bg-lavender-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue aria-pressed:bg-blue aria-pressed:text-white ${className}`}
    >
      <span
        key={`arrow-${bump.id}`}
        aria-hidden="true"
        className={`h-1.75 w-2.5 bg-blue mask-[url(/assets/shared/icon-arrow-up.svg)] mask-contain mask-center mask-no-repeat transition-colors group-aria-pressed/upvote:bg-white motion-reduce:animate-none ${
          animate ? "animate-nudge" : ""
        }`}
      />
      <span className="inline-grid overflow-hidden">
        {animate && bump.from !== null && (
          <span
            key={`out-${bump.id}`}
            aria-hidden="true"
            onAnimationEnd={() => setBump((b) => ({ ...b, from: null }))}
            className="animate-count-out [grid-area:1/1] motion-reduce:hidden"
          >
            {bump.from}
          </span>
        )}
        <span
          key={`in-${bump.id}`}
          className={`[grid-area:1/1] motion-reduce:animate-none ${
            animate ? "animate-count-in" : ""
          }`}
        >
          {optimistic.upvotes}
        </span>
      </span>
      <span className="sr-only">
        {optimistic.upvotes === 1 ? " upvote" : " upvotes"}
      </span>
    </button>
  );
}
