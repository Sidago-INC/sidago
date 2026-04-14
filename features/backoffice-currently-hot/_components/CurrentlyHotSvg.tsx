"use client";

import React from "react";
import { svgCurrentlyHotLeadsData } from "../_lib/data";
import { CurrentlyHotTable } from "./CurrentlyHotTable";

export function CurrentlyHotSvg() {
  return (
    <CurrentlyHotTable
      data={svgCurrentlyHotLeadsData}
      title="Currently Hot Leads - SVG"
      variant="svg"
    />
  );
}
