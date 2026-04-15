"use client";

import { Form } from "./Form";
import { PublicLayout } from "@/components/layouts/public/PublicLayout";

export function ResetPassword({ token }: { token: string }) {
  return (
    <PublicLayout>
      <Form token={token} />
    </PublicLayout>
  );
}
