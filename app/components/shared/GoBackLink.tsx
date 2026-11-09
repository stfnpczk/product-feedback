"use client";

import Image from "next/image";
import Link from "next/link";
import { useBackNavigation } from "./useBackNavigation";

export function GoBackLink({ href }: { href: string }) {
  const handleClick = useBackNavigation(href);

  return (
    <Link
      href={href}
      onClick={handleClick}
      className="flex items-center gap-3.75 text-body-3 font-bold text-slate hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue md:text-sm"
    >
      <Image
        src="/assets/shared/icon-arrow-left.svg"
        alt=""
        width={7}
        height={10}
      />
      Go Back
    </Link>
  );
}
