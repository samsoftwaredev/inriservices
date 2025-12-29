"use client";

import { useState } from "react";
import { uuidv4, generateSampleInvoice } from "@/tools";
import AddFeatureForm from "../ProInteriorEstimate/AddFeatureForm";
import { ProtectedRoute } from "../ProtectedRoute";
import { RoomProvider } from "@/context/RoomContext";
import { ProjectCostProvider } from "@/context";
import { Button, Input, Box, Typography, Paper, Divider } from "@mui/material";
import FeaturesList from "../ProInteriorEstimate/FeaturesList";
import { InvoiceGenerator } from "../InvoiceGenerator";

const GeneralEstimate = () => {
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
  };

  const openLaborDialog = (featureType: string, featureId: string) => {
    // todo
  };

  // todo
  // upload pictures of the property
  // describe the work needed
  // customer input details and notes
  // generate PDF estimate report
  return (
    <ProtectedRoute>
      <Typography variant="h4" gutterBottom>
        General Estimate
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={addNewRoom}
          sx={{ mr: 2 }}
        >
          Add Room
        </Button>

        {/* Invoice Generator Demo */}
        <InvoiceGenerator
          invoiceData={generateSampleInvoice()}
          buttonText="Download Invoice PDF"
          variant="outlined"
        />
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

      <Divider sx={{ mb: 3 }} />

      <ProjectCostProvider>
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
              <Typography variant="h6" gutterBottom>
                Room {index + 1}
              </Typography>
              <Input value={room.name} fullWidth sx={{ mb: 2 }} />
              <AddFeatureForm roomId={room.id} />
              <FeaturesList onOpenLaborDialog={openLaborDialog} />
            </Paper>
          </RoomProvider>
        ))}
      </ProjectCostProvider>
    </ProtectedRoute>
  );
};

export default GeneralEstimate;
