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

import CustomerHeader from "@/components/CustomerHeader";
import CustomerInfoCard from "../CustomerInfoCard";
import CustomerSelectionMenu from "../CustomerSelectionMenu";
import NewCustomerDialog from "../NewCustomerDialog";
import ProjectSettings from "../ProjectSettings";
import Room from "../Room";
import CustomerExpectations from "../CustomerExpectations";
import { Customer, LocationData } from "../../../interfaces/laborTypes";
import { theme } from "@/app/theme";

interface Props {
  drawerWidth: number;
  locationData: LocationData;
  setLocationData: React.Dispatch<React.SetStateAction<LocationData>>;
  currentCustomer: Customer;
  previousCustomers: Customer[];
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  newCustomerDialogOpen: boolean;
  setNewCustomerDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSelectPreviousCustomer: (customer: Customer) => void;
  onSaveNewCustomer: (newCustomerData: Omit<Customer, "id">) => void;
  onCustomerUpdate: (updatedCustomer: Customer) => void;
  onAddNewSection: () => void;
  onDeleteSectionClick: (sectionId: string, sectionName: string) => void;
  onRoomUpdate: (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => void;
  baseCost: number;
  onCostChange: (newBaseCost: number) => void;
}

const MainContent = ({
  drawerWidth,
  locationData,
  setLocationData,
  currentCustomer,
  previousCustomers,
  anchorEl,
  setAnchorEl,
  newCustomerDialogOpen,
  setNewCustomerDialogOpen,
  onSelectPreviousCustomer,
  onSaveNewCustomer,
  onCustomerUpdate,
  onAddNewSection,
  onDeleteSectionClick,
  onRoomUpdate,
  baseCost,
  onCostChange,
}: Props) => {
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

      <CustomerInfoCard
        currentCustomer={currentCustomer}
        onCustomerUpdate={onCustomerUpdate}
      />

      <CustomerSelectionMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        previousCustomers={previousCustomers}
        onSelectCustomer={onSelectPreviousCustomer}
        onCreateNewCustomer={() => setNewCustomerDialogOpen(true)}
      />

      <NewCustomerDialog
        open={newCustomerDialogOpen}
        onClose={() => setNewCustomerDialogOpen(false)}
        onSaveCustomer={onSaveNewCustomer}
      />

      <ProjectSettings
        locationData={locationData}
        setLocationData={setLocationData}
      />

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
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

        {locationData.sections.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No sections added yet.
          </Typography>
        )}

        {locationData.sections.map((section) => (
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

            <Room
              onRoomUpdate={onRoomUpdate}
              roomName={section.name}
              roomDescription={section.description}
              measurementUnit={locationData.measurementUnit}
              floorNumber={section.floorNumber}
              id={section.id}
            />
          </Box>
        ))}

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddNewSection}
          fullWidth
          sx={{
            ml: 2,
            background: theme.palette.gradient.subtle,
          }}
        >
          Add Room
        </Button>
      </Paper>

      <CustomerExpectations baseCost={baseCost} onCostChange={onCostChange} />
    </Box>
  );
};

export default MainContent;
