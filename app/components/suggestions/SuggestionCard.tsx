import Image from "next/image";
import Link from "next/link";
import type { Suggestion } from "@/db/queries";
import { categoryLabels } from "@/lib/categories";
import { UpvoteButton } from "./UpvoteButton";

export function SuggestionCard({ suggestion }: { suggestion: Suggestion }) {
  const { id, title, description, category, upvotes, upvoted, commentCount } =
    suggestion;

  return (
    <article className="group relative grid grid-cols-[1fr_auto] gap-y-4 rounded-[10px] bg-white p-6 [grid-template-areas:'content_content'_'upvotes_comments'] has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-blue md:grid-cols-[auto_1fr_auto] md:px-8 md:py-7 md:[grid-template-areas:'upvotes_content_comments']">
      <div className="[grid-area:content] md:pr-6 md:pl-10">
        <h2 className="text-body-3 font-bold tracking-[-0.18px] text-navy transition-colors group-has-[a:hover]:text-blue md:text-h3">
          <Link
            href={`/feedback/${id}`}
            className="outline-none after:absolute after:inset-0 after:rounded-[10px]"
          >
            {title}
          </Link>
        </h2>
        <p className="mt-2.25 text-body-3 font-normal md:mt-1 md:text-body-1">
          {description}
        </p>
        <p className="mt-2 flex h-7.5 w-fit items-center rounded-[10px] bg-lavender px-4 text-body-3 text-blue md:mt-3">
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
