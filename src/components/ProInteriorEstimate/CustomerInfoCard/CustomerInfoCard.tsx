"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Box,
  Typography,
  IconButton,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  SelectChangeEvent,
  InputLabel,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Customer } from "@/interfaces/laborTypes";
import { usa_states } from "@/constants";
import { Person2Outlined, PersonPinCircleOutlined } from "@mui/icons-material";

interface Props {
  currentCustomer: Customer;
  onCustomerUpdate: (customer: Customer) => void;
}

const CustomerInfoCard = ({ currentCustomer, onCustomerUpdate }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Customer>({ ...currentCustomer });

  const handleEditClick = () => {
    setEditData({ ...currentCustomer });
    setEditMode(true);
  };

  const handleStateChange = (event: SelectChangeEvent<string>) => {
    setEditData({
      ...editData,
      state: event.target.value,
    });
  };

  const handleInputChange =
    (field: keyof Customer) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setEditData({
        ...editData,
        [field]: event.target.value,
      });
    };

  const handleSave = () => {
    onCustomerUpdate(editData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditData({ ...currentCustomer });
    setEditMode(false);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {editMode ? (
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Customer Name"
                value={editData.name}
                onChange={handleInputChange("name")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Point of Contact"
                value={editData.contact}
                onChange={handleInputChange("contact")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={editData.phone}
                onChange={handleInputChange("phone")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Email"
                value={editData.email}
                onChange={handleInputChange("email")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Address"
                value={editData.address}
                onChange={handleInputChange("address")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="City"
                value={editData.city}
                onChange={handleInputChange("city")}
                size="small"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Select
                labelId="state-select-label"
                id="state-select"
                fullWidth
                label="State"
                value={editData.state}
                size="small"
                onChange={handleStateChange}
              >
                {usa_states.map((state) => (
                  <MenuItem key={state.value} value={state.value}>
                    {state.value} - {state.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                label="ZIP Code"
                value={editData.zipCode}
                onChange={handleInputChange("zipCode")}
                size="small"
              />
            </Grid>
          </Grid>
        ) : (
          <Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                mb: 1,
              }}
            >
              <Person2Outlined fontSize="large" />
              <Typography variant="h6">Customer Information</Typography>
              <IconButton
                size="small"
                color="primary"
                onClick={handleEditClick}
                sx={{ ml: 1 }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>

            <Divider sx={{ mb: 1 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Client:</strong> {currentCustomer.name}
                </Typography>
                <Typography variant="body1">
                  <strong>Contact:</strong> {currentCustomer.contact}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Phone:</strong> {currentCustomer.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {currentCustomer.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  <strong>Address:</strong> {currentCustomer.address},{" "}
                  {currentCustomer.city}, {currentCustomer.state}{" "}
                  {currentCustomer.zipCode}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </CardContent>

      {editMode && (
        <CardActions sx={{ justifyContent: "flex-end" }}>
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
            disabled={!editData.name || !editData.contact || !editData.phone}
          >
            Save Changes
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default CustomerInfoCard;
