"use client";

import React from "react";

import MainContent from "./MainContent";
import EstimateSummary from "./EstimateSummary";
import {
  BuildingProvider,
  GallonsProvider,
  ProjectCostProvider,
} from "@/context";

const Building = ({ isNewClient }: { isNewClient?: boolean }) => {
  return (
    <BuildingProvider>
      <ProjectCostProvider>
        <GallonsProvider>
          <MainContent isNewClient={isNewClient} />
          <EstimateSummary />
        </GallonsProvider>
      </ProjectCostProvider>
    </BuildingProvider>
  );
};

export default Building;
