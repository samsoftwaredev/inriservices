"use client";

import React from "react";

import EstimateSummary from "./EstimateSummary";
import {
  BuildingProvider,
  GallonsProvider,
  ProjectCostProvider,
} from "@/context";

const Building = () => {
  return (
    <BuildingProvider>
      <ProjectCostProvider>
        <GallonsProvider>
          <EstimateSummary />
        </GallonsProvider>
      </ProjectCostProvider>
    </BuildingProvider>
  );
};

export default Building;
