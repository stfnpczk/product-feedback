import Link from "next/link";
import { useId } from "react";
import { getRoadmapCounts } from "@/db/queries";
import { roadmapStatuses, statusLabels } from "@/lib/statuses";
import { StatusDot } from "../shared/StatusDot";

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
        {roadmapStatuses.map((status) => (
          <li key={status} className="flex items-center gap-4 text-body-1">
            <StatusDot status={status} />
            <span>{statusLabels[status]}</span>
            <span className="ml-auto font-bold">{counts[status]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
