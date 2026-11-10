import { z } from "zod";

export function requiredText(max: number) {
  return z
    .string()
    .transform((value) => value.replace(/\r\n?/g, "\n"))
    .pipe(
      z
        .string()
        .trim()
        .min(1, "Can't be empty")
        .max(max, `Can't be longer than ${max} characters`),
    );
}
