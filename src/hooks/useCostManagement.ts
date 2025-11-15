import { useState } from "react";

export const useCostManagement = () => {
  const [baseCost, setBaseCost] = useState(1000);

  const handleCostChange = (newBaseCost: number) => {
    setBaseCost(newBaseCost);
  };

  const calculateTotalCost = (
    laborCosts: number = 0,
    materialCosts: number = 0,
    additionalCosts: number = 0
  ) => {
    return baseCost + laborCosts + materialCosts + additionalCosts;
  };

  const resetCosts = () => {
    setBaseCost(1000);
  };

  return {
    // State
    baseCost,

    // Handlers
    handleCostChange,
    calculateTotalCost,
    resetCosts,
    setBaseCost,
  };
};
