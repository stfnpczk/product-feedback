import Image from "next/image";
import type { CommentData } from "@/db/queries";
import { ReplyButton } from "./ReplyButton";
import { ReplyForm } from "./ReplyForm";

export function Comment({
  comment,
  hasReplies = false,
}: {
  comment: CommentData;
  hasReplies?: boolean;
}) {
  const { id, content, replyingTo, author } = comment;

  return (
    <article className="grid grid-cols-[auto_1fr_auto] items-center gap-x-4 md:gap-x-8">
      <Image
        src={author.image}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full"
      />
      <div>
        <h3 className="text-body-3-bold text-navy md:text-h4">{author.name}</h3>
        <p className="text-body-3 font-normal md:text-sm">@{author.username}</p>
      </div>
      <ReplyButton commentId={id} authorName={author.name} />
      {hasReplies && (
        <span
          aria-hidden="true"
          className="col-start-1 row-span-2 row-start-2 -mb-8 hidden w-px self-stretch justify-self-center bg-slate/10 md:mt-5.75 md:block"
        />
      )}
      <p className="col-span-full mt-4 text-body-3 font-normal md:col-span-2 md:col-start-2 md:mt-4.25 md:text-body-2">
        {replyingTo && (
          <span className="font-bold text-purple">@{replyingTo} </span>
        )}
        {content}
      </p>
      <ReplyForm
        commentId={id}
        authorName={author.name}
        className="col-span-full mt-6 md:col-span-2 md:col-start-2"
      />
    </article>
  );
}
