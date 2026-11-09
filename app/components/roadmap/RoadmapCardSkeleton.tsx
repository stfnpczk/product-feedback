import {
  roadmapCardFooter,
  roadmapCardLayout,
  roadmapCardStatusSpacing,
  roadmapCardUpvoteSize,
} from "./roadmap-card-styles";

export function RoadmapCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse motion-reduce:animate-none ${roadmapCardLayout}`}
    >
      <div className="h-4 w-1/3 rounded-full bg-lavender" />
      <div
        className={`h-4 w-2/3 rounded-full bg-lavender ${roadmapCardStatusSpacing}`}
      />
      <div className="mt-3 h-4 w-full rounded-full bg-lavender" />
      <div className="mt-auto h-7.5 w-20 rounded-card bg-lavender" />
      <div className={roadmapCardFooter}>
        <div className={`rounded-card bg-lavender ${roadmapCardUpvoteSize}`} />
        <div className="h-4 w-10 rounded-full bg-lavender" />
      </div>
    </div>
  );
}
