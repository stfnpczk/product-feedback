"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { MouseEvent } from "react";

type NavigationEntries = {
  currentEntry: { index: number } | null;
  entries(): { url: string | null }[];
};

function previousEntryMatches(href: string) {
  const navigation = (window as { navigation?: NavigationEntries }).navigation;
  const index = navigation?.currentEntry?.index ?? 0;
  const previousUrl = index > 0 ? navigation?.entries()[index - 1]?.url : null;
  if (!previousUrl) return false;

  const previous = new URL(previousUrl);
  const target = new URL(href, location.origin);
  return (
    previous.origin === target.origin && previous.pathname === target.pathname
  );
}

export function GoBackLink({ href }: { href: string }) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified || event.button !== 0 || !previousEntryMatches(href)) return;

    event.preventDefault();
    router.back();
  }

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex items-center gap-3.75 text-body-3 font-bold text-slate hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue md:text-sm"
    >
      <Image
        src="/assets/shared/icon-arrow-left.svg"
        alt=""
        width={7}
        height={10}
      />
      Go Back
    </Link>
  );
}
