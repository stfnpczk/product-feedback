import { z } from "zod";

const feedbackId = z.coerce.number().int().positive().max(2_147_483_647);

export function parseFeedbackId(value: string) {
  const result = feedbackId.safeParse(value);
  return result.success ? result.data : null;
}
