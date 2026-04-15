import { redirect } from "next/navigation";
import { ResetPassword } from "./components/ResetPassword";

export const metadata = {
  title: "Reset Password | Sidago CRM",
  description: "Reset your account password securely.",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params?.token;

  if (!token || typeof token !== "string") {
    redirect("/");
  }

  return <ResetPassword token={token} />;
}
