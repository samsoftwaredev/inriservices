"use client";

import { useState } from "react";
import { uuidv4, generateSampleInvoice } from "@/tools";
import AddFeatureForm from "../ProInteriorEstimate/AddFeatureForm";
import { RoomProvider } from "@/context/RoomContext";
import { Button, Box, Typography, Paper, Divider, Grid } from "@mui/material";
import FeaturesList from "../ProInteriorEstimate/FeaturesList";
import { InvoiceGenerator } from "../InvoiceGenerator";
import CustomerSelectionMenu from "../ProInteriorEstimate/CustomerSelectionMenu";
import RoomGeneralInfo from "./RoomGeneralInfo";
import { useClient } from "@/context/ClientContext";
import { Person as PersonIcon } from "@mui/icons-material";

const GeneralEstimate = () => {
  const { currentClient } = useClient();
  const measurementUnit: "ft" | "m" = "ft";

  const [rooms, setRooms] = useState([
    {
      id: uuidv4(),
      name: "Living Room",
      description: "A cozy living room",
      floorNumber: 1,
    },
  ]);

  const addNewRoom = () => {
    const newRoom = {
      id: uuidv4(),
      name: `Room ${rooms.length + 1}`,
      description: "",
      floorNumber: 1,
    };
    setRooms([...rooms, newRoom]);
    //     propertyRoomApi.createRoom({
    // property_id: string;
    //     project_id: string | null;
    //     level: number;
    //     sort_order: number;
    //     name: string;
    //     ceiling_area_sqft: number | null;
    //     ceiling_height_ft: number | null;
    //     company_id: string;
    //     description: string | null;
    //     floor_area_sqft: number | null;
    //     notes_customer: string | null;
    //     notes_internal: string | null;
    //     openings_area_sqft: number | null;
    //     paint_ceiling: boolean;
    //     paint_doors: boolean;
    //     paint_trim: boolean;
    //     paint_walls: boolean;
    //     room_height_ft: number | null;
    //     wall_area_sqft: number | null;
    //     wall_perimeter_ft: number | null;
    //     });
  };

  const openLaborDialog = (featureType: string, featureId: string) => {
    // todo
  };

  // todo
  // pick customer first
  // upload pictures of the property
  // describe the work needed
  // customer input details and notes
  // generate PDF estimate report
  return (
    <>
      <CustomerSelectionMenu
        title={"General Estimate"}
        subtitle={"Select a customer for this estimate"}
        onCreateNewCustomer={() => {}}
        onCreateNewLocation={() => {}}
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        {currentClient ? (
          <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Name
              </Typography>
              <Typography variant="body1">{currentClient.fullName}</Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">{currentClient.email}</Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Phone
              </Typography>
              <Typography variant="body1">{currentClient.phone}</Typography>
            </Grid>
            <Grid size={{ md: 6, xs: 12 }}>
              <Typography variant="body2" color="text.secondary">
                Address
              </Typography>
              <Typography variant="body1">
                {currentClient?.buildings[0].address}{" "}
                {currentClient?.buildings[0].address2}
                <br />
                {currentClient?.buildings[0].city},{" "}
                {currentClient?.buildings[0].state}{" "}
                {currentClient?.buildings[0].zipCode}
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <Grid size={{ xs: 12 }}>
            <Box sx={{ textAlign: "center", py: 8 }}>
              <PersonIcon
                sx={{ fontSize: 64, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h6" color="text.secondary">
                Select Client
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Start by adding your first client to track projects and revenue.
              </Typography>
            </Box>
          </Grid>
        )}
      </Paper>

      {rooms.map((room, index) => (
        <RoomProvider
          key={room.id}
          roomId={room.id}
          roomName={room.name}
          roomDescription={room.description}
          measurementUnit={measurementUnit}
          floorNumber={room.floorNumber}
        >
          <Paper sx={{ p: 2, mb: 2 }}>
            <RoomGeneralInfo room={room} index={index} />
            <AddFeatureForm roomId={room.id} />
            <FeaturesList onOpenLaborDialog={openLaborDialog} />
          </Paper>
        </RoomProvider>
      ))}

      <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          onClick={addNewRoom}
          sx={{ mr: 2, width: { md: 250, xs: "100%" } }}
        >
          Add Room
        </Button>
      </Box>

      {/* Estimate Summary */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Estimate Summary
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Total Rooms: {rooms.length}
        </Typography>
        <Typography variant="h6" color="primary">
          Estimated Total: ${rooms.length * 450 + (rooms.length - 1) * 50}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          *Tax not included. Final pricing may vary based on specific
          requirements.
        </Typography>
      </Paper>

      <Box sx={{ mb: 3 }} display="flex" justifyContent="center">
        {/* Invoice Generator Demo */}
        <InvoiceGenerator
          invoiceData={generateSampleInvoice()}
          buttonText="Download Invoice PDF"
          variant="outlined"
        />
      </Box>
    </>
  );
};

export default GeneralEstimate;
