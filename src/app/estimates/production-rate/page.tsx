"use client";

import React, { useState } from "react";
import { Box, Container, Typography, Tabs, Tab, Paper } from "@mui/material";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import TaskDefinitionManager from "@/components/ProductionRate/TaskDefinitionManager";
import JobDataTracker from "@/components/ProductionRate/JobDataTracker";
import RateCalculator from "@/components/ProductionRate/RateCalculator";
import DifficultyModifiers from "@/components/ProductionRate/DifficultyModifiers";
import ProductionEstimator from "@/components/ProductionRate/ProductionEstimator";
import BeginnerRates from "@/components/ProductionRate/BeginnerRates";

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
      id={`production-rate-tabpanel-${index}`}
      aria-labelledby={`production-rate-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const ProductionRate = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <ProtectedRoute>
      <AppLayout>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              fontWeight={700}
            >
              Production Rate System
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Build accurate estimates based on real production data, not
              guesses.
            </Typography>
          </Box>

          <Paper sx={{ width: "100%" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": {
                  fontWeight: 600,
                  textTransform: "none",
                  fontSize: "1rem",
                },
              }}
            >
              <Tab label="📊 Beginner Rates" />
              <Tab label="🧩 Define Tasks" />
              <Tab label="📝 Job Data Tracker" />
              <Tab label="⏱️ Rate Calculator" />
              <Tab label="⚙️ Difficulty Modifiers" />
              <Tab label="💰 Estimator" />
            </Tabs>

            <TabPanel value={activeTab} index={0}>
              <BeginnerRates />
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
              <TaskDefinitionManager />
            </TabPanel>

            <TabPanel value={activeTab} index={2}>
              <JobDataTracker />
            </TabPanel>

            <TabPanel value={activeTab} index={3}>
              <RateCalculator />
            </TabPanel>

            <TabPanel value={activeTab} index={4}>
              <DifficultyModifiers />
            </TabPanel>

            <TabPanel value={activeTab} index={5}>
              <ProductionEstimator />
            </TabPanel>
          </Paper>
        </Container>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ProductionRate;
