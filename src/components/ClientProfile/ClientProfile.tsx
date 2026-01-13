"use client";

import * as React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MapIcon from "@mui/icons-material/Map";
import { ClientFullData } from "@/types";

type StatCardProps = {
  label: string;
  value: React.ReactNode;
  tint?: "blue" | "green" | "purple";
};

function StatCard({ label, value, tint = "blue" }: StatCardProps) {
  const tintMap = {
    blue: {
      border: "rgba(25, 118, 210, 0.35)",
      bg: "rgba(25, 118, 210, 0.06)",
      valueColor: "primary.main",
    },
    green: {
      border: "rgba(46, 125, 50, 0.35)",
      bg: "rgba(46, 125, 50, 0.06)",
      valueColor: "success.main",
    },
    purple: {
      border: "rgba(123, 31, 162, 0.35)",
      bg: "rgba(123, 31, 162, 0.06)",
      valueColor: "secondary.main",
    },
  }[tint];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        borderRadius: 2,
        borderColor: tintMap.border,
        bgcolor: tintMap.bg,
        minHeight: 78,
      }}
    >
      <Typography
        sx={{
          fontWeight: 800,
          fontSize: 22,
          color: tintMap.valueColor,
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
        {label}
      </Typography>
    </Paper>
  );
}

function InfoRow({
  icon,
  children,
  onCopy,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
  onCopy?: () => void;
}) {
  return (
    <Stack direction="row" spacing={1.25} alignItems="center">
      <Box
        sx={{ color: "text.secondary", display: "flex", alignItems: "center" }}
      >
        {icon}
      </Box>
      <Box sx={{ color: "text.primary", flex: 1 }}>{children}</Box>
      {onCopy && (
        <IconButton
          size="small"
          onClick={onCopy}
          sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
        >
          <ContentCopyIcon fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
}

interface ClientProfileProps {
  client: ClientFullData;

  /** Optional callbacks for modal-like behavior */
  onClose?: () => void;
  onNewProject?: () => void;

  /** Optional: if you already have project history items */
  projectHistory?: Array<{
    id: string;
    name: string;
    status: string;
    endDate?: string | null;
    invoiceTotal?: number | null;
  }>;
}

const ClientProfile = ({
  client,
  onClose,
  onNewProject,
  projectHistory,
}: ClientProfileProps) => {
  const [copySuccess, setCopySuccess] = React.useState<string | null>(null);

  const hasProjects = (projectHistory?.length ?? 0) > 0;

  const completedCount = React.useMemo(() => {
    // If you don't have history passed in, just show 0 like the mock
    if (!projectHistory) return 0;
    return projectHistory.filter((p) => p.status === "completed").length;
  }, [projectHistory]);

  const revenue = client.properties.reduce(
    (acc, property) =>
      acc +
      (property.projects?.reduce(
        (projAcc, project) => projAcc + (project.invoiceTotalCents ?? 0),
        0
      ) ?? 0),
    0
  );
  const properties = client.properties[0];

  const addressLine = `${properties.addressLine1}${
    properties.addressLine2 ? `, ${properties.addressLine2}` : ""
  }, ${properties.city}, ${properties.state} ${properties.zip}`;

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess(`${label} copied to clipboard`);
      setTimeout(() => setCopySuccess(null), 3000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      setCopySuccess("Failed to copy");
      setTimeout(() => setCopySuccess(null), 3000);
    }
  };

  const openInGoogleMaps = () => {
    const query = encodeURIComponent(addressLine);
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${query}`,
      "_blank"
    );
  };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          pt: 2.5,
          pb: 1.5,
          display: "flex",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.25 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              {client.displayName}
            </Typography>

            {/* Optional status pill */}
            {client.status ? (
              <Chip
                size="small"
                label={client.status}
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: 12,
                  textTransform: "capitalize",
                  bgcolor: "background.default",
                }}
              />
            ) : null}
          </Stack>

          <Stack spacing={1.1} sx={{ mt: 1 }}>
            <InfoRow
              icon={<MailOutlineIcon fontSize="small" />}
              onCopy={() => copyToClipboard(client.email, "Email")}
            >
              {client.email}
            </InfoRow>
            <InfoRow
              icon={<PhoneOutlinedIcon fontSize="small" />}
              onCopy={() => copyToClipboard(client.phone, "Phone")}
            >
              {client.phone}
            </InfoRow>
            <InfoRow
              icon={<LocationOnOutlinedIcon fontSize="small" />}
              onCopy={() => copyToClipboard(addressLine, "Address")}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={1}
                sx={{ width: "100%" }}
              >
                <Typography variant="body2" sx={{ flex: 1 }}>
                  {addressLine}
                </Typography>
                <IconButton
                  size="small"
                  onClick={openInGoogleMaps}
                  sx={{ opacity: 0.7, "&:hover": { opacity: 1 } }}
                  title="Open in Google Maps"
                >
                  <MapIcon fontSize="small" />
                </IconButton>
              </Stack>
            </InfoRow>
          </Stack>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          aria-label="Close"
          sx={{ mt: 0.25 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Notes */}
      {client.notes ? (
        <Box sx={{ px: 3, pb: 2 }}>
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 2,
              bgcolor: "background.default",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Notes
            </Typography>
            <Typography variant="body2">{client.notes}</Typography>
          </Paper>
        </Box>
      ) : (
        <Box sx={{ px: 3, pb: 2 }} />
      )}

      {/* Stats */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <StatCard tint="blue" label="Total Projects" value={revenue ?? 0} />
          <StatCard tint="green" label="Completed" value={completedCount} />
          <StatCard
            tint="purple"
            label="Revenue"
            value={`$${Number(revenue).toLocaleString()}`}
          />
        </Box>
      </Box>

      {/* Map Section */}
      <Box sx={{ px: 3, pb: 2 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.5 }}>
          Location
        </Typography>
        <Paper
          variant="outlined"
          sx={{
            borderRadius: 2,
            overflow: "hidden",
            height: 300,
            position: "relative",
          }}
        >
          <iframe
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dO0Yy4PvVkRTco&q=${encodeURIComponent(
              addressLine
            )}`}
            style={{
              width: "100%",
              height: "100%",
              border: 0,
            }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map showing location of ${client.displayName}`}
          />
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              zIndex: 1,
            }}
          >
            <IconButton
              onClick={openInGoogleMaps}
              size="small"
              sx={{
                bgcolor: "background.paper",
                "&:hover": { bgcolor: "background.default" },
                boxShadow: 1,
              }}
              title="Open in Google Maps"
            >
              <MapIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Box>

      <Divider />

      {/* Project History */}
      <Box sx={{ px: 3, py: 2.25 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1.5 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
            Project History
          </Typography>

          <Button
            onClick={onNewProject}
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            New Project
          </Button>
        </Stack>

        {/* Empty state (matches mock) */}
        {!hasProjects ? (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 5,
              textAlign: "center",
              bgcolor: "background.default",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 1.25,
                color: "text.secondary",
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 40 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              No projects yet
            </Typography>
          </Paper>
        ) : (
          <Stack spacing={1.25}>
            {projectHistory!.map((p) => (
              <Paper
                key={p.id}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                }}
              >
                <Box sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 800 }} noWrap>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {p.status}
                    {p.endDate
                      ? ` • ${new Date(p.endDate).toLocaleDateString()}`
                      : ""}
                  </Typography>
                </Box>

                <Typography sx={{ fontWeight: 800 }}>
                  {typeof p.invoiceTotal === "number"
                    ? `$${p.invoiceTotal.toLocaleString()}`
                    : ""}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* Copy Success Snackbar */}
      <Snackbar
        open={!!copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setCopySuccess(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {copySuccess}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ClientProfile;
