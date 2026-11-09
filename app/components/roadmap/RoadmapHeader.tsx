import { AddFeedbackLink } from "../shared/AddFeedbackLink";
import { GoBackLink } from "../shared/GoBackLink";

export function RoadmapHeader() {
  return (
    <header className="flex h-25 items-center justify-between bg-navy-dark px-6 md:h-28.25 md:rounded-card md:px-8 lg:pr-10">
      <div className="flex flex-col items-start gap-0.75 md:gap-1">
        <GoBackLink href="/" variant="onDark" />
        <h1 className="text-h3 text-white md:text-h1">Roadmap</h1>
      </div>
      <AddFeedbackLink className="focus-visible:outline-white!" />
    </header>
  );
}
