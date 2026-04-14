"use client";

import React from "react";
import { bentonCurrentlyHotLeadsData } from "../_lib/data";
import { CurrentlyHotTable } from "./CurrentlyHotTable";

export function CurrentlyHotBenton() {
  return (
    <CurrentlyHotTable
      data={bentonCurrentlyHotLeadsData}
      title="Currently Hot Leads - Benton"
      variant="benton"
    />
  );
}
