"use client";

import React from "react";
import { rm95RecentInterestData } from "../_lib/data";
import { RecentInterestTable } from "./RecentInterestTable";

export function RecentInterest95rm() {
  return (
    <RecentInterestTable
      data={rm95RecentInterestData}
      title="Recent Interest - 95RM"
    />
  );
}
