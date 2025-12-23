"use client";

import React from "react";
import { Box, Typography, Divider, Button, IconButton } from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  HomeRepairServiceOutlined,
} from "@mui/icons-material";

import CustomerHeader from "@/components/CustomerHeader";
import CustomerSelectionMenu from "../CustomerSelectionMenu";
import ProjectSettings from "../ProjectSettings";
import Room from "../Room";
import { LocationData } from "@/interfaces/laborTypes";
import { theme } from "@/app/theme";
import { useCustomer } from "@/context/CustomerContext";
import { RoomProvider } from "@/context/RoomContext";
import { useProjectCost } from "@/context";

interface Props {
  buildingData?: LocationData;
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  onAddNewSection: () => void;
  onDeleteSectionClick: (sectionId: string, sectionName: string) => void;
  onRoomUpdate: (updates: {
    roomId: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => void;
}

const MainContent = ({
  buildingData,
  anchorEl,
  setAnchorEl,
  onAddNewSection,
  onDeleteSectionClick,
  onRoomUpdate,
}: Props) => {
  const { updateProjectCost } = useProjectCost();
  const { previousCustomers, currentCustomer, setCurrentCustomer } =
    useCustomer();

  const newCustomer = () => {
    setCurrentCustomer(undefined);
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <Box component="main" my={2}>
      <CustomerHeader
        headerName="Edit Estimate"
        headerDescription="Fill in the details to generate a professional quote"
      >
        <IconButton
          color="primary"
          onClick={handleClick}
          sx={{
            background: theme.palette.gradient.subtle,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <AddIcon />
        </IconButton>
      </CustomerHeader>

      <CustomerSelectionMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        previousCustomers={previousCustomers}
        onCreateNewCustomer={newCustomer}
        onCreateNewLocation={() => {}}
      />

      <ProjectSettings currentCustomer={currentCustomer} />

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

      {buildingData === undefined || buildingData.sections.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No sections added yet.
        </Typography>
      ) : null}

      {buildingData?.sections.map((section) => (
        <Box key={section.id} sx={{ mb: 2, position: "relative" }}>
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
              onClick={() => onDeleteSectionClick(section.id, section.name)}
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
            roomId={section.id}
            roomName={section.name}
            roomDescription={section.description}
            measurementUnit={buildingData.measurementUnit}
            floorNumber={section.floorNumber}
            updateProjectCost={updateProjectCost}
          >
            <Room onRoomUpdate={onRoomUpdate} />
          </RoomProvider>
        </Box>
      ))}

      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={onAddNewSection}
        fullWidth
        sx={{
          background: theme.palette.gradient.subtle,
        }}
      >
        Add Room
      </Button>

      {/* <CustomerExpectations baseCost={baseCost} onCostChange={onCostChange} /> */}
    </Box>
  );
};

export default MainContent;
