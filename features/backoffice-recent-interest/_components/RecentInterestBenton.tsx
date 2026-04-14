"use client";

import React from "react";
import { bentonRecentInterestData } from "../_lib/data";
import { RecentInterestTable } from "./RecentInterestTable";

export function RecentInterestBenton() {
  return (
    <RecentInterestTable
      data={bentonRecentInterestData}
      title="Recent Interest - Benton"
    />
  );
}
