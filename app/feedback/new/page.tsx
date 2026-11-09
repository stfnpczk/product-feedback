import type { Metadata } from "next";
import { createFeedback } from "@/app/actions/feedback";
import { FeedbackForm } from "@/app/components/feedback-form/FeedbackForm";
import { FormPage } from "@/app/components/feedback-form/FormPage";

export const metadata: Metadata = { title: "New Feedback" };

export default function NewFeedbackPage() {
  return (
    <FormPage backHref="/">
      <FeedbackForm mode="create" returnHref="/" action={createFeedback} />
    </FormPage>
  );
}
