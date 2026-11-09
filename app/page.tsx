import { CategoryFilter } from "./components/suggestions/CategoryFilter";
import { Header } from "./components/suggestions/Header";
import { RoadmapSummary } from "./components/suggestions/RoadmapSummary";
import { SuggestionsToolbar } from "./components/suggestions/SuggestionsToolbar";

export default function SuggestionsPage() {
  return (
    <div className="md:px-10 md:pt-14 lg:mx-auto lg:flex lg:max-w-297.5 lg:gap-7.5 lg:pt-23.5">
      <div className="max-md:contents md:grid md:grid-cols-3 md:gap-2.5 lg:flex lg:w-63.75 lg:shrink-0 lg:flex-col lg:gap-6">
        <Header>
          <CategoryFilter />
          <RoadmapSummary />
        </Header>
        <div className="hidden md:contents">
          <CategoryFilter />
          <RoadmapSummary />
        </div>
      </div>
      <main className="md:mt-10 lg:mt-0 lg:flex-1">
        <SuggestionsToolbar />
      </main>
    </div>
  );
}
