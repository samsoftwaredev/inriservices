"use client";

import React from "react";
import { RoomData, RoomDimensionsOverview } from "../laborTypes";
import RoomDimensionsEdit from "./RoomWallDimensionsEdit";
import RoomDimensionsDisplay from "./RoomWallDimensionsDisplay";
import InfoTooltip from "../InfoTooltip";
import { Typography } from "@mui/material";

interface Props {
  measurementUnit: string;
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
