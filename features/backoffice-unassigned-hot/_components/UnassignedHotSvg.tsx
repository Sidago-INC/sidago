"use client";

import React from "react";
import { unassignedHotLeadsData } from "../_lib/data";
import { UnassignedHotTable } from "./UnassignedHotTable";

export function UnassignedHotSvg() {
  return (
    <UnassignedHotTable
      data={unassignedHotLeadsData}
      title="Unassigned Hot Leads - SVG"
      variant="svg"
    />
  );
}
