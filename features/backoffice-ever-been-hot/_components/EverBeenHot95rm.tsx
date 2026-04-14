"use client";

import React from "react";
import { everBeenHot95rmData } from "../_lib/data";
import { EverBeenHotTable } from "./EverBeenHotTable";

export function EverBeenHot95rm() {
  return (
    <EverBeenHotTable
      data={everBeenHot95rmData}
      title="Ever Been Hot - 95RM"
      variant="95rm"
    />
  );
}
