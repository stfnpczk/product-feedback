"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type ReactNode, startTransition, useOptimistic } from "react";
import { roadmapHref } from "@/lib/roadmap-tabs";
import type { RoadmapStatus } from "@/lib/statuses";
import { roadmapStatusBg } from "../shared/roadmap-status-styles";

export type RoadmapTabColumn = {
  status: RoadmapStatus;
  label: string;
  panel: ReactNode;
};

export function RoadmapTabs({
  active,
  columns,
}: {
  active: RoadmapStatus;
  columns: RoadmapTabColumn[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useOptimistic(active);
  const activeIndex = columns.findIndex(({ status }) => status === activeTab);

  function switchTab(next: RoadmapStatus) {
    startTransition(() => {
      setActiveTab(next);
      router.replace(roadmapHref(next), { scroll: false });
    });
  }

  return (
    <>
      <nav aria-label="Roadmap status" className="relative md:hidden">
        <ul className="grid h-15 grid-cols-3 border-b border-steel/25">
          {columns.map(({ status, label }) => {
            const isActive = status === activeTab;
            return (
              <li key={status} className="-mb-px">
                <Link
                  href={roadmapHref(status)}
                  aria-current={isActive ? "page" : undefined}
                  onNavigate={(event) => {
                    event.preventDefault();
                    switchTab(status);
                  }}
                  className={`flex h-full items-center justify-center text-body-3-bold focus-ring transition-colors focus-ring-inset ${
                    isActive ? "text-navy" : "text-navy/40 hover:text-navy"
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
        <span
          aria-hidden="true"
          style={{ translate: `${activeIndex * 100}%` }}
          className={`absolute bottom-0 left-0 h-1 w-1/3 transition-[translate,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${roadmapStatusBg[activeTab]}`}
        />
      </nav>
      <div className="px-6 pt-6 md:grid md:grid-cols-3 md:items-start md:gap-2.5 md:p-0 lg:gap-7.5">
        {columns.map(({ status, panel }) => (
          <div
            key={status}
            className={status === activeTab ? undefined : "max-md:hidden"}
          >
            {panel}
          </div>
        ))}
      </div>
    </>
  );
}
