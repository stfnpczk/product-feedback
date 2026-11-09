"use client";

import { useEffect } from "react";
import { buttonStyles } from "@/app/components/shared/button-styles";
import { MessagePage } from "@/app/components/shared/MessagePage";

export default function ErrorPage({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <MessagePage
      title="Something went wrong."
      action={
        <button type="button" onClick={retry} className={buttonStyles()}>
          Try Again
        </button>
      }
    >
      The page couldn’t be loaded. Please try again in a moment.
    </MessagePage>
  );
}
