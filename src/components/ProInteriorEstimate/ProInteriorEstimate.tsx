"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import WarningIcon from "@mui/icons-material/Warning";

import CustomerHeader from "./CustomerHeader";
import CustomerInfoCard from "./CustomerInfoCard";
import CustomerSelectionMenu from "./CustomerSelectionMenu";
import NewCustomerDialog from "./NewCustomerDialog";
import ProjectSettings from "./ProjectSettings";
import Room from "./Room";
import { Customer, LocationData, Section } from "./laborTypes";
import CustomerExpectations from "./CustomerExpectations";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
  sectionName: string | null;
}

const ProInteriorEstimate = () => {
  // Sample previous customers data
  const [previousCustomers, setPreviousCustomers] = useState<Customer[]>([
    {
      id: "1",
      name: "John Doe",
      contact: "Jane Smith",
      phone: "(123) 456-7890",
      email: "jane.smith@example.com",
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
      zipCode: "12345",
    },
    {
      id: "2",
      name: "Alice Johnson",
      contact: "Bob Wilson",
      phone: "(555) 123-4567",
      email: "bob.wilson@email.com",
      address: "456 Oak Avenue",
      city: "Springfield",
      state: "TX",
      zipCode: "67890",
    },
    {
      id: "3",
      name: "Michael Brown",
      contact: "Sarah Brown",
      phone: "(333) 555-7777",
      email: "sarah.brown@gmail.com",
      address: "789 Pine Street",
      city: "Riverside",
      state: "FL",
      zipCode: "54321",
    },
  ]);

  const [currentCustomer, setCurrentCustomer] = useState<Customer>({
    id: "1",
    name: "John Doe",
    contact: "Jane Smith",
    phone: "(123) 456-7890",
    email: "jane.smith@example.com",
    address: "123 Main St",
    city: "Anytown",
    state: "CA",
    zipCode: "12345",
  });

  const [locationData, setLocationData] = useState<LocationData>({
    address: "123 Main St",
    city: "Garland",
    state: "TX",
    zipCode: "75040",
    measurementUnit: "ft",
    floorPlan: 1,
    sections: [
      {
        id: "1",
        name: "Living Room",
        description: "Spacious living area",
        floorNumber: 1,
      },
      {
        id: "2",
        name: "Kitchen",
        description: "Modern kitchen area",
        floorNumber: 1,
      },
    ],
  });

  // Menu and dialog states
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      sectionId: null,
      sectionName: null,
    });

  const handleSelectPreviousCustomer = (customer: Customer) => {
    setCurrentCustomer(customer);
    setLocationData({
      ...locationData,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zipCode: customer.zipCode,
    });
    setAnchorEl(null);
  };

  const handleSaveNewCustomer = (newCustomerData: Omit<Customer, "id">) => {
    const newCustomer: Customer = {
      ...newCustomerData,
      id: Date.now().toString(),
    };

    setCurrentCustomer(newCustomer);
    setPreviousCustomers([...previousCustomers, newCustomer]);
    setLocationData({
      ...locationData,
      address: newCustomer.address,
      city: newCustomer.city,
      state: newCustomer.state,
      zipCode: newCustomer.zipCode,
    });
  };

  const handleCustomerUpdate = (updatedCustomer: Customer) => {
    setCurrentCustomer(updatedCustomer);
    setPreviousCustomers(
      previousCustomers.map((customer) =>
        customer.id === updatedCustomer.id ? updatedCustomer : customer
      )
    );
    setLocationData({
      ...locationData,
      address: updatedCustomer.address,
      city: updatedCustomer.city,
      state: updatedCustomer.state,
      zipCode: updatedCustomer.zipCode,
    });
  };

  const addNewSection = () => {
    const newSection: Section = {
      id: Date.now().toString(),
      name: `Room ${locationData.sections.length + 1}`,
      description: "New room section",
      floorNumber: 1,
    };

    setLocationData({
      ...locationData,
      sections: [...locationData.sections, newSection],
    });
  };

  const handleDeleteSectionClick = (sectionId: string, sectionName: string) => {
    setDeleteConfirmation({
      open: true,
      sectionId,
      sectionName,
    });
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      open: false,
      sectionId: null,
      sectionName: null,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmation.sectionId) {
      setLocationData({
        ...locationData,
        sections: locationData.sections.filter(
          (section) => section.id !== deleteConfirmation.sectionId
        ),
      });
    }
    handleDeleteCancel();
  };

  const onRoomUpdate = (updates: {
    id: string;
    roomName: string;
    roomDescription: string;
    floorNumber: number;
  }) => {
    setLocationData((prevData) => {
      const updatedSections = prevData.sections.map((section) =>
        section.id === updates.id
          ? {
              ...section,
              name: updates.roomName,
              description: updates.roomDescription,
              floorNumber: updates.floorNumber,
            }
          : section
      );
      return {
        ...prevData,
        sections: updatedSections,
      };
    });
  };

  const [baseCost, setBaseCost] = useState(1000);

  const handleCostChange = (newBaseCost: number) => {
    // setBaseCost(newBaseCost);
  };

  return (
    <Box sx={{ p: 3 }}>
      <CustomerHeader
        locationData={locationData}
        onAddCustomerClick={setAnchorEl}
      />

      <CustomerInfoCard
        currentCustomer={currentCustomer}
        onCustomerUpdate={handleCustomerUpdate}
      />

      <CustomerSelectionMenu
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        previousCustomers={previousCustomers}
        onSelectCustomer={handleSelectPreviousCustomer}
        onCreateNewCustomer={() => setNewCustomerDialogOpen(true)}
      />

      <NewCustomerDialog
        open={newCustomerDialogOpen}
        onClose={() => setNewCustomerDialogOpen(false)}
        onSaveCustomer={handleSaveNewCustomer}
      />

      <Divider sx={{ my: 3 }} />

      <ProjectSettings
        locationData={locationData}
        setLocationData={setLocationData}
      />

      <Divider sx={{ my: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5">Work Sections</Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={addNewSection}
          sx={{ ml: 2 }}
        >
          Add Section
        </Button>
      </Box>

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
              onClick={() => handleDeleteSectionClick(section.id, section.name)}
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

      <CustomerExpectations
        baseCost={baseCost}
        onCostChange={handleCostChange}
      />

      {/* Delete Section Confirmation Dialog */}
      <Dialog
        open={deleteConfirmation.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-section-dialog-title"
        aria-describedby="delete-section-dialog-description"
      >
        <DialogTitle
          id="delete-section-dialog-title"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          <WarningIcon color="warning" />
          Confirm Section Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-section-dialog-description">
            Are you sure you want to delete the section "
            {deleteConfirmation.sectionName}"?
            <br />
            <br />
            <Typography component="span" variant="body2" color="error">
              This action cannot be undone. All room features, dimensions, labor
              tasks, and cost calculations for this section will be permanently
              removed.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
          >
            Delete Section
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProInteriorEstimate;
