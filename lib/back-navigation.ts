const listPaths = ["/", "/roadmap"];

export function isBackTarget({
  previousUrl,
  currentUrl,
  href,
}: {
  previousUrl: string | null | undefined;
  currentUrl: string;
  href: string;
}) {
  if (!previousUrl) return false;

  const previous = new URL(previousUrl);
  const current = new URL(currentUrl);
  const target = new URL(href, current.origin);
  if (
    previous.origin !== target.origin ||
    previous.pathname === current.pathname
  ) {
    return false;
  }
  return target.pathname === "/"
    ? listPaths.includes(previous.pathname)
    : previous.pathname === target.pathname;
}
