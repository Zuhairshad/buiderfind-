import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuilderFind — Find Trusted Builders & Get Free Quotes",
  description:
    "Post your job, receive up to 3 quotes from trusted local builders. Compare prices, check reviews and book with confidence. FREE to use.",
  keywords: "builders, building quotes, find a builder, local builders, construction quotes UK",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
