import { type Category, categoryLabels } from "@/lib/categories";

export function CategoryTag({
  category,
  className = "",
}: {
  category: Category;
  className?: string;
}) {
  return (
    <p
      className={`flex h-7.5 w-fit items-center rounded-card bg-lavender px-4 text-body-3 text-blue ${className}`}
    >
      {categoryLabels[category]}
    </p>
  );
}
