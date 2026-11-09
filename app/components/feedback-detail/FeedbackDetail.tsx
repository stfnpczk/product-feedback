import Link from "next/link";
import { notFound } from "next/navigation";
import { getComments, getFeedback } from "@/db/queries";
import { parseFeedbackId } from "@/lib/feedback-id";
import { buttonStyles } from "../shared/button-styles";
import { FeedbackCard } from "../shared/FeedbackCard";
import { AddCommentForm } from "./AddCommentForm";
import { CommentThread } from "./CommentThread";
import { DetailTopBar } from "./DetailTopBar";

export async function FeedbackDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = parseFeedbackId((await params).id);
  if (id === null) notFound();

  const [feedback, comments] = await Promise.all([
    getFeedback(id),
    getComments(id),
  ]);
  if (!feedback) notFound();

  return (
    <>
      <DetailTopBar>
        <Link
          href={`/feedback/${id}/edit`}
          className={buttonStyles("secondary")}
        >
          Edit Feedback
        </Link>
      </DetailTopBar>
      <FeedbackCard feedback={feedback} headingLevel="h1" />
      {comments.length > 0 && (
        <CommentThread comments={comments} count={feedback.commentCount} />
      )}
      <AddCommentForm feedbackId={id} />
    </>
  );
}
