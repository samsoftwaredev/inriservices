"use client";

import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import {
  AccessId,
  BundleId,
  EstimateState,
  LineItem,
  MethodId,
  OccupancyId,
  PrepId,
  ScopeId,
  SheenId,
  SurfaceId,
  SystemId,
  UnitId,
} from "@/types/skuPainting";
import {
  ACCESS,
  ADDONS,
  CONDITIONS,
  METHODS,
  OCCUPANCY,
  PREP,
  SCOPES,
  SHEEN,
  SURFACES,
  SYSTEMS,
  UNITS,
} from "@/constants/catalogSKUPainting";

const BUNDLES: Record<BundleId, { title: string; steps: string[] }> = {
  P1: {
    title: "Paint Only (light prep)",
    steps: [
      "Protect floors & furniture (standard)",
      "Cover outlets/switches",
      "Minor surface cleaning",
      "Cut-in + roll 2 coats",
      "Cleanup + walkthrough",
    ],
  },
  P2: {
    title: "Standard Prep + Paint",
    steps: [
      "Everything in Paint Only",
      "Light sanding where needed",
      "Caulk gaps (trim/corners)",
      "Fill minor nail holes (spot putty)",
      "Spot prime patched/filled areas",
    ],
  },
  P3: {
    title: "Heavy Prep + Paint",
    steps: [
      "Everything in Standard Prep",
      "Scrape loose paint",
      "Sand rough areas (more extensive)",
      "Stain-block primer as needed",
      "Adhesion bonding primer as needed",
    ],
  },
  P4: {
    title: "Premium Finish (high visibility)",
    steps: [
      "Everything in Heavy Prep",
      "Extra skim/touch-ups for uniformity",
      "Extra sanding for smoothness",
      "Coordinate Level-5 style finish where applicable",
    ],
  },
  P5: {
    title: "Cabinet/Trim Enamel System",
    steps: [
      "Degrease + degloss",
      "Sand/scuff + dust control",
      "Bonding primer",
      "2 enamel coats (spray/roll/brush)",
      "Cure guidance + reassemble",
    ],
  },
};

/** --------------------------------
 *  Pricing Engine (starter)
 *  Base price determined by (Surface + Unit + Prep + System + Method)
 *  Multipliers for (Access + Occupancy)
 *  Adders for Conditions + Add-ons
 *  -------------------------------- */

// Starter base rates (per unit) — replace with your real pricing
// Units: U1=per sqft, U2=per lf, U3=per item, U4=per set, U5=per elevation, U6=per package
const BASE_RATES: Record<UnitId, { defaultRate: number; note: string }> = {
  U1: { defaultRate: 1.85, note: "per ft² baseline" },
  U2: { defaultRate: 3.25, note: "per linear ft baseline" },
  U3: { defaultRate: 125, note: "per item baseline" },
  U4: { defaultRate: 55, note: "per set baseline" },
  U5: { defaultRate: 850, note: "per elevation baseline" },
  U6: { defaultRate: 650, note: "package baseline" },
};

function surfaceRateFactor(surface?: SurfaceId): number {
  if (!surface) return 1;

  // rough relative complexity (tune later)
  const factors: Partial<Record<SurfaceId, number>> = {
    S1: 1.0, // walls
    S2: 1.05, // ceilings
    S3: 1.2, // trim
    S4: 1.25, // doors
    S5: 1.2, // jambs
    S6: 2.2, // cabinets
    S8: 1.35, // rails
    S9: 1.1, // accent
    S10: 1.15, // bath/humidity
    S11: 1.25, // siding
    S12: 1.35, // masonry
    S13: 1.45, // stucco
    S14: 1.25, // fascia/soffit
    S15: 1.25, // exterior trim
    S16: 1.15, // garage door
    S17: 1.25, // fence/deck
    S18: 1.35, // pergola
  };

  return factors[surface] ?? 1;
}

function prepFactor(prep?: PrepId): number {
  switch (prep) {
    case "PR1":
      return 1.0;
    case "PR2":
      return 1.15;
    case "PR3":
      return 1.35;
    case "PR4":
      return 1.6;
    default:
      return 1.0;
  }
}

function systemFactor(system?: SystemId): number {
  switch (system) {
    case "SYS1":
      return 1.0;
    case "SYS2":
      return 1.08;
    case "SYS3":
      return 1.22;
    case "SYS4":
      return 1.28;
    case "SYS5":
      return 1.35;
    case "SYS6":
      return 1.35;
    case "SYS7":
      return 1.25;
    default:
      return 1.0;
  }
}

function methodFactor(method?: MethodId): number {
  switch (method) {
    case "M1":
      return 1.0;
    case "M2":
      return 1.15;
    case "M3":
      return 1.05;
    case "M4":
      return 1.35;
    case "M5":
      return 1.12;
    default:
      return 1.0;
  }
}

// Bundle selection rules:
// - Cabinets OR SYS5+M4 => P5
// - Otherwise map from Prep: PR1->P1, PR2->P2, PR3->P3, PR4->P4
function chooseBundle(s: EstimateState): BundleId {
  if (s.surface === "S6") return "P5";
  if (s.system === "SYS5" && s.method === "M4") return "P5";
  const bundleFromPrep = PREP.find((p) => p.id === s.prep)?.bundle ?? "P2";
  return bundleFromPrep;
}

function buildSku(s: EstimateState): string {
  const c = s.conditions?.length
    ? `(${[...s.conditions].sort().join(",")})`
    : "";
  const a = s.addons?.length ? `(+${[...s.addons].sort().join(",")})` : "";
  return [
    s.surface ?? "S?",
    s.unit ?? "U?",
    s.scope ?? "SC?",
    s.system ?? "SYS?",
    s.prep ?? "PR?",
    s.sheen ?? "F?",
    s.method ?? "M?",
    s.access ?? "A?",
    s.occupancy ?? "H?",
    c,
    a,
  ]
    .filter(Boolean)
    .join(" ");
}

function buildScopeText(s: EstimateState): string {
  const surface = SURFACES.find((x) => x.id === s.surface)?.label ?? "Surface";
  const scope = SCOPES.find((x) => x.id === s.scope)?.label ?? "Scope";
  const system = SYSTEMS.find((x) => x.id === s.system)?.label ?? "System";
  const prep = PREP.find((x) => x.id === s.prep)?.label ?? "Prep";
  const method = METHODS.find((x) => x.id === s.method)?.label ?? "Method";
  const sheen = SHEEN.find((x) => x.id === s.sheen)?.label ?? "Sheen";

  return `${scope}: ${surface}. Paint system: ${system}. Prep level: ${prep}. Application: ${method}. Finish: ${sheen}.`;
}

function computeLineItems(s: EstimateState): {
  sku: string;
  bundleId: BundleId;
  scopeText: string;
  items: LineItem[];
  subtotal: number;
  total: number;
} {
  const sku = buildSku(s);
  const bundleId = chooseBundle(s);
  const scopeText = buildScopeText(s);

  // Guard: incomplete => show empty pricing
  const required =
    s.surface &&
    s.unit &&
    s.scope &&
    s.system &&
    s.prep &&
    s.sheen &&
    s.method &&
    s.access &&
    s.occupancy;

  if (!required) {
    return { sku, bundleId, scopeText, items: [], subtotal: 0, total: 0 };
  }

  const qty = Math.max(1, Number.isFinite(s.quantity) ? s.quantity : 1);

  const baseRate = BASE_RATES[s.unit!].defaultRate;
  const rate =
    baseRate *
    surfaceRateFactor(s.surface) *
    prepFactor(s.prep) *
    systemFactor(s.system) *
    methodFactor(s.method);

  const accessMult = ACCESS.find((x) => x.id === s.access)?.mult ?? 1;
  const occMult = OCCUPANCY.find((x) => x.id === s.occupancy)?.mult ?? 1;
  const multiplier = accessMult * occMult;

  // Base labor line (unit-priced)
  const baseLine: LineItem = {
    id: "base",
    title: "Paint scope base",
    qty,
    unitPrice: round2(rate * multiplier),
    note: BASE_RATES[s.unit!].note,
  };

  // Conditions + Add-ons (flat adders)
  const conditionItems: LineItem[] = (s.conditions ?? []).map((id) => {
    const found = CONDITIONS.find((x) => x.id === id);
    return {
      id: `cond-${id}`,
      title: `Condition: ${id} — ${found?.label ?? id}`,
      qty: 1,
      unitPrice: found?.adder ?? 0,
      note: found?.note,
    };
  });

  const addonItems: LineItem[] = (s.addons ?? []).map((id) => {
    const found = ADDONS.find((x) => x.id === id);
    return {
      id: `add-${id}`,
      title: `Add-on: ${id} — ${found?.label ?? id}`,
      qty: 1,
      unitPrice: found?.adder ?? 0,
    };
  });

  const items = [baseLine, ...conditionItems, ...addonItems]
    // hide $0 “info only” unless you want them visible
    .filter((li) => li.unitPrice > 0 || li.note);

  const subtotal = items.reduce((sum, li) => sum + li.qty * li.unitPrice, 0);

  // Placeholder tax rule: OFF by default in this page (because painting tax rules vary)
  const total = subtotal;

  return { sku, bundleId, scopeText, items, subtotal, total };
}

function money(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}
function round2(n: number) {
  return Math.round(n * 100) / 100;
}

function Section({
  title,
  children,
  mobile,
  defaultExpanded = true,
}: {
  title: string;
  children: React.ReactNode;
  mobile: boolean;
  defaultExpanded?: boolean;
}) {
  if (!mobile) {
    return (
      <Stack spacing={1.25}>
        <Typography variant="subtitle1" fontWeight={900}>
          {title}
        </Typography>
        {children}
      </Stack>
    );
  }

  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography fontWeight={900}>{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
}

export default function EstimatePaintBlocks() {
  const mobile = useMediaQuery("(max-width:900px)");

  const [state, setState] = React.useState<EstimateState>({
    customerName: "",
    address: "",
    quantity: 1,
    conditions: [],
    addons: [],
    notes: "",
  });

  const result = React.useMemo(() => computeLineItems(state), [state]);
  const bundle = BUNDLES[result.bundleId];

  const requiredMissing =
    !state.surface ||
    !state.unit ||
    !state.scope ||
    !state.system ||
    !state.prep ||
    !state.sheen ||
    !state.method ||
    !state.access ||
    !state.occupancy;

  const copySku = async () => {
    try {
      await navigator.clipboard.writeText(result.sku);
    } catch {
      // ignore
    }
  };

  const toggle = <T extends string>(arr: T[], value: T) => {
    const has = arr.includes(value);
    return has ? arr.filter((x) => x !== value) : [...arr, value];
  };

  // Filter scopes by surface group (interior/exterior) for better UX
  const surfaceGroup = SURFACES.find((s) => s.id === state.surface)?.group;
  const scopesFiltered = surfaceGroup
    ? SCOPES.filter((x) => x.group === surfaceGroup)
    : SCOPES;

  return (
    <Box sx={{ p: 1 }}>
      <Stack spacing={2}>
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1.5}
          alignItems={{ xs: "flex-start", md: "center" }}
          justifyContent="space-between"
        >
          <Typography variant="body2" color="text.secondary">
            Bundle-driven auto-itemized estimates using your painting
            dimensions.
          </Typography>
        </Stack>

        <Grid container spacing={2}>
          {/* Left: Form */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                <Stack spacing={mobile ? 1 : 2.25}>
                  <Section
                    title="Core dimensions"
                    mobile={mobile}
                    defaultExpanded
                  >
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Surface type</InputLabel>
                          <Select
                            label="Surface type"
                            value={state.surface ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                surface: e.target.value as SurfaceId,
                              }))
                            }
                          >
                            <ListSubheaderLike label="Interior" />
                            {SURFACES.filter((x) => x.group === "interior").map(
                              (x) => (
                                <MenuItem key={x.id} value={x.id}>
                                  {x.id} — {x.label}
                                </MenuItem>
                              ),
                            )}
                            <ListSubheaderLike label="Exterior" />
                            {SURFACES.filter((x) => x.group === "exterior").map(
                              (x) => (
                                <MenuItem key={x.id} value={x.id}>
                                  {x.id} — {x.label}
                                </MenuItem>
                              ),
                            )}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Measurement unit</InputLabel>
                          <Select
                            label="Measurement unit"
                            value={state.unit ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                unit: e.target.value as UnitId,
                              }))
                            }
                          >
                            {UNITS.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Scope</InputLabel>
                          <Select
                            label="Scope"
                            value={state.scope ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                scope: e.target.value as ScopeId,
                              }))
                            }
                          >
                            {scopesFiltered.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          type="number"
                          label={
                            UNITS.find((u) => u.id === state.unit)?.qtyLabel ??
                            "Quantity"
                          }
                          value={state.quantity}
                          inputProps={{ min: 1 }}
                          onChange={(e) =>
                            setState((s) => ({
                              ...s,
                              quantity: Math.max(
                                1,
                                Number(e.target.value || 1),
                              ),
                            }))
                          }
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {state.unit
                                  ? UNITS.find((u) => u.id === state.unit)
                                      ?.label
                                  : ""}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Paint system</InputLabel>
                          <Select
                            label="Paint system"
                            value={state.system ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                system: e.target.value as SystemId,
                              }))
                            }
                          >
                            {SYSTEMS.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Prep level</InputLabel>
                          <Select
                            label="Prep level"
                            value={state.prep ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                prep: e.target.value as PrepId,
                              }))
                            }
                          >
                            {PREP.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Finish / sheen</InputLabel>
                          <Select
                            label="Finish / sheen"
                            value={state.sheen ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                sheen: e.target.value as SheenId,
                              }))
                            }
                          >
                            {SHEEN.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Application method</InputLabel>
                          <Select
                            label="Application method"
                            value={state.method ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                method: e.target.value as MethodId,
                              }))
                            }
                          >
                            {METHODS.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Access / height</InputLabel>
                          <Select
                            label="Access / height"
                            value={state.access ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                access: e.target.value as AccessId,
                              }))
                            }
                          >
                            {ACCESS.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Occupancy / protection</InputLabel>
                          <Select
                            label="Occupancy / protection"
                            value={state.occupancy ?? ""}
                            onChange={(e) =>
                              setState((s) => ({
                                ...s,
                                occupancy: e.target.value as OccupancyId,
                              }))
                            }
                          >
                            {OCCUPANCY.map((x) => (
                              <MenuItem key={x.id} value={x.id}>
                                {x.id} — {x.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12 }}>
                        <TextField
                          fullWidth
                          label="Notes (optional)"
                          value={state.notes}
                          onChange={(e) =>
                            setState((s) => ({ ...s, notes: e.target.value }))
                          }
                        />
                      </Grid>
                    </Grid>
                  </Section>

                  <Divider />

                  <Section
                    title="Condition modifiers (checkbox adders)"
                    mobile={mobile}
                    defaultExpanded={!mobile}
                  >
                    <Grid container spacing={1}>
                      {CONDITIONS.map((c) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={c.id}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, borderRadius: 2 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={state.conditions.includes(c.id)}
                                  onChange={() =>
                                    setState((s) => ({
                                      ...s,
                                      conditions: toggle(s.conditions, c.id),
                                    }))
                                  }
                                />
                              }
                              label={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ width: "100%" }}
                                >
                                  <Typography fontWeight={900}>
                                    {c.id}
                                  </Typography>
                                  <Typography variant="body2" sx={{ flex: 1 }}>
                                    {c.label}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={
                                      c.adder > 0
                                        ? `+${money(c.adder)}`
                                        : (c.note ?? "info")
                                    }
                                  />
                                </Stack>
                              }
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Section>

                  <Divider />

                  <Section
                    title="Add-ons (choose any)"
                    mobile={mobile}
                    defaultExpanded={false}
                  >
                    <Grid container spacing={1}>
                      {ADDONS.map((a) => (
                        <Grid size={{ xs: 12, sm: 6 }} key={a.id}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, borderRadius: 2 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={state.addons.includes(a.id)}
                                  onChange={() =>
                                    setState((s) => ({
                                      ...s,
                                      addons: toggle(s.addons, a.id),
                                    }))
                                  }
                                />
                              }
                              label={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ width: "100%" }}
                                >
                                  <Typography fontWeight={900}>
                                    {a.id}
                                  </Typography>
                                  <Typography variant="body2" sx={{ flex: 1 }}>
                                    {a.label}
                                  </Typography>
                                  <Chip
                                    size="small"
                                    variant="outlined"
                                    label={
                                      a.adder > 0
                                        ? `+${money(a.adder)}`
                                        : "separate"
                                    }
                                  />
                                </Stack>
                              }
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Section>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ position: { md: "sticky" }, top: { md: 16 } }}>
              <Stack spacing={2}>
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      <Box>
                        <Typography fontWeight={900}>Summary</Typography>
                        <Typography variant="body2" color="text.secondary">
                          SKU + bundle + itemized pricing
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={copySku}
                        aria-label="copy sku"
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="caption" color="text.secondary">
                      SKU
                    </Typography>
                    <Typography
                      fontWeight={900}
                      sx={{ wordBreak: "break-word" }}
                    >
                      {result.sku}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={`${result.bundleId} — ${bundle.title}`}
                        color="primary"
                        size="small"
                      />
                      {requiredMissing && (
                        <Chip label="Incomplete" color="warning" size="small" />
                      )}
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Typography variant="subtitle2" fontWeight={900}>
                      Auto scope text
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {result.scopeText}
                    </Typography>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography fontWeight={900} sx={{ mb: 1 }}>
                      Bundle steps
                    </Typography>
                    <List dense>
                      {bundle.steps.map((step) => (
                        <ListItem key={step} sx={{ py: 0.25 }}>
                          <ListItemText primary={step} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>

                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Typography fontWeight={900} sx={{ mb: 1 }}>
                      Line items
                    </Typography>

                    {result.items.length === 0 ? (
                      <Typography variant="body2" color="text.secondary">
                        Select all core fields to generate pricing.
                      </Typography>
                    ) : (
                      <List dense disablePadding>
                        {result.items.map((li) => (
                          <ListItem
                            key={li.id}
                            disableGutters
                            secondaryAction={
                              <Typography fontWeight={900}>
                                {money(li.qty * li.unitPrice)}
                              </Typography>
                            }
                          >
                            <ListItemText
                              primary={
                                <Typography fontWeight={800}>
                                  {li.title}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                >
                                  {li.qty} × {money(li.unitPrice)}{" "}
                                  {li.note ? `• ${li.note}` : ""}
                                </Typography>
                              }
                            />
                          </ListItem>
                        ))}
                      </List>
                    )}

                    <Divider sx={{ my: 1.5 }} />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">Subtotal</Typography>
                      <Typography fontWeight={900}>
                        {money(result.subtotal)}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography fontWeight={900}>Total</Typography>
                      <Typography fontWeight={900}>
                        {money(result.total)}
                      </Typography>
                    </Stack>

                    <Divider sx={{ my: 1.5 }} />

                    <Button
                      fullWidth
                      variant="contained"
                      disabled={requiredMissing}
                      sx={{ borderRadius: 999 }}
                    >
                      Save & Send
                    </Button>
                  </CardContent>
                </Card>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}

/** Small helper to visually separate groups inside Select without importing ListSubheader */
function ListSubheaderLike({ label }: { label: string }) {
  return (
    <MenuItem
      disabled
      value={`__${label}__`}
      sx={{ opacity: 1, fontWeight: 900 }}
    >
      {label}
    </MenuItem>
  );
}
