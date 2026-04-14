"use client";

import React from "react";
import { svgRecentInterestData } from "../_lib/data";
import { RecentInterestTable } from "./RecentInterestTable";

export function RecentInterestSvg() {
  return (
    <RecentInterestTable
      data={svgRecentInterestData}
      title="Recent Interest - SVG"
    />
  );
}
