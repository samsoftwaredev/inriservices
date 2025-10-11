"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Button,
  Typography,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from "@mui/icons-material";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
  sectionName: string | null;
}

interface Props {
  deleteConfirmation: DeleteConfirmationState;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeleteSectionDialog = ({
  deleteConfirmation,
  onCancel,
  onConfirm,
}: Props) => {
  return (
    <Dialog
      open={deleteConfirmation.open}
      onClose={onCancel}
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
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          startIcon={<DeleteIcon />}
        >
          Delete Section
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteSectionDialog;
