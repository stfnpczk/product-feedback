import { Suspense } from "react";
import { parseSuggestionFilters } from "@/lib/suggestion-filters";
import { pageContainer } from "@/app/components/shared/layout-styles";
import { CategoryFilter } from "@/app/components/suggestions/CategoryFilter";
import { Header } from "@/app/components/suggestions/Header";
import { RoadmapSummary } from "@/app/components/suggestions/RoadmapSummary";
import {
  Suggestions,
  SuggestionsFallback,
} from "@/app/components/suggestions/Suggestions";

export default function SuggestionsPage({ searchParams }: PageProps<"/">) {
  const filters = searchParams.then(parseSuggestionFilters);

  const categoryFilter = (
    <Suspense fallback={<CategoryFilter />}>
      <CategoryFilter filters={filters} />
    </Suspense>
  );

  return (
    <div className={`md:pt-14 lg:flex lg:gap-7.5 lg:pt-23.5 ${pageContainer}`}>
      <div className="max-md:contents md:grid md:grid-cols-3 md:gap-2.5 lg:flex lg:w-63.75 lg:shrink-0 lg:flex-col lg:gap-6">
        <Header>
          {categoryFilter}
          <RoadmapSummary />
        </Header>
        <div className="hidden md:contents">
          {categoryFilter}
          <RoadmapSummary />
        </div>
      </div>
      <main className="pb-14 md:mt-10 md:pb-28 lg:mt-0 lg:flex-1 lg:pb-32">
        <Suspense fallback={<SuggestionsFallback />}>
          <Suggestions filters={filters} />
        </Suspense>
      </main>
    </div>
  );
}
