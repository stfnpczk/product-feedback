const base =
  "inline-flex h-10 shrink-0 cursor-pointer items-center justify-center rounded-card px-4 text-body-3 font-bold text-lavender transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue disabled:cursor-not-allowed disabled:opacity-60 md:h-11 md:px-6 md:text-sm";

const variants = {
  primary: "bg-purple hover:bg-purple-hover",
  secondary: "bg-blue hover:bg-blue-hover",
  tertiary: "bg-navy hover:bg-navy-hover",
  danger: "bg-red hover:bg-red-hover",
};

export function buttonStyles(variant: keyof typeof variants = "primary") {
  return `${base} ${variants[variant]}`;
}
