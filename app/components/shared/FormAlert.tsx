import type { ReactNode } from "react";

export function FormAlert({
  children,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  if (!children) return null;

  return (
    <p role="alert" className={`text-sm text-red ${className}`}>
      {children}
    </p>
  );
}
