import { notFound } from "next/navigation";
import { isTradeSlug } from "@/data/directory";
import type { ReactNode } from "react";

export default async function TradeLayout({ children, params }: { children: ReactNode; params: Promise<{ trade: string }> }) {
  const { trade } = await params;

  if (!isTradeSlug(trade)) {
    notFound();
  }

  return children;
}
