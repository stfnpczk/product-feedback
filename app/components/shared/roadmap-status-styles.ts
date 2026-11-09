import type { RoadmapStatus } from "@/lib/statuses";

export const roadmapStatusBg: Record<RoadmapStatus, string> = {
  planned: "bg-peach",
  "in-progress": "bg-purple",
  live: "bg-sky",
};
