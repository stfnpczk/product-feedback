import { z } from "zod";
import { categories } from "./categories";

export const sortOptions = [
  "most-upvotes",
  "least-upvotes",
  "most-comments",
  "least-comments",
] as const;

export const defaultSort = "most-upvotes" satisfies Sort;

export const sortLabels: Record<Sort, string> = {
  "most-upvotes": "Most Upvotes",
  "least-upvotes": "Least Upvotes",
  "most-comments": "Most Comments",
  "least-comments": "Least Comments",
};

const suggestionFiltersSchema = z.object({
  sort: z.enum(sortOptions).catch(defaultSort),
  category: z.enum(["all", ...categories]).catch("all"),
});

export type Sort = (typeof sortOptions)[number];
export type SuggestionFilters = z.infer<typeof suggestionFiltersSchema>;
export type CategoryFilterValue = SuggestionFilters["category"];

export function suggestionsHref({ sort, category }: SuggestionFilters) {
  const params = new URLSearchParams();
  if (category !== "all") params.set("category", category);
  if (sort !== defaultSort) params.set("sort", sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

export function parseSuggestionFilters(
  searchParams: Record<string, string | string[] | undefined>,
): SuggestionFilters {
  return suggestionFiltersSchema.parse(searchParams);
}
