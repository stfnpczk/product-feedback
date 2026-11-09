import type { CommentNode } from "@/db/queries";
import { Comment } from "./Comment";
import { ReplyProvider } from "./ReplyProvider";

export function CommentThread({
  comments,
  count,
}: {
  comments: CommentNode[];
  count: number;
}) {
  return (
    <section
      aria-labelledby="comments-heading"
      className="rounded-card bg-white p-6 md:px-8 md:pb-8 lg:pb-12"
    >
      <h2 id="comments-heading" className="mb-6 text-h3 text-navy md:mb-7">
        {count} {count === 1 ? "Comment" : "Comments"}
      </h2>
      <ReplyProvider>
        <ul className="divide-y divide-steel/25">
          {comments.map((comment) => (
            <li key={comment.id} className="py-6 first:pt-0 last:pb-0 md:py-8">
              <Comment
                comment={comment}
                hasReplies={comment.replies.length > 0}
              />
              {comment.replies.length > 0 && (
                <ul className="mt-6 flex flex-col gap-6 pl-6 md:mt-8 md:gap-8 md:pl-11.25">
                  {comment.replies.map((reply) => (
                    <li
                      key={reply.id}
                      className="relative before:absolute before:top-0 before:-bottom-6 before:-left-6 before:w-px before:bg-slate/10 last:before:bottom-auto last:before:h-5 md:before:-bottom-8 md:before:-left-6.25"
                    >
                      <Comment comment={reply} />
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </ReplyProvider>
    </section>
  );
}
