"use client";

import React, { useState, useRef, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Stack,
  Chip,
  Alert,
} from "@mui/material";
import { CloudUpload, Delete, PhotoCamera } from "@mui/icons-material";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ImageFile {
  id: string;
  file: File;
  url: string;
  name: string;
  size: number;
}

interface Props {
  onImagesChange?: (images: ImageFile[]) => void;
  maxFiles?: number;
  maxSizeInMB?: number;
  acceptedFormats?: string[];
  disabled?: boolean;
  label?: string;
  helperText?: string;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const DEFAULT_ACCEPTED_FORMATS = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

const DEFAULT_MAX_SIZE_MB = 5;
const DEFAULT_MAX_FILES = 3;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

const validateFile = (
  file: File,
  acceptedFormats: string[],
  maxSizeInMB: number
): string | null => {
  if (!acceptedFormats.includes(file.type)) {
    return `File type ${file.type} not supported`;
  }

  if (file.size > maxSizeInMB * 1024 * 1024) {
    return `File size exceeds ${maxSizeInMB}MB limit`;
  }

  return null;
};

const createImageFile = (file: File): ImageFile => ({
  id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
  file,
  url: URL.createObjectURL(file),
  name: file.name,
  size: file.size,
});

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ImageUpload = ({
  onImagesChange,
  maxFiles = DEFAULT_MAX_FILES,
  maxSizeInMB = DEFAULT_MAX_SIZE_MB,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  disabled = false,
  label = "Upload Images",
  helperText = "Drag & drop images here, or click to select files",
}: Props) => {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================

  const [images, setImages] = useState<ImageFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  const updateImages = useCallback(
    (newImages: ImageFile[]) => {
      setImages(newImages);
      onImagesChange?.(newImages);
    },
    [onImagesChange]
  );

  const handleFiles = useCallback(
    (fileList: FileList) => {
      setError(null);

      const files = Array.from(fileList);
      const validFiles: ImageFile[] = [];
      let errorMessage = "";

      // Check if we would exceed max files
      if (images.length + files.length > maxFiles) {
        errorMessage = `Maximum ${maxFiles} files allowed`;
        setError(errorMessage);
        return;
      }

      // Validate each file
      for (const file of files) {
        const validationError = validateFile(
          file,
          acceptedFormats,
          maxSizeInMB
        );

        if (validationError) {
          errorMessage = validationError;
          break;
        }

        validFiles.push(createImageFile(file));
      }

      if (errorMessage) {
        setError(errorMessage);
        return;
      }

      // Add valid files to existing images
      updateImages([...images, ...validFiles]);
    },
    [images, maxFiles, maxSizeInMB, acceptedFormats, updateImages]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragOver(false);

      if (disabled) return;

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [disabled, handleFiles]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFiles(files);
      }
      // Reset the input value to allow uploading the same file again
      e.target.value = "";
    },
    [handleFiles]
  );

  const handleRemoveImage = useCallback(
    (id: string) => {
      const updatedImages = images.filter((image) => {
        if (image.id === id) {
          // Clean up object URL to prevent memory leaks
          URL.revokeObjectURL(image.url);
          return false;
        }
        return true;
      });
      updateImages(updatedImages);
    },
    [images, updateImages]
  );

  const handleClearAll = useCallback(() => {
    // Clean up all object URLs
    images.forEach((image) => URL.revokeObjectURL(image.url));
    updateImages([]);
    setError(null);
  }, [images, updateImages]);

  // ============================================================================
  // CLEANUP EFFECT
  // ============================================================================

  React.useEffect(() => {
    return () => {
      // Clean up object URLs on unmount
      images.forEach((image) => URL.revokeObjectURL(image.url));
    };
  }, [images]);

  // ============================================================================
  // RENDER
  // ============================================================================

  const canAddMore = images.length < maxFiles;
  const acceptString = acceptedFormats.join(",");

  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="body2" fontWeight="medium" gutterBottom>
        {label}
      </Typography>

      {/* Upload Area */}
      <Paper
        sx={{
          border: "2px dashed",
          borderColor: error
            ? "error.main"
            : isDragOver
            ? "primary.main"
            : "grey.300",
          borderRadius: 2,
          p: 3,
          textAlign: "center",
          cursor: disabled || !canAddMore ? "not-allowed" : "pointer",
          bgcolor: disabled
            ? "grey.100"
            : isDragOver
            ? "primary.50"
            : "grey.50",
          transition: "all 0.3s ease",
          opacity: disabled ? 0.6 : 1,
          "&:hover": {
            borderColor: !disabled && canAddMore ? "primary.main" : undefined,
            bgcolor: !disabled && canAddMore ? "primary.50" : undefined,
          },
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptString}
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          disabled={disabled || !canAddMore}
        />

        <Stack spacing={2} alignItems="center">
          <CloudUpload
            sx={{
              fontSize: 48,
              color: error ? "error.main" : "primary.main",
            }}
          />

          <Box>
            <Typography variant="body1" fontWeight="medium" gutterBottom>
              {canAddMore ? helperText : `Maximum ${maxFiles} files reached`}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Supported formats:{" "}
              {acceptedFormats
                .map((format) => format.split("/")[1].toUpperCase())
                .join(", ")}
              {" • "}Max size: {maxSizeInMB}MB
            </Typography>
          </Box>

          {canAddMore && !disabled && (
            <Chip
              icon={<PhotoCamera />}
              label="Choose Files"
              variant="outlined"
              color="primary"
              size="small"
            />
          )}
        </Stack>
      </Paper>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2" fontWeight="medium">
              Uploaded Images ({images.length}/{maxFiles})
            </Typography>
            {images.length > 1 && (
              <IconButton size="small" onClick={handleClearAll} color="error">
                <Delete fontSize="small" />
              </IconButton>
            )}
          </Box>

          <Stack spacing={1}>
            {images.map((image) => (
              <Paper
                key={image.id}
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  border: "1px solid",
                  borderColor: "grey.200",
                }}
              >
                {/* Image Thumbnail */}
                <Box
                  component="img"
                  src={image.url}
                  alt={image.name}
                  sx={{
                    width: 48,
                    height: 48,
                    objectFit: "cover",
                    borderRadius: 1,
                    border: "1px solid",
                    borderColor: "grey.300",
                  }}
                />

                {/* File Info */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight="medium"
                    noWrap
                    title={image.name}
                  >
                    {image.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(image.size)}
                  </Typography>
                </Box>

                {/* Remove Button */}
                <IconButton
                  size="small"
                  onClick={() => handleRemoveImage(image.id)}
                  color="error"
                  sx={{ flexShrink: 0 }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Paper>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ImageUpload;
