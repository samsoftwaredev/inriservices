import { useState, useEffect, useMemo } from "react";
import { SelectChangeEvent } from "@mui/material";
import { availableLaborTasks, featureTypes } from "@/constants/laborData";
import {
  RoomData,
  FeatureType,
  LaborTask,
  TaskHours,
} from "@/interfaces/laborTypes";

interface UseLaborTaskDialogProps {
  open: boolean;
  onClose: () => void;
  selectedFeature: { type: FeatureType; id: string } | null;
  selectedLaborTasks: string[];
  setSelectedLaborTasks: React.Dispatch<React.SetStateAction<string[]>>;
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
  setSelectedFeature: React.Dispatch<
    React.SetStateAction<{ type: FeatureType; id: string } | null>
  >;
}

export const useLaborTaskDialog = ({
  open,
  onClose,
  selectedFeature,
  selectedLaborTasks,
  setSelectedLaborTasks,
  roomData,
  setRoomData,
  setSelectedFeature,
}: UseLaborTaskDialogProps) => {
  const [taskHours, setTaskHours] = useState<TaskHours>({});
  const [isEditingFeature, setIsEditingFeature] = useState(false);
  const [editFeatureName, setEditFeatureName] = useState("");
  const [editFeatureType, setEditFeatureType] = useState<FeatureType>("walls");
  const [includeMaterialCosts, setIncludeMaterialCosts] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter tasks based on search term
  const filteredLaborTasks = useMemo(() => {
    if (!searchTerm.trim()) {
      return availableLaborTasks;
    }

    const searchLower = searchTerm.toLowerCase();
    return availableLaborTasks.filter(
      (task) =>
        task.name.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.laborMaterials?.some((material) =>
          material.name?.toLowerCase().includes(searchLower)
        )
    );
  }, [searchTerm]);

  // Initialize task hours when dialog opens or selected feature changes
  useEffect(() => {
    if (selectedFeature && open) {
      const feature = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );

      const initialHours: TaskHours = {};

      availableLaborTasks.forEach((task) => {
        const existingTask = feature?.workLabor?.find(
          (wl) => wl.name === task.name
        );
        initialHours[task.name] = existingTask?.hours || task.hours;
      });

      setTaskHours(initialHours);
      setEditFeatureName(feature?.name || "");
      setEditFeatureType(selectedFeature.type);

      if (feature?.workLabor) {
        const existingTaskNames = feature.workLabor.map((task) => task.name);
        setSelectedLaborTasks(existingTaskNames);
      }

      setIncludeMaterialCosts(feature?.includeMaterialCosts !== false);
    }
  }, [selectedFeature, open, roomData.features, setSelectedLaborTasks]);

  // Event handlers
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleLaborTaskToggle = (taskName: string) => {
    setSelectedLaborTasks((prev) =>
      prev.includes(taskName)
        ? prev.filter((name) => name !== taskName)
        : [...prev, taskName]
    );
  };

  const handleHoursChange = (taskName: string, hours: number) => {
    setTaskHours((prev) => ({
      ...prev,
      [taskName]: Math.max(0, hours),
    }));
  };

  const handleMaterialCostsToggle = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIncludeMaterialCosts(event.target.checked);
  };

  // Return empty cost data - these values are now handled by the context
  const totalCost = 0;
  const totalLaborCost = 0;
  const totalMaterialCost = 0;
  const taskBreakdown: any[] = [];

  // Feature editing handlers
  const handleEditFeature = () => {
    setIsEditingFeature(true);
  };

  const handleSaveFeatureEdit = () => {
    if (!selectedFeature) return;

    const updatedFeatures = roomData.features[selectedFeature.type].map(
      (feature) => {
        if (feature.id === selectedFeature.id) {
          return {
            ...feature,
            name: editFeatureName,
            includeMaterialCosts,
          };
        }
        return feature;
      }
    );

    if (editFeatureType !== selectedFeature.type) {
      const featureToMove = roomData.features[selectedFeature.type].find(
        (f) => f.id === selectedFeature.id
      );

      if (featureToMove) {
        const updatedFeatureToMove = {
          ...featureToMove,
          name: editFeatureName,
          includeMaterialCosts,
        };

        const oldTypeFeatures = roomData.features[selectedFeature.type].filter(
          (f) => f.id !== selectedFeature.id
        );

        const newTypeFeatures = [
          ...(roomData.features[editFeatureType] || []),
          updatedFeatureToMove,
        ];

        setRoomData({
          ...roomData,
          features: {
            ...roomData.features,
            [selectedFeature.type]: oldTypeFeatures,
            [editFeatureType]: newTypeFeatures,
          },
        });

        setSelectedFeature({
          type: editFeatureType,
          id: selectedFeature.id,
        });
      }
    } else {
      setRoomData({
        ...roomData,
        features: {
          ...roomData.features,
          [selectedFeature.type]: updatedFeatures,
        },
      });
    }

    setIsEditingFeature(false);
  };

  const handleCancelFeatureEdit = () => {
    if (!selectedFeature) return;

    const feature = roomData.features[selectedFeature.type].find(
      (f) => f.id === selectedFeature.id
    );

    setEditFeatureName(feature?.name || "");
    setEditFeatureType(selectedFeature.type);
    setIncludeMaterialCosts(feature?.includeMaterialCosts !== false);
    setIsEditingFeature(false);
  };

  const handleFeatureTypeChange = (event: SelectChangeEvent<FeatureType>) => {
    setEditFeatureType(event.target.value as FeatureType);
  };

  const saveLaborTasks = () => {
    if (!selectedFeature) return;

    const selectedTasks: LaborTask[] = availableLaborTasks
      .filter((task) => selectedLaborTasks.includes(task.name))
      .map((task) => ({
        ...task,
        hours: taskHours[task.name] || task.hours,
        amountOfLabor:
          taskHours[task.name] * task.rate || task.hours * task.rate,
      }));

    const currentFeatureType = selectedFeature.type;
    const updatedFeatures = roomData.features[currentFeatureType].map(
      (feature) => {
        if (feature.id === selectedFeature.id) {
          return {
            ...feature,
            workLabor: selectedTasks,
            includeMaterialCosts,
          };
        }
        return feature;
      }
    );

    setRoomData({
      ...roomData,
      features: {
        ...roomData.features,
        [currentFeatureType]: updatedFeatures,
      },
    });

    handleClose();
  };

  const handleClose = () => {
    onClose();
    setSelectedFeature(null);
    setSelectedLaborTasks([]);
    setTaskHours({});
    setIsEditingFeature(false);
    setIncludeMaterialCosts(true);
    setSearchTerm("");
  };

  const getFeatureData = () => {
    if (!selectedFeature) return { name: "", type: "" };

    const feature = roomData.features[selectedFeature.type].find(
      (f) => f.id === selectedFeature.id
    );
    return {
      name: feature?.name || "Unknown Feature",
      type:
        selectedFeature.type.charAt(0).toUpperCase() +
        selectedFeature.type.slice(1),
    };
  };

  const getFeatureTypeLabel = (type: FeatureType) => {
    const featureType = featureTypes.find((ft) => ft.value === type);
    return featureType?.label || type;
  };

  return {
    taskHours,
    setTaskHours,
    isEditingFeature,
    setIsEditingFeature,
    editFeatureName,
    setEditFeatureName,
    editFeatureType,
    setEditFeatureType,
    includeMaterialCosts,
    setIncludeMaterialCosts,
    searchTerm,
    setSearchTerm,
    filteredLaborTasks,
    totalCost,
    totalLaborCost,
    totalMaterialCost,
    taskBreakdown,
    handleLaborTaskToggle,
    handleHoursChange,
    handleMaterialCostsToggle,
    handleSearchChange,
    handleClearSearch,
    handleEditFeature,
    handleSaveFeatureEdit,
    handleCancelFeatureEdit,
    handleFeatureTypeChange,
    saveLaborTasks,
    handleClose,
    getFeatureData,
    getFeatureTypeLabel,
  };
};
