"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Fab,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  ArrowDownward as NextFieldIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Download as DownloadIcon,
  Lock as LockIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
} from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ContractPDF from "../ContractGenerator/ContractPDF";
import SigningDocumentViewer from "./SigningDocumentViewer";
import SignaturePad from "./SignaturePad";
import SigningStateScreen from "./SigningStateScreen";
import {
  Agreement,
  AgreementStatus,
  SignatureData,
  SigningField,
  createDefaultSigningFields,
  createDemoAgreement,
} from "./types";
import { defaultContractValues } from "../ContractGenerator/types";

// ─── Progress Steps ────────────────────────────────────────────────
const SIGNING_STEPS = ["Review Agreement", "Complete Fields", "Sign & Submit"];

interface ContractSigningPageProps {
  /** Pass a pre-filled agreement; falls back to demo data */
  agreement?: Agreement;
}

const ContractSigningPage: React.FC<ContractSigningPageProps> = ({
  agreement: propAgreement,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // ─── State ─────────────────────────────────────────────────────
  const [agreement] = useState<Agreement>(
    () => propAgreement ?? createDemoAgreement(defaultContractValues),
  );
  const [signingStatus, setSigningStatus] = useState<
    AgreementStatus | "in_progress" | "success" | "invalid"
  >(agreement.status === "pending" ? "in_progress" : agreement.status);

  const [fields, setFields] = useState<SigningField[]>(() =>
    createDefaultSigningFields(agreement.contractData.clientName),
  );
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [initials, setInitials] = useState<SignatureData | null>(null);
  const [zoom, setZoom] = useState(1);
  const [sigPadOpen, setSigPadOpen] = useState(false);
  const [sigPadMode, setSigPadMode] = useState<"signature" | "initials">(
    "signature",
  );
  const [submitting, setSubmitting] = useState(false);
  const [signedAt, setSignedAt] = useState<string | undefined>(
    agreement.signedAt,
  );

  // ─── Derived ───────────────────────────────────────────────────
  const completedCount = useMemo(
    () => fields.filter((f) => f.completed).length,
    [fields],
  );
  const totalRequired = useMemo(
    () => fields.filter((f) => f.required).length,
    [fields],
  );
  const progress =
    totalRequired > 0 ? (completedCount / totalRequired) * 100 : 0;
  const allComplete = completedCount === totalRequired;

  const activeStep = useMemo(() => {
    if (progress === 0) return 0;
    if (!allComplete) return 1;
    return 2;
  }, [progress, allComplete]);

  const nextIncompleteField = useMemo(
    () => fields.find((f) => f.required && !f.completed),
    [fields],
  );

  // ─── Handlers ──────────────────────────────────────────────────
  const handleFieldChange = useCallback(
    (fieldId: string, value: string | boolean) => {
      setFields((prev) =>
        prev.map((f) => {
          if (f.id !== fieldId) return f;
          const completed =
            typeof value === "boolean" ? value : value.trim().length > 0;
          return { ...f, value, completed };
        }),
      );
    },
    [],
  );

  const handleSignatureAdopt = useCallback(
    (data: SignatureData) => {
      if (sigPadMode === "signature") {
        setSignature(data);
        setFields((prev) =>
          prev.map((f) =>
            f.id === "client-signature"
              ? { ...f, completed: true, value: data.dataUrl }
              : f,
          ),
        );
      } else {
        setInitials(data);
        setFields((prev) =>
          prev.map((f) =>
            f.type === "initials"
              ? { ...f, completed: true, value: data.dataUrl }
              : f,
          ),
        );
      }
    },
    [sigPadMode],
  );

  const openSignaturePad = useCallback(() => {
    setSigPadMode("signature");
    setSigPadOpen(true);
  }, []);

  const openInitialsPad = useCallback(() => {
    setSigPadMode("initials");
    setSigPadOpen(true);
  }, []);

  const scrollToNextField = useCallback(() => {
    if (nextIncompleteField) {
      const el = document.getElementById(nextIncompleteField.sectionRef);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [nextIncompleteField]);

  const handleFinish = useCallback(async () => {
    if (!allComplete) return;
    setSubmitting(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 2000));
    const now = new Date().toISOString();
    setSignedAt(now);
    setSigningStatus("success");
    setSubmitting(false);
  }, [allComplete]);

  // ─── Non-signable states ───────────────────────────────────────
  if (
    signingStatus === "signed" ||
    signingStatus === "expired" ||
    signingStatus === "cancelled" ||
    signingStatus === "invalid"
  ) {
    return (
      <SigningStateScreen
        status={signingStatus}
        signerName={agreement.signerName}
        referenceNumber={agreement.referenceNumber}
        signedAt={signedAt}
      />
    );
  }

  if (signingStatus === "success") {
    return (
      <SigningStateScreen
        status="success"
        signerName={agreement.signerName}
        referenceNumber={agreement.referenceNumber}
        signedAt={signedAt}
        onDownload={() => {
          // Trigger download via hidden link
        }}
      />
    );
  }

  // ─── Action Panel Content ──────────────────────────────────────
  const actionPanel = (
    <Box
      sx={{
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        height: "100%",
      }}
    >
      {/* Signer Info */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          Signer
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {agreement.signerName || "Client"}
        </Typography>
        {agreement.signerEmail && (
          <Typography variant="body2" color="text.secondary">
            {agreement.signerEmail}
          </Typography>
        )}
      </Box>

      {/* Agreement Info */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          Agreement
        </Typography>
        <Typography variant="body2" fontWeight="bold">
          {agreement.title}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ref: {agreement.referenceNumber}
        </Typography>
      </Box>

      {/* Progress */}
      <Box>
        <Typography variant="caption" color="text.secondary">
          Progress
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 4, my: 0.5 }}
        />
        <Typography variant="caption">
          {completedCount} of {totalRequired} required fields completed
        </Typography>
      </Box>

      {/* Steps */}
      <Stepper activeStep={activeStep} orientation="vertical" sx={{ mt: 1 }}>
        {SIGNING_STEPS.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Required Fields List */}
      <Box sx={{ flex: 1, overflow: "auto" }}>
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mb={1}
        >
          Required Actions
        </Typography>
        <Stack spacing={0.5}>
          {fields
            .filter((f) => f.required)
            .map((f) => (
              <Chip
                key={f.id}
                size="small"
                icon={f.completed ? <CheckIcon /> : undefined}
                label={f.label}
                color={f.completed ? "success" : "default"}
                variant={f.completed ? "filled" : "outlined"}
                onClick={() => {
                  const el = document.getElementById(f.sectionRef);
                  if (el)
                    el.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                }}
                sx={{ justifyContent: "flex-start", cursor: "pointer" }}
              />
            ))}
        </Stack>
      </Box>

      {/* Finish button */}
      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!allComplete || submitting}
        onClick={handleFinish}
        startIcon={
          submitting ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            <CheckIcon />
          )
        }
      >
        {submitting ? "Submitting..." : "Finish Signing"}
      </Button>
    </Box>
  );

  // ─── Render ────────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f0f2f5",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ─── Top Bar ───── */}
      <AppBar
        position="sticky"
        elevation={1}
        color="inherit"
        sx={{ bgcolor: "#fff", borderBottom: "1px solid #e0e0e0" }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 1,
            minHeight: { xs: 56 },
          }}
        >
          {/* Left: branding */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LockIcon color="success" fontSize="small" />
            <Typography
              variant="subtitle1"
              fontWeight="bold"
              sx={{ display: { xs: "none", sm: "block" } }}
            >
              INRI Paint &amp; Wall LLC
            </Typography>
            <Chip
              size="small"
              label="Secure Signing"
              color="success"
              variant="outlined"
            />
          </Box>

          {/* Center: progress (desktop) */}
          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flex: 1,
                maxWidth: 400,
                mx: 2,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ flex: 1, height: 6, borderRadius: 3 }}
              />
              <Typography variant="caption" whiteSpace="nowrap">
                {completedCount}/{totalRequired}
              </Typography>
            </Box>
          )}

          {/* Right: zoom + actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <Tooltip title="Zoom out">
              <span>
                <IconButton
                  size="small"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  disabled={zoom <= 0.5}
                >
                  <ZoomOutIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Typography
              variant="caption"
              sx={{ minWidth: 36, textAlign: "center" }}
            >
              {Math.round(zoom * 100)}%
            </Typography>
            <Tooltip title="Zoom in">
              <span>
                <IconButton
                  size="small"
                  onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
                  disabled={zoom >= 1.5}
                >
                  <ZoomInIcon />
                </IconButton>
              </span>
            </Tooltip>

            {/* Download PDF */}
            <PDFDownloadLink
              document={<ContractPDF data={agreement.contractData} />}
              fileName={`contract-${agreement.referenceNumber}.pdf`}
              style={{ textDecoration: "none" }}
            >
              {({ loading }) => (
                <Tooltip title="Download PDF">
                  <span>
                    <IconButton size="small" disabled={loading}>
                      <DownloadIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
            </PDFDownloadLink>
          </Box>
        </Toolbar>

        {/* Mobile progress bar */}
        {isMobile && (
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 4 }}
          />
        )}
      </AppBar>

      {/* ─── Main Content ───── */}
      <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* Document Viewer Area */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            py: 3,
            px: { xs: 1, md: 3 },
          }}
        >
          <SigningDocumentViewer
            data={agreement.contractData}
            fields={fields}
            signature={signature}
            initials={initials}
            zoom={zoom}
            onFieldChange={handleFieldChange}
            onOpenSignature={openSignaturePad}
            onOpenInitials={openInitialsPad}
          />
        </Box>

        {/* Desktop Side Panel */}
        {!isMobile && (
          <Paper
            elevation={2}
            sx={{
              width: 300,
              flexShrink: 0,
              overflow: "auto",
              borderLeft: "1px solid #e0e0e0",
            }}
          >
            {actionPanel}
          </Paper>
        )}
      </Box>

      {/* ─── Mobile Bottom Bar ───── */}
      {isMobile && (
        <Paper
          elevation={8}
          sx={{
            position: "sticky",
            bottom: 0,
            p: 1.5,
            display: "flex",
            gap: 1,
            alignItems: "center",
            borderTop: "1px solid #e0e0e0",
            zIndex: 10,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" display="block">
              {completedCount}/{totalRequired} completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>

          {nextIncompleteField && (
            <Button
              size="small"
              variant="outlined"
              onClick={scrollToNextField}
              startIcon={<NextFieldIcon />}
            >
              Next
            </Button>
          )}

          <Button
            size="small"
            variant="contained"
            disabled={!allComplete || submitting}
            onClick={handleFinish}
            startIcon={
              submitting ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <CheckIcon />
              )
            }
          >
            {submitting ? "..." : "Finish"}
          </Button>
        </Paper>
      )}

      {/* ─── Desktop FAB: Jump to next field ───── */}
      {!isMobile && nextIncompleteField && (
        <Tooltip title={`Next: ${nextIncompleteField.label}`}>
          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 24, right: 340 }}
            onClick={scrollToNextField}
          >
            <NextFieldIcon />
          </Fab>
        </Tooltip>
      )}

      {/* ─── Signature Pad Modal ───── */}
      <SignaturePad
        open={sigPadOpen}
        onClose={() => setSigPadOpen(false)}
        onAdopt={handleSignatureAdopt}
        mode={sigPadMode}
        existingData={sigPadMode === "signature" ? signature : initials}
      />
    </Box>
  );
};

export default ContractSigningPage;
