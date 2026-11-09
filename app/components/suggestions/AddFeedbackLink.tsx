import Link from "next/link";

export function AddFeedbackLink({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/feedback/new"
      className={`flex h-10 items-center rounded-[10px] bg-purple px-4 text-body-3 font-bold text-lavender transition-colors hover:bg-purple-hover md:h-11 md:px-6 md:text-sm ${className}`}
    >
      + Add Feedback
    </Link>
  );
}
