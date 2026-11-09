"use client";

import Link from "next/link";
import { useBackNavigation } from "./useBackNavigation";

const variants = {
  default: { link: "text-slate focus-visible:outline-blue", arrow: "bg-blue" },
  onDark: { link: "text-white focus-visible:outline-white", arrow: "bg-white" },
};

export function GoBackLink({
  href,
  variant = "default",
}: {
  href: string;
  variant?: keyof typeof variants;
}) {
  const handleNavigate = useBackNavigation(href);
  const { link, arrow } = variants[variant];

  return (
    <Link
      href={href}
      onNavigate={handleNavigate}
      className={`flex items-center gap-3.75 text-body-3 font-bold hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 md:text-sm ${link}`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-1.75 mask-[url(/assets/shared/icon-arrow-left.svg)] mask-contain mask-center mask-no-repeat ${arrow}`}
      />
      Go Back
    </Link>
  );
}
