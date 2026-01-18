"use client";

import { Button, Typography, Stack, Grid, Box } from "@mui/material";
import {
  Add as AddIcon,
  PersonAddAlt as PersonAddIcon,
  Person as PersonIcon,
} from "@mui/icons-material";

interface Props {
  onOpenSearchClientDialog: () => void;
  onOpenNewClientDialog: () => void;
}

const RequireClient = ({
  onOpenSearchClientDialog,
  onOpenNewClientDialog,
}: Props) => {
  return (
    <Grid size={{ xs: 12 }}>
      <Box sx={{ textAlign: "center", py: 8 }}>
        <PersonIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Select Client
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Once a client is selected, you can create an estimate.
        </Typography>
        <Stack
          gap={3}
          direction={{ xs: "column", md: "row" }}
          justifyContent="center"
        >
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={onOpenSearchClientDialog}
          >
            Select Client
          </Button>
          <Button
            startIcon={<PersonAddIcon />}
            onClick={onOpenNewClientDialog}
            sx={{ ml: 2 }}
          >
            Create New Client
          </Button>
        </Stack>
      </Box>
    </Grid>
  );
};

export default RequireClient;
