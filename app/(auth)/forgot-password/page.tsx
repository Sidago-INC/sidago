import { ForgotPassword } from "./components/ForgotPassword";

export const metadata = {
  title: "Forgot Password | Sidao CRM",
  description:
    "Reset your password by requesting a secure password reset link.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <ForgotPassword />;
}
