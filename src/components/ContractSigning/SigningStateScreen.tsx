"use client";

import React from "react";
import { Box, Button, Paper, Typography } from "@mui/material";
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  AccessTime as ExpiredIcon,
  Error as ErrorIcon,
  Description as DocIcon,
  Download as DownloadIcon,
} from "@mui/icons-material";
import { AgreementStatus } from "./types";

interface SigningStateScreenProps {
  status: AgreementStatus | "invalid" | "success";
  signerName?: string;
  referenceNumber?: string;
  signedAt?: string;
  onDownload?: () => void;
}

const stateConfig: Record<
  string,
  {
    icon: React.ReactNode;
    title: string;
    description: string;
    color: string;
    bgColor: string;
  }
> = {
  pending: {
    icon: <DocIcon sx={{ fontSize: 64 }} />,
    title: "Agreement Pending",
    description:
      "This agreement is waiting for your review and signature. Please continue to complete the signing process.",
    color: "#1976d2",
    bgColor: "#e3f2fd",
  },
  signed: {
    icon: <CheckCircleIcon sx={{ fontSize: 64 }} />,
    title: "Agreement Already Signed",
    description:
      "This agreement has already been signed. No further action is required.",
    color: "#2e7d32",
    bgColor: "#e8f5e9",
  },
  success: {
    icon: <CheckCircleIcon sx={{ fontSize: 64 }} />,
    title: "Agreement Signed Successfully!",
    description:
      "Your signature has been recorded. A copy of the signed agreement is available for download.",
    color: "#2e7d32",
    bgColor: "#e8f5e9",
  },
  expired: {
    icon: <ExpiredIcon sx={{ fontSize: 64 }} />,
    title: "Agreement Expired",
    description:
      "This agreement has expired and can no longer be signed. Please contact the contractor for a new agreement.",
    color: "#ed6c02",
    bgColor: "#fff3e0",
  },
  cancelled: {
    icon: <CancelIcon sx={{ fontSize: 64 }} />,
    title: "Agreement Cancelled",
    description:
      "This agreement has been cancelled by the contractor and is no longer valid.",
    color: "#d32f2f",
    bgColor: "#ffebee",
  },
  invalid: {
    icon: <ErrorIcon sx={{ fontSize: 64 }} />,
    title: "Invalid Agreement Link",
    description:
      "The agreement link is invalid or has been removed. Please check the link or contact INRI Paint & Wall LLC.",
    color: "#d32f2f",
    bgColor: "#ffebee",
  },
};

const SigningStateScreen: React.FC<SigningStateScreenProps> = ({
  status,
  signerName,
  referenceNumber,
  signedAt,
  onDownload,
}) => {
  const config = stateConfig[status] || stateConfig.invalid;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          p: { xs: 3, md: 5 },
          borderRadius: 3,
        }}
      >
        {/* Company branding */}
        <Typography
          variant="h6"
          fontWeight="bold"
          color="text.secondary"
          mb={3}
        >
          INRI Paint &amp; Wall LLC
        </Typography>

        {/* Icon */}
        <Box
          sx={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            bgcolor: config.bgColor,
            color: config.color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 3,
          }}
        >
          {config.icon}
        </Box>

        {/* Title */}
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {config.title}
        </Typography>

        {/* Description */}
        <Typography variant="body1" color="text.secondary" mb={3}>
          {config.description}
        </Typography>

        {/* Details */}
        {(signerName || referenceNumber || signedAt) && (
          <Box
            sx={{
              bgcolor: "#fafafa",
              borderRadius: 2,
              p: 2,
              mb: 3,
              textAlign: "left",
            }}
          >
            {signerName && (
              <Typography variant="body2" mb={0.5}>
                <strong>Signer:</strong> {signerName}
              </Typography>
            )}
            {referenceNumber && (
              <Typography variant="body2" mb={0.5}>
                <strong>Reference:</strong> {referenceNumber}
              </Typography>
            )}
            {signedAt && (
              <Typography variant="body2">
                <strong>Signed at:</strong>{" "}
                {new Date(signedAt).toLocaleString("en-US", {
                  dateStyle: "long",
                  timeStyle: "short",
                })}
              </Typography>
            )}
          </Box>
        )}

        {/* Download button on success */}
        {(status === "success" || status === "signed") && onDownload && (
          <Button
            variant="contained"
            size="large"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
            fullWidth
            sx={{ mb: 2 }}
          >
            Download Signed Copy
          </Button>
        )}

        {/* Footer */}
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          mt={2}
        >
          INRI Paint &amp; Wall LLC &bull; 5900 Balcones Drive, STE 100, Austin,
          TX 78731
          <br />
          214-400-1397 &bull; samuel@inripaintwall.com
        </Typography>
      </Paper>
    </Box>
  );
};

export default SigningStateScreen;
