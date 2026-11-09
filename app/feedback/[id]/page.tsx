import type { Metadata } from "next";
import { Suspense } from "react";
import { FeedbackDetail } from "@/app/components/feedback-detail/FeedbackDetail";
import { FeedbackDetailSkeleton } from "@/app/components/feedback-detail/FeedbackDetailSkeleton";
import { getFeedback } from "@/db/queries";
import { parseIdParam } from "@/lib/ids";

export async function generateMetadata({
  params,
}: PageProps<"/feedback/[id]">): Promise<Metadata> {
  const id = parseIdParam((await params).id);
  const feedback = id === null ? undefined : await getFeedback(id);
  return { title: feedback?.title ?? "Feedback not found" };
}

export default function FeedbackDetailPage({
  params,
}: PageProps<"/feedback/[id]">) {
  return (
    <main className="mx-auto box-content flex max-w-135 flex-col gap-6 px-6 pt-6 pb-22 md:max-w-182.5 md:px-10 md:pt-14 md:pb-30 lg:pt-20 lg:pb-32">
      <Suspense fallback={<FeedbackDetailSkeleton />}>
        <FeedbackDetail params={params} />
      </Suspense>
    </main>
  );
}
