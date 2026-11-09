import Image from "next/image";
import Link from "next/link";

export function SuggestionsToolbar() {
  return (
    <div className="flex h-14 items-center bg-navy-dark px-6 text-lavender md:h-18 md:gap-9.5 md:rounded-[10px] md:pr-3 lg:pr-4">
      <h1 className="sr-only md:not-sr-only md:flex md:items-center md:gap-4 md:text-h3 md:text-white">
        <Image
          src="/assets/suggestions/icon-suggestions.svg"
          alt=""
          width={23}
          height={24}
        />
        6 Suggestions
      </h1>
      <p className="flex items-center gap-2 text-body-3 font-normal md:text-sm">
        <span>
          Sort by : <span className="font-bold">Most Upvotes</span>
        </span>
        <span
          aria-hidden="true"
          className="h-1.75 w-2.5 bg-lavender mask-[url(/assets/shared/icon-arrow-down.svg)] mask-contain mask-center mask-no-repeat"
        />
      </p>
      <Link
        href="/feedback/new"
        className="ml-auto flex h-10 items-center rounded-[10px] bg-purple px-4 text-body-3 font-bold transition-colors hover:bg-purple-hover md:h-11 md:px-6 md:text-sm"
      >
        + Add Feedback
      </Link>
    </div>
  );
}
