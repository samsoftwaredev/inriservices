"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  Divider,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

import RoomDimensions from "../RoomDimensions";
import RoomFeatures from "../RoomFeatures";
import {
  RoomData,
  Props,
  RoomDimensionsOverview,
  PaintBaseType,
} from "@/interfaces/laborTypes";
import { floorOptions } from "../../../constants/laborData";
import { calculateArea, calculatePerimeter } from "../laborCalc";
import { convertToFeet } from "@/tools/convertMeasurement";
import { useRoom } from "@/context/RoomContext";

const Room = ({ onRoomUpdate }: Props) => {
  const {
    roomId,
    roomName,
    roomDescription,
    floorNumber,
    roomData,
    setRoomData,
    measurementUnit,
  } = useRoom();
  const [isEditMode, setIsEditMode] = useState(true);

  const [editData, setEditData] = useState<RoomDimensionsOverview>({
    area: roomData.area,
    wallPerimeter: roomData.wallPerimeter,
    roomHeight: roomData.roomHeight,
    roomName: roomName,
    roomDescription: roomDescription,
    floorNumber: floorNumber,
    baseboardHeight: 0,
    wallPaintCoats: 1,
    baseboardPaintCoats: 1,
    baseboardPerimeter: "",
    chairRailPerimeter: "",
    chairRailHeight: 0,
    chairRailPaintCoats: 1,
    crownMoldingPerimeter: "",
    crownMoldingHeight: 0,
    crownMoldingPaintCoats: 1,
    wainscotingPerimeter: "",
    wainscotingHeight: 0,
    wainscotingPaintCoats: 1,
  });

  const handleEditClick = () => {
    setEditData({
      area: roomData.area,
      wallPerimeter: roomData.wallPerimeter,
      roomHeight: roomData.roomHeight,
      roomName: roomName,
      roomDescription: roomDescription,
      floorNumber: floorNumber,
      baseboardPerimeter: roomData.baseboardPerimeter,
      baseboardHeight: roomData.baseboardHeight,
      wallPaintCoats: roomData.wallPaintCoats,
      baseboardPaintCoats: roomData.baseboardPaintCoats,
      chairRailPerimeter: roomData.chairRailPerimeter,
      chairRailHeight: roomData.chairRailHeight,
      chairRailPaintCoats: roomData.chairRailPaintCoats,
      crownMoldingPerimeter: roomData.crownMoldingPerimeter,
      crownMoldingHeight: roomData.crownMoldingHeight,
      crownMoldingPaintCoats: roomData.crownMoldingPaintCoats,
      wainscotingPerimeter: roomData.wainscotingPerimeter,
      wainscotingHeight: roomData.wainscotingHeight,
      wainscotingPaintCoats: roomData.wainscotingPaintCoats,
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    setRoomData({
      ...roomData,
      area: editData.area,
      wallPerimeter: editData.wallPerimeter,
      areaCalculated: calculateArea(editData.area),
      baseboardPerimeterCalculated: calculatePerimeter(
        editData.baseboardPerimeter,
        convertToFeet(editData.baseboardHeight, measurementUnit)
      ),
      chairRailPerimeterCalculated: calculatePerimeter(
        editData.chairRailPerimeter,
        convertToFeet(editData.chairRailHeight, measurementUnit)
      ),
      crownMoldingPerimeterCalculated: calculatePerimeter(
        editData.crownMoldingPerimeter,
        convertToFeet(editData.crownMoldingHeight, measurementUnit)
      ),
      wallPerimeterCalculated: calculatePerimeter(
        editData.wallPerimeter,
        convertToFeet(editData.roomHeight, measurementUnit)
      ),
      wainscotingPerimeterCalculated: calculatePerimeter(
        editData.wainscotingPerimeter,
        convertToFeet(editData.wainscotingHeight, measurementUnit)
      ),
      baseboardHeight: editData.baseboardHeight,
      wallPaintCoats: editData.wallPaintCoats,
      baseboardPaintCoats: editData.baseboardPaintCoats,
      chairRailHeight: editData.chairRailHeight,
      chairRailPaintCoats: editData.chairRailPaintCoats,
      crownMoldingHeight: editData.crownMoldingHeight,
      crownMoldingPaintCoats: editData.crownMoldingPaintCoats,
      wainscotingHeight: editData.wainscotingHeight,
      wainscotingPaintCoats: editData.wainscotingPaintCoats,
      roomHeight: editData.roomHeight,
      floorNumber: editData.floorNumber,
    });

    setIsEditMode(false);

    if (onRoomUpdate) {
      onRoomUpdate({
        roomId: roomId,
        roomName: editData.roomName,
        roomDescription: editData.roomDescription!,
        floorNumber: editData.floorNumber!,
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      area: roomData.area,
      wallPerimeter: roomData.wallPerimeter,
      roomHeight: roomData.roomHeight,
      baseboardPerimeter: roomData.baseboardPerimeter,
      roomName: roomName,
      roomDescription: roomDescription,
      floorNumber: floorNumber,
      baseboardHeight: roomData.baseboardHeight,
      wallPaintCoats: roomData.wallPaintCoats,
      baseboardPaintCoats: roomData.baseboardPaintCoats,
      chairRailPerimeter: roomData.chairRailPerimeter,
      chairRailHeight: roomData.chairRailHeight,
      chairRailPaintCoats: roomData.chairRailPaintCoats,
      crownMoldingPerimeter: roomData.crownMoldingPerimeter,
      crownMoldingHeight: roomData.crownMoldingHeight,
      crownMoldingPaintCoats: roomData.crownMoldingPaintCoats,
      wainscotingPerimeter: roomData.wainscotingPerimeter,
      wainscotingHeight: roomData.wainscotingHeight,
      wainscotingPaintCoats: roomData.wainscotingPaintCoats,
    });
    setIsEditMode(false);
  };

  const handleInputChange =
    (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditData({
        ...editData,
        [field]: event.target.value,
      });
    };

  const handleFloorChange = (event: SelectChangeEvent<number>) => {
    setEditData({
      ...editData,
      floorNumber: event.target.value as number,
    });
  };

  // Use edit data values when in edit mode, otherwise use props
  const displayRoomName = isEditMode ? editData.roomName : roomName;
  const displayRoomDescription = isEditMode
    ? editData.roomDescription
    : roomDescription;
  const displayFloorNumber = isEditMode ? editData.floorNumber : floorNumber;

  return (
    <Card elevation={2} sx={{ mb: 2 }}>
      <CardContent>
        {/* Room Header Section */}
        {isEditMode ? (
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                label="Room Name"
                value={editData.roomName}
                onChange={handleInputChange("roomName")}
                size="small"
                placeholder="e.g., Living Room, Master Bedroom"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Floor Number</InputLabel>
                <Select
                  value={editData.floorNumber}
                  label="Floor Number"
                  onChange={handleFloorChange}
                >
                  {floorOptions.map((floor) => (
                    <MenuItem key={floor} value={floor}>
                      Floor {floor}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Room Description"
                value={editData.roomDescription}
                onChange={handleInputChange("roomDescription")}
                size="small"
                multiline
                rows={2}
                placeholder="Describe the room (e.g., Spacious living area with high ceilings)"
              />
            </Grid>
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {displayRoomName}
                </Typography>
                <IconButton
                  onClick={handleEditClick}
                  color="primary"
                  aria-label="edit room"
                  sx={{ mb: 0.7, display: "inline-flex" }}
                >
                  <EditIcon />
                </IconButton>
              </Box>

              <Typography variant="body2" color="text.secondary" gutterBottom>
                {displayRoomDescription}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Floor: {displayFloorNumber} | Room ID: {roomId}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <RoomDimensions
          roomId={roomId}
          measurementUnit={measurementUnit}
          isEditMode={isEditMode}
          roomData={roomData}
          editData={editData}
          setEditData={setEditData}
          setRoomData={setRoomData}
        />

        <Divider sx={{ my: 2 }} />

        <RoomFeatures
          roomId={roomId}
          measurementUnit={measurementUnit}
          roomData={roomData}
          setRoomData={setRoomData}
        />
      </CardContent>

      {isEditMode && (
        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            onClick={handleCancel}
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            color="primary"
          >
            Save Changes
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default Room;
