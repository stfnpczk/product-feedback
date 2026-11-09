export const statuses = [
  "suggestion",
  "planned",
  "in-progress",
  "live",
] as const;
export type Status = (typeof statuses)[number];

export const statusLabels: Record<Status, string> = {
  suggestion: "Suggestion",
  planned: "Planned",
  "in-progress": "In-Progress",
  live: "Live",
};

export const roadmapStatuses = [
  "planned",
  "in-progress",
  "live",
] as const satisfies readonly Status[];
export type RoadmapStatus = (typeof roadmapStatuses)[number];

export const roadmapCardLabels: Record<RoadmapStatus, string> = {
  planned: "Planned",
  "in-progress": "In Progress",
  live: "Live",
};

export const roadmapStatusDescriptions: Record<RoadmapStatus, string> = {
  planned: "Ideas prioritized for research",
  "in-progress": "Currently being developed",
  live: "Released features",
};
