"use client";

import { LaborCostData, RoomData } from "@/interfaces/laborTypes";
import React, { createContext, useContext, useState } from "react";

interface ProjectCostContextType {
  updateProjectCost: (roomId: string, roomData: RoomData) => void;
  totalProjectCost: number;
  totalProjectLaborCost: number;
  totalProjectMaterialCost: number;
  projectTaskBreakdown: any[];
}

interface ProjectCostProviderProps {
  children: React.ReactNode;
}

const ProjectCostContext = createContext<ProjectCostContextType | undefined>(
  undefined
);

export const ProjectCostProvider = ({ children }: ProjectCostProviderProps) => {
  const [laborCosts, setLaborCosts] = useState<Record<string, LaborCostData>>({
    // Example structure; actual data will be populated via updateProjectCost
    // [roomId]: {
    //   totalCost: 0,
    //   totalLaborCost: 0,
    //   totalMaterialCost: 0,
    //   taskBreakdown: [],
    // },
  });

  const updateProjectCost = (roomId: string, roomData: RoomData) => {
    // Logic to update laborCosts based on roomId and roomData
    // This is a placeholder implementation; actual logic will depend on requirements
    let totalLaborCost = 0;
    let totalMaterialCost = 0;
    let totalCost = 0;

    roomData.features &&
      Object.values(roomData.features).forEach((featureArray) => {
        featureArray.forEach((feature) => {
          feature.workLabor?.forEach((task) => {
            totalLaborCost += task.hours * task.rate;
            totalMaterialCost +=
              roomData.includeMaterialCosts === true &&
              feature.includeMaterialCosts === true &&
              task.laborMaterials
                ? task.laborMaterials.reduce(
                    (matTotal, material) =>
                      matTotal + material.quantity * material.price,
                    0
                  )
                : 0;
          });
        });
      });

    totalCost = totalLaborCost + totalMaterialCost;

    setLaborCosts((prevCosts) => {
      // Update the costs accordingly
      return {
        ...prevCosts,
        [roomId]: {
          // Example structure; replace with actual cost calculation
          totalLaborCost: totalLaborCost,
          totalMaterialCost: totalMaterialCost,
          totalCost: totalCost,
          taskBreakdown: [],
        },
      };
    });
  };

  const totalProjectCost = Object.values(laborCosts).reduce(
    (sum, costData) => sum + costData.totalCost,
    0
  );

  const totalProjectLaborCost = Object.values(laborCosts).reduce(
    (sum, costData) => sum + costData.totalLaborCost,
    0
  );

  const totalProjectMaterialCost = Object.values(laborCosts).reduce(
    (sum, costData) => sum + costData.totalMaterialCost,
    0
  );

  const projectTaskBreakdown = Object.values(laborCosts).flatMap(
    (costData) => costData.taskBreakdown
  );

  const value: ProjectCostContextType = {
    updateProjectCost,
    totalProjectCost,
    totalProjectLaborCost,
    totalProjectMaterialCost,
    projectTaskBreakdown,
  };

  return (
    <ProjectCostContext.Provider value={value}>
      {children}
    </ProjectCostContext.Provider>
  );
};

export const useProjectCost = (): ProjectCostContextType => {
  const context = useContext(ProjectCostContext);
  if (context === undefined) {
    throw new Error("useProjectCost must be used within a ProjectCostProvider");
  }
  return context;
};
