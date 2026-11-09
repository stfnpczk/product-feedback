import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteFeedback, updateFeedback } from "@/app/actions/feedback";
import { FeedbackForm } from "@/app/components/feedback-form/FeedbackForm";
import { FeedbackFormSkeleton } from "@/app/components/feedback-form/FeedbackFormSkeleton";
import { FormPage } from "@/app/components/feedback-form/FormPage";
import { getFeedback } from "@/db/queries";
import { parseFeedbackId } from "@/lib/feedback-id";

export async function generateMetadata({
  params,
}: PageProps<"/feedback/[id]/edit">): Promise<Metadata> {
  const id = parseFeedbackId((await params).id);
  const feedback = id === null ? undefined : await getFeedback(id);
  return {
    title: feedback ? `Editing: ${feedback.title}` : "Feedback not found",
  };
}

export default function EditFeedbackPage({
  params,
}: PageProps<"/feedback/[id]/edit">) {
  return (
    <Suspense
      fallback={
        <FormPage>
          <FeedbackFormSkeleton />
        </FormPage>
      }
    >
      <EditFeedback params={params} />
    </Suspense>
  );
}

async function EditFeedback({
  params,
}: Pick<PageProps<"/feedback/[id]/edit">, "params">) {
  const id = parseFeedbackId((await params).id);
  if (id === null) notFound();

  const feedback = await getFeedback(id);
  if (!feedback) notFound();

  const { title, category, status, description } = feedback;

  return (
    <FormPage backHref={`/feedback/${id}`}>
      <FeedbackForm
        mode="edit"
        feedbackId={id}
        defaultValues={{ title, category, status, description }}
        action={updateFeedback.bind(null, id)}
        deleteAction={deleteFeedback.bind(null, id)}
      />
    </FormPage>
  );
}
