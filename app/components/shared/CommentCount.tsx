import Image from "next/image";

export function CommentCount({
  count,
  className = "",
}: {
  count: number;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-2 text-body-3 font-bold tracking-[-0.18px] text-navy ${className}`}
    >
      <Image
        src="/assets/shared/icon-comments.svg"
        alt=""
        width={18}
        height={16}
      />
      <span className={count === 0 ? "text-navy/50" : undefined}>{count}</span>
      <span className="sr-only">{count === 1 ? " comment" : " comments"}</span>
    </p>
  );
}
