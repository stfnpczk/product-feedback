import Link from "next/link";
import { buttonStyles } from "./button-styles";

export function AddFeedbackLink({ className = "" }: { className?: string }) {
  return (
    <Link href="/feedback/new" className={`${buttonStyles()} ${className}`}>
      + Add Feedback
    </Link>
  );
}
