import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "UK Home Improvement Cost Calculator | BuilderFind",
  description: "Create an early area-based cost allowance for extensions, driveways, flooring and plastering.",
};

export default function Layout({ children }: { children: ReactNode }) {
  return children;
}
