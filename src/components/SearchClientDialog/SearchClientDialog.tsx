"use client";

import React from "react";
import { Dialog, DialogContent } from "@mui/material";
import SearchClient from "../SearchClient";

interface Props {
  isOpen: boolean;
  isEditMode?: boolean;
  onClose: () => void;
}

const SearchClientDialog = ({ isOpen, onClose }: Props) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <SearchClient />
    </Dialog>
  );
};

export default SearchClientDialog;
