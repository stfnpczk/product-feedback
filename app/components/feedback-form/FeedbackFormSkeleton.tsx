export function FeedbackFormSkeleton() {
  return (
    <>
      <p role="status" className="sr-only">
        Loading feedback…
      </p>
      <div
        aria-hidden="true"
        className="mt-11 flow-root animate-pulse rounded-card bg-white px-6 pb-6 motion-reduce:animate-none md:mt-14 md:px-10.5 md:pb-10"
      >
        <div className="-mt-5 size-10 rounded-full bg-lavender md:-mt-7 md:size-14" />
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
