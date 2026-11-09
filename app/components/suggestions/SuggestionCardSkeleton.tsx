export function SuggestionCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="grid h-50 animate-pulse grid-cols-[1fr_auto] content-between rounded-[10px] bg-white p-6 [grid-template-areas:'content_content'_'upvotes_comments'] motion-reduce:animate-none md:h-37.75 md:grid-cols-[auto_1fr_auto] md:content-start md:px-8 md:py-7 md:[grid-template-areas:'upvotes_content_comments']"
    >
      <div className="flex flex-col gap-3 [grid-area:content] md:pr-6 md:pl-10">
        <div className="h-4 w-1/2 rounded-full bg-lavender" />
        <div className="h-4 w-4/5 rounded-full bg-lavender" />
        <div className="h-7.5 w-24 rounded-[10px] bg-lavender" />
      </div>
      <div className="h-8 w-17.25 rounded-[10px] bg-lavender [grid-area:upvotes] md:h-13.25 md:w-10" />
      <div className="h-4 w-10 self-center rounded-full bg-lavender [grid-area:comments]" />
    </div>
  );
}
