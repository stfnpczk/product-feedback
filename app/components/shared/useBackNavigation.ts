"use client";

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

export function useBackNavigation(href: string) {
  const router = useRouter();

  return function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const modified =
      event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
    if (modified || event.button !== 0 || !previousEntryMatches(href)) return;

    event.preventDefault();
    router.back();
  };
}

export function useNavigateBack(href: string) {
  const router = useRouter();

  return function navigateBack() {
    if (previousEntryMatches(href)) router.back();
    else router.replace(href);
  };
}
