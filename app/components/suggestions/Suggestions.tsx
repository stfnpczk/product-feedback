import { getSuggestions } from "@/db/queries";
import { feedbackHref } from "@/lib/routes";
import type { SuggestionFilters } from "@/lib/suggestion-filters";
import { FeedbackCard } from "../shared/FeedbackCard";
import { FeedbackCardSkeleton } from "../shared/FeedbackCardSkeleton";
import { EmptyState } from "./EmptyState";
import { SuggestionsToolbar } from "./SuggestionsToolbar";

const listClasses = "mx-6 mt-8 flex flex-col gap-4 md:mx-0 md:mt-6 lg:gap-5";

export async function Suggestions({
  filters,
}: {
  filters: Promise<SuggestionFilters>;
}) {
  const resolvedFilters = await filters;
  const suggestions = await getSuggestions(resolvedFilters);

  return (
    <>
      <SuggestionsToolbar
        count={suggestions.length}
        filters={resolvedFilters}
      />
      {suggestions.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className={listClasses}>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <FeedbackCard
                feedback={suggestion}
                href={feedbackHref(suggestion.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export function SuggestionsFallback() {
  return (
    <>
      <SuggestionsToolbar />
      <p role="status" className="sr-only">
        Loading suggestions…
      </p>
      <div className={listClasses}>
        {Array.from({ length: 3 }, (_, i) => (
          <FeedbackCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
