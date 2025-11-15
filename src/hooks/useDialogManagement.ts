import { useState } from "react";

interface DeleteConfirmationState {
  open: boolean;
  sectionId: string | null;
  sectionName: string | null;
}

export const useDialogManagement = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [newCustomerDialogOpen, setNewCustomerDialogOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmationState>({
      open: false,
      sectionId: null,
      sectionName: null,
    });

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

  const closeNewCustomerDialog = () => {
    setNewCustomerDialogOpen(false);
  };

  const openNewCustomerDialog = () => {
    setNewCustomerDialogOpen(true);
    setAnchorEl(null);
  };

  const closeCustomerMenu = () => {
    setAnchorEl(null);
  };

  return {
    // State
    anchorEl,
    setAnchorEl,
    newCustomerDialogOpen,
    setNewCustomerDialogOpen,
    deleteConfirmation,
    setDeleteConfirmation,

    // Handlers
    handleDeleteSectionClick,
    handleDeleteCancel,
    closeNewCustomerDialog,
    openNewCustomerDialog,
    closeCustomerMenu,
  };
};
