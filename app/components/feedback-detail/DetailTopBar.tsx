import type { ReactNode } from "react";
import { GoBackLink } from "../shared/GoBackLink";

export function DetailTopBar({ children }: { children?: ReactNode }) {
  return (
    <div className="flex min-h-10 items-center justify-between md:min-h-11">
      <GoBackLink href="/" />
      {children}
    </div>
  );
}
