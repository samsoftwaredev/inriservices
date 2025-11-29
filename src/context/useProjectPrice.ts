"use client";

import { LaborTaskCostSummary } from "@/interfaces/laborTypes";
import React, { createContext, useContext, useState, ReactNode } from "react";

type ProjectPriceProviderProps = {
  children: ReactNode;
};

type ProjectPriceContextType = {
  totalProjectPrice: number;
  totalProjectLaborCost: LaborTaskCostSummary[];
  setTotalProjectPrice: React.Dispatch<React.SetStateAction<number>>;
  setTotalProjectLaborCost: React.Dispatch<
    React.SetStateAction<LaborTaskCostSummary[]>
  >;
};

const ProjectPriceContext = createContext<ProjectPriceContextType | undefined>(
  undefined
);

export const ProjectPriceProvider = ({
  children,
}: ProjectPriceProviderProps) => {
  const [totalProjectPrice, setTotalProjectPrice] = useState<number>(0);
  const [totalProjectLaborCost, setTotalProjectLaborCost] = useState<
    LaborTaskCostSummary[]
  >([]);

  const value: ProjectPriceContextType = {
    totalProjectPrice,
    totalProjectLaborCost,
    setTotalProjectPrice,
    setTotalProjectLaborCost,
  };

  return React.createElement(ProjectPriceContext.Provider, { value }, children);
};

// Custom hook to use the context
export const useProjectPrice = (): ProjectPriceContextType => {
  const context = useContext(ProjectPriceContext);
  if (context === undefined) {
    throw new Error(
      "useProjectPrice must be used within a ProjectPriceProvider"
    );
  }
  return context;
};
