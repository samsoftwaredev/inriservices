"use client";

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Grid,
  Alert,
  Slider,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface Modifier {
  id: string;
  name: string;
  category: "conditions" | "access" | "complexity" | "occupancy";
  percentAdjustment: number;
  description: string;
  editable?: boolean;
}

const defaultModifiers: Modifier[] = [
  // Conditions
  {
    id: "1",
    name: "Occupied Home",
    category: "conditions",
    percentAdjustment: 15,
    description: "Furniture in place, careful work required",
  },
  {
    id: "2",
    name: "Heavy Furniture",
    category: "conditions",
    percentAdjustment: 10,
    description: "Significant furniture to move/protect",
  },
  {
    id: "3",
    name: "Poor Surface Condition",
    category: "conditions",
    percentAdjustment: 25,
    description: "Extensive repairs needed",
  },

  // Access
  {
    id: "4",
    name: "High Ceilings (12-14 ft)",
    category: "access",
    percentAdjustment: 20,
    description: "Need scaffolding/tall ladders",
  },
  {
    id: "5",
    name: "Very High Ceilings (15+ ft)",
    category: "access",
    percentAdjustment: 35,
    description: "Major access challenges",
  },
  {
    id: "6",
    name: "Stairs/Multi-level",
    category: "access",
    percentAdjustment: 10,
    description: "Extra carrying time",
  },

  // Complexity
  {
    id: "7",
    name: "Detail Trim Work",
    category: "complexity",
    percentAdjustment: 25,
    description: "Intricate trim, crown molding",
  },
  {
    id: "8",
    name: "Texture Matching",
    category: "complexity",
    percentAdjustment: 30,
    description: "Must match existing texture",
  },
  {
    id: "9",
    name: "Color Change (Dark to Light)",
    category: "complexity",
    percentAdjustment: 15,
    description: "Extra coats required",
  },
  {
    id: "10",
    name: "Wallpaper Removal",
    category: "complexity",
    percentAdjustment: 40,
    description: "Time-consuming prep",
  },

  // Occupancy
  {
    id: "11",
    name: "Business Open During Work",
    category: "occupancy",
    percentAdjustment: 20,
    description: "Limited work windows",
  },
  {
    id: "12",
    name: "Extreme Care Required",
    category: "occupancy",
    percentAdjustment: 25,
    description: "Expensive items/surfaces",
  },
];

const DifficultyModifiers: React.FC = () => {
  const [modifiers, setModifiers] = useState<Modifier[]>(defaultModifiers);
  const [customModifiers, setCustomModifiers] = useState<Modifier[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] =
    useState<Modifier["category"]>("conditions");
  const [newPercent, setNewPercent] = useState(10);
  const [newDescription, setNewDescription] = useState("");

  const handleAddModifier = () => {
    if (newName.trim()) {
      const newModifier: Modifier = {
        id: Date.now().toString(),
        name: newName.trim(),
        category: newCategory,
        percentAdjustment: newPercent,
        description: newDescription.trim(),
        editable: true,
      };
      setCustomModifiers([...customModifiers, newModifier]);

      // Reset form
      setNewName("");
      setNewDescription("");
      setNewPercent(10);
    }
  };

  const handleDeleteModifier = (id: string) => {
    setCustomModifiers(customModifiers.filter((mod) => mod.id !== id));
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "conditions":
        return "warning";
      case "access":
        return "error";
      case "complexity":
        return "primary";
      case "occupancy":
        return "secondary";
      default:
        return "default";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "conditions":
        return "🏠";
      case "access":
        return "🪜";
      case "complexity":
        return "🎨";
      case "occupancy":
        return "👥";
      default:
        return "📌";
    }
  };

  const groupedModifiers = [...modifiers, ...customModifiers].reduce(
    (acc, mod) => {
      if (!acc[mod.category]) acc[mod.category] = [];
      acc[mod.category].push(mod);
      return acc;
    },
    {} as Record<string, Modifier[]>,
  );

  // Example calculation
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);
  const [baseHours, setBaseHours] = useState(8);

  const toggleModifier = (id: string) => {
    setSelectedModifiers((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const totalModifierPercent = [...modifiers, ...customModifiers]
    .filter((m) => selectedModifiers.includes(m.id))
    .reduce((sum, m) => sum + m.percentAdjustment, 0);

  const adjustedHours = baseHours * (1 + totalModifierPercent / 100);

  return (
    <Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} gutterBottom>
          Step 5: Adjust for Difficulty Tiers
        </Typography>
        <Typography variant="body2">
          Reality: Not every house is empty. Not every wall is perfect.
          <br />
          Pros don&apos;t guess harder jobs —{" "}
          <strong>they apply modifiers.</strong>
        </Typography>
      </Alert>

      <Grid container spacing={3}>
        {/* Add Custom Modifier */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Add Custom Modifier
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Modifier Name"
                  placeholder="e.g., Popcorn ceiling removal"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  size="small"
                  fullWidth
                />

                <TextField
                  label="Category"
                  select
                  value={newCategory}
                  onChange={(e) =>
                    setNewCategory(e.target.value as Modifier["category"])
                  }
                  size="small"
                  fullWidth
                  SelectProps={{ native: true }}
                >
                  <option value="conditions">Conditions</option>
                  <option value="access">Access</option>
                  <option value="complexity">Complexity</option>
                  <option value="occupancy">Occupancy</option>
                </TextField>

                <Box>
                  <Typography variant="body2" gutterBottom>
                    Time Adjustment: +{newPercent}%
                  </Typography>
                  <Slider
                    value={newPercent}
                    onChange={(_, value) => setNewPercent(value as number)}
                    min={5}
                    max={100}
                    step={5}
                    marks
                    valueLabelDisplay="auto"
                    color="primary"
                  />
                </Box>

                <TextField
                  label="Description"
                  placeholder="Why does this add time?"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  size="small"
                  fullWidth
                  multiline
                  rows={2}
                />

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddModifier}
                  disabled={!newName.trim()}
                  fullWidth
                >
                  Add Modifier
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Live Calculator */}
          <Card sx={{ mt: 2, bgcolor: "success.light" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                🧮 Live Calculator
              </Typography>

              <TextField
                label="Base Hours"
                type="number"
                value={baseHours}
                onChange={(e) => setBaseHours(Number(e.target.value))}
                size="small"
                fullWidth
                sx={{ mb: 2 }}
              />

              <Paper sx={{ p: 2, bgcolor: "white" }}>
                <Typography variant="body2" color="text.secondary">
                  Selected Modifiers: +{totalModifierPercent}%
                </Typography>
                <Divider sx={{ my: 1 }} />
                <Typography variant="h5" fontWeight={700} color="success.dark">
                  {adjustedHours.toFixed(1)} hours
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {baseHours}h × (1 + {totalModifierPercent}%) ={" "}
                  {adjustedHours.toFixed(1)}h
                </Typography>
              </Paper>

              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                Click modifiers below to see the impact
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Modifier Library */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Modifier Library
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Click on any modifier to see its impact in the calculator
              </Typography>

              {Object.entries(groupedModifiers).map(([category, mods]) => (
                <Box key={category} sx={{ mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      textTransform="capitalize"
                    >
                      {getCategoryIcon(category)} {category}
                    </Typography>
                    <Chip
                      label={`${mods.length} modifiers`}
                      size="small"
                      color={getCategoryColor(category) as any}
                    />
                  </Box>

                  <Grid container spacing={1}>
                    {mods.map((mod) => (
                      <Grid size={{ xs: 12, sm: 6 }} key={mod.id}>
                        <Paper
                          sx={{
                            p: 1.5,
                            cursor: "pointer",
                            border: 2,
                            borderColor: selectedModifiers.includes(mod.id)
                              ? `${getCategoryColor(mod.category)}.main`
                              : "transparent",
                            bgcolor: selectedModifiers.includes(mod.id)
                              ? `${getCategoryColor(mod.category)}.light`
                              : "grey.50",
                            transition: "all 0.2s",
                            "&:hover": {
                              borderColor: `${getCategoryColor(mod.category)}.main`,
                              transform: "scale(1.02)",
                            },
                          }}
                          onClick={() => toggleModifier(mod.id)}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body2" fontWeight={600}>
                                {mod.name}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {mod.description}
                              </Typography>
                            </Box>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 0.5,
                                alignItems: "center",
                              }}
                            >
                              <Chip
                                label={`+${mod.percentAdjustment}%`}
                                size="small"
                                color={getCategoryColor(mod.category) as any}
                              />
                              {mod.editable && (
                                <IconButton
                                  size="small"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteModifier(mod.id);
                                  }}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              )}
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              ))}
            </CardContent>
          </Card>

          {/* Pro Tips */}
          <Card sx={{ mt: 2, bgcolor: "primary.main", color: "white" }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                💡 Pro Tips for Using Modifiers
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>✓ Stack Modifiers</strong>
                    <br />
                    Occupied + High Ceilings = +35%
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>✓ Be Conservative</strong>
                    <br />
                    Better to finish early than run over
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>✓ Track Reality</strong>
                    <br />
                    Adjust modifiers based on actual job data
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="body2">
                    <strong>✓ Document Reasoning</strong>
                    <br />
                    Explain why modifiers were applied
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DifficultyModifiers;
