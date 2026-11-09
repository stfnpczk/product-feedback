import type { RoadmapStatus } from "@/lib/statuses";
import { roadmapStatusBg } from "./roadmap-status-styles";

export function StatusDot({ status }: { status: RoadmapStatus }) {
  return (
    <span
      aria-hidden="true"
      className={`size-2 shrink-0 rounded-full ${roadmapStatusBg[status]}`}
    />
  );
}
