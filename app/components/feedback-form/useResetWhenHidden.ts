"use client";

import { type RefObject, useEffect, useEffectEvent } from "react";

export function useResetWhenHidden(
  formRef: RefObject<HTMLFormElement | null>,
  onReset: () => void,
) {
  const reset = useEffectEvent((form: HTMLFormElement | null) => {
    form?.reset();
    onReset();
  });

  useEffect(() => {
    const form = formRef.current;
    return () => reset(form);
  }, [formRef]);
}
