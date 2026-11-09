import { categoryEnum } from "@/db/schema";

export const categories = categoryEnum.enumValues;
export type Category = (typeof categories)[number];

export const categoryLabels: Record<Category, string> = {
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
  feature: "Feature",
};
