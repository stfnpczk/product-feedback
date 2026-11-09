import type { ReactNode } from "react";

export function MessagePage({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action: ReactNode;
}) {
  return (
    <main className="mx-auto box-content max-w-135 px-6 pt-14 pb-19 md:max-w-182.5 md:px-10 md:pt-20 md:pb-28 lg:pt-32">
      <div className="flex flex-col items-center rounded-card bg-white px-6 py-19 text-center md:py-14">
        <span
          aria-hidden="true"
          className="h-27 w-25.5 bg-[url(/assets/suggestions/illustration-empty.svg)] bg-contain bg-center bg-no-repeat md:h-34 md:w-32.5"
        />
        <h1 className="mt-10 text-h3 text-navy md:mt-13.5 md:text-h1">
          {title}
        </h1>
        <p className="mt-3.5 max-w-102.5 text-body-3 font-normal md:mt-4 md:text-body-1">
          {children}
        </p>
        <div className="mt-6 md:mt-12">{action}</div>
      </div>
    </main>
  );
}
