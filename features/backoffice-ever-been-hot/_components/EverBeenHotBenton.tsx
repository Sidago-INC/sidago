"use client";

import React from "react";
import { everBeenHotBentonData } from "../_lib/data";
import { EverBeenHotTable } from "./EverBeenHotTable";

export function EverBeenHotBenton() {
  return (
    <EverBeenHotTable
      data={everBeenHotBentonData}
      title="Ever Been Hot - Benton"
      variant="benton"
    />
  );
}
