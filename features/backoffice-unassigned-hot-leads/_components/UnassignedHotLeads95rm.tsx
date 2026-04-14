"use client";

import React from "react";
import { unassignedHotLeadsData } from "../_lib/data";
import { UnassignedHotLeadsTable } from "./UnassignedHotLeadsTable";

export function UnassignedHotLeads95rm() {
  return (
    <UnassignedHotLeadsTable
      data={unassignedHotLeadsData}
      title="Unassigned Hot Leads - 95RM"
      variant="95rm"
    />
  );
}
