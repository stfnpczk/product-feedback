import Image from "next/image";
import type { SuggestionFilters } from "@/lib/suggestion-filters";
import { AddFeedbackLink } from "./AddFeedbackLink";
import { SortSelect } from "./SortSelect";

export function SuggestionsToolbar({
  count,
  filters,
}: {
  count?: number;
  filters?: SuggestionFilters;
}) {
  const heading =
    count === undefined
      ? "Suggestions"
      : `${count} ${count === 1 ? "Suggestion" : "Suggestions"}`;

  return (
    <div className="flex h-14 items-center bg-navy-dark px-6 text-lavender md:h-18 md:gap-9.5 md:rounded-[10px] md:pr-3 lg:pr-4">
      <h1 className="sr-only md:not-sr-only md:flex md:items-center md:gap-4 md:text-h3 md:text-white">
        <Image
          src="/assets/suggestions/icon-suggestions.svg"
          alt=""
          width={23}
          height={24}
        />
        {heading}
      </h1>
      <SortSelect filters={filters} />
      <AddFeedbackLink className="ml-auto" />
    </div>
  );
}
