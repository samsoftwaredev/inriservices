"use client";

import React, { useMemo, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  Checkbox,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { computeEstimate } from "./estimateEngine";
import {
  repairTypes,
  sizeBands,
  orientations,
  accessOptions,
  finishTypes,
  paintScopes,
  protectionOptions,
  modifiers,
  stepBundles,
} from "@/constants/catalogSKUDrywall";
import { EstimateSelection, ModifierId } from "@/types/skuDrywall";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

const EstimateDrywallBlocks = () => {
  const mobile = useMediaQuery("(max-width:900px)");

  const [selection, setSelection] = useState<EstimateSelection>({
    modifiers: [],
    quantity: 1,
  });

  const result = useMemo(() => computeEstimate(selection), [selection]);

  const bundle = stepBundles[result.bundleId];

  const setField = <K extends keyof EstimateSelection>(
    key: K,
    value: EstimateSelection[K],
  ) => {
    setSelection((prev) => ({ ...prev, [key]: value }));
  };

  const toggleModifier = (id: ModifierId) => {
    setSelection((prev) => {
      const exists = prev.modifiers.includes(id);
      return {
        ...prev,
        modifiers: exists
          ? prev.modifiers.filter((m) => m !== id)
          : [...prev.modifiers, id],
      };
    });
  };

  const requiredMissing =
    !selection.repairType ||
    !selection.size ||
    !selection.orientation ||
    !selection.access ||
    !selection.finish ||
    !selection.paintScope ||
    !selection.protection;

  return (
    <Box sx={{ py: 3 }}>
      <Container maxWidth="xl">
        <Stack spacing={2}>
          {/* Header */}
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={1.5}
            alignItems={{ xs: "flex-start", md: "center" }}
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Build an estimate using Repair Type + Size + Finish + Scope +
                Modifiers.
              </Typography>
            </Box>
          </Stack>

          <Grid container spacing={2}>
            {/* Left: Form */}
            <Grid size={{ xs: 12, md: 8 }}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: { xs: 1.5, md: 2.5 } }}>
                  <Stack spacing={mobile ? 1 : 2.5}>
                    <Grid container spacing={2}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Repair Type</InputLabel>
                          <Select
                            label="Repair Type"
                            value={selection.repairType ?? ""}
                            onChange={(e) =>
                              setField("repairType", e.target.value as any)
                            }
                          >
                            {repairTypes.map((t) => (
                              <MenuItem key={t.id} value={t.id}>
                                {t.id} — {t.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Size Band</InputLabel>
                          <Select
                            label="Size Band"
                            value={selection.size ?? ""}
                            onChange={(e) =>
                              setField("size", e.target.value as any)
                            }
                          >
                            {sizeBands.map((s) => (
                              <MenuItem key={s.id} value={s.id}>
                                {s.id} — {s.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Orientation</InputLabel>
                          <Select
                            label="Orientation"
                            value={selection.orientation ?? ""}
                            onChange={(e) =>
                              setField("orientation", e.target.value as any)
                            }
                          >
                            {orientations.map((o) => (
                              <MenuItem key={o.id} value={o.id}>
                                {o.id} — {o.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Height / Access</InputLabel>
                          <Select
                            label="Height / Access"
                            value={selection.access ?? ""}
                            onChange={(e) =>
                              setField("access", e.target.value as any)
                            }
                          >
                            {accessOptions.map((a) => (
                              <MenuItem key={a.id} value={a.id}>
                                {a.id} — {a.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Quantity"
                          type="number"
                          value={selection.quantity}
                          inputProps={{ min: 1 }}
                          onChange={(e) =>
                            setField(
                              "quantity",
                              Math.max(1, Number(e.target.value || 1)),
                            )
                          }
                        />
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Finish</InputLabel>
                          <Select
                            label="Finish"
                            value={selection.finish ?? ""}
                            onChange={(e) =>
                              setField("finish", e.target.value as any)
                            }
                          >
                            {finishTypes.map((f) => (
                              <MenuItem key={f.id} value={f.id}>
                                {f.id} — {f.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Paint Scope</InputLabel>
                          <Select
                            label="Paint Scope"
                            value={selection.paintScope ?? ""}
                            onChange={(e) =>
                              setField("paintScope", e.target.value as any)
                            }
                          >
                            {paintScopes.map((p) => (
                              <MenuItem key={p.id} value={p.id}>
                                {p.id} — {p.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Protection / Occupancy</InputLabel>
                          <Select
                            label="Protection / Occupancy"
                            value={selection.protection ?? ""}
                            onChange={(e) =>
                              setField("protection", e.target.value as any)
                            }
                          >
                            {protectionOptions.map((h) => (
                              <MenuItem key={h.id} value={h.id}>
                                {h.id} — {h.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          size="small"
                          label="Notes (optional)"
                          value={selection.notes ?? ""}
                          onChange={(e) => setField("notes", e.target.value)}
                        />
                      </Grid>
                    </Grid>

                    <Divider />

                    <Grid container spacing={1}>
                      {modifiers.map((m) => (
                        <Grid key={m.id} size={{ xs: 12, sm: 6 }}>
                          <Paper
                            variant="outlined"
                            sx={{ p: 1, borderRadius: 2 }}
                          >
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={selection.modifiers.includes(
                                    m.id as any,
                                  )}
                                  onChange={() => toggleModifier(m.id as any)}
                                />
                              }
                              label={
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Typography variant="body2" fontWeight={700}>
                                    {m.id}
                                  </Typography>
                                  <Typography variant="body2">
                                    {m.label}
                                  </Typography>
                                  <Box sx={{ flex: 1 }} />
                                  <Chip
                                    size="small"
                                    label={
                                      m.amount > 0
                                        ? `+${currency(m.amount)}`
                                        : "info"
                                    }
                                    variant="outlined"
                                  />
                                </Stack>
                              }
                            />
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>

                    <Divider />

                    <Stack spacing={1}>
                      <Chip
                        label={`${bundle.id} — ${bundle.title}`}
                        sx={{ alignSelf: "flex-start" }}
                      />
                      <List dense>
                        {bundle.steps.map((s) => (
                          <ListItem key={s} sx={{ py: 0.25 }}>
                            <ListItemText primary={s} />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Right: Sticky Summary */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Box
                sx={{
                  position: { md: "sticky" },
                  top: { md: 16 },
                }}
              >
                <Card variant="outlined" sx={{ borderRadius: 2 }}>
                  <CardContent>
                    <Stack spacing={1.5}>
                      <Typography variant="subtitle1" fontWeight={900}>
                        Estimate Summary
                      </Typography>

                      <Paper
                        variant="outlined"
                        sx={{ p: 1.25, borderRadius: 2 }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          SKU
                        </Typography>
                        <Typography fontWeight={800} sx={{ mt: 0.5 }}>
                          {result.sku}
                        </Typography>
                      </Paper>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Labor</Typography>
                        <Typography fontWeight={800}>
                          {currency(result.laborSubtotal)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">
                          Modifiers
                        </Typography>
                        <Typography fontWeight={800}>
                          {currency(result.modifiersTotal)}
                        </Typography>
                      </Stack>

                      <Divider />

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Subtotal</Typography>
                        <Typography fontWeight={900}>
                          {currency(result.subtotal)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography color="text.secondary">Tax</Typography>
                        <Typography fontWeight={800}>
                          {currency(result.tax)}
                        </Typography>
                      </Stack>

                      <Stack direction="row" justifyContent="space-between">
                        <Typography fontWeight={900}>Total</Typography>
                        <Typography fontWeight={900}>
                          {currency(result.total)}
                        </Typography>
                      </Stack>

                      {requiredMissing && (
                        <Typography variant="body2" color="warning.main">
                          Select all core fields to generate final estimate.
                        </Typography>
                      )}

                      <Divider />

                      <Typography variant="subtitle2" fontWeight={900}>
                        Line Items
                      </Typography>
                      <List dense>
                        {result.items.map((it, idx) => (
                          <ListItem key={idx} sx={{ py: 0.25 }}>
                            <ListItemText
                              primary={
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  spacing={2}
                                >
                                  <Typography variant="body2" fontWeight={700}>
                                    {it.title}
                                  </Typography>
                                  <Typography variant="body2" fontWeight={800}>
                                    {currency(it.amount)}
                                  </Typography>
                                </Stack>
                              }
                              secondary={it.description}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Stack>
                  </CardContent>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};

export default EstimateDrywallBlocks;
