import type { Metadata } from "next";
import { createFeedback } from "@/app/actions/feedback";
import { FeedbackForm } from "@/app/components/feedback-form/FeedbackForm";
import { GoBackLink } from "@/app/components/shared/GoBackLink";

export const metadata: Metadata = { title: "New Feedback" };

export default function NewFeedbackPage() {
  return (
    <main className="mx-auto box-content max-w-135 px-6 pt-6 pb-19 md:pt-11 md:pb-20 lg:pt-20">
      <div className="flex min-h-10 items-center md:min-h-11">
        <GoBackLink href="/" />
      </div>
      <FeedbackForm
        heading="Create New Feedback"
        icon="/assets/shared/icon-new-feedback.svg"
        submitLabel="Add Feedback"
        cancelHref="/"
        action={createFeedback}
      />
    </main>
  );
}
