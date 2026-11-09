import { MobileNav } from "./MobileNav";

export function Header({ children }: { children: React.ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex h-18 items-center justify-between bg-[url(/assets/suggestions/mobile/background-header.png)] bg-cover bg-center px-6 text-white md:static md:h-auto md:items-end md:rounded-card md:bg-[url(/assets/suggestions/tablet/background-header.png)] md:p-6 lg:h-34.25 lg:bg-[url(/assets/suggestions/desktop/background-header.png)]">
      <div>
        <p className="text-body-2 font-bold tracking-[-0.19px] md:text-h2 md:tracking-[-0.25px]">
          Frontend Mentor
        </p>
        <p className="text-body-3 font-medium text-white/75 md:text-body-2">
          Feedback Board
        </p>
      </div>
      <MobileNav>{children}</MobileNav>
    </header>
  );
}
