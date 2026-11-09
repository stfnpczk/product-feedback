import { statusEnum } from "@/db/schema";

export const statuses = statusEnum.enumValues;
export type Status = (typeof statuses)[number];

export const statusLabels: Record<Status, string> = {
  suggestion: "Suggestion",
  planned: "Planned",
  "in-progress": "In-Progress",
  live: "Live",
};
