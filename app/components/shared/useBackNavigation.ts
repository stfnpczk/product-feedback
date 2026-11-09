"use client";

import { useRouter } from "next/navigation";

const listPaths = ["/", "/roadmap"];

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
  if (
    previous.origin !== target.origin ||
    previous.pathname === location.pathname
  ) {
    return false;
  }
  return target.pathname === "/"
    ? listPaths.includes(previous.pathname)
    : previous.pathname === target.pathname;
}

export function useBackNavigation(href: string) {
  const router = useRouter();

  return function handleNavigate(event: { preventDefault(): void }) {
    if (!previousEntryMatches(href)) return;

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
