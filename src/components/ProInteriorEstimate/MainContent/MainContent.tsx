"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  IconButton,
  Paper,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  HomeRepairServiceOutlined,
} from "@mui/icons-material";

import CustomerSelectionMenu from "../CustomerSelectionMenu";
import ClientForm from "../ClientForm";
import Room from "../Room";
import { theme } from "@/app/theme";
import { useClient } from "@/context/ClientContext";
import { RoomProvider } from "@/context/RoomContext";
import { useBuilding } from "@/context";
import DeleteSectionDialog from "../DeleteSectionDialog";
import { MeasurementUnit } from "@/interfaces/laborTypes";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";

const MainContent = () => {
  const {
    buildingData,
    deleteConfirmation,
    addNewRoom,
    handleDeleteSectionClick,
    handleDeleteCancel,
    handleDeleteConfirm,
    onRoomUpdate,
  } = useBuilding();
  const { currentClient } = useClient();

  const newCustomer = () => {};

  const defaultValues: ClientFormData | undefined =
    currentClient && buildingData
      ? {
          id: currentClient?.id,
          fullName: currentClient?.fullName,
          email: currentClient?.email,
          phone: currentClient?.phone,
          contact: currentClient?.contact,
          addressId: buildingData?.id,
          address: buildingData?.address,
          address2: buildingData?.address2,
          city: buildingData?.city,
          state: buildingData?.state,
          zipCode: buildingData?.zipCode,
          measurementUnit:
            buildingData?.measurementUnit || ("ft" as MeasurementUnit),
          floorPlan: buildingData?.floorPlan || 0,
          numberOfProjects: 0,
          totalRevenue: 0,
          lastProjectDate: "",
          status: "active",
        }
      : currentClient
      ? {
          id: currentClient?.id,
          fullName: currentClient?.fullName,
          email: currentClient?.email,
          phone: currentClient?.phone,
          contact: currentClient?.contact,
          addressId: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          zipCode: "",
          measurementUnit: "ft" as MeasurementUnit,
          floorPlan: 0,
          numberOfProjects: 0,
          totalRevenue: 0,
          lastProjectDate: "",
          status: "active",
        }
      : undefined;

  return (
    <Box component="main" my={2}>
      <CustomerSelectionMenu
        onCreateNewCustomer={newCustomer}
        onCreateNewLocation={() => {}}
      />

      <Paper elevation={2} sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        <ClientForm onSubmit={() => {}} defaultValues={defaultValues} />
      </Paper>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          mb: 2,
        }}
      >
        <HomeRepairServiceOutlined fontSize="large" />
        <Typography variant="h6">Rooms & Measurements</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {buildingData === undefined || buildingData.rooms.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No rooms added yet.
        </Typography>
      ) : null}

      {buildingData?.rooms.map((room) => (
        <Box key={room.id} sx={{ mb: 2, position: "relative" }}>
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <IconButton
              size="small"
              color="error"
              onClick={() => handleDeleteSectionClick(room.id, room.name)}
              sx={{
                bgcolor: "background.paper",
                boxShadow: 1,
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
              title="Delete Section"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>

          <RoomProvider
            roomId={room.id}
            roomName={room.name}
            roomDescription={room.description}
            measurementUnit={buildingData.measurementUnit}
            floorNumber={room.floorNumber}
          >
            <Room onRoomUpdate={onRoomUpdate} />
          </RoomProvider>
        </Box>
      ))}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addNewRoom}
        fullWidth
        sx={{
          background: theme.palette.gradient.subtle,
        }}
      >
        Add Room
      </Button>

      {/* <CustomerExpectations baseCost={baseCost} onCostChange={onCostChange} /> */}
      <DeleteSectionDialog
        deleteConfirmation={deleteConfirmation}
        onCancel={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </Box>
  );
};

export default MainContent;
