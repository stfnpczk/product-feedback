"use client";

import { createContext, type ReactNode, use, useState } from "react";

type ReplyContextValue = {
  openId: number | null;
  toggle: (commentId: number) => void;
  close: (commentId: number) => void;
};

const ReplyContext = createContext<ReplyContextValue | null>(null);

export const replyButtonId = (commentId: number) => `reply-button-${commentId}`;
export const replyFormId = (commentId: number) => `reply-form-${commentId}`;

export function ReplyProvider({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<number | null>(null);

  function toggle(commentId: number) {
    setOpenId((current) => (current === commentId ? null : commentId));
  }

  function close(commentId: number) {
    setOpenId(null);
    document.getElementById(replyButtonId(commentId))?.focus();
  }

  return (
    <ReplyContext value={{ openId, toggle, close }}>{children}</ReplyContext>
  );
}

export function useReply() {
  const context = use(ReplyContext);
  if (!context) throw new Error("useReply must be used inside ReplyProvider");
  return context;
}
