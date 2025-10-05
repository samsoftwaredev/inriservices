"use client";

import React from "react";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import BuildIcon from "@mui/icons-material/Build";

interface Props {
  includeMaterialCosts: boolean;
  onToggle: (event: React.ChangeEvent<HTMLInputElement>) => void;
  totalMaterialCost: number;
}

const MaterialCostsToggle = ({
  includeMaterialCosts,
  onToggle,
  totalMaterialCost,
}: Props) => {
  return (
    <Box sx={{ mb: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
      <FormControlLabel
        control={
          <Switch
            checked={includeMaterialCosts}
            onChange={onToggle}
            color="primary"
          />
        }
        label={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <BuildIcon fontSize="small" />
            <Typography variant="body1">
              Include Material Costs in Estimate
            </Typography>
          </Box>
        }
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, ml: 4 }}>
        {includeMaterialCosts
          ? "Material costs will be included in the total project cost"
          : "Only labor costs will be calculated (customer provides materials)"}
      </Typography>
      {!includeMaterialCosts && totalMaterialCost > 0 && (
        <Typography variant="body2" color="warning.main" sx={{ mt: 1, ml: 4 }}>
          Materials excluded: -${totalMaterialCost.toLocaleString()}
        </Typography>
      )}
    </Box>
  );
};

export default MaterialCostsToggle;
