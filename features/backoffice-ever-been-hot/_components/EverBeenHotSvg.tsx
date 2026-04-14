"use client";

import React from "react";
import { everBeenHotSvgData } from "../_lib/data";
import { EverBeenHotTable } from "./EverBeenHotTable";

export function EverBeenHotSvg() {
  return (
    <EverBeenHotTable
      data={everBeenHotSvgData}
      title="Ever Been Hot - SVG"
      variant="svg"
    />
  );
}
