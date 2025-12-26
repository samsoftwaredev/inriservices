"use client";

import React from "react";

import MainContent from "./MainContent";
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
          <MainContent />
          <EstimateSummary />
        </GallonsProvider>
      </ProjectCostProvider>
    </BuildingProvider>
  );
};

export default Building;
