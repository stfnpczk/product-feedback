"use client";

import { useRouter } from "next/navigation";
import { startTransition, useOptimistic } from "react";
import {
  defaultSort,
  type Sort,
  type SuggestionFilters,
  sortLabels,
  sortOptions,
  suggestionsHref,
} from "@/lib/suggestion-filters";
import { Select } from "../shared/Select";

const options = sortOptions.map((value) => ({
  value,
  label: sortLabels[value],
}));

export function SortSelect({ filters }: { filters?: SuggestionFilters }) {
  const router = useRouter();
  const [sort, setOptimisticSort] = useOptimistic(filters?.sort ?? defaultSort);

  function onChange(next: Sort) {
    if (!filters) return;
    startTransition(() => {
      setOptimisticSort(next);
      router.push(suggestionsHref({ ...filters, sort: next }), {
        scroll: false,
      });
    });
  }

  return (
    <Select
      label="Sort by :"
      options={options}
      value={sort}
      onChange={onChange}
      disabled={!filters}
    />
  );
}
