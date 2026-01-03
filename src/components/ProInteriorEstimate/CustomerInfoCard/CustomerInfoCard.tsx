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
  Divider,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person2Outlined,
  PhotoLibrary as PhotoLibraryIcon,
} from "@mui/icons-material";
import { ClientData } from "@/interfaces/laborTypes";
import { ImageUpload } from "@/components";

interface Props {
  currentClient: ClientData;
  onCustomerUpdate: (customer: ClientData) => void;
}

const CustomerInfoCard = ({ currentClient, onCustomerUpdate }: Props) => {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<ClientData>({ ...currentClient });
  const [customerImages, setCustomerImages] = useState<any[]>([]);

  const handleEditClick = () => {
    setEditData({ ...currentClient });
    setEditMode(true);
  };

  const handleInputChange =
    (field: keyof ClientData) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
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
    setEditData({ ...currentClient });
    setEditMode(false);
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {editMode ? (
          <Box>
            {/* Client Information Form */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Client Information
              </Typography>

              {/* Image Upload Section */}
              <Box sx={{ mb: 2 }}>
                <ImageUpload
                  onImagesChange={handleImagesChange}
                  maxFiles={5}
                  maxSizeInMB={10}
                  label="Upload Project Images"
                  helperText="Add photos of the project area, reference images, or color samples"
                  acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Client Name"
                    value={editData.fullName}
                    onChange={handleInputChange("fullName")}
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
              </Grid>
            </Box>
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
                  <strong>Client:</strong> {currentClient.fullName}
                </Typography>
                <Typography variant="body1">
                  <strong>Contact:</strong> {currentClient.contact}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="body1">
                  <strong>Phone:</strong> {currentClient.phone}
                </Typography>
                <Typography variant="body1">
                  <strong>Email:</strong> {currentClient.email}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Typography variant="body1">
                  <strong>Address:</strong>{" "}
                  {currentClient.buildings?.[0].address},{" "}
                  {currentClient.buildings?.[0].city},{" "}
                  {currentClient.buildings?.[0].state}{" "}
                  {currentClient.buildings?.[0].zipCode}
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
            disabled={
              !editData.fullName || !editData.contact || !editData.phone
            }
          >
            Save Changes
          </Button>
        </CardActions>
      )}
    </Card>
  );
};

export default CustomerInfoCard;
