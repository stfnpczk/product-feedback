import { type ReactNode, useId } from "react";
import { type RoadmapStatus, roadmapStatusDescriptions } from "@/lib/statuses";

export function RoadmapColumn({
  status,
  label,
  children,
}: {
  status: RoadmapStatus;
  label: string;
  children: ReactNode;
}) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId} className="text-h3 text-navy md:text-h4 lg:text-h3">
        {label}
      </h2>
      <p className="mt-1 text-body-3 font-normal md:text-sm lg:text-body-1">
        {roadmapStatusDescriptions[status]}
      </p>
      {children}
    </section>
  );
}
