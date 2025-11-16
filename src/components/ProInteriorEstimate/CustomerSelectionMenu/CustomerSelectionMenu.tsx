"use client";

import React from "react";
import {
  Menu,
  MenuItem,
  Typography,
  Divider,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Customer } from "@/interfaces/laborTypes";
import { theme } from "@/app/theme";

interface Props {
  anchorEl: HTMLElement | null;
  onClose: () => void;
  previousCustomers: Customer[];
  onSelectCustomer: (customer: Customer) => void;
  onCreateNewCustomer: () => void;
}

const CustomerSelectionMenu = ({
  anchorEl,
  onClose,
  previousCustomers,
  onSelectCustomer,
  onCreateNewCustomer,
}: Props) => {
  const handleSelectCustomer = (customer: Customer) => {
    onSelectCustomer(customer);
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
      <Typography
        variant="subtitle2"
        sx={{ px: 2, py: 1, color: "text.secondary" }}
      >
        Previous Customers
      </Typography>
      {previousCustomers.map((customer) => (
        <MenuItem
          key={customer.id}
          onClick={() => handleSelectCustomer(customer)}
          sx={{ minWidth: 250 }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary={customer.name}
            secondary={`${customer.contact} • ${customer.phone}`}
          />
        </MenuItem>
      ))}
      <Divider />
      <MenuItem onClick={handleCreateNew}>
        <ListItemIcon>
          <PersonAddIcon />
        </ListItemIcon>
        <ListItemText primary="Create New Customer" />
      </MenuItem>
    </Menu>
  );
};

export default CustomerSelectionMenu;
