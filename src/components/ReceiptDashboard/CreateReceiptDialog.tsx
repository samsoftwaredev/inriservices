"use client";

import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CreateReceipt from "../CreateReceipt";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  onError: (error: string) => void;
}

const CreateReceiptDialog = ({ open, onClose }: Props) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogContent>
          <CreateReceipt onSuccess={handleClose} onCancel={handleClose} />
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
};

export default CreateReceiptDialog;
