export function fieldStyles(invalid = false) {
  return `w-full rounded-field border bg-ghost text-body-3 font-normal text-navy placeholder:text-steel focus:outline-none md:text-body-2 ${
    invalid ? "border-red" : "border-transparent focus:border-blue"
  }`;
}
