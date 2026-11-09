import type { FeedbackSummary } from "@/db/queries";
import { CategoryTag } from "./CategoryTag";
import { CommentCount } from "./CommentCount";
import { FeedbackCardTitle } from "./FeedbackCardTitle";
import {
  feedbackCardContent,
  feedbackCardFrame,
  feedbackCardLayout,
} from "./feedback-card-styles";
import { UpvoteButton } from "./UpvoteButton";

type FeedbackCardProps = {
  feedback: FeedbackSummary;
  href?: string;
  headingLevel?: "h1" | "h2";
};

export function FeedbackCard({
  feedback,
  href,
  headingLevel = "h2",
}: FeedbackCardProps) {
  const { id, title, description, category, upvotes, upvoted, commentCount } =
    feedback;

  return (
    <article className={`gap-y-4 ${feedbackCardFrame} ${feedbackCardLayout}`}>
      <div className={feedbackCardContent}>
        <FeedbackCardTitle
          title={title}
          href={href}
          headingLevel={headingLevel}
          className="md:text-h3"
        />
        <p className="mt-2.25 text-body-3 font-normal md:mt-1 md:text-body-1">
          {description}
        </p>
        <CategoryTag category={category} className="mt-2 md:mt-3" />
      </div>

      <UpvoteButton
        feedbackId={id}
        upvotes={upvotes}
        upvoted={upvoted}
        className="h-8 gap-2.25 self-center justify-self-start pr-3.25 pl-3.75 [grid-area:upvotes] md:h-13.25 md:w-10 md:flex-col md:justify-start md:gap-1.5 md:self-start md:px-0 md:pt-3.5"
      />

      <CommentCount
        count={commentCount}
        className="self-center [grid-area:comments] md:text-body-1 md:tracking-[-0.22px]"
      />
    </article>
  );
}
