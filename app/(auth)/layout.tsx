"use client";
import { GuestRoute } from "@/components/guards/GuestRoute";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return <GuestRoute>{children}</GuestRoute>;
}
