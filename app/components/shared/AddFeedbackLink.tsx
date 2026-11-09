import Link from "next/link";
import { newFeedbackHref } from "@/lib/routes";
import { buttonStyles } from "./button-styles";

export function AddFeedbackLink({ className = "" }: { className?: string }) {
  return (
    <Link href={newFeedbackHref} className={`${buttonStyles()} ${className}`}>
      + Add Feedback
    </Link>
  );
}
