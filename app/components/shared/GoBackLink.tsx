"use client";

import Link from "next/link";
import { useBackLink } from "./back-navigation";

const variants = {
  default: { link: "text-slate", arrow: "bg-blue" },
  onDark: { link: "text-white focus-ring-white", arrow: "bg-white" },
};

export function GoBackLink({
  href,
  variant = "default",
}: {
  href: string;
  variant?: keyof typeof variants;
}) {
  const handleNavigate = useBackLink(href);
  const { link, arrow } = variants[variant];

  return (
    <Link
      href={href}
      onNavigate={handleNavigate}
      className={`flex items-center gap-3.75 text-body-3 font-bold focus-ring focus-ring-offset-4 hover:underline md:text-sm ${link}`}
    >
      <span
        aria-hidden="true"
        className={`h-2.5 w-1.75 mask-[url(/assets/shared/icon-arrow-left.svg)] mask-contain mask-center mask-no-repeat ${arrow}`}
      />
      Go Back
    </Link>
  );
}
