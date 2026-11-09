import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "Product Feedback App",
  description: "Frontend Mentor product feedback app",
  icons: { icon: "/assets/favicon-32x32.png" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={jost.variable}>
      <body>{children}</body>
    </html>
  );
}
