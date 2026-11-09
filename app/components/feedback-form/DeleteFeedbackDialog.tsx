"use client";

import { startTransition, useActionState, useId, useRef } from "react";
import type { DeleteFeedbackState } from "@/app/actions/feedback";
import { buttonStyles } from "../shared/button-styles";

type DeleteFeedbackDialogProps = {
  title: string;
  action: () => Promise<DeleteFeedbackState>;
  className?: string;
};

export function DeleteFeedbackDialog({
  title,
  action,
  className = "",
}: DeleteFeedbackDialogProps) {
  const headingId = useId();
  const descriptionId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [state, dispatch, isPending] = useActionState<DeleteFeedbackState>(
    () => action(),
    { status: "idle" },
  );

  function open() {
    dialogRef.current?.showModal();
    cancelRef.current?.focus();
  }

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`${buttonStyles("danger")} ${className}`}
      >
        Delete
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={headingId}
        aria-describedby={descriptionId}
        onCancel={(event) => {
          if (isPending) event.preventDefault();
        }}
        className="m-auto w-[calc(100%-3rem)] max-w-105 rounded-card bg-white p-6 text-slate shadow-dropdown backdrop:bg-navy-dark/50 md:p-8"
      >
        <h2 id={headingId} className="text-h3 text-navy">
          Delete feedback?
        </h2>
        <p
          id={descriptionId}
          className="mt-3 text-body-3 font-normal md:text-body-2"
        >
          ‘{title}’ and all its comments will be permanently deleted.
        </p>

        {state.status === "error" && !isPending && (
          <p role="alert" className="mt-4 text-sm text-red">
            {state.message}
          </p>
        )}

        <div className="mt-6 flex flex-col-reverse gap-4 md:flex-row md:justify-end">
          <button
            ref={cancelRef}
            type="button"
            onClick={close}
            disabled={isPending}
            className={buttonStyles("tertiary")}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => startTransition(dispatch)}
            disabled={isPending}
            className={buttonStyles("danger")}
          >
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
}
