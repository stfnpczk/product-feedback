"use client";

import { useRouter } from "next/navigation";
import { isBackTarget } from "@/lib/back-navigation";

type NavigationEntries = {
  currentEntry: { index: number } | null;
  entries(): { url: string | null }[];
};

function previousEntryMatches(href: string) {
  const navigation = (window as { navigation?: NavigationEntries }).navigation;
  const index = navigation?.currentEntry?.index ?? 0;
  const previousUrl = index > 0 ? navigation?.entries()[index - 1]?.url : null;
  return isBackTarget({ previousUrl, currentUrl: location.href, href });
}

export function useBackLink(href: string) {
  const router = useRouter();

  return function handleNavigate(event: { preventDefault(): void }) {
    if (!previousEntryMatches(href)) return;

    event.preventDefault();
    router.back();
  };
}

export function useReturnTo(href: string) {
  const router = useRouter();

  return function returnTo() {
    if (previousEntryMatches(href)) router.back();
    else router.replace(href);
  };
}
