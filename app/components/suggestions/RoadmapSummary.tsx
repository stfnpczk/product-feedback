import Link from "next/link";
import { useId } from "react";
import { getRoadmapCounts } from "@/db/queries";

const statuses = [
  { key: "planned", label: "Planned", dot: "bg-peach" },
  { key: "in-progress", label: "In-Progress", dot: "bg-purple" },
  { key: "live", label: "Live", dot: "bg-sky" },
] as const;

export async function RoadmapSummary() {
  const counts = await getRoadmapCounts();

  return <RoadmapSummaryCard counts={counts} />;
}

function RoadmapSummaryCard({
  counts,
}: {
  counts: Awaited<ReturnType<typeof getRoadmapCounts>>;
}) {
  const titleId = useId();

  return (
    <section
      aria-labelledby={titleId}
      className="rounded-card bg-white px-6 pt-4.75 pb-6 text-slate"
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
        {statuses.map(({ key, label, dot }) => (
          <li key={key} className="flex items-center gap-4 text-body-1">
            <span aria-hidden="true" className={`size-2 rounded-full ${dot}`} />
            <span>{label}</span>
            <span className="ml-auto font-bold">{counts[key]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
