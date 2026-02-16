"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Tabs,
  Tab,
  Paper,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
  CircularProgress,
  Stack,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import RefreshIcon from "@mui/icons-material/Refresh";
import CalculateIcon from "@mui/icons-material/Calculate";
import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import { financialProfileApi } from "@/services/companyFinancialProfilesApi";
import { productionRateTemplateApi } from "@/services/productionRateTamplatesApi";
import { companyProductionRateApi } from "@/services/companyProductionRatesApi";
import {
  projectEstimateApi,
  estimateComputeApi,
} from "@/services/projectEstimatesApi";
import { projectApi } from "@/services/projectApi";
import {
  CompanyFinancialProfile,
  ProductionRateTemplate,
  CompanyProductionRate,
  ProjectEstimate,
  ProjectEstimateLine,
  Project,
  ServiceType,
  UnitType,
  EstimateStatus,
} from "@/types";
import { supabase } from "../supabaseConfig";

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatCurrency = (cents: number | null | undefined): string => {
  if (cents == null) return "$0.00";
  return `$${(cents / 100).toFixed(2)}`;
};

const formatPercent = (bps: number | null | undefined): string => {
  if (bps == null) return "0%";
  return `${(bps / 100).toFixed(2)}%`;
};

// ============================================
// TAB PANEL COMPONENT
// ============================================
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
      id={`gpp-tabpanel-${index}`}
      aria-labelledby={`gpp-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
const GPPAdmin = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  // ============================================
  // TAB 1: FINANCIAL PROFILE STATE
  // ============================================
  const [profile, setProfile] = useState<CompanyFinancialProfile | null>(null);
  const [profileForm, setProfileForm] = useState({
    annual_overhead_cents: 0,
    field_employee_count: 1,
    weeks_per_year: 48,
    hours_per_week: 40,
    avg_wage_cents: 2500,
    labor_burden_bps: 2000,
    target_profit_margin_bps: 2000,
    material_profit_margin_bps: 1500,
    currency: "USD",
  });

  // ============================================
  // TAB 2: PRODUCTION RATES STATE
  // ============================================
  const [templates, setTemplates] = useState<ProductionRateTemplate[]>([]);
  const [overrides, setOverrides] = useState<CompanyProductionRate[]>([]);
  const [templateFilters, setTemplateFilters] = useState<{
    service?: ServiceType;
    unit?: UnitType;
  }>({});
  const [overrideDialog, setOverrideDialog] = useState<{
    open: boolean;
    editing?: CompanyProductionRate | null;
  }>({ open: false, editing: null });
  const [overrideForm, setOverrideForm] = useState<{
    service: ServiceType;
    unit: UnitType;
    units_per_hour: number;
    notes: string;
  }>({
    service: "interior_paint",
    unit: "sqft_wall",
    units_per_hour: 100,
    notes: "",
  });

  // ============================================
  // TAB 3: PROJECT ESTIMATE STATE
  // ============================================
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [estimate, setEstimate] = useState<ProjectEstimate | null>(null);
  const [estimateLines, setEstimateLines] = useState<ProjectEstimateLine[]>([]);
  const [materialCostCents, setMaterialCostCents] = useState<number>(0);

  // ============================================
  // LOAD INITIAL DATA
  // ============================================
  useEffect(() => {
    loadFinancialProfile();
    loadProductionRates();
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      loadEstimate(selectedProjectId);
    }
  }, [selectedProjectId]);

  // ============================================
  // TAB 1: FINANCIAL PROFILE FUNCTIONS
  // ============================================
  const loadFinancialProfile = async () => {
    try {
      setLoading(true);
      const data = await financialProfileApi.get();
      if (data) {
        setProfile(data);
        setProfileForm({
          annual_overhead_cents: data.annual_overhead_cents ?? 0,
          field_employee_count: data.field_employee_count ?? 1,
          weeks_per_year: data.weeks_per_year ?? 48,
          hours_per_week: data.hours_per_week ?? 40,
          avg_wage_cents: data.avg_wage_cents ?? 2500,
          labor_burden_bps: data.labor_burden_bps ?? 2000,
          target_profit_margin_bps: data.target_profit_margin_bps ?? 2000,
          material_profit_margin_bps: data.material_profit_margin_bps ?? 1500,
          currency: data.currency ?? "USD",
        });
      }
    } catch (error) {
      showSnackbar(`Failed to load profile: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const saveFinancialProfile = async () => {
    try {
      setLoading(true);
      const updated = await financialProfileApi.upsert({
        company_id: profile?.company_id ?? "",
        ...profileForm,
      });
      await supabase.rpc("recalc_company_gpp_rates", {
        p_company_id: updated.company_id,
      });
      loadFinancialProfile();
      setProfile(updated);
      showSnackbar("Financial profile saved successfully", "success");
    } catch (error) {
      showSnackbar(`Failed to save profile: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // TAB 2: PRODUCTION RATES FUNCTIONS
  // ============================================
  const loadProductionRates = async () => {
    try {
      setLoading(true);
      const [templatesRes, overridesRes] = await Promise.all([
        productionRateTemplateApi.list(templateFilters),
        companyProductionRateApi.list(),
      ]);
      setTemplates(templatesRes.items);
      setOverrides(overridesRes.items);
    } catch (error) {
      showSnackbar(`Failed to load rates: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const openOverrideDialog = (override?: CompanyProductionRate) => {
    if (override) {
      setOverrideForm({
        service: override.service,
        unit: override.unit,
        units_per_hour: override.units_per_hour,
        notes: override.notes ?? "",
      });
      setOverrideDialog({ open: true, editing: override });
    } else {
      setOverrideForm({
        service: "interior_paint",
        unit: "sqft_wall",
        units_per_hour: 100,
        notes: "",
      });
      setOverrideDialog({ open: true, editing: null });
    }
  };

  const closeOverrideDialog = () => {
    setOverrideDialog({ open: false, editing: null });
  };

  const saveOverride = async () => {
    try {
      setLoading(true);
      if (overrideDialog.editing) {
        await companyProductionRateApi.update(overrideDialog.editing.id, {
          units_per_hour: overrideForm.units_per_hour,
          notes: overrideForm.notes,
        });
        showSnackbar("Override updated successfully", "success");
      } else {
        await companyProductionRateApi.upsert({
          company_id: profile?.company_id ?? "",
          service: overrideForm.service,
          unit: overrideForm.unit,
          units_per_hour: overrideForm.units_per_hour,
          notes: overrideForm.notes,
        });
        showSnackbar("Override created successfully", "success");
      }
      closeOverrideDialog();
      loadProductionRates();
    } catch (error) {
      showSnackbar(`Failed to save override: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteOverride = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this override? This will revert to the template rate.",
      )
    )
      return;
    try {
      setLoading(true);
      await companyProductionRateApi.delete(id);
      showSnackbar("Override deleted successfully", "success");
      loadProductionRates();
    } catch (error) {
      showSnackbar(`Failed to delete override: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const getEffectiveRate = (service: ServiceType, unit: UnitType): number => {
    const override = overrides.find(
      (o) => o.service === service && o.unit === unit,
    );
    if (override) return override.units_per_hour;
    const template = templates.find(
      (t) => t.service === service && t.unit === unit,
    );
    return template?.units_per_hour ?? 0;
  };

  // ============================================
  // TAB 3: PROJECT ESTIMATE FUNCTIONS
  // ============================================
  const loadProjects = async () => {
    try {
      const res = await projectApi.listProjects({ limit: 200 });
      setProjects(res.items);
    } catch (error) {
      showSnackbar(`Failed to load projects: ${error}`, "error");
    }
  };

  const loadEstimate = async (projectId: string) => {
    try {
      setLoading(true);
      const estData = await projectEstimateApi.getFull(projectId);
      setEstimate(estData.estimate);
      setEstimateLines(estData.lines);

      // Load material cost from project
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setMaterialCostCents(project.material_cost_cents ?? 0);
      }
    } catch (error) {
      showSnackbar(`Failed to load estimate: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const saveMaterialCost = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      await projectApi.updateProject(selectedProjectId, {
        material_cost_cents: materialCostCents,
      });
      showSnackbar("Material cost saved successfully", "success");
    } catch (error) {
      showSnackbar(`Failed to save material cost: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const recalculateEstimate = async () => {
    if (!selectedProjectId) return;
    try {
      setLoading(true);
      await estimateComputeApi.recalcProjectEstimate(selectedProjectId);
      showSnackbar("Estimate recalculated successfully", "success");
      await loadEstimate(selectedProjectId);
    } catch (error) {
      showSnackbar(`Failed to recalculate estimate: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const updateEstimateStatus = async (status: EstimateStatus) => {
    if (!estimate) return;
    try {
      setLoading(true);
      await projectEstimateApi.update(estimate.id, { status });
      showSnackbar(`Estimate marked as ${status}`, "success");
      await loadEstimate(selectedProjectId);
    } catch (error) {
      showSnackbar(`Failed to update status: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  const deleteEstimate = async () => {
    if (!estimate || estimate.status !== "draft") return;
    if (!confirm("Are you sure you want to delete this draft estimate?"))
      return;
    try {
      setLoading(true);
      await projectEstimateApi.delete(estimate.id);
      showSnackbar("Estimate deleted successfully", "success");
      setEstimate(null);
      setEstimateLines([]);
    } catch (error) {
      showSnackbar(`Failed to delete estimate: ${error}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // UTILITY
  // ============================================
  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // ============================================
  // RENDER
  // ============================================
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
              GPP Admin
            </Typography>
            <Typography variant="body1" color="text.secondary">
              General Pricing & Production — Manage financial settings,
              production rates, and project estimates
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
              <Tab label="💰 Pricing Settings" />
              <Tab label="📊 Production Rates" />
              <Tab label="🔨 Project Estimate Builder" />
            </Tabs>

            {/* ============================================ */}
            {/* TAB 1: PRICING SETTINGS */}
            {/* ============================================ */}
            <TabPanel value={activeTab} index={0}>
              {loading && !profile ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 8 }}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          Financial Profile
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 3 }}
                        >
                          Configure your company&apos;s overhead, labor costs,
                          and margins
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Annual Overhead (cents)"
                              type="number"
                              fullWidth
                              value={profileForm.annual_overhead_cents}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  annual_overhead_cents: Number(e.target.value),
                                })
                              }
                              helperText="Total annual overhead in cents"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Field Employee Count"
                              type="number"
                              fullWidth
                              value={profileForm.field_employee_count}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  field_employee_count: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Weeks per Year"
                              type="number"
                              fullWidth
                              value={profileForm.weeks_per_year}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  weeks_per_year: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Hours per Week"
                              type="number"
                              fullWidth
                              value={profileForm.hours_per_week}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  hours_per_week: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Average Wage (cents/hour)"
                              type="number"
                              fullWidth
                              value={profileForm.avg_wage_cents}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  avg_wage_cents: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Labor Burden (bps)"
                              type="number"
                              fullWidth
                              value={profileForm.labor_burden_bps}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  labor_burden_bps: Number(e.target.value),
                                })
                              }
                              helperText="Basis points (100 bps = 1%)"
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Target Profit Margin (bps)"
                              type="number"
                              fullWidth
                              value={profileForm.target_profit_margin_bps}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  target_profit_margin_bps: Number(
                                    e.target.value,
                                  ),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                              label="Material Profit Margin (bps)"
                              type="number"
                              fullWidth
                              value={profileForm.material_profit_margin_bps}
                              onChange={(e) =>
                                setProfileForm({
                                  ...profileForm,
                                  material_profit_margin_bps: Number(
                                    e.target.value,
                                  ),
                                })
                              }
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <Button
                              variant="contained"
                              startIcon={
                                loading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <SaveIcon />
                                )
                              }
                              onClick={saveFinancialProfile}
                              disabled={loading}
                              fullWidth
                              size="large"
                            >
                              Save Financial Profile
                            </Button>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={2}>
                      <Card sx={{ bgcolor: "primary.light" }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Sellable Man Hours
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {profile?.sellable_man_hours?.toFixed(0) ?? "—"}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {profileForm.field_employee_count} employees ×{" "}
                            {profileForm.weeks_per_year} weeks ×{" "}
                            {profileForm.hours_per_week} hrs/week
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Total billable hours available per year across your
                            field team
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card sx={{ bgcolor: "success.light" }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Overhead per Hour
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {formatCurrency(profile?.overhead_per_hour_cents)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {formatCurrency(profileForm.annual_overhead_cents)}{" "}
                            annual overhead ÷{" "}
                            {profile?.sellable_man_hours?.toFixed(0) ?? "0"}{" "}
                            hours
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Fixed costs (rent, insurance, admin) allocated per
                            billable hour
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card sx={{ bgcolor: "warning.light" }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Direct Labor Cost per Hour
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {formatCurrency(
                              profile?.direct_labor_cost_per_hour_cents,
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {formatCurrency(profileForm.avg_wage_cents)} wage ×
                            (1 + {formatPercent(profileForm.labor_burden_bps)}{" "}
                            burden)
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Base wage plus payroll taxes, insurance, and
                            benefits
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card sx={{ bgcolor: "error.light" }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            True Cost per Hour
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {formatCurrency(profile?.true_cost_per_hour_cents)}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {formatCurrency(
                              profile?.direct_labor_cost_per_hour_cents,
                            )}{" "}
                            labor +{" "}
                            {formatCurrency(profile?.overhead_per_hour_cents)}{" "}
                            overhead
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Total cost to keep one person working for one hour
                            (break-even rate)
                          </Typography>
                        </CardContent>
                      </Card>

                      <Card sx={{ bgcolor: "secondary.light" }}>
                        <CardContent>
                          <Typography variant="subtitle2" gutterBottom>
                            Billable Rate per Hour
                          </Typography>
                          <Typography variant="h4" fontWeight={700}>
                            {formatCurrency(
                              profile?.billable_rate_per_hour_cents,
                            )}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            display="block"
                            sx={{ mt: 1 }}
                          >
                            {formatCurrency(profile?.true_cost_per_hour_cents)}{" "}
                            true cost × (1 +{" "}
                            {formatPercent(
                              profileForm.target_profit_margin_bps,
                            )}{" "}
                            profit)
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 1 }}
                          >
                            Minimum rate to charge customers to hit your target
                            profit margin
                          </Typography>
                        </CardContent>
                      </Card>
                    </Stack>
                  </Grid>
                </Grid>
              )}
            </TabPanel>

            {/* ============================================ */}
            {/* TAB 2: PRODUCTION RATES */}
            {/* ============================================ */}
            <TabPanel value={activeTab} index={1}>
              <Grid container spacing={3}>
                {/* Templates (Read-only) */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Production Rate Templates
                        </Typography>
                        <IconButton onClick={loadProductionRates} size="small">
                          <RefreshIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Global defaults (read-only)
                      </Typography>

                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Service</InputLabel>
                          <Select
                            value={templateFilters.service ?? ""}
                            onChange={(e) => {
                              setTemplateFilters({
                                ...templateFilters,
                                service: e.target.value as ServiceType,
                              });
                              loadProductionRates();
                            }}
                            label="Service"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="interior_paint">
                              Interior Paint
                            </MenuItem>
                            <MenuItem value="exterior_paint">
                              Exterior Paint
                            </MenuItem>
                            <MenuItem value="drywall_patch">
                              Drywall Patch
                            </MenuItem>
                            <MenuItem value="drywall_finish">
                              Drywall Finish
                            </MenuItem>
                            <MenuItem value="trim_paint">Trim Paint</MenuItem>
                            <MenuItem value="door_paint">Door Paint</MenuItem>
                            <MenuItem value="cabinet_paint">
                              Cabinet Paint
                            </MenuItem>
                          </Select>
                        </FormControl>

                        <FormControl size="small" sx={{ minWidth: 150 }}>
                          <InputLabel>Unit</InputLabel>
                          <Select
                            value={templateFilters.unit ?? ""}
                            onChange={(e) => {
                              setTemplateFilters({
                                ...templateFilters,
                                unit: e.target.value as UnitType,
                              });
                              loadProductionRates();
                            }}
                            label="Unit"
                          >
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="sqft_wall">Sqft Wall</MenuItem>
                            <MenuItem value="sqft_ceiling">
                              Sqft Ceiling
                            </MenuItem>
                            <MenuItem value="sqft_floor">Sqft Floor</MenuItem>
                            <MenuItem value="linear_ft_trim">
                              Linear Ft Trim
                            </MenuItem>
                            <MenuItem value="each_door">Each Door</MenuItem>
                            <MenuItem value="each_patch">Each Patch</MenuItem>
                          </Select>
                        </FormControl>
                      </Stack>

                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : templates.length === 0 ? (
                        <Alert severity="info">No templates found</Alert>
                      ) : (
                        <TableContainer sx={{ maxHeight: 500 }}>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Service</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Unit</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Rate</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {templates.map((template) => (
                                <TableRow key={template.id}>
                                  <TableCell>{template.service}</TableCell>
                                  <TableCell>{template.unit}</TableCell>
                                  <TableCell align="right">
                                    {template.units_per_hour}/hr
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Company Overrides (CRUD) */}
                <Grid size={{ xs: 12, md: 6 }}>
                  <Card>
                    <CardContent>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          mb: 2,
                        }}
                      >
                        <Typography variant="h6" fontWeight={700}>
                          Company Overrides
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<AddIcon />}
                          size="small"
                          onClick={() => openOverrideDialog()}
                        >
                          Add Override
                        </Button>
                      </Box>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2 }}
                      >
                        Custom rates for your company
                      </Typography>

                      {loading ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            py: 4,
                          }}
                        >
                          <CircularProgress />
                        </Box>
                      ) : overrides.length === 0 ? (
                        <Alert severity="info">
                          No overrides yet. Add your first override to customize
                          production rates.
                        </Alert>
                      ) : (
                        <TableContainer sx={{ maxHeight: 500 }}>
                          <Table size="small" stickyHeader>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  <strong>Service</strong>
                                </TableCell>
                                <TableCell>
                                  <strong>Unit</strong>
                                </TableCell>
                                <TableCell align="right">
                                  <strong>Rate</strong>
                                </TableCell>
                                <TableCell align="center">
                                  <strong>Actions</strong>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {overrides.map((override) => (
                                <TableRow key={override.id}>
                                  <TableCell>{override.service}</TableCell>
                                  <TableCell>{override.unit}</TableCell>
                                  <TableCell align="right">
                                    <Chip
                                      label={`${override.units_per_hour}/hr`}
                                      size="small"
                                      color="primary"
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        openOverrideDialog(override)
                                      }
                                      color="primary"
                                    >
                                      <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                      size="small"
                                      onClick={() =>
                                        deleteOverride(override.id)
                                      }
                                      color="error"
                                    >
                                      <DeleteIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>

            {/* ============================================ */}
            {/* TAB 3: PROJECT ESTIMATE BUILDER */}
            {/* ============================================ */}
            <TabPanel value={activeTab} index={2}>
              <Grid container spacing={3}>
                {/* Project Selector & Material Cost */}
                <Grid size={{ xs: 12, md: 4 }}>
                  <Stack spacing={2}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} gutterBottom>
                          Select Project
                        </Typography>
                        <FormControl fullWidth>
                          <InputLabel>Project</InputLabel>
                          <Select
                            value={selectedProjectId}
                            onChange={(e) =>
                              setSelectedProjectId(e.target.value)
                            }
                            label="Project"
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {projects.map((project) => (
                              <MenuItem key={project.id} value={project.id}>
                                {project.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </CardContent>
                    </Card>

                    {selectedProjectId && (
                      <>
                        <Card>
                          <CardContent>
                            <Typography
                              variant="h6"
                              fontWeight={700}
                              gutterBottom
                            >
                              Material Cost
                            </Typography>
                            <TextField
                              label="Material Cost (cents)"
                              type="number"
                              fullWidth
                              value={materialCostCents}
                              onChange={(e) =>
                                setMaterialCostCents(Number(e.target.value))
                              }
                              sx={{ mb: 2 }}
                            />
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              {formatCurrency(materialCostCents)}
                            </Typography>
                            <Button
                              variant="outlined"
                              startIcon={<SaveIcon />}
                              onClick={saveMaterialCost}
                              fullWidth
                              disabled={loading}
                            >
                              Save Material Cost
                            </Button>
                          </CardContent>
                        </Card>

                        <Card sx={{ bgcolor: "primary.main", color: "white" }}>
                          <CardContent>
                            <Button
                              variant="contained"
                              startIcon={
                                loading ? (
                                  <CircularProgress size={20} />
                                ) : (
                                  <CalculateIcon />
                                )
                              }
                              onClick={recalculateEstimate}
                              fullWidth
                              size="large"
                              disabled={loading}
                              sx={{
                                bgcolor: "white",
                                color: "primary.main",
                                "&:hover": { bgcolor: "grey.100" },
                              }}
                            >
                              Recalculate Estimate
                            </Button>
                          </CardContent>
                        </Card>
                      </>
                    )}
                  </Stack>
                </Grid>

                {/* Estimate Summary */}
                <Grid size={{ xs: 12, md: 8 }}>
                  {!selectedProjectId ? (
                    <Alert severity="info">
                      Select a project to view estimate details
                    </Alert>
                  ) : loading && !estimate ? (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", py: 4 }}
                    >
                      <CircularProgress />
                    </Box>
                  ) : !estimate ? (
                    <Alert severity="warning">
                      No estimate found for this project
                    </Alert>
                  ) : (
                    <>
                      <Card sx={{ mb: 3 }}>
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              mb: 2,
                            }}
                          >
                            <Typography variant="h6" fontWeight={700}>
                              Estimate Summary
                            </Typography>
                            <Stack direction="row" spacing={1}>
                              <Chip
                                label={estimate.status}
                                color={
                                  estimate.status === "final"
                                    ? "success"
                                    : "default"
                                }
                              />
                              {estimate.status === "draft" && (
                                <>
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() =>
                                      updateEstimateStatus("final")
                                    }
                                  >
                                    Mark Final
                                  </Button>
                                  <IconButton
                                    size="small"
                                    onClick={deleteEstimate}
                                    color="error"
                                  >
                                    <DeleteIcon />
                                  </IconButton>
                                </>
                              )}
                            </Stack>
                          </Box>

                          <Grid container spacing={2}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Man Hours
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {estimate.estimated_man_hours?.toFixed(2) ??
                                  "—"}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Labor Cost
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {formatCurrency(estimate.labor_price_cents)}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Material Cost
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {formatCurrency(estimate.material_price_cents)}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                Tax
                              </Typography>
                              <Typography variant="h6" fontWeight={700}>
                                {formatCurrency(estimate.tax_cents)}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Divider sx={{ my: 2 }} />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <Typography variant="h5" fontWeight={700}>
                              Total
                            </Typography>
                            <Typography
                              variant="h4"
                              fontWeight={700}
                              color="primary"
                            >
                              {formatCurrency(estimate.total_cents)}
                            </Typography>
                          </Box>

                          <Divider sx={{ my: 2 }} />

                          <Typography
                            variant="subtitle2"
                            gutterBottom
                            fontWeight={700}
                          >
                            Snapshot Values
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Overhead/hr:{" "}
                                {formatCurrency(
                                  estimate.snapshot_overhead_per_hour_cents,
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Direct Labor/hr:{" "}
                                {formatCurrency(
                                  estimate.snapshot_direct_labor_cost_per_hour_cents,
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                True Cost/hr:{" "}
                                {formatCurrency(
                                  estimate.snapshot_true_cost_per_hour_cents,
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Billable Rate/hr:{" "}
                                {formatCurrency(
                                  estimate.snapshot_billable_rate_per_hour_cents,
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Labor Margin:{" "}
                                {formatPercent(
                                  estimate.snapshot_labor_margin_bps,
                                )}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6 }}>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Material Margin:{" "}
                                {formatPercent(
                                  estimate.snapshot_material_margin_bps,
                                )}
                              </Typography>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>

                      {/* Estimate Lines */}
                      <Card>
                        <CardContent>
                          <Typography
                            variant="h6"
                            fontWeight={700}
                            gutterBottom
                          >
                            Estimate Lines
                          </Typography>
                          {estimateLines.length === 0 ? (
                            <Alert severity="info">
                              No estimate lines found
                            </Alert>
                          ) : (
                            <TableContainer>
                              <Table size="small">
                                <TableHead>
                                  <TableRow sx={{ bgcolor: "grey.100" }}>
                                    <TableCell>
                                      <strong>Room</strong>
                                    </TableCell>
                                    <TableCell>
                                      <strong>Service</strong>
                                    </TableCell>
                                    <TableCell>
                                      <strong>Unit</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>Quantity</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>Rate</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>Hours</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>Labor Price</strong>
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {estimateLines.map((line) => (
                                    <TableRow key={line.id}>
                                      <TableCell>
                                        {line.room_id ?? "—"}
                                      </TableCell>
                                      <TableCell>{line.service}</TableCell>
                                      <TableCell>{line.unit}</TableCell>
                                      <TableCell align="right">
                                        {line.quantity?.toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {line.units_per_hour}/hr
                                      </TableCell>
                                      <TableCell align="right">
                                        {line.man_hours?.toFixed(2)}
                                      </TableCell>
                                      <TableCell align="right">
                                        {formatCurrency(line.labor_price_cents)}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  <TableRow sx={{ bgcolor: "primary.light" }}>
                                    <TableCell colSpan={5} align="right">
                                      <strong>Totals:</strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>
                                        {estimateLines
                                          .reduce(
                                            (sum, l) =>
                                              sum + (l.man_hours ?? 0),
                                            0,
                                          )
                                          .toFixed(2)}
                                        h
                                      </strong>
                                    </TableCell>
                                    <TableCell align="right">
                                      <strong>
                                        {formatCurrency(
                                          estimateLines.reduce(
                                            (sum, l) =>
                                              sum + (l.labor_price_cents ?? 0),
                                            0,
                                          ),
                                        )}
                                      </strong>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </TableContainer>
                          )}
                        </CardContent>
                      </Card>
                    </>
                  )}
                </Grid>
              </Grid>
            </TabPanel>
          </Paper>
        </Container>

        {/* ============================================ */}
        {/* OVERRIDE DIALOG */}
        {/* ============================================ */}
        <Dialog
          open={overrideDialog.open}
          onClose={closeOverrideDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {overrideDialog.editing ? "Edit Override" : "Add Override"}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <FormControl fullWidth disabled={!!overrideDialog.editing}>
                <InputLabel>Service</InputLabel>
                <Select
                  value={overrideForm.service}
                  onChange={(e) =>
                    setOverrideForm({
                      ...overrideForm,
                      service: e.target.value as ServiceType,
                    })
                  }
                  label="Service"
                >
                  <MenuItem value="interior_paint">Interior Paint</MenuItem>
                  <MenuItem value="exterior_paint">Exterior Paint</MenuItem>
                  <MenuItem value="drywall_patch">Drywall Patch</MenuItem>
                  <MenuItem value="drywall_finish">Drywall Finish</MenuItem>
                  <MenuItem value="trim_paint">Trim Paint</MenuItem>
                  <MenuItem value="door_paint">Door Paint</MenuItem>
                  <MenuItem value="cabinet_paint">Cabinet Paint</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth disabled={!!overrideDialog.editing}>
                <InputLabel>Unit</InputLabel>
                <Select
                  value={overrideForm.unit}
                  onChange={(e) =>
                    setOverrideForm({
                      ...overrideForm,
                      unit: e.target.value as UnitType,
                    })
                  }
                  label="Unit"
                >
                  <MenuItem value="sqft_wall">Sqft Wall</MenuItem>
                  <MenuItem value="sqft_ceiling">Sqft Ceiling</MenuItem>
                  <MenuItem value="sqft_floor">Sqft Floor</MenuItem>
                  <MenuItem value="linear_ft_trim">Linear Ft Trim</MenuItem>
                  <MenuItem value="each_door">Each Door</MenuItem>
                  <MenuItem value="each_patch">Each Patch</MenuItem>
                </Select>
              </FormControl>

              <TextField
                label="Units per Hour"
                type="number"
                fullWidth
                value={overrideForm.units_per_hour}
                onChange={(e) =>
                  setOverrideForm({
                    ...overrideForm,
                    units_per_hour: Number(e.target.value),
                  })
                }
                helperText="Production rate (e.g., 150 sqft/hour)"
              />

              <TextField
                label="Notes"
                multiline
                rows={3}
                fullWidth
                value={overrideForm.notes}
                onChange={(e) =>
                  setOverrideForm({ ...overrideForm, notes: e.target.value })
                }
                helperText="Optional notes about this override"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeOverrideDialog}>Cancel</Button>
            <Button
              onClick={saveOverride}
              variant="contained"
              disabled={loading || overrideForm.units_per_hour <= 0}
            >
              {overrideDialog.editing ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* ============================================ */}
        {/* SNACKBAR */}
        {/* ============================================ */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default GPPAdmin;
