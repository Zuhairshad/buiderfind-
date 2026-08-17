import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PasswordRecoveryForm from "@/components/auth/PasswordRecoveryForm";

export const metadata: Metadata = { title: "Reset Your Password | BuilderFind", description: "Request a secure BuilderFind password reset link." };

export default async function Page({ searchParams }: PageProps<"/forgot-password">) {
  const token = (await searchParams).token;
  return <><Navbar/><main className="flex min-h-[65vh] items-center justify-center bg-[#E3F2FD] px-4 py-16"><PasswordRecoveryForm token={typeof token === "string" ? token : ""}/></main><Footer/></>;
}
