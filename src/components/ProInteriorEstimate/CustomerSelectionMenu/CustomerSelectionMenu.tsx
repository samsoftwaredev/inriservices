"use client";

import React from "react";
import { Menu, MenuItem, ListItemIcon, ListItemText } from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Customer } from "@/interfaces/laborTypes";

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  previousCustomers: Customer[];
  onCreateNewCustomer: () => void;
  onCreateNewLocation: () => void;
}

const CustomerSelectionMenu = ({
  anchorEl,
  onClose,
  onCreateNewCustomer,
  onCreateNewLocation,
}: Props) => {
  const handleCreateLocation = () => {
    onCreateNewLocation();
    onClose();
  };

  const handleCreateNew = () => {
    onCreateNewCustomer();
    onClose();
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
    >
      <MenuItem onClick={handleCreateNew}>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Create New Customer" />
      </MenuItem>
      <MenuItem onClick={handleCreateLocation}>
        <ListItemIcon>
          <AddBusinessIcon />
        </ListItemIcon>
        <ListItemText primary="Create New Location" />
      </MenuItem>
    </Menu>
  );
};

export default CustomerSelectionMenu;
