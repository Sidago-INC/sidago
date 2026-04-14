"use client";

import React from "react";
import { unassignedHotLeadsData } from "../_lib/data";
import { UnassignedHotLeadsTable } from "./UnassignedHotLeadsTable";

export function UnassignedHotLeadsSvg() {
  return (
    <UnassignedHotLeadsTable
      data={unassignedHotLeadsData}
      title="Unassigned Hot Leads - SVG"
      variant="svg"
    />
  );
}
