import Link from "next/link";
import { type Category, categoryLabels } from "@/lib/categories";
import {
  type CategoryFilterValue,
  defaultSort,
  type SuggestionFilters,
  suggestionsHref,
} from "@/lib/suggestion-filters";

const options: { value: CategoryFilterValue; label: string }[] = [
  { value: "all", label: "All" },
  ...(Object.entries(categoryLabels) as [Category, string][]).map(
    ([value, label]) => ({ value, label }),
  ),
];

export async function CategoryFilter({
  filters,
}: {
  filters?: Promise<SuggestionFilters>;
}) {
  const current = await filters;

  return (
    <nav
      aria-label="Filter by category"
      className="min-h-44.5 rounded-[10px] bg-white p-6 lg:min-h-0"
    >
      <ul className="flex flex-wrap gap-x-2 gap-y-3.5">
        {options.map(({ value, label }) => {
          const isActive = value === current?.category;
          return (
            <li key={value}>
              <Link
                href={suggestionsHref({
                  category: value,
                  sort: current?.sort ?? defaultSort,
                })}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-7.5 items-center rounded-[10px] px-4 text-body-3 transition-colors ${
                  isActive
                    ? "bg-blue text-white"
                    : "bg-lavender text-blue hover:bg-lavender-hover"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
