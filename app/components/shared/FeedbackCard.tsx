import Image from "next/image";
import Link from "next/link";
import type { FeedbackSummary } from "@/db/queries";
import { categoryLabels } from "@/lib/categories";
import {
  feedbackCardContent,
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
  headingLevel: Heading = "h2",
}: FeedbackCardProps) {
  const { id, title, description, category, upvotes, upvoted, commentCount } =
    feedback;

  return (
    <article
      className={`group relative gap-y-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-blue ${feedbackCardLayout}`}
    >
      <div className={feedbackCardContent}>
        <Heading className="text-body-3 font-bold tracking-[-0.18px] text-navy transition-colors group-has-[a:hover]:text-blue md:text-h3">
          {href ? (
            <Link
              href={href}
              className="outline-none after:absolute after:inset-0 after:rounded-card"
            >
              {title}
            </Link>
          ) : (
            title
          )}
        </Heading>
        <p className="mt-2.25 text-body-3 font-normal md:mt-1 md:text-body-1">
          {description}
        </p>
        <p className="mt-2 flex h-7.5 w-fit items-center rounded-card bg-lavender px-4 text-body-3 text-blue md:mt-3">
          {categoryLabels[category]}
        </p>
      </div>

      <UpvoteButton
        feedbackId={id}
        upvotes={upvotes}
        upvoted={upvoted}
        className="h-8 gap-2.25 self-center justify-self-start pr-3.25 pl-3.75 [grid-area:upvotes] md:h-13.25 md:w-10 md:flex-col md:justify-start md:gap-1.5 md:self-start md:px-0 md:pt-3.5"
      />

      <p className="flex items-center gap-2 self-center text-body-3 font-bold tracking-[-0.18px] text-navy [grid-area:comments] md:text-body-1 md:tracking-[-0.22px]">
        <Image
          src="/assets/shared/icon-comments.svg"
          alt=""
          width={18}
          height={16}
        />
        {commentCount}
        <span className="sr-only">
          {commentCount === 1 ? " comment" : " comments"}
        </span>
      </p>
    </article>
  );
}
