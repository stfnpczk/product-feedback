import type { CSSProperties } from "react";
import type { FeedbackSummary } from "@/db/queries";
import { feedbackHref } from "@/lib/routes";
import { type RoadmapStatus, roadmapCardLabels } from "@/lib/statuses";
import { CategoryTag } from "../shared/CategoryTag";
import { CommentCount } from "../shared/CommentCount";
import { FeedbackCardTitle } from "../shared/FeedbackCardTitle";
import { feedbackCardFrame } from "../shared/feedback-card-styles";
import { roadmapStatusBg } from "../shared/roadmap-status-styles";
import { StatusDot } from "../shared/StatusDot";
import { UpvoteButton } from "../shared/UpvoteButton";
import {
  roadmapCardFooter,
  roadmapCardLayout,
  roadmapCardStatusSpacing,
  roadmapCardUpvoteSize,
} from "./roadmap-card-styles";

export function RoadmapCard({
  feedback,
  status,
  index,
}: {
  feedback: FeedbackSummary;
  status: RoadmapStatus;
  index: number;
}) {
  const { id, title, description, category, upvotes, upvoted, commentCount } =
    feedback;

  return (
    <article className={`${feedbackCardFrame} ${roadmapCardLayout}`}>
      <span
        aria-hidden="true"
        style={{ "--index": index } as CSSProperties}
        className={`pointer-events-none absolute inset-x-0 -top-1.5 h-1.5 animate-bar-draw overflow-hidden rounded-t-field [animation-delay:calc(var(--index)*60ms)] motion-reduce:animate-none ${roadmapStatusBg[status]}`}
      >
        <span className="absolute inset-y-0 w-1/3 -translate-x-full bg-linear-to-r from-transparent via-white/60 to-transparent group-hover:animate-bar-sweep group-has-[a:focus-visible]:animate-bar-sweep motion-reduce:hidden" />
      </span>
      <p className="flex items-center gap-2 text-body-3 font-normal md:gap-4 lg:text-body-1">
        <StatusDot status={status} />
        {roadmapCardLabels[status]}
      </p>
      <FeedbackCardTitle
        title={title}
        href={feedbackHref(id)}
        headingLevel="h3"
        className={`lg:text-h3 ${roadmapCardStatusSpacing}`}
      />
      <p className="mt-2.25 mb-2 line-clamp-3 text-body-3 font-normal text-pretty lg:mt-1 lg:text-body-1">
        {description}
      </p>
      <CategoryTag category={category} className="mt-auto" />
      <div className={roadmapCardFooter}>
        <UpvoteButton
          feedbackId={id}
          upvotes={upvotes}
          upvoted={upvoted}
          className={`gap-2.5 pl-4 ${roadmapCardUpvoteSize}`}
        />
        <CommentCount count={commentCount} className="lg:text-body-1-bold" />
      </div>
    </article>
  );
}
