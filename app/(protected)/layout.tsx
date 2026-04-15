"use client";
import { AuthLayout } from "@/components/layouts/protected/AuthLayout";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
