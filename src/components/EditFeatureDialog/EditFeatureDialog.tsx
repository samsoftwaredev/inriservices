"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  Divider,
  Card,
  CardMedia,
  Stack,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  PhotoCamera as PhotoCameraIcon,
  Delete as DeleteIcon,
  Image as ImageIcon,
} from "@mui/icons-material";
import { RoomFeature, FeatureType } from "@/interfaces/laborTypes";
import { featureTypes } from "@/constants/laborData";
import { ImageUpload } from "@/components";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface Props {
  open: boolean;
  onClose: () => void;
  feature: RoomFeature | null;
  featureType: FeatureType;
  onSave: (updatedFeature: RoomFeature, newFeatureType: FeatureType) => void;
}

interface EditableFeature {
  id: string;
  type: string;
  dimensions: string;
  image: string;
  name?: string;
  description?: string;
  picture: string | null;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getDefaultFeatureImage = (featureType: FeatureType): string => {
  const imageMap: Record<FeatureType, string> = {
    doors: "/images/features/door-default.jpg",
    windows: "/images/features/window-default.jpg",
    outlets: "/images/features/outlet-default.jpg",
    switches: "/images/features/switch-default.jpg",
    fixtures: "/images/features/fixture-default.jpg",
    trim: "/images/features/trim-default.jpg",
    cabinetry: "/images/features/cabinetry-default.jpg",
    flooring: "/images/features/flooring-default.jpg",
    walls: "/images/features/walls-default.jpg",
    ceilings: "/images/features/ceiling-default.jpg",
    other: "/images/features/other-default.jpg",
    closets: "/images/features/closet-default.jpg",
    crownMolding: "/images/features/crown-molding-default.jpg",
    chairRail: "/images/features/chair-rail-default.jpg",
    baseboard: "/images/features/baseboard-default.jpg",
    wainscoting: "/images/features/wainscoting-default.jpg",
  };

  return imageMap[featureType] || "/images/features/default-feature.jpg";
};

const validateFeatureData = (feature: EditableFeature): string[] => {
  const errors: string[] = [];

  if (!feature.name?.trim()) {
    errors.push("Feature name is required");
  }

  if (!feature.type?.trim()) {
    errors.push("Feature type is required");
  }

  if (!feature.dimensions?.trim()) {
    errors.push("Dimensions are required");
  }

  return errors;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const EditFeatureDialog = ({
  open,
  onClose,
  feature,
  featureType,
  onSave,
}: Props) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [editableFeature, setEditableFeature] = useState<EditableFeature>({
    id: "",
    type: "",
    dimensions: "",
    image: "",
    name: "",
    description: "",
    picture: null,
  });

  const [selectedFeatureType, setSelectedFeatureType] =
    useState<FeatureType>(featureType);
  const [errors, setErrors] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [imageMode, setImageMode] = useState<"default" | "custom" | "upload">(
    "default"
  );

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    if (feature && open) {
      setEditableFeature({
        id: feature.id,
        type: feature.type,
        dimensions: feature.dimensions,
        image: feature.image,
        name: feature.name || "",
        description: feature.description || "",
        picture: feature.picture,
      });
      setSelectedFeatureType(featureType);
      setErrors([]);
      setUploadedImages([]);

      // Determine image mode
      if (
        feature.image &&
        feature.image !== getDefaultFeatureImage(featureType)
      ) {
        setImageMode("custom");
      } else {
        setImageMode("default");
      }
    }
  }, [feature, featureType, open]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const handleInputChange =
    (field: keyof EditableFeature) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setEditableFeature((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));

      // Clear errors when user starts typing
      if (errors.length > 0) {
        setErrors([]);
      }
    };

  const handleFeatureTypeChange = (event: any) => {
    const newFeatureType = event.target.value as FeatureType;
    setSelectedFeatureType(newFeatureType);

    // Update image if using default
    if (imageMode === "default") {
      setEditableFeature((prev) => ({
        ...prev,
        image: getDefaultFeatureImage(newFeatureType),
      }));
    }
  };

  const handleImageModeChange = (mode: "default" | "custom" | "upload") => {
    setImageMode(mode);

    if (mode === "default") {
      setEditableFeature((prev) => ({
        ...prev,
        image: getDefaultFeatureImage(selectedFeatureType),
        picture: null,
      }));
      setUploadedImages([]);
    } else if (mode === "upload") {
      // User will upload new image
      setUploadedImages([]);
    }
  };

  const handleImageUpload = (images: any[]) => {
    setUploadedImages(images);

    if (images.length > 0) {
      const uploadedImage = images[0];
      setEditableFeature((prev) => ({
        ...prev,
        image: uploadedImage.url,
        picture: uploadedImage.url,
      }));
    }
  };

  const handleCustomImageUrlChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const imageUrl = event.target.value;
    setEditableFeature((prev) => ({
      ...prev,
      image: imageUrl,
      picture: imageUrl || null,
    }));
  };

  const handleSave = () => {
    const validationErrors = validateFeatureData(editableFeature);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Create updated feature with all original properties preserved
    const updatedFeature: RoomFeature = {
      ...feature!, // Preserve original feature properties
      ...editableFeature, // Override with edited values
    };

    onSave(updatedFeature, selectedFeatureType);
    onClose();
  };

  const handleCancel = () => {
    setErrors([]);
    setUploadedImages([]);
    onClose();
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderImageSection = () => {
    const currentImageUrl =
      editableFeature.image || getDefaultFeatureImage(selectedFeatureType);

    return (
      <Box>
        <Typography variant="subtitle2" gutterBottom fontWeight="medium">
          Feature Image
        </Typography>

        {/* Current Image Preview */}
        <Card sx={{ mb: 2, maxWidth: 300 }}>
          <CardMedia
            component="img"
            height={160}
            image={currentImageUrl}
            alt="Feature preview"
            sx={{ objectFit: "cover" }}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getDefaultFeatureImage(selectedFeatureType);
            }}
          />
        </Card>

        {/* Image Mode Selection */}
        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
          <Button
            variant={imageMode === "default" ? "contained" : "outlined"}
            size="small"
            onClick={() => handleImageModeChange("default")}
          >
            Default
          </Button>
          <Button
            variant={imageMode === "custom" ? "contained" : "outlined"}
            size="small"
            onClick={() => handleImageModeChange("custom")}
          >
            Custom URL
          </Button>
          <Button
            variant={imageMode === "upload" ? "contained" : "outlined"}
            size="small"
            onClick={() => handleImageModeChange("upload")}
            startIcon={<PhotoCameraIcon />}
          >
            Upload
          </Button>
        </Stack>

        {/* Custom URL Input */}
        {imageMode === "custom" && (
          <TextField
            fullWidth
            size="small"
            label="Image URL"
            value={editableFeature.image}
            onChange={handleCustomImageUrlChange}
            placeholder="https://example.com/image.jpg"
            sx={{ mb: 2 }}
          />
        )}

        {/* Image Upload */}
        {imageMode === "upload" && (
          <Box sx={{ mb: 2 }}>
            <ImageUpload
              onImagesChange={handleImageUpload}
              maxFiles={1}
              maxSizeInMB={5}
              label="Upload Feature Image"
              helperText="Upload an image for this feature"
              acceptedFormats={["image/jpeg", "image/png", "image/webp"]}
            />
          </Box>
        )}
      </Box>
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  if (!feature) return null;

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { minHeight: "60vh" },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          bgcolor: "primary.50",
          color: "primary.main",
        }}
      >
        <EditIcon />
        <Typography variant="h6" component="span">
          Edit Feature
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Please fix the following errors:
            </Typography>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Feature Details */}
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" gutterBottom color="primary.main">
              Feature Details
            </Typography>

            <Grid container spacing={2}>
              {/* Feature Name */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Feature Name"
                  value={editableFeature.name}
                  onChange={handleInputChange("name")}
                  placeholder="e.g., Front Door, Living Room Window"
                  error={errors.some((error) => error.includes("name"))}
                />
              </Grid>

              {/* Feature Type */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Feature Type</InputLabel>
                  <Select
                    value={selectedFeatureType}
                    label="Feature Type"
                    onChange={handleFeatureTypeChange}
                  >
                    {featureTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Dimensions */}
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Dimensions"
                  value={editableFeature.dimensions}
                  onChange={handleInputChange("dimensions")}
                  placeholder="e.g., 3ft x 7ft, 24in x 36in"
                  error={errors.some((error) => error.includes("Dimensions"))}
                />
              </Grid>

              {/* Type (Internal) */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Internal Type"
                  value={editableFeature.type}
                  onChange={handleInputChange("type")}
                  placeholder="Internal type classification"
                  helperText="Used for internal categorization"
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  label="Description"
                  value={editableFeature.description}
                  onChange={handleInputChange("description")}
                  multiline
                  rows={3}
                  placeholder="Additional details about this feature..."
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Image Section */}
          <Grid size={{ xs: 12, md: 5 }}>
            <Divider sx={{ display: { xs: "block", md: "none" }, my: 2 }} />
            {renderImageSection()}
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3, bgcolor: "grey.50" }}>
        <Button
          onClick={handleCancel}
          variant="outlined"
          startIcon={<CancelIcon />}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={errors.length > 0}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditFeatureDialog;
