import Link from "next/link";
import { useId } from "react";

const statuses = [
  { label: "Planned", count: 2, dot: "bg-peach" },
  { label: "In-Progress", count: 3, dot: "bg-purple" },
  { label: "Live", count: 1, dot: "bg-sky" },
];

export function RoadmapSummary() {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-[10px] bg-white px-6 pt-4.75 pb-6 text-slate"
    >
      <div className="flex items-center justify-between">
        <h2 id={titleId} className="text-h3 text-navy">
          Roadmap
        </h2>
        <Link
          href="/roadmap"
          className="text-body-3 text-blue underline transition-colors hover:text-blue-hover"
        >
          View
        </Link>
      </div>
      <ul className="mt-6 flex flex-col gap-2">
        {statuses.map(({ label, count, dot }) => (
          <li key={label} className="flex items-center gap-4 text-body-1">
            <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
            <span>{label}</span>
            <span className="ml-auto font-bold">{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
