import Link from "next/link";

export function FeedbackCardTitle({
  title,
  href,
  headingLevel: Heading,
  className = "",
}: {
  title: string;
  href?: string;
  headingLevel: "h1" | "h2" | "h3";
  className?: string;
}) {
  return (
    <Heading
      className={`text-body-3-bold text-navy transition-colors group-has-[a:hover]:text-blue ${className}`}
    >
      {href ? (
        <Link
          href={href}
          className="outline-none after:absolute after:inset-0 after:rounded-card"
        >
          {title}
        </Link>
      ) : (
        title
      )}
    </Heading>
  );
}
