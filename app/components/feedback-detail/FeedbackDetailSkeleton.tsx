import { FeedbackCardSkeleton } from "../shared/FeedbackCardSkeleton";
import { DetailTopBar } from "./DetailTopBar";

export function FeedbackDetailSkeleton() {
  return (
    <>
      <DetailTopBar>
        <div className="h-10 w-29.75 rounded-card bg-blue/20 md:h-11 md:w-35.5" />
      </DetailTopBar>
      <p role="status" className="sr-only">
        Loading feedback…
      </p>
      <FeedbackCardSkeleton />
      <div
        aria-hidden="true"
        className="flex animate-pulse flex-col gap-6 rounded-card bg-white p-6 motion-reduce:animate-none md:px-8"
      >
        <div className="h-5 w-32 rounded-full bg-lavender" />
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex gap-4 md:gap-8">
            <div className="size-10 shrink-0 rounded-full bg-lavender" />
            <div className="flex flex-1 flex-col gap-3 pt-1">
              <div className="h-4 w-1/3 rounded-full bg-lavender" />
              <div className="h-4 w-full rounded-full bg-lavender" />
              <div className="h-4 w-4/5 rounded-full bg-lavender" />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
