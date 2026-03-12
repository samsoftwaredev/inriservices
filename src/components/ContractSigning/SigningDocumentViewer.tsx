"use client";

import React from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  TextField,
  Typography,
} from "@mui/material";
import {
  Draw as DrawIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import { ContractFormData } from "../ContractGenerator/types";
import { SignatureData, SigningField } from "./types";

// ─── Helpers ───────────────────────────────────────────────────────
const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value || "___________";
  return `$${num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const formatDate = (value: string): string => {
  if (!value) return "___________";
  const d = new Date(value + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatTime = (value: string): string => {
  if (!value) return "___________";
  const [h, m] = value.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  return `${h12}:${m} ${ampm}`;
};

// ─── Signing field wrapper ─────────────────────────────────────────
const SigningFieldBlock: React.FC<{
  field: SigningField;
  children: React.ReactNode;
}> = ({ field, children }) => (
  <Box
    id={field.sectionRef}
    sx={{
      my: 2,
      p: 2,
      border: "2px solid",
      borderColor: field.completed ? "success.main" : "warning.main",
      borderRadius: 1,
      bgcolor: field.completed ? "success.light" : "warning.light",
      position: "relative",
      transition: "all 0.3s ease",
    }}
  >
    <Chip
      size="small"
      icon={field.completed ? <CheckIcon /> : <UncheckedIcon />}
      label={field.completed ? "Completed" : "Required"}
      color={field.completed ? "success" : "warning"}
      sx={{ position: "absolute", top: -12, right: 12 }}
    />
    {children}
  </Box>
);

// ─── Section Title ─────────────────────────────────────────────────
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
    {children}
  </Typography>
);

const FieldRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Typography variant="body1" mb={0.5}>
    {label}: <strong>{value || "___________"}</strong>
  </Typography>
);

// ─── Main Component ────────────────────────────────────────────────
interface SigningDocumentViewerProps {
  data: ContractFormData;
  fields: SigningField[];
  signature: SignatureData | null;
  initials: SignatureData | null;
  zoom: number;
  onFieldChange: (fieldId: string, value: string | boolean) => void;
  onOpenSignature: () => void;
  onOpenInitials: () => void;
}

const SigningDocumentViewer: React.FC<SigningDocumentViewerProps> = ({
  data,
  fields,
  signature,
  initials,
  zoom,
  onFieldChange,
  onOpenSignature,
  onOpenInitials,
}) => {
  const getField = (id: string) => fields.find((f) => f.id === id)!;

  const renderSignatureImage = (sigData: SignatureData | null, alt: string) => {
    if (!sigData) return null;
    return (
      <Box
        component="img"
        src={sigData.dataUrl}
        alt={alt}
        sx={{
          maxWidth: 250,
          maxHeight: 80,
          display: "block",
          mt: 1,
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        transform: `scale(${zoom})`,
        transformOrigin: "top center",
        transition: "transform 0.2s ease",
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          mx: "auto",
          p: { xs: 2, md: 4 },
          bgcolor: "#fff",
          border: "1px solid #ddd",
          borderRadius: 2,
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          fontFamily: "'Georgia', serif",
        }}
      >
        {/* ───── Header ───── */}
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
        >
          INRI Paint &amp; Wall LLC
        </Typography>
        <Typography
          variant="h6"
          textAlign="center"
          color="text.secondary"
          mb={2}
        >
          Contract Agreement
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {/* ───── Intro ───── */}
        <Typography variant="body1" mb={2}>
          This Painting Contract Agreement (&ldquo;Agreement&rdquo;) is entered
          into on <strong>{formatDate(data.agreementDate)}</strong> by and
          between{" "}
          <strong>INRI Paint &amp; Wall LLC (&ldquo;Contractor&rdquo;)</strong>,
          located in Dallas, TX, and{" "}
          <strong>
            {data.clientName || "___________"} (&ldquo;Client&rdquo;)
          </strong>{" "}
          residing at <strong>{data.clientAddress || "___________"}</strong>.
        </Typography>

        <Divider />

        {/* ───── 1. Contact Information ───── */}
        <SectionTitle>1. Contact Information</SectionTitle>
        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
          Contractor:
        </Typography>
        <Box sx={{ pl: 2, mb: 1 }}>
          <FieldRow label="Company" value="INRI Paint & Wall LLC" />
          <FieldRow
            label="Address"
            value="5900 Balcones Drive, STE 100, Austin, TX 78731"
          />
          <FieldRow label="Phone" value="214-400-1397" />
          <FieldRow label="Email" value="samuel@inripaintwall.com" />
        </Box>
        <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
          Client:
        </Typography>
        <Box sx={{ pl: 2, mb: 1 }}>
          <FieldRow label="Name" value={data.clientName} />
          <FieldRow label="Address" value={data.clientAddress} />
          <FieldRow label="Phone" value={data.clientPhone} />
          <FieldRow label="Email" value={data.clientEmail} />
        </Box>

        <Divider />

        {/* ───── 2. Scope of Work ───── */}
        <SectionTitle>2. Scope of Work</SectionTitle>
        <Typography variant="body1" mb={1}>
          Contractor agrees to provide painting and/or drywall services at the
          address provided by the Client.
        </Typography>
        <FieldRow label="Type of project" value={data.typeOfProject} />
        <Typography variant="body1" mt={1} mb={0.5}>
          Customer&apos;s Details:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ pl: 2, mb: 1, whiteSpace: "pre-wrap" }}
        >
          {data.customerDetails || "___________"}
        </Typography>
        <FieldRow label="Areas/Rooms" value={data.areasRooms} />
        <FieldRow label="Prep Work" value={data.prepWork} />
        <FieldRow label="Number of coats" value={data.numberOfCoats} />
        <FieldRow label="Paint brand/type" value={data.paintBrand} />
        <Typography variant="body1" mt={1} mb={0.5}>
          Exclusions:
        </Typography>
        <Typography
          variant="body1"
          fontWeight="bold"
          sx={{ pl: 2, mb: 1, whiteSpace: "pre-wrap" }}
        >
          {data.exclusions || "None"}
        </Typography>
        <Typography variant="body1" mt={1}>
          Photos may be taken before and after for clarity and project tracking.
        </Typography>

        {/* Initials: Scope of Work */}
        <SigningFieldBlock field={getField("initial-scope")}>
          <Typography variant="body2" fontWeight="bold" mb={1}>
            Please initial to acknowledge the Scope of Work:
          </Typography>
          {initials ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderSignatureImage(initials, "Initials")}
              <Button size="small" onClick={onOpenInitials}>
                Change
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<DrawIcon />}
              onClick={onOpenInitials}
            >
              Add Initials
            </Button>
          )}
        </SigningFieldBlock>

        <Divider />

        {/* ───── 3. Project Timeline ───── */}
        <SectionTitle>3. Project Timeline</SectionTitle>
        <Typography variant="body1" mb={1}>
          Work is to begin on <strong>{formatDate(data.startDate)}</strong> and
          is estimated to be completed by{" "}
          <strong>{formatDate(data.completionDate)}</strong>, excluding weather
          delays or material backorders.
        </Typography>
        <Typography variant="body1">
          Work hours will be from{" "}
          <strong>{formatTime(data.workStartTime)}</strong> to{" "}
          <strong>{formatTime(data.workEndTime)}</strong>.
        </Typography>

        <Divider />

        {/* ───── 4. Payment Terms ───── */}
        <SectionTitle>4. Payment Terms</SectionTitle>
        <FieldRow label="Total Cost" value={formatCurrency(data.totalCost)} />
        <Typography variant="body1" mb={0.5}>
          Deposit: <strong>{formatCurrency(data.depositAmount)}</strong> due
          before project start.
        </Typography>
        <Typography variant="body1" mb={0.5}>
          The remaining balance is due upon completion and client approval.
        </Typography>
        <Typography variant="body1">
          Accepted Payment Methods: Zelle, Cash, Credit Card, Debit Card.
        </Typography>

        {/* Initials: Payment Terms */}
        <SigningFieldBlock field={getField("initial-payment")}>
          <Typography variant="body2" fontWeight="bold" mb={1}>
            Please initial to acknowledge the Payment Terms:
          </Typography>
          {initials ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderSignatureImage(initials, "Initials")}
              <Button size="small" onClick={onOpenInitials}>
                Change
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<DrawIcon />}
              onClick={onOpenInitials}
            >
              Add Initials
            </Button>
          )}
        </SigningFieldBlock>

        <Divider />

        {/* ───── 5. Warranty ───── */}
        <SectionTitle>5. Warranty &amp; Satisfaction Guarantee</SectionTitle>
        <Typography variant="body1" mb={1}>
          INRI Paint &amp; Wall LLC stands behind the quality of our
          craftsmanship and is committed to your satisfaction.
        </Typography>
        <Typography variant="body1" mb={1}>
          We offer a <strong>{data.warrantyMonths || "___"} month(s)</strong>{" "}
          limited warranty on workmanship.
        </Typography>
        <Typography variant="body1" mb={1}>
          If any defects in workmanship are found within the warranty period, we
          will return to correct the issue at no additional cost to the Client.
        </Typography>
        <Typography variant="body1">
          This warranty does not cover damage caused by the Client, normal wear
          and tear, moisture, settling, or improper surface preparation done by
          others.
        </Typography>

        {/* Initials: Warranty */}
        <SigningFieldBlock field={getField("initial-warranty")}>
          <Typography variant="body2" fontWeight="bold" mb={1}>
            Please initial to acknowledge the Warranty Terms:
          </Typography>
          {initials ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {renderSignatureImage(initials, "Initials")}
              <Button size="small" onClick={onOpenInitials}>
                Change
              </Button>
            </Box>
          ) : (
            <Button
              variant="outlined"
              startIcon={<DrawIcon />}
              onClick={onOpenInitials}
            >
              Add Initials
            </Button>
          )}
        </SigningFieldBlock>

        <Divider />

        {/* ───── 6. Client Responsibilities ───── */}
        <SectionTitle>6. Client Responsibilities</SectionTitle>
        <Typography variant="body1">
          The Client agrees to provide access to the work areas during scheduled
          work hours. Furniture, personal items, and fragile objects should be
          moved away from work areas prior to the start date. INRI Paint &amp;
          Wall LLC is not responsible for items left in work areas.
        </Typography>

        <Divider />

        {/* ───── 7. Change Orders ───── */}
        <SectionTitle>7. Change Orders</SectionTitle>
        <Typography variant="body1">
          Any changes to the scope of work after this Agreement is signed must
          be agreed upon in writing by both parties. Additional work may result
          in additional charges and extended timelines.
        </Typography>

        <Divider />

        {/* ───── 8. Cancellation Policy ───── */}
        <SectionTitle>8. Cancellation Policy</SectionTitle>
        <Typography variant="body1">
          Either party may cancel this Agreement with written notice. If the
          Client cancels after work has begun, the Client is responsible for
          payment of all work completed to date. The deposit is non-refundable
          once materials have been purchased or work has commenced.
        </Typography>

        <Divider />

        {/* ───── 9. Liability ───── */}
        <SectionTitle>9. Liability</SectionTitle>
        <Typography variant="body1">
          INRI Paint &amp; Wall LLC carries general liability insurance. The
          Contractor is not responsible for pre-existing conditions including
          but not limited to: mold, rot, structural damage, or surfaces not part
          of the agreed scope.
        </Typography>

        <Divider />

        {/* ───── 10. Dispute Resolution ───── */}
        <SectionTitle>10. Dispute Resolution</SectionTitle>
        <Typography variant="body1">
          In the event of a dispute, both parties agree to attempt resolution
          through direct communication. If a resolution cannot be reached, both
          parties agree to seek mediation before pursuing legal action. This
          Agreement is governed by the laws of the State of Texas.
        </Typography>

        <Divider />

        {/* ───── 11. Entire Agreement ───── */}
        <SectionTitle>11. Entire Agreement</SectionTitle>
        <Typography variant="body1">
          This document constitutes the entire agreement between the parties and
          supersedes all prior discussions, negotiations, and agreements. Any
          amendments must be made in writing and signed by both parties.
        </Typography>

        <Divider />

        {/* ───── 12. Acceptance & Signatures ───── */}
        <SectionTitle>12. Acceptance &amp; Signatures</SectionTitle>
        <Typography variant="body1" mb={2}>
          By signing below, both parties agree to the terms and conditions
          outlined in this Agreement.
        </Typography>

        {/* Review checkbox */}
        <SigningFieldBlock field={getField("review-contract")}>
          <FormControlLabel
            control={
              <Checkbox
                checked={getField("review-contract").value === true}
                onChange={(e) =>
                  onFieldChange("review-contract", e.target.checked)
                }
              />
            }
            label="I have reviewed the entire contract above"
          />
        </SigningFieldBlock>

        {/* Full legal name */}
        <SigningFieldBlock field={getField("confirm-identity")}>
          <Typography variant="body2" fontWeight="bold" mb={1}>
            Confirm your full legal name:
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={getField("confirm-identity").value as string}
            onChange={(e) => onFieldChange("confirm-identity", e.target.value)}
            placeholder="Enter your full legal name"
          />
        </SigningFieldBlock>

        {/* Client Signature */}
        <Box mt={3}>
          <Typography variant="body1" mb={0.5}>
            Client Signature &amp; Date:
          </Typography>

          <SigningFieldBlock field={getField("client-signature")}>
            {signature ? (
              <Box>
                {renderSignatureImage(signature, "Client Signature")}
                <Button size="small" onClick={onOpenSignature} sx={{ mt: 1 }}>
                  Change Signature
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                startIcon={<DrawIcon />}
                onClick={onOpenSignature}
              >
                Sign Here
              </Button>
            )}
          </SigningFieldBlock>

          <Typography variant="body1" fontWeight="bold" mt={1}>
            {(getField("confirm-identity").value as string) ||
              data.clientSignatureName ||
              "___________"}
          </Typography>
        </Box>

        {/* Signing Date */}
        <SigningFieldBlock field={getField("signing-date")}>
          <Typography variant="body2" fontWeight="bold" mb={1}>
            Date of Signing:
          </Typography>
          <Typography variant="body1">
            {formatDate(getField("signing-date").value as string)}
          </Typography>
        </SigningFieldBlock>

        {/* Contractor Signature */}
        <Box mt={3}>
          <Typography variant="body1" mb={0.5}>
            Contractor Signature &amp; Date:
          </Typography>
          <Box
            sx={{
              borderBottom: "2px solid #000",
              width: 300,
              mt: 5,
              mb: 0.5,
            }}
          />
          <Typography variant="body1" fontWeight="bold">
            INRI Paint &amp; Wall LLC
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.contractorName || "Samuel / INRI Paint & Wall LLC"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Date: ___________________
          </Typography>
        </Box>

        <Divider sx={{ mt: 4, mb: 2 }} />

        {/* ───── E-Sign Consent ───── */}
        <SigningFieldBlock field={getField("consent-esign")}>
          <Typography variant="body2" mb={1}>
            <strong>Electronic Signature Consent:</strong> By checking below, I
            agree that my electronic signature is the legal equivalent of my
            manual/handwritten signature and I consent to be legally bound by
            this agreement.
          </Typography>
          <FormControlLabel
            control={
              <Checkbox
                checked={getField("consent-esign").value === true}
                onChange={(e) =>
                  onFieldChange("consent-esign", e.target.checked)
                }
              />
            }
            label="I consent to electronic signature"
          />
        </SigningFieldBlock>

        <SigningFieldBlock field={getField("terms-accepted")}>
          <FormControlLabel
            control={
              <Checkbox
                checked={getField("terms-accepted").value === true}
                onChange={(e) =>
                  onFieldChange("terms-accepted", e.target.checked)
                }
              />
            }
            label="I have read and agree to all terms and conditions in this agreement"
          />
        </SigningFieldBlock>
      </Box>
    </Box>
  );
};

export default SigningDocumentViewer;
