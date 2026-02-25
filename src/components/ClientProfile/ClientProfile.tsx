"use client";

import * as maptilersdk from "@maptiler/sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Card,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AddIcon from "@mui/icons-material/Add";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import MapIcon from "@mui/icons-material/Map";
import DeleteIcon from "@mui/icons-material/Delete";
import { ClientFullData, ClientStatus, MetricCard } from "@/types";
import { formatPhoneNumber } from "@/tools";
import { clientApi } from "@/services";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Circle, Edit as EditIcon } from "@mui/icons-material";
import MetricCards from "../Dashboard/MetricCards";

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
  onNewProject?: () => void;
}

const ClientProfile = ({ client, onNewProject }: ClientProfileProps) => {
  const router = useRouter();
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<ClientStatus>(
    client.status,
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const projectHistory = client.properties
    .flatMap((property) => property.projects || [])
    .sort((a, b) => {
      const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
      const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
      return dateB - dateA;
    });

  const hasProjects = (projectHistory?.length ?? 0) > 0;

  const completedCount = useMemo(() => {
    // If you don't have history passed in, just show 0 like the mock
    if (!projectHistory) return 0;
    return projectHistory.filter((p) => p.status === "completed").length;
  }, [projectHistory]);

  const revenue = client.properties.reduce(
    (acc, property) =>
      acc +
      (property.projects?.reduce(
        (projAcc, project) => projAcc + (project.invoiceTotalCents ?? 0),
        0,
      ) ?? 0),
    0,
  );

  const property = client.properties[0];

  const addressLine = `${property.addressLine1}${
    property.addressLine2 ? `, ${property.addressLine2}` : ""
  }, ${property.city}, ${property.state} ${property.zip}`;

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
      "_blank",
    );
  };

  const onEditClient = () => {
    router.push(`/clients/${client.id}/edit`);
  };

  const handleOpenDeleteDialog = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleDeleteClient = async () => {
    try {
      setIsDeleting(true);
      await clientApi.deleteClient(client.id);
      toast.success("Client deleted successfully");
      setDeleteDialogOpen(false);
      // Redirect to clients page
      location.href = "/clients";
    } catch (error) {
      console.error("Error deleting client:", error);
      toast.error("Failed to delete client. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (newStatus: ClientStatus) => {
    try {
      setIsUpdatingStatus(true);
      await clientApi.updateClient(client.id, {
        status: newStatus,
      });
      setCurrentStatus(newStatus);
      toast.success("Client status updated successfully");
    } catch (error) {
      console.error("Error updating client status:", error);
      toast.error("Failed to update client status. Please try again.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const summaryCards: MetricCard[] = [
    {
      title: "Total Projects",
      value: revenue ?? 0,
      color: "blue" as const,
      icon: (
        <DescriptionOutlinedIcon
          fontSize="small"
          sx={{ color: "primary.main" }}
        />
      ),
      format: (value) => `$${Number(value).toLocaleString()}`,
    },
    {
      title: "Completed",
      value: completedCount,
      color: "green" as const,
      icon: <Circle fontSize="small" sx={{ color: "success.main" }} />,
      format: (value) => value.toString(),
    },
    {
      title: "Revenue",
      value: revenue,
      color: "purple" as const,
      icon: <Circle fontSize="small" sx={{ color: "secondary.main" }} />,
      format: (value) => `$${Number(value).toLocaleString()}`,
    },
  ];

  return (
    <>
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
              <IconButton
                size="small"
                onClick={onEditClient}
                title="Edit Client"
                color="primary"
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2 }}
              >
                {client.displayName}
              </Typography>

              {/* Status Dropdown */}
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <Select
                  value={currentStatus}
                  onChange={(e) =>
                    handleStatusChange(e.target.value as ClientStatus)
                  }
                  disabled={isUpdatingStatus}
                  sx={{
                    textTransform: "capitalize",
                    bgcolor: "background.default",
                    "& .MuiSelect-select": {
                      py: 0.5,
                    },
                  }}
                >
                  <MenuItem value="lead" sx={{ textTransform: "capitalize" }}>
                    <Circle
                      fontSize="small"
                      sx={{ color: "warning.main", mr: 0.5 }}
                    />
                    Lead
                  </MenuItem>
                  <MenuItem value="active" sx={{ textTransform: "capitalize" }}>
                    <Circle
                      fontSize="small"
                      sx={{ color: "success.main", mr: 0.5 }}
                    />
                    Active
                  </MenuItem>
                  <MenuItem
                    value="inactive"
                    sx={{ textTransform: "capitalize" }}
                  >
                    <Circle
                      fontSize="small"
                      sx={{ color: "text.disabled", mr: 0.5 }}
                    />
                    Inactive
                  </MenuItem>
                </Select>
              </FormControl>
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
                {formatPhoneNumber(client.phone)}
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
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
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
          <MetricCards summaryCards={summaryCards} />
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

            <Stack sx={{ direction: { sm: "column", md: "row" }, gap: 1 }}>
              <Button
                onClick={handleOpenDeleteDialog}
                color="error"
                startIcon={<DeleteIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 700,
                }}
              >
                Delete Client
              </Button>
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
                    {typeof p.invoiceTotalCents === "number"
                      ? `$${(p.invoiceTotalCents / 100).toLocaleString()}`
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete {client.displayName}? This action
            cannot be undone and will remove all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteClient}
            color="error"
            variant="contained"
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClientProfile;
