"use client";

import React from "react";
import {
  MeasurementUnit,
  RoomData,
  RoomDimensionsOverview,
} from "@/interfaces/laborTypes";
import RoomDimensionsEdit from "./RoomDimensionsEdit";
import RoomDimensionsDisplay from "./RoomDimensionsDisplay";
import InfoTooltip from "../InfoTooltip";
import { Typography } from "@mui/material";

interface Props {
  measurementUnit: MeasurementUnit;
  isEditMode: boolean;
  roomData: RoomData;
  editData: RoomDimensionsOverview;
  setEditData: React.Dispatch<React.SetStateAction<RoomDimensionsOverview>>;
  setRoomData: React.Dispatch<React.SetStateAction<RoomData>>;
}

const RoomDimensions = ({
  measurementUnit,
  isEditMode,
  roomData,
  editData,
  setEditData,
  setRoomData,
}: Props) => {
  if (isEditMode) {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Room Dimensions
          <InfoTooltip message="You record a measurement of '3x5' by stating the units and dimensions, most commonly as '3 by 5'. This means the item is 3 units wide by 5 units long." />
        </Typography>
        <RoomDimensionsEdit
          measurementUnit={measurementUnit}
          roomData={roomData}
          editData={editData}
          setEditData={setEditData}
          setRoomData={setRoomData}
        />
      </>
    );
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Room Dimensions
        <InfoTooltip message="You record a measurement of '3x5' by stating the units and dimensions, most commonly as '3 by 5'. This means the item is 3 units wide by 5 units long." />
      </Typography>
      <RoomDimensionsDisplay
        measurementUnit={measurementUnit}
        roomData={roomData}
      />
    </>
  );
};

export default RoomDimensions;
