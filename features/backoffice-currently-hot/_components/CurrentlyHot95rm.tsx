"use client";

import React from "react";
import { rm95CurrentlyHotLeadsData } from "../_lib/data";
import { CurrentlyHotTable } from "./CurrentlyHotTable";

export function CurrentlyHot95rm() {
  return (
    <CurrentlyHotTable
      data={rm95CurrentlyHotLeadsData}
      title="Currently Hot Leads - 95RM"
      variant="95rm"
    />
  );
}
