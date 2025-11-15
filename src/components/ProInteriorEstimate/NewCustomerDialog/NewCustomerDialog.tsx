"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { Customer } from "../../../interfaces/laborTypes";

import { usa_states } from "@/constants";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaveCustomer: (customer: Omit<Customer, "id">) => void;
}

const NewCustomerDialog = ({ open, onClose, onSaveCustomer }: Props) => {
  const [customerData, setCustomerData] = useState<Omit<Customer, "id">>({
    name: "",
    contact: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const handleInputChange =
    (field: keyof typeof customerData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setCustomerData({
        ...customerData,
        [field]: event.target.value,
      });
    };

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    setCustomerData({
      ...customerData,
      state: event.target.value,
    });
  };

  const handleSave = () => {
    onSaveCustomer(customerData);
    handleClose();
  };

  const handleClose = () => {
    setCustomerData({
      name: "",
      contact: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
    });
    onClose();
  };

  const isFormValid =
    customerData.name && customerData.contact && customerData.phone;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Create New Customer</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Customer Name"
              value={customerData.name}
              onChange={handleInputChange("name")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Point of Contact"
              value={customerData.contact}
              onChange={handleInputChange("contact")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Phone Number"
              value={customerData.phone}
              onChange={handleInputChange("phone")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={customerData.email}
              onChange={handleInputChange("email")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Physical Address"
              value={customerData.address}
              onChange={handleInputChange("address")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="City"
              value={customerData.city}
              onChange={handleInputChange("city")}
              required
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <FormControl fullWidth required>
              <InputLabel id="current-customer-label">State</InputLabel>
              <Select
                labelId="current-customer-label"
                id="current-customer"
                value={customerData.state}
                onChange={handleStateChange}
              >
                {usa_states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.value} - {state.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="ZIP Code"
              value={customerData.zipCode}
              onChange={handleInputChange("zipCode")}
              required
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSave}
          variant="contained"
          disabled={!isFormValid}
        >
          Save Customer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewCustomerDialog;
