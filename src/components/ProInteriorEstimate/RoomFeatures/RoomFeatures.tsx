"use client";

import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import AddFeatureForm from "../AddFeatureForm";
import FeaturesList from "../FeaturesList";
import LaborTaskDialog from "../LaborTaskDialog";
import {
  RoomData,
  FeatureType,
  MeasurementUnit,
} from "../../../interfaces/laborTypes";

interface Props {
  measurementUnit: MeasurementUnit;
  roomData: RoomData;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
}

const RoomFeatures = ({ measurementUnit, roomData, setRoomData }: Props) => {
  const [laborDialogOpen, setLaborDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<{
    type: FeatureType;
    id: string;
  } | null>(null);
  const [selectedLaborTasks, setSelectedLaborTasks] = useState<string[]>([]);

  const getTotalFeatures = () => {
    return Object.values(roomData.features).reduce(
      (total, featureArray) => total + featureArray.length,
      0
    );
  };

  const openLaborDialog = (featureType: FeatureType, featureId: string) => {
    const feature = roomData.features[featureType].find(
      (f) => f.id === featureId
    );
    setSelectedFeature({ type: featureType, id: featureId });
    setSelectedLaborTasks(feature?.workLabor?.map((task) => task.name) || []);
    setLaborDialogOpen(true);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="features-content"
          id="features-header"
        >
          <Typography variant="h6">
            Room Features ({getTotalFeatures()})
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <AddFeatureForm
            measurementUnit={measurementUnit}
            roomData={roomData}
            setRoomData={setRoomData}
          />

          <FeaturesList
            roomData={roomData}
            setRoomData={setRoomData}
            onOpenLaborDialog={openLaborDialog}
          />
        </AccordionDetails>
      </Accordion>

      <LaborTaskDialog
        open={laborDialogOpen}
        onClose={() => setLaborDialogOpen(false)}
        selectedFeature={selectedFeature}
        selectedLaborTasks={selectedLaborTasks}
        setSelectedLaborTasks={setSelectedLaborTasks}
        roomData={roomData}
        setRoomData={setRoomData}
        setSelectedFeature={setSelectedFeature}
      />
    </>
  );
};

export default RoomFeatures;
