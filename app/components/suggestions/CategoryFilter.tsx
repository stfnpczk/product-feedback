import Link from "next/link";

const categories = [
  { value: "all", label: "All" },
  { value: "ui", label: "UI" },
  { value: "ux", label: "UX" },
  { value: "enhancement", label: "Enhancement" },
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
];

export function CategoryFilter() {
  const active = "all";

  return (
    <nav
      aria-label="Filter by category"
      className="min-h-44.5 rounded-[10px] bg-white p-6 lg:min-h-0"
    >
      <ul className="flex flex-wrap gap-x-2 gap-y-3.5">
        {categories.map(({ value, label }) => {
          const isActive = value === active;
          return (
            <li key={value}>
              <Link
                href={value === "all" ? "/" : `/?category=${value}`}
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
