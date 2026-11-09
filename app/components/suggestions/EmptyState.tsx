import Image from "next/image";
import { AddFeedbackLink } from "./AddFeedbackLink";

export function EmptyState() {
  return (
    <div className="mx-6 mt-8 flex flex-col items-center rounded-card bg-white px-6 py-19 text-center md:mx-0 md:mt-6 md:min-h-150 md:justify-center md:py-14">
      <Image
        src="/assets/suggestions/illustration-empty.svg"
        alt=""
        width={102}
        height={108}
        className="md:h-34 md:w-32.5"
      />
      <h2 className="mt-10 text-h3 text-navy md:mt-13.5 md:text-h1">
        There is no feedback yet.
      </h2>
      <p className="mt-3.5 max-w-102.5 text-body-3 font-normal md:mt-4 md:text-body-1">
        Got a suggestion? Found a bug that needs to be squashed? We love hearing
        about new ideas to improve our app.
      </p>
      <AddFeedbackLink className="mt-6 md:mt-12" />
    </div>
  );
}
