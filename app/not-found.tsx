import type { Metadata } from "next";
import Link from "next/link";
import { buttonStyles } from "@/app/components/shared/button-styles";
import { MessagePage } from "@/app/components/shared/MessagePage";

export const metadata: Metadata = { title: "Not found" };

export default function NotFound() {
  return (
    <MessagePage
      title="This page doesn’t exist."
      action={
        <Link href="/" className={buttonStyles()}>
          Go to Suggestions
        </Link>
      }
    >
      The feedback may have been deleted, or the link may be wrong.
    </MessagePage>
  );
}
