"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import SearchClient from "../SearchClient";
import { Close } from "@mui/icons-material";

interface Props {
  isOpen: boolean;
  isEditMode?: boolean;
  onClose: () => void;
}

const SearchClientDialog = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Select Client
        {/* closeButton */}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <SearchClient onClientSelected={onClose} />
      </DialogContent>
    </Dialog>
  );
};

export default SearchClientDialog;
