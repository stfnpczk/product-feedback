import {
  feedbackCardContent,
  feedbackCardLayout,
} from "./feedback-card-styles";

export function FeedbackCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className={`h-50 animate-pulse content-between motion-reduce:animate-none md:h-37.75 md:content-start ${feedbackCardLayout}`}
    >
      <div className={`flex flex-col gap-3 ${feedbackCardContent}`}>
        <div className="h-4 w-1/2 rounded-full bg-lavender" />
        <div className="h-4 w-4/5 rounded-full bg-lavender" />
        <div className="h-7.5 w-24 rounded-card bg-lavender" />
      </div>
      <div className="h-8 w-17.25 rounded-card bg-lavender [grid-area:upvotes] md:h-13.25 md:w-10" />
      <div className="h-4 w-10 self-center rounded-full bg-lavender [grid-area:comments]" />
    </div>
  );
}
