import type { Metadata } from "next";
import { Suspense } from "react";
import {
  RoadmapBoard,
  RoadmapBoardFallback,
} from "@/app/components/roadmap/RoadmapBoard";
import { RoadmapHeader } from "@/app/components/roadmap/RoadmapHeader";
import { pageContainer } from "@/app/components/shared/layout-styles";
import { parseRoadmapTab } from "@/lib/roadmap-tabs";

export const metadata: Metadata = { title: "Roadmap" };

export default function RoadmapPage({ searchParams }: PageProps<"/roadmap">) {
  const active = searchParams.then(parseRoadmapTab);

  return (
    <div className={`md:pt-14 lg:pt-19.5 ${pageContainer}`}>
      <RoadmapHeader />
      <main className="pb-14 md:mt-8 md:pb-28 lg:mt-12 lg:pb-32">
        <Suspense fallback={<RoadmapBoardFallback />}>
          <RoadmapBoard active={active} />
        </Suspense>
      </main>
    </div>
  );
}
