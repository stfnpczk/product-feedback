import { getRoadmapFeedback } from "@/db/queries";
import { defaultRoadmapTab, roadmapColumnLabel } from "@/lib/roadmap-tabs";
import { type RoadmapStatus, roadmapStatuses } from "@/lib/statuses";
import { RoadmapCard } from "./RoadmapCard";
import { RoadmapCardSkeleton } from "./RoadmapCardSkeleton";
import { RoadmapColumn } from "./RoadmapColumn";
import { RoadmapTabs } from "./RoadmapTabs";

const listClasses = "mt-6 flex flex-col gap-4 lg:mt-8 lg:gap-6";

export async function RoadmapBoard({
  active,
}: {
  active: Promise<RoadmapStatus>;
}) {
  const [activeTab, board] = await Promise.all([active, getRoadmapFeedback()]);

  const columns = roadmapStatuses.map((status) => {
    const items = board[status];
    const label = roadmapColumnLabel(status, items.length);

    return {
      status,
      label,
      panel: (
        <RoadmapColumn status={status} label={label}>
          {items.length === 0 ? (
            <p className="mt-6 text-body-3 font-normal lg:mt-8 lg:text-body-1">
              No feedback here yet.
            </p>
          ) : (
            <ul className={listClasses}>
              {items.map((item, index) => (
                <li key={item.id}>
                  <RoadmapCard feedback={item} status={status} index={index} />
                </li>
              ))}
            </ul>
          )}
        </RoadmapColumn>
      ),
    };
  });

  return <RoadmapTabs active={activeTab} columns={columns} />;
}

export function RoadmapBoardFallback() {
  const columns = roadmapStatuses.map((status) => {
    const label = roadmapColumnLabel(status);

    return {
      status,
      label,
      panel: (
        <RoadmapColumn status={status} label={label}>
          <div className={listClasses}>
            {Array.from({ length: 2 }, (_, i) => (
              <RoadmapCardSkeleton key={i} />
            ))}
          </div>
        </RoadmapColumn>
      ),
    };
  });

  return (
    <>
      <p role="status" className="sr-only">
        Loading roadmap…
      </p>
      <RoadmapTabs active={defaultRoadmapTab} columns={columns} />
    </>
  );
}
