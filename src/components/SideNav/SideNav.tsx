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
  MenuItem,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  PunchClock,
  DocumentScannerOutlined,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Person as PersonIcon } from "@mui/icons-material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { Customer } from "@/interfaces/laborTypes";
import Link from "next/link";
import { drawerWidth } from "@/constants";
import { useAuth } from "@/context";

interface Props {
  mobileOpen: boolean;
  onDrawerToggle: () => void;
  onNavigation: (path: string) => void;
  onLogoClick: () => void;
  currentCustomer?: Customer;
  previousCustomers: Customer[];
  onSelectPreviousCustomer: (customer: Customer) => void;
}

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
  {
    text: "Time Logs",
    icon: <PunchClock />,
    path: "/timelogs",
  },
  {
    text: "Generate Contracts",
    icon: <DocumentScannerOutlined />,
    path: "/contracts",
  },
  {
    text: "Money Tracker",
    icon: <AttachMoneyIcon />,
    path: "/money-tracker",
  },
];

const SideNav = ({
  mobileOpen,
  onDrawerToggle,
  onNavigation,
  onLogoClick,
  currentCustomer,
  previousCustomers,
  onSelectPreviousCustomer,
}: Props) => {
  const { logout } = useAuth();
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
          <Typography
            variant="h6"
            fontSize={15}
            color="white"
            fontWeight="bold"
          >
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
      {currentCustomer && (
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
      )}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ px: 2, mt: 2, display: "block" }}
      >
        Previous Customers
      </Typography>
      {previousCustomers.map((customer) => (
        <MenuItem
          key={customer.id}
          onClick={() => onSelectPreviousCustomer(customer)}
          sx={{ minWidth: 250 }}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <Link
            href={`/interior-estimate/${customer.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <ListItemText
              primary={customer.name}
              secondary={`${customer.contact} • ${customer.phone}`}
            />
          </Link>
        </MenuItem>
      ))}
      <Box sx={{ position: "absolute", bottom: 16, width: "100%" }}>
        <MenuItem onClick={logout} sx={{ minWidth: 250 }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ px: 2, mt: 2, display: "block" }}
        >
          © {new Date().getFullYear()} INRI Estimator
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

export default SideNav;
