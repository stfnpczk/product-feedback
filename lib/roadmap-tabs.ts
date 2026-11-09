import { z } from "zod";
import { type RoadmapStatus, roadmapStatuses, statusLabels } from "./statuses";

export const defaultRoadmapTab = "in-progress" satisfies RoadmapStatus;

const roadmapTabSchema = z.object({
  status: z.enum(roadmapStatuses).catch(defaultRoadmapTab),
});

export function parseRoadmapTab(
  searchParams: Record<string, string | string[] | undefined>,
): RoadmapStatus {
  return roadmapTabSchema.parse(searchParams).status;
}

export function roadmapHref(status: RoadmapStatus) {
  return status === defaultRoadmapTab
    ? "/roadmap"
    : `/roadmap?status=${status}`;
}

export function roadmapColumnLabel(status: RoadmapStatus, count?: number) {
  const label = statusLabels[status];
  return count === undefined ? label : `${label} (${count})`;
}
