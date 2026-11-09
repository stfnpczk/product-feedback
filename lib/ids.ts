import { z } from "zod";

const MAX_SERIAL = 2_147_483_647;

export const recordId = z.int().positive().max(MAX_SERIAL);

const idParam = z.coerce.number().pipe(recordId);

export function parseIdParam(value: string) {
  const result = idParam.safeParse(value);
  return result.success ? result.data : null;
}
