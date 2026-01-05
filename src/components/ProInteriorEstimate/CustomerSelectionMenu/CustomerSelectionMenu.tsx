"use client";

import React, { useState } from "react";
import {
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import EditDocumentIcon from "@mui/icons-material/EditDocument";
import MoneyIcon from "@mui/icons-material/Money";
import NewClientDialog from "@/components/NewClientDialog/NewClientDialog";
import { Add as AddIcon, Person as PersonIcon } from "@mui/icons-material";
import CustomerHeader from "@/components/CustomerHeader";
import { theme } from "@/app/theme";
import SearchClientDialog from "@/components/SearchClientDialog";
import { ClientFormData } from "@/components/SearchClient/SearchClient.model";

interface Props {
  title?: string;
  subtitle?: string;
  isNewClient?: boolean;
  onCreateNewCustomer: (data: ClientFormData) => void;
  onCreateNewLocation: () => void;
}

const CustomerSelectionMenu = ({
  onCreateNewCustomer,
  onCreateNewLocation,
  title,
  subtitle,
  isNewClient = true,
}: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isOpenNewClientDialog, setIsOpenNewClientDialog] = useState(false);
  const [isOpenSearchClientDialog, setIsOpenSearchClientDialog] =
    useState(false);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onClose = () => {
    setAnchorEl(null);
  };

  const onCloseNewClientDialog = () => {
    setIsOpenNewClientDialog(false);
  };

  const handleCreateLocation = () => {
    onCreateNewLocation();
    onClose();
  };

  const handleCreateNew = () => {
    setIsOpenNewClientDialog(true);
    onClose();
  };

  const handleSearchClick = () => {
    setIsOpenSearchClientDialog(true);
    onClose();
  };

  const onCloseSearchClientDialog = () => {
    setIsOpenSearchClientDialog(false);
  };

  return (
    <>
      <CustomerHeader
        headerName={title || (isNewClient ? "New Estimate" : "Edit Estimate")}
        headerDescription={
          subtitle || "Fill in the details to generate a professional quote"
        }
      >
        <IconButton
          color="primary"
          onClick={handleClick}
          sx={{
            background: theme.palette.gradient.subtle,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <AddIcon />
        </IconButton>
        {/* client search */}
        <Button
          startIcon={<PersonIcon />}
          color="secondary"
          onClick={handleSearchClick}
          sx={{
            mx: 0.5,
            bgcolor: "primary.main",
            color: "white",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Select Client
        </Button>
      </CustomerHeader>
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
          <Divider />
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText primary="New Client" />
        </MenuItem>
        <MenuItem onClick={handleCreateLocation}>
          <ListItemIcon>
            <AddBusinessIcon />
          </ListItemIcon>
          <ListItemText primary="New Location" />
        </MenuItem>
        <MenuItem onClick={handleCreateLocation}>
          <ListItemIcon>
            <EditDocumentIcon />
          </ListItemIcon>
          <ListItemText primary="New Contract" />
        </MenuItem>
        <MenuItem onClick={handleCreateLocation}>
          <ListItemIcon>
            <MoneyIcon />
          </ListItemIcon>
          <ListItemText primary="New Estimate" />
        </MenuItem>
      </Menu>
      <NewClientDialog
        onClose={onCloseNewClientDialog}
        isOpen={isOpenNewClientDialog}
        onSubmit={onCreateNewCustomer}
      />
      <SearchClientDialog
        isOpen={isOpenSearchClientDialog}
        onClose={onCloseSearchClientDialog}
      />
    </>
  );
};

export default CustomerSelectionMenu;
