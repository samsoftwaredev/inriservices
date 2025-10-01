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
import { RoomData, Props } from "../laborTypes";
import { floorOptions } from "../laborData";
import { calculateArea, calculateWallPerimeter } from "../laborCalc";

const Room = ({
  measurementUnit,
  floorNumber,
  id,
  roomName = "Room",
  roomDescription = "A standard room",
  onRoomUpdate,
}: Props) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [roomData, setRoomData] = useState<RoomData>({
    ceilingArea: "0x0",
    ceilingAreaCalculated: 0,
    wallPerimeter: "5 4",
    wallPerimeterCalculated: 0,
    roomHeight: 10,
    floorNumber: floorNumber,
    features: {
      walls: [],
      windows: [],
      doors: [],
      closets: [],
      crownMolding: [],
      chairRail: [],
      baseboard: [],
      wainscoting: [],
    },
  });

  const [editData, setEditData] = useState<{
    ceilingArea: string;
    wallPerimeter: string;
    roomHeight: number;
    roomName: string;
    roomDescription?: string;
    floorNumber?: number;
  }>({
    ceilingArea: roomData.ceilingArea,
    wallPerimeter: roomData.wallPerimeter,
    roomHeight: roomData.roomHeight,
    roomName: roomName,
    roomDescription: roomDescription,
    floorNumber: floorNumber,
  });

  const handleEditClick = () => {
    setEditData({
      ceilingArea: roomData.ceilingArea,
      wallPerimeter: roomData.wallPerimeter,
      roomHeight: roomData.roomHeight,
      roomName: roomName,
      roomDescription: roomDescription,
      floorNumber: floorNumber,
    });
    setIsEditMode(true);
  };

  const handleSave = () => {
    setRoomData({
      ...roomData,
      ceilingArea: editData.ceilingArea,
      wallPerimeter: editData.wallPerimeter,
      ceilingAreaCalculated: calculateArea(editData.ceilingArea),
      wallPerimeterCalculated: calculateWallPerimeter(
        editData.wallPerimeter,
        editData.roomHeight
      ),
      roomHeight: editData.roomHeight,
      floorNumber: editData.floorNumber,
    });

    setIsEditMode(false);

    if (onRoomUpdate) {
      onRoomUpdate({
        id: id,
        roomName: editData.roomName,
        roomDescription: editData.roomDescription!,
        floorNumber: editData.floorNumber!,
      });
    }
  };

  const handleCancel = () => {
    setEditData({
      ceilingArea: roomData.ceilingArea,
      wallPerimeter: roomData.wallPerimeter,
      roomHeight: roomData.roomHeight,
      roomName: roomName,
      roomDescription: roomDescription,
      floorNumber: floorNumber,
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
                Floor: {displayFloorNumber} | Room ID: {id}
              </Typography>
            </Box>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <RoomDimensions
          measurementUnit={measurementUnit}
          isEditMode={isEditMode}
          roomData={roomData}
          editData={editData}
          setEditData={setEditData}
          setRoomData={setRoomData}
        />

        <Divider sx={{ my: 2 }} />

        <RoomFeatures
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
