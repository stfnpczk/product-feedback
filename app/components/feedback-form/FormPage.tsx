import type { ReactNode } from "react";
import { GoBackLink } from "../shared/GoBackLink";

export function FormPage({
  backHref,
  children,
}: {
  backHref?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto box-content max-w-135 px-6 pt-6 pb-19 md:pt-11 md:pb-20 lg:pt-20">
      <div className="flex min-h-10 items-center md:min-h-11">
        {backHref && <GoBackLink href={backHref} />}
      </div>
      {children}
    </main>
  );
}
