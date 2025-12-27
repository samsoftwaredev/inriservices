"use client";

import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  LinearProgress,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionIcon from "@mui/icons-material/Description";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import EditIcon from "@mui/icons-material/Edit";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import GroupsIcon from "@mui/icons-material/Groups";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import SignatureIcon from "@mui/icons-material/Draw";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Controller, useFieldArray, useForm } from "react-hook-form";

/**
 * Dashboard + Full user flow (Send -> upload PDF -> add recipients -> review -> send),
 * plus: view document details, simulate signing, statuses, manage list.
 *
 * Notes:
 * - This is UI + client-side state only (no backend). Wire API calls where noted.
 * - PDF viewing is simulated. For real PDFs use: react-pdf or PDF.js and secure URLs.
 */

type DocStatus =
  | "action_required"
  | "waiting_for_others"
  | "completed"
  | "draft";

type Role = "Signer" | "Viewer" | "CC";
type Recipient = {
  id: string;
  name: string;
  email: string;
  role: Role;
  hasSigned?: boolean;
};

type DocumentItem = {
  id: string;
  title: string;
  status: DocStatus;
  lastUpdatedISO: string;
  ownerName: string;
  ownerOrg?: string;
  fileName?: string;
  fileSizeBytes?: number;
  recipients: Recipient[];
  message?: string;
  audit: { atISO: string; text: string }[];
};

type NewDocForm = {
  title: string;
  senderName: string;
  senderOrg: string;
  message: string;
  file: FileList | null;
  recipients: { name: string; email: string; role: Role }[];
};

const statusLabel: Record<DocStatus, string> = {
  action_required: "Action Required",
  waiting_for_others: "Waiting for Others",
  completed: "Completed",
  draft: "Draft",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function bytesToSize(bytes?: number) {
  if (!bytes || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let b = bytes;
  let i = 0;
  while (b >= 1024 && i < units.length - 1) {
    b /= 1024;
    i += 1;
  }
  return `${b.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

function makeId(prefix = "id") {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now()}`;
}

function getCounts(docs: DocumentItem[]) {
  let action_required = 0;
  let waiting_for_others = 0;
  let completed = 0;
  docs.forEach((d) => {
    if (d.status === "action_required") action_required += 1;
    if (d.status === "waiting_for_others") waiting_for_others += 1;
    if (d.status === "completed") completed += 1;
  });
  return { action_required, waiting_for_others, completed };
}

const roles: Role[] = ["Signer", "Viewer", "CC"];

const seedDocs: DocumentItem[] = [
  {
    id: makeId("doc"),
    title: "Painting Contract - INRI Paint & Wall",
    status: "action_required",
    lastUpdatedISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    ownerName: "Samuel",
    ownerOrg: "INRI Paint & Wall LLC",
    fileName: "painting-contract.pdf",
    fileSizeBytes: 524_288,
    message: "Please review and sign. Thank you!",
    recipients: [
      {
        id: makeId("rec"),
        name: "Connie",
        email: "connie@example.com",
        role: "Signer",
        hasSigned: false,
      },
      {
        id: makeId("rec"),
        name: "Torie",
        email: "torie@example.com",
        role: "CC",
        hasSigned: false,
      },
    ],
    audit: [
      {
        atISO: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        text: "Document created",
      },
      {
        atISO: new Date(Date.now() - 1000 * 60 * 60 * 1.8).toISOString(),
        text: "Recipients added",
      },
      {
        atISO: new Date(Date.now() - 1000 * 60 * 60 * 1.7).toISOString(),
        text: "Sent to recipients",
      },
    ],
  },
];

type ViewMode = "dashboard" | "details";

const steps = ["Upload PDF", "Recipients", "Review & Send"] as const;

export default function DocumentSigningDashboard(): React.JSX.Element {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const [docs, setDocs] = React.useState<DocumentItem[]>(seedDocs);
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<DocStatus | "all">(
    "all"
  );

  const [mode, setMode] = React.useState<ViewMode>("dashboard");
  const [activeDocId, setActiveDocId] = React.useState<string | null>(null);

  const [sendOpen, setSendOpen] = React.useState(false);
  const [sendStep, setSendStep] = React.useState(0);
  const [sending, setSending] = React.useState(false);

  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const counts = React.useMemo(() => getCounts(docs), [docs]);

  const filteredDocs = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return docs
      .filter((d) =>
        statusFilter === "all" ? true : d.status === statusFilter
      )
      .filter((d) => {
        if (!q) return true;
        const inTitle = d.title.toLowerCase().includes(q);
        const inRecipient = d.recipients.some(
          (r) =>
            r.email.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q)
        );
        const inFile = (d.fileName ?? "").toLowerCase().includes(q);
        return inTitle || inRecipient || inFile;
      })
      .sort((a, b) => (a.lastUpdatedISO < b.lastUpdatedISO ? 1 : -1));
  }, [docs, query, statusFilter]);

  const activeDoc = React.useMemo(
    () => docs.find((d) => d.id === activeDocId) ?? null,
    [docs, activeDocId]
  );

  const openDoc = (id: string) => {
    setActiveDocId(id);
    setMode("details");
  };

  const closeDetails = () => {
    setMode("dashboard");
    setActiveDocId(null);
  };

  const markSignedByFirstSigner = () => {
    if (!activeDoc) return;
    const signerIndex = activeDoc.recipients.findIndex(
      (r) => r.role === "Signer"
    );
    if (signerIndex < 0) return;

    setDocs((prev) =>
      prev.map((d) => {
        if (d.id !== activeDoc.id) return d;

        const nextRecipients = d.recipients.map((r, idx) =>
          idx === signerIndex ? { ...r, hasSigned: true } : r
        );

        const allSignersSigned = nextRecipients
          .filter((r) => r.role === "Signer")
          .every((r) => r.hasSigned);

        const nextStatus: DocStatus = allSignersSigned
          ? "completed"
          : "waiting_for_others";

        return {
          ...d,
          recipients: nextRecipients,
          status: nextStatus,
          lastUpdatedISO: new Date().toISOString(),
          audit: [
            {
              atISO: new Date().toISOString(),
              text: "Signer completed signature (simulated)",
            },
            ...d.audit,
          ],
        };
      })
    );
  };

  const deleteDoc = (id: string) => {
    setDocs((prev) => prev.filter((d) => d.id !== id));
    if (activeDocId === id) closeDetails();
  };

  const openSend = () => {
    setSendOpen(true);
    setSendStep(0);
  };

  const closeSend = () => {
    setSendOpen(false);
    setSendStep(0);
    setSending(false);
    reset();
  };

  // --- React Hook Form: Send flow ---
  const {
    control,
    handleSubmit,
    reset,
    watch,
    trigger,
    formState: { errors },
  } = useForm<NewDocForm>({
    defaultValues: {
      title: "",
      senderName: "John",
      senderOrg: "",
      message: "",
      file: null,
      recipients: [{ name: "", email: "", role: "Signer" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipients",
  });

  const fileList = watch("file");
  const pickedFile = fileList?.[0];

  const nextStep = async () => {
    // Validate per step
    if (sendStep === 0) {
      const ok = await trigger(["title", "file"]);
      if (!ok) return;
    }
    if (sendStep === 1) {
      const ok = await trigger(["recipients"]);
      if (!ok) return;
    }
    setSendStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setSendStep((s) => Math.max(s - 1, 0));

  const submitSend = handleSubmit(async (values) => {
    setSending(true);

    // Simulate API call
    await new Promise((r) => setTimeout(r, 700));

    const newDoc: DocumentItem = {
      id: makeId("doc"),
      title: values.title.trim(),
      status: "action_required",
      lastUpdatedISO: new Date().toISOString(),
      ownerName: values.senderName.trim() || "You",
      ownerOrg: values.senderOrg.trim() || undefined,
      fileName: pickedFile?.name,
      fileSizeBytes: pickedFile?.size,
      message: values.message.trim() || undefined,
      recipients: values.recipients.map((r) => ({
        id: makeId("rec"),
        name: r.name.trim() || r.email.trim(),
        email: r.email.trim(),
        role: r.role,
        hasSigned: false,
      })),
      audit: [
        { atISO: new Date().toISOString(), text: "Document created" },
        { atISO: new Date().toISOString(), text: "Recipients added" },
        { atISO: new Date().toISOString(), text: "Sent to recipients" },
      ],
    };

    setDocs((prev) => [newDoc, ...prev]);
    setSending(false);
    setSendOpen(false);
    setSendStep(0);
    reset();
  });

  const PageShell = (children: React.ReactNode) => (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fff" }}>
      <AppBar position="static" elevation={0} color="transparent">
        <Toolbar sx={{ px: { xs: 2, md: 3 } }}>
          {!isMdUp ? (
            <IconButton
              edge="start"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation"
            >
              <MoreVertIcon />
            </IconButton>
          ) : null}

          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={800}>
              {mode === "dashboard" ? "Good morning, John" : "Document Details"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mode === "dashboard"
                ? "Here's what's happening with your documents today."
                : "Review activity, recipients, and signing status."}
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openSend}
            sx={{ borderRadius: 999, textTransform: "none" }}
          >
            Send New Document
          </Button>
        </Toolbar>
      </AppBar>

      {!isMdUp ? (
        <Drawer
          anchor="left"
          open={mobileNavOpen}
          onClose={() => setMobileNavOpen(false)}
        >
          <Box sx={{ width: 280, p: 2 }}>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Filters
            </Typography>
            <Divider sx={{ mb: 1 }} />
            <List dense>
              {[
                { key: "all", label: "All" },
                { key: "action_required", label: "Action Required" },
                { key: "waiting_for_others", label: "Waiting for Others" },
                { key: "completed", label: "Completed" },
                { key: "draft", label: "Draft" },
              ].map((item) => (
                <ListItem key={item.key} disablePadding>
                  <ListItemButton
                    selected={statusFilter === (item.key as any)}
                    onClick={() => {
                      setStatusFilter(item.key as any);
                      setMobileNavOpen(false);
                    }}
                  >
                    <ListItemIcon>
                      {item.key === "action_required" ? (
                        <ErrorOutlineIcon />
                      ) : item.key === "waiting_for_others" ? (
                        <GroupsIcon />
                      ) : item.key === "completed" ? (
                        <DoneAllIcon />
                      ) : (
                        <DescriptionIcon />
                      )}
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      ) : null}

      <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>{children}</Box>

      <SendDocumentDialog
        open={sendOpen}
        onClose={closeSend}
        step={sendStep}
        onNext={nextStep}
        onBack={prevStep}
        onSubmit={submitSend}
        sending={sending}
        control={control}
        errors={errors}
        recipientsFields={fields}
        appendRecipient={() => append({ name: "", email: "", role: "Signer" })}
        removeRecipient={remove}
        pickedFile={pickedFile}
      />
    </Box>
  );

  // ---------- DASHBOARD ----------
  const Dashboard = (
    <Box>
      {/* Stats row */}
      <Grid3>
        <StatCard
          title="Action Required"
          value={counts.action_required}
          icon={<ErrorOutlineIcon />}
          helper="Needs your attention"
        />
        <StatCard
          title="Waiting for Others"
          value={counts.waiting_for_others}
          icon={<GroupsIcon />}
          helper="Out for signature"
        />
        <StatCard
          title="Completed"
          value={counts.completed}
          icon={<CheckCircleIcon />}
          helper="Fully signed"
        />
      </Grid3>

      {/* Search + filter */}
      <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", mt: 2 }}>
        <TextField
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search documents, recipients, or file names"
          fullWidth
          sx={{ flex: 1, minWidth: 260 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          label="Status"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="action_required">Action Required</MenuItem>
          <MenuItem value="waiting_for_others">Waiting for Others</MenuItem>
          <MenuItem value="completed">Completed</MenuItem>
          <MenuItem value="draft">Draft</MenuItem>
        </TextField>
      </Box>

      {/* Recent Documents table */}
      <Paper
        variant="outlined"
        sx={{ borderRadius: 3, mt: 2, overflow: "hidden" }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.paper",
          }}
        >
          <Typography fontWeight={800}>Recent Documents</Typography>
          <Link
            component="button"
            onClick={() => {
              setQuery("");
              setStatusFilter("all");
            }}
            underline="none"
            sx={{ fontWeight: 700 }}
          >
            View All
          </Link>
        </Box>

        <Divider />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Document</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Last Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredDocs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <Box sx={{ py: 5, textAlign: "center" }}>
                      <Typography color="text.secondary">
                        No documents found. Start by sending one!
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                filteredDocs.slice(0, 8).map((d) => (
                  <TableRow key={d.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            display: "grid",
                            placeItems: "center",
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <DescriptionIcon fontSize="small" />
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={800} noWrap>
                            {d.title}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            noWrap
                          >
                            {d.fileName ?? "PDF"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <StatusChip status={d.status} />
                    </TableCell>

                    <TableCell>{formatDate(d.lastUpdatedISO)}</TableCell>

                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View">
                          <IconButton
                            size="small"
                            onClick={() => openDoc(d.id)}
                          >
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => deleteDoc(d.id)}
                          >
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Security note */}
      <Box sx={{ mt: 2 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          color="text.secondary"
        >
          <ShieldOutlinedIcon fontSize="small" />
          <Typography variant="caption">
            Tip: For production, store PDFs in private storage (signed URLs),
            encrypt at rest, and use audit logs + MFA.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );

  // ---------- DETAILS ----------
  const Details = activeDoc ? (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={closeDetails}
          sx={{ textTransform: "none", borderRadius: 999 }}
        >
          Back
        </Button>

        <Box sx={{ flex: 1 }} />

        <Button
          variant="outlined"
          startIcon={<SignatureIcon />}
          onClick={markSignedByFirstSigner}
          sx={{ textTransform: "none", borderRadius: 999 }}
          disabled={activeDoc.status === "completed"}
        >
          Sign (Simulate)
        </Button>
      </Stack>

      <GridDetails>
        {/* Left: Doc viewer + meta */}
        <Box>
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <Box
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <DescriptionIcon />
              <Box sx={{ minWidth: 0 }}>
                <Typography fontWeight={900} noWrap>
                  {activeDoc.title}
                </Typography>
                <Typography variant="caption" color="text.secondary" noWrap>
                  {activeDoc.fileName ?? "document.pdf"} •{" "}
                  {bytesToSize(activeDoc.fileSizeBytes)} •{" "}
                  {statusLabel[activeDoc.status]}
                </Typography>
              </Box>

              <Box sx={{ flex: 1 }} />

              <StatusChip status={activeDoc.status} />
            </Box>
            <Divider />

            {/* PDF Preview placeholder */}
            <Box
              sx={{
                height: { xs: 280, md: 420 },
                bgcolor: "action.hover",
                display: "grid",
                placeItems: "center",
                p: 2,
              }}
            >
              <Box sx={{ textAlign: "center" }}>
                <Typography fontWeight={900}>PDF Preview</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Plug in a real viewer (PDF.js / react-pdf) + secure URL.
                </Typography>

                <Button
                  variant="contained"
                  startIcon={<VisibilityIcon />}
                  sx={{ mt: 2, borderRadius: 999, textTransform: "none" }}
                  onClick={() =>
                    alert(
                      "In production, open a secure PDF viewer modal or route."
                    )
                  }
                >
                  Open Viewer
                </Button>
              </Box>
            </Box>

            {activeDoc.message ? (
              <>
                <Divider />
                <Box sx={{ p: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontWeight={800}
                  >
                    Message
                  </Typography>
                  <Typography sx={{ mt: 0.5 }}>{activeDoc.message}</Typography>
                </Box>
              </>
            ) : null}
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={900}>Audit Trail</Typography>
              <Typography variant="body2" color="text.secondary">
                Timestamped log of document events (critical for legal
                defensibility).
              </Typography>
            </Box>
            <Divider />
            <List dense>
              {activeDoc.audit.slice(0, 8).map((a) => (
                <ListItem key={a.atISO}>
                  <ListItemText
                    primary={a.text}
                    secondary={formatDate(a.atISO)}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Box>

        {/* Right: recipients + actions */}
        <Box>
          <Paper variant="outlined" sx={{ borderRadius: 3 }}>
            <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 1 }}>
              <GroupsIcon />
              <Box>
                <Typography fontWeight={900}>Recipients</Typography>
                <Typography variant="body2" color="text.secondary">
                  Track who needs to sign, view, or be copied.
                </Typography>
              </Box>
            </Box>
            <Divider />

            <List>
              {activeDoc.recipients.map((r) => {
                const chip =
                  r.role === "Signer"
                    ? r.hasSigned
                      ? { label: "Signed", color: "success" as const }
                      : { label: "Needs Signature", color: "warning" as const }
                    : { label: r.role, color: "default" as const };

                return (
                  <ListItem
                    key={r.id}
                    secondaryAction={
                      <Chip
                        size="small"
                        label={chip.label}
                        color={chip.color}
                      />
                    }
                  >
                    <ListItemIcon>
                      <Avatar sx={{ width: 28, height: 28 }}>
                        {r.name?.trim()?.[0]?.toUpperCase() ?? "U"}
                      </Avatar>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box
                          sx={{
                            display: "flex",
                            gap: 1,
                            alignItems: "center",
                            flexWrap: "wrap",
                          }}
                        >
                          <Typography fontWeight={800}>{r.name}</Typography>
                          <Chip
                            size="small"
                            variant="outlined"
                            label={r.role}
                          />
                        </Box>
                      }
                      secondary={r.email}
                    />
                  </ListItem>
                );
              })}
            </List>

            <Divider />
            <Box sx={{ p: 2 }}>
              <Stack direction="row" spacing={1}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{ borderRadius: 999, textTransform: "none" }}
                  onClick={() =>
                    alert("In production: re-send reminders via API.")
                  }
                >
                  Send Reminder
                </Button>
                <Button
                  fullWidth
                  variant="outlined"
                  startIcon={<DeleteOutlineIcon />}
                  sx={{ borderRadius: 999, textTransform: "none" }}
                  onClick={() => deleteDoc(activeDoc.id)}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Paper>

          <Paper variant="outlined" sx={{ borderRadius: 3, mt: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography fontWeight={900}>Next Actions</Typography>
              <Typography variant="body2" color="text.secondary">
                Suggested steps to complete this document.
              </Typography>

              <Stack spacing={1.25} sx={{ mt: 2 }}>
                <InfoRow
                  title="Verify identity"
                  desc="Enable OTP email/SMS, knowledge-based checks, or eID verification for higher assurance."
                />
                <InfoRow
                  title="Secure storage"
                  desc="Keep PDFs in private storage with signed URLs and short TTL."
                />
                <InfoRow
                  title="Compliance"
                  desc="Ensure audit logs, consent capture, and retention policies match your jurisdiction."
                />
              </Stack>
            </Box>
          </Paper>
        </Box>
      </GridDetails>
    </Box>
  ) : (
    <Box>
      <Typography color="text.secondary">No document selected.</Typography>
    </Box>
  );

  return PageShell(mode === "dashboard" ? Dashboard : Details);
}

/* ----------------------- UI pieces ----------------------- */

function StatusChip({ status }: { status: DocStatus }) {
  const config =
    status === "action_required"
      ? {
          label: "Action Required",
          color: "warning" as const,
          variant: "filled" as const,
        }
      : status === "waiting_for_others"
      ? { label: "Waiting", color: "info" as const, variant: "filled" as const }
      : status === "completed"
      ? {
          label: "Completed",
          color: "success" as const,
          variant: "filled" as const,
        }
      : {
          label: "Draft",
          color: "default" as const,
          variant: "outlined" as const,
        };

  return (
    <Chip
      size="small"
      label={config.label}
      color={config.color}
      variant={config.variant}
    />
  );
}

function StatCard(props: {
  title: string;
  value: number;
  icon: React.ReactNode;
  helper: string;
}) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={800}
            letterSpacing={0.5}
          >
            {props.title}
          </Typography>
          <Typography
            variant="h4"
            fontWeight={900}
            sx={{ mt: 0.5, lineHeight: 1 }}
          >
            {props.value}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
            {props.helper}
          </Typography>
        </Box>

        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            bgcolor: "action.hover",
          }}
        >
          {props.icon}
        </Box>
      </CardContent>
    </Card>
  );
}

function InfoRow({ title, desc }: { title: string; desc: string }) {
  return (
    <Box>
      <Typography fontWeight={800}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">
        {desc}
      </Typography>
    </Box>
  );
}

/* ----------------------- Send dialog (complete flow) ----------------------- */

function SendDocumentDialog(props: {
  open: boolean;
  onClose: () => void;
  step: number;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  sending: boolean;

  control: any;
  errors: any;

  recipientsFields: { id: string }[];
  appendRecipient: () => void;
  removeRecipient: (index: number) => void;

  pickedFile?: File;
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const stepTitle =
    props.step === 0
      ? "Upload your PDF"
      : props.step === 1
      ? "Add recipients"
      : "Review & send";

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      fullScreen={fullScreen}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography fontWeight={900}>Send New Document</Typography>
          <Typography variant="body2" color="text.secondary">
            Securely send PDFs for e-signature with an audit trail.
          </Typography>
        </Box>

        <IconButton onClick={props.onClose} aria-label="Close">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stepper activeStep={props.step} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((s) => (
            <Step key={s}>
              <StepLabel>{s}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Typography fontWeight={900} sx={{ mb: 1 }}>
          {stepTitle}
        </Typography>

        {props.step === 0 ? (
          <StepUpload
            control={props.control}
            errors={props.errors}
            pickedFile={props.pickedFile}
          />
        ) : null}
        {props.step === 1 ? (
          <StepRecipients
            control={props.control}
            errors={props.errors}
            recipientsFields={props.recipientsFields}
            appendRecipient={props.appendRecipient}
            removeRecipient={props.removeRecipient}
          />
        ) : null}
        {props.step === 2 ? (
          <StepReview control={props.control} pickedFile={props.pickedFile} />
        ) : null}

        {props.sending ? <LinearProgress sx={{ mt: 2 }} /> : null}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1, justifyContent: "space-between" }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={props.step === 0 ? props.onClose : props.onBack}
          sx={{ borderRadius: 999, textTransform: "none" }}
          disabled={props.sending}
        >
          {props.step === 0 ? "Cancel" : "Back"}
        </Button>

        <Box sx={{ display: "flex", gap: 1 }}>
          {props.step < 2 ? (
            <Button
              variant="contained"
              onClick={props.onNext}
              sx={{ borderRadius: 999, textTransform: "none" }}
              disabled={props.sending}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={props.onSubmit}
              sx={{ borderRadius: 999, textTransform: "none" }}
              disabled={props.sending}
            >
              Send
            </Button>
          )}
        </Box>
      </DialogActions>
    </Dialog>
  );
}

function StepUpload({
  control,
  errors,
  pickedFile,
}: {
  control: any;
  errors: any;
  pickedFile?: File;
}) {
  return (
    <Stack spacing={2}>
      <Controller
        name="title"
        control={control}
        rules={{
          required: "Document title is required",
          minLength: { value: 3, message: "Too short" },
        }}
        render={({ field }: any) => (
          <TextField
            {...field}
            label="Document Title"
            placeholder="e.g., Service Agreement"
            error={!!errors?.title}
            helperText={errors?.title?.message}
            fullWidth
          />
        )}
      />

      <Box
        sx={{
          border: "1px dashed",
          borderColor: errors?.file ? "error.main" : "divider",
          borderRadius: 3,
          p: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", sm: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography fontWeight={900}>PDF Upload</Typography>
            <Typography variant="body2" color="text.secondary">
              Only PDFs are allowed. In production: virus scan + file validation
              + private storage.
            </Typography>

            {pickedFile ? (
              <Typography variant="body2" sx={{ mt: 1 }}>
                <b>Selected:</b> {pickedFile.name} •{" "}
                {bytesToSize(pickedFile.size)}
              </Typography>
            ) : (
              <Typography
                variant="body2"
                sx={{ mt: 1 }}
                color={errors?.file ? "error" : "text.secondary"}
              >
                {errors?.file?.message ?? "No file selected yet."}
              </Typography>
            )}
          </Box>

          <Controller
            name="file"
            control={control}
            rules={{
              required: "PDF file is required",
              validate: (v: FileList | null) => {
                const f = v?.[0];
                if (!f) return "PDF file is required";
                if (f.type !== "application/pdf") return "Must be a PDF";
                if (f.size > 20 * 1024 * 1024) return "Max file size is 20MB";
                return true;
              },
            }}
            render={({ field }: any) => (
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                component="label"
                sx={{
                  borderRadius: 999,
                  textTransform: "none",
                  whiteSpace: "nowrap",
                }}
              >
                Choose PDF
                <input
                  hidden
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => field.onChange(e.target.files)}
                />
              </Button>
            )}
          />
        </Stack>
      </Box>

      <Divider />

      <Typography variant="caption" color="text.secondary">
        Legal note: You still need proper consent capture, identity verification
        (as needed), and jurisdiction-appropriate e-sign compliance. This UI
        alone doesn’t make something legally binding.
      </Typography>
    </Stack>
  );
}

function StepRecipients(props: {
  control: any;
  errors: any;
  recipientsFields: { id: string }[];
  appendRecipient: () => void;
  removeRecipient: (index: number) => void;
}) {
  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography fontWeight={900}>Recipients</Typography>
          <Typography variant="body2" color="text.secondary">
            Add signers first, then optional viewers/CC.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={props.appendRecipient}
          sx={{ borderRadius: 999, textTransform: "none" }}
        >
          Add recipient
        </Button>
      </Box>

      <Stack spacing={2}>
        {props.recipientsFields.map((f, index) => (
          <Paper key={f.id} variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
            <Stack spacing={2}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography fontWeight={900}>Recipient {index + 1}</Typography>
                <IconButton
                  aria-label="Remove recipient"
                  onClick={() => props.removeRecipient(index)}
                  disabled={props.recipientsFields.length === 1}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Controller
                  name={`recipients.${index}.name`}
                  control={props.control}
                  rules={{ required: "Name is required" }}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Name"
                      placeholder="Jane Doe"
                      error={!!props.errors?.recipients?.[index]?.name}
                      helperText={
                        props.errors?.recipients?.[index]?.name?.message
                      }
                    />
                  )}
                />

                <Controller
                  name={`recipients.${index}.email`}
                  control={props.control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email",
                    },
                  }}
                  render={({ field }: any) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email"
                      placeholder="jane@company.com"
                      error={!!props.errors?.recipients?.[index]?.email}
                      helperText={
                        props.errors?.recipients?.[index]?.email?.message
                      }
                    />
                  )}
                />

                <Controller
                  name={`recipients.${index}.role`}
                  control={props.control}
                  rules={{ required: "Role is required" }}
                  render={({ field }: any) => (
                    <TextField {...field} select fullWidth label="Role">
                      {roles.map((r) => (
                        <MenuItem key={r} value={r}>
                          {r}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Stack>
  );
}

function StepReview({
  control,
  pickedFile,
}: {
  control: any;
  pickedFile?: File;
}) {
  // We can safely read values via Controller without re-render tricks by using a hidden render,
  // but simplest is: use Controller to display fields (read-only).
  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Typography fontWeight={900}>Summary</Typography>
        <Typography variant="body2" color="text.secondary">
          Confirm details before sending.
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={1}>
          <Controller
            name="title"
            control={control}
            render={({ field }: any) => (
              <Row label="Title" value={field.value || "—"} />
            )}
          />
          <Row
            label="PDF"
            value={
              pickedFile
                ? `${pickedFile.name} (${bytesToSize(pickedFile.size)})`
                : "—"
            }
          />

          <Controller
            name="senderName"
            control={control}
            render={({ field }: any) => (
              <Row label="Sender" value={field.value || "—"} />
            )}
          />
          <Controller
            name="senderOrg"
            control={control}
            render={({ field }: any) => (
              <Row label="Business" value={field.value || "—"} />
            )}
          />

          <Controller
            name="message"
            control={control}
            render={({ field }: any) => (
              <Row label="Message" value={field.value || "—"} multiline />
            )}
          />
        </Stack>
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Typography fontWeight={900}>Sender details</Typography>
        <Typography variant="body2" color="text.secondary">
          These appear in the email and audit trail.
        </Typography>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mt: 2 }}
        >
          <Controller
            name="senderName"
            control={control}
            rules={{ required: "Sender name is required" }}
            render={({ field, fieldState }: any) => (
              <TextField
                {...field}
                label="Your name"
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
          <Controller
            name="senderOrg"
            control={control}
            render={({ field }: any) => (
              <TextField
                {...field}
                label="Business name (optional)"
                fullWidth
              />
            )}
          />
        </Stack>

        <Controller
          name="message"
          control={control}
          render={({ field }: any) => (
            <TextField
              {...field}
              label="Message to recipients (optional)"
              placeholder="Short instructions, deadlines, etc."
              fullWidth
              multiline
              minRows={3}
              sx={{ mt: 2 }}
            />
          )}
        />
      </Paper>

      <Paper variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
        <Typography fontWeight={900}>
          Security & compliance checklist
        </Typography>
        <Stack spacing={1} sx={{ mt: 1.5 }}>
          <ChecklistItem text="Capture explicit consent to e-sign." />
          <ChecklistItem text="Store PDFs in private storage (signed URL, short TTL)." />
          <ChecklistItem text="Maintain audit trail (IP, timestamp, events)." />
          <ChecklistItem text="Use tamper-evident document hashing (server-side)." />
        </Stack>
      </Paper>
    </Stack>
  );
}

function Row({
  label,
  value,
  multiline,
}: {
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "160px 1fr" },
        gap: 1,
        alignItems: "start",
      }}
    >
      <Typography variant="body2" color="text.secondary" fontWeight={800}>
        {label}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          whiteSpace: multiline ? "pre-wrap" : "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ChecklistItem({ text }: { text: string }) {
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <CheckCircleIcon fontSize="small" />
      <Typography variant="body2" color="text.secondary">
        {text}
      </Typography>
    </Stack>
  );
}

/* ----------------------- Responsive layout helpers ----------------------- */

function Grid3({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}

function GridDetails({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.6fr 1fr" },
        gap: 2,
      }}
    >
      {children}
    </Box>
  );
}
