"use client";

import React from "react";

import MainContent from "./MainContent";
import EstimateSummary from "./EstimateSummary";
import {
  BuildingProvider,
  GallonsProvider,
  ProjectCostProvider,
} from "@/context";
import { useCustomer } from "@/context/CustomerContext";

const Building = () => {
  const { currentCustomer } = useCustomer();
  return (
    <BuildingProvider customer={currentCustomer}>
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
