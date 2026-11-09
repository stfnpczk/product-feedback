import type { ReactNode } from "react";

export function FieldError({
  id,
  children,
}: {
  id: string;
  children?: ReactNode;
}) {
  if (!children) return null;

  return (
    <p id={id} className="mt-1 text-sm text-red">
      {children}
    </p>
  );
}
