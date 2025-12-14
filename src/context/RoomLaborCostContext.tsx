"use client";

import React, { createContext, useContext, useId, useMemo } from "react";
import { availableLaborTasks } from "@/constants/laborData";
import { TaskHours } from "@/interfaces/laborTypes";

interface TaskBreakdownItem {
  name: string;
  hours: number;
  laborCost: number;
  materialCost: number;
  totalCost: number;
}

interface RoomLaborCostContextType {
  totalCost: number;
  totalLaborCost: number;
  totalMaterialCost: number;
  taskBreakdown: TaskBreakdownItem[];
}

interface RoomLaborCostProviderProps {
  children: React.ReactNode;
  selectedLaborTasks: string[];
  taskHours: TaskHours;
  includeMaterialCosts: boolean;
}

const RoomLaborCostContext = createContext<
  RoomLaborCostContextType | undefined
>(undefined);

export const RoomLaborCostProvider = ({
  children,
  selectedLaborTasks,
  taskHours,
  includeMaterialCosts,
}: RoomLaborCostProviderProps) => {
  // Calculate total cost
  const totalCost = useMemo(() => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const hours = taskHours[taskName] || task.hours;
      const laborCost = hours * task.rate;
      const materialCost = includeMaterialCosts
        ? task.laborMaterials?.reduce(
            (matTotal, material) =>
              matTotal + material.quantity * material.price,
            0
          ) || 0
        : 0;

      return total + laborCost + materialCost;
    }, 0);
  }, [selectedLaborTasks, taskHours, includeMaterialCosts]);

  // Calculate total labor cost
  const totalLaborCost = useMemo(() => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const hours = taskHours[taskName] || task.hours;
      const laborCost = hours * task.rate;

      return total + laborCost;
    }, 0);
  }, [selectedLaborTasks, taskHours]);

  // Calculate total material cost
  const totalMaterialCost = useMemo(() => {
    return selectedLaborTasks.reduce((total, taskName) => {
      const task = availableLaborTasks.find((t) => t.name === taskName);
      if (!task) return total;

      const materialCost =
        task.laborMaterials?.reduce(
          (matTotal, material) => matTotal + material.quantity * material.price,
          0
        ) || 0;

      return total + materialCost;
    }, 0);
  }, [selectedLaborTasks]);

  // Generate task breakdown
  const taskBreakdown = useMemo((): TaskBreakdownItem[] => {
    return selectedLaborTasks
      .map((taskName) => {
        const task = availableLaborTasks.find((t) => t.name === taskName);
        if (!task) return null;

        const hours = taskHours[taskName] || task.hours;
        const laborCost = hours * task.rate;
        const materialCost = includeMaterialCosts
          ? task.laborMaterials?.reduce(
              (matTotal, material) =>
                matTotal + material.quantity * material.price,
              0
            ) || 0
          : 0;

        const taskBreakdownItem: TaskBreakdownItem = {
          name: taskName,
          hours,
          laborCost,
          materialCost,
          totalCost: laborCost + materialCost,
        };

        return taskBreakdownItem;
      })
      .filter((item): item is TaskBreakdownItem => item !== null);
  }, [selectedLaborTasks, taskHours, includeMaterialCosts]);

  const value: RoomLaborCostContextType = {
    totalCost,
    totalLaborCost,
    totalMaterialCost,
    taskBreakdown,
  };

  return (
    <RoomLaborCostContext.Provider value={value}>
      {children}
    </RoomLaborCostContext.Provider>
  );
};

export const useRoomLaborCost = (): RoomLaborCostContextType => {
  const context = useContext(RoomLaborCostContext);
  if (context === undefined) {
    throw new Error(
      "useRoomLaborCost must be used within a RoomLaborCostProvider"
    );
  }
  return context;
};
