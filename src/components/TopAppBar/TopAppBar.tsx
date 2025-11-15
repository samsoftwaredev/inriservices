"use client";

import React from "react";
import {
  Box,
  Typography,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";
import { Customer } from "../../interfaces/laborTypes";

interface Props {
  drawerWidth: number;
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onNavigation: (path: string) => void;
  onLogoClick: () => void;
  currentCustomer: Customer;
}

const NavigationDrawer = ({
  drawerWidth,
  mobileOpen,
  onDrawerToggle,
  onNavigation,
  onLogoClick,
  currentCustomer,
}: Props) => {
  const navigationItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "Clients",
      icon: <PeopleIcon />,
      path: "/clients",
    },
    {
      text: "New Estimate",
      icon: <AssessmentIcon />,
      path: "/estimates",
    },
  ];

  const drawerContent = (
    <Box>
      {/* Company Logo */}
      <Box
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          borderBottom: "1px solid",
          borderColor: "divider",
          "&:hover": {
            bgcolor: "action.hover",
          },
        }}
        onClick={onLogoClick}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mr: 2,
          }}
        >
          <Typography variant="h6" color="white" fontWeight="bold">
            INRI
          </Typography>
        </Box>
        <Box>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            INRI Estimator
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Estimation Software
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <List sx={{ pt: 2 }}>
        {navigationItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => onNavigation(item.path)}
              sx={{
                mx: 1,
                borderRadius: 1,
                "&:hover": {
                  bgcolor: "primary.50",
                },
              }}
            >
              <ListItemIcon sx={{ color: "primary.main" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: "medium",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2, mx: 2 }} />

      {/* Additional Info Section */}
      <Box sx={{ p: 2 }}>
        <Typography variant="caption" color="text.secondary" gutterBottom>
          Current Project
        </Typography>
        <Typography variant="body2" fontWeight="medium">
          Interior Estimate
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {currentCustomer.name}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            borderRight: "1px solid",
            borderColor: "divider",
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default NavigationDrawer;
