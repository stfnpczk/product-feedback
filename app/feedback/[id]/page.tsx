import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackDetail } from "@/app/components/feedback-detail/FeedbackDetail";
import { FeedbackDetailSkeleton } from "@/app/components/feedback-detail/FeedbackDetailSkeleton";
import { getFeedback } from "@/db/queries";
import { parseFeedbackId } from "@/lib/feedback-id";

export async function generateMetadata({
  params,
}: PageProps<"/feedback/[id]">): Promise<Metadata> {
  const id = parseFeedbackId((await params).id);
  const feedback = id === null ? undefined : await getFeedback(id);
  return { title: feedback?.title ?? "Feedback not found" };
}

export default function FeedbackDetailPage({
  params,
}: PageProps<"/feedback/[id]">) {
  return (
    <main className="mx-auto box-content flex max-w-182.5 flex-col gap-6 px-6 pt-6 pb-22 md:px-10 md:pt-14 md:pb-30 lg:pt-20 lg:pb-32">
      <Suspense fallback={<FeedbackDetailSkeleton />}>
        <FeedbackDetail params={params} />
      </Suspense>
    </main>
  );
}
