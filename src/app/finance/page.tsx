"use client";

import React, { useState } from "react";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import {
  Dashboard as DashboardIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
} from "@mui/icons-material";
import FinanceDashboard from "@/components/FinanceDashboard";
import LedgerTable from "@/components/LedgerTable";
import AccountsManager from "@/components/AccountsManager";
import VendorsManager from "@/components/VendorsManager";
import AssetsManager from "@/components/AssetsManager";
import AppLayout from "@/components/AppLayout/AppLayout";
import ProtectedRoute from "@/components/ProtectedRoute/ProtectedRoute";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Finance Module
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="finance tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              icon={<DashboardIcon />}
              iconPosition="start"
              label="Dashboard"
              id="finance-tab-0"
              aria-controls="finance-tabpanel-0"
            />
            <Tab
              icon={<ReceiptIcon />}
              iconPosition="start"
              label="Ledger"
              id="finance-tab-1"
              aria-controls="finance-tabpanel-1"
            />
            <Tab
              icon={<AccountBalanceIcon />}
              iconPosition="start"
              label="Accounts"
              id="finance-tab-2"
              aria-controls="finance-tabpanel-2"
            />
            <Tab
              icon={<PeopleIcon />}
              iconPosition="start"
              label="Vendors"
              id="finance-tab-3"
              aria-controls="finance-tabpanel-3"
            />
            <Tab
              icon={<InventoryIcon />}
              iconPosition="start"
              label="Assets"
              id="finance-tab-4"
              aria-controls="finance-tabpanel-4"
            />
          </Tabs>
        </Box>

        <TabPanel value={activeTab} index={0}>
          <FinanceDashboard />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <LedgerTable />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <AccountsManager />
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <VendorsManager />
        </TabPanel>

        <TabPanel value={activeTab} index={4}>
          <AssetsManager />
        </TabPanel>
      </AppLayout>
    </ProtectedRoute>
  );
}
