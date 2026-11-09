import { formCard, formCardIcon } from "./form-card-styles";

export function FeedbackFormSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Loading feedback…
      </p>
      <div
        aria-hidden="true"
        className={`animate-pulse motion-reduce:animate-none ${formCard}`}
      >
        <div className={`rounded-full bg-lavender ${formCardIcon}`} />
        <div className="mt-6 h-6 w-3/4 rounded-full bg-lavender md:h-8" />
        <div className="mt-6 flex flex-col gap-6 md:mt-10">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i}>
              <div className="h-4 w-28 rounded-full bg-lavender" />
              <div className="mt-2 h-4 w-48 rounded-full bg-lavender" />
              <div className="mt-4 h-12 rounded-field bg-ghost" />
            </div>
          ))}
        </div>
        <div className="mt-10 h-10 rounded-card bg-lavender md:mt-8 md:ml-auto md:h-11 md:w-36" />
      </div>
    </>
  );
}
