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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person2Outlined,
  PersonPinCircleOutlined,
  ExpandMore as ExpandMoreIcon,
  PhotoLibrary as PhotoLibraryIcon,
} from "@mui/icons-material";
import { Customer } from "@/interfaces/laborTypes";
import { usa_states } from "@/constants";
import { ImageUpload } from "@/components";

interface Props {
  currentCustomer: Customer;
  onCustomerUpdate: (customer: Customer) => void;
}

const CustomerInfoCard = ({ currentCustomer, onCustomerUpdate }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<Customer>({ ...currentCustomer });
  const [customerImages, setCustomerImages] = useState<any[]>([]);

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

  const handleImagesChange = (images: any[]) => {
    setCustomerImages(images);
    // You can also save this to the customer object if needed
    // setEditData({
    //   ...editData,
    //   images: images.map(img => img.url) // or however you want to store them
    // });
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
          <Box>
            {/* Customer Information Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
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
            </Box>

            {/* Image Upload Section */}
            <ImageUpload
              onImagesChange={handleImagesChange}
              maxFiles={5}
              maxSizeInMB={10}
              label="Upload Project Images"
              helperText="Add photos of the project area, reference images, or color samples"
              acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
            />
          </Box>
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

            {/* Display uploaded images when not editing */}
            {customerImages.length > 0 && (
              <Box sx={{ mt: 2 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <PhotoLibraryIcon color="primary" fontSize="small" />
                  <Typography variant="subtitle2">
                    Project Images ({customerImages.length})
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                    flexWrap: "wrap",
                    maxHeight: 120,
                    overflow: "auto",
                  }}
                >
                  {customerImages.map((image) => (
                    <Box
                      key={image.id}
                      component="img"
                      src={image.url}
                      alt={image.name}
                      sx={{
                        width: 60,
                        height: 60,
                        objectFit: "cover",
                        borderRadius: 1,
                        border: "1px solid",
                        borderColor: "grey.300",
                        cursor: "pointer",
                        "&:hover": {
                          opacity: 0.8,
                        },
                      }}
                      title={image.name}
                    />
                  ))}
                </Box>
              </Box>
            )}
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
