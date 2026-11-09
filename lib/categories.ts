export const categories = [
  "feature",
  "ui",
  "ux",
  "enhancement",
  "bug",
] as const;
export type Category = (typeof categories)[number];

export const categoryFilterOrder = [
  "ui",
  "ux",
  "enhancement",
  "bug",
  "feature",
] as const satisfies readonly Category[];

export const categoryLabels: Record<Category, string> = {
  feature: "Feature",
  ui: "UI",
  ux: "UX",
  enhancement: "Enhancement",
  bug: "Bug",
};
