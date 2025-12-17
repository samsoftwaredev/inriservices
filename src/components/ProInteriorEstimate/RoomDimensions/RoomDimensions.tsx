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
  roomId: string;
  measurementUnit: MeasurementUnit;
  isEditMode: boolean;
  editData: RoomDimensionsOverview;
  setEditData: React.Dispatch<React.SetStateAction<RoomDimensionsOverview>>;
}

const RoomDimensions = ({
  roomId,
  measurementUnit,
  isEditMode,
  editData,
  setEditData,
}: Props) => {
  if (isEditMode) {
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Room Dimensions
          <InfoTooltip message="You record a measurement of '3x5' by stating the units and dimensions, most commonly as '3 by 5'. This means the item is 3 units wide by 5 units long." />
        </Typography>
        <RoomDimensionsEdit
          roomId={roomId}
          measurementUnit={measurementUnit}
          editData={editData}
          setEditData={setEditData}
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
      <RoomDimensionsDisplay measurementUnit={measurementUnit} />
    </>
  );
};

export default RoomDimensions;
