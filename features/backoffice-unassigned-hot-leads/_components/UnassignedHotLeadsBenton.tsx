"use client";

import React from "react";
import { unassignedHotLeadsData } from "../_lib/data";
import { UnassignedHotLeadsTable } from "./UnassignedHotLeadsTable";

export function UnassignedHotLeadsBenton() {
  return (
    <UnassignedHotLeadsTable
      data={unassignedHotLeadsData}
      title="Unassigned Hot Leads - Benton"
      variant="benton"
    />
  );
}
