"use client";

import React from "react";
import { Box, Divider, Typography } from "@mui/material";
import { ContractFormData } from "./types";

const formatCurrency = (value: string): string => {
  const num = parseFloat(value);
  if (isNaN(num)) return value || "___________";
  return `$${num.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

const blank = (val: string) => val || "___________";

interface ContractPreviewProps {
  data: ContractFormData;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Typography variant="h6" fontWeight="bold" mt={3} mb={1}>
    {children}
  </Typography>
);

const Field: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <Typography variant="body1" mb={0.5}>
    {label}: <strong>{value}</strong>
  </Typography>
);

const ContractPreview: React.FC<ContractPreviewProps> = ({ data }) => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: "#fff",
        border: "1px solid #ddd",
        borderRadius: 2,
        fontFamily: "'Georgia', serif",
        maxWidth: 800,
        mx: "auto",
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
      >
        INRI Paint &amp; Wall LLC
      </Typography>
      <Typography variant="h6" textAlign="center" color="text.secondary" mb={2}>
        Contract Agreement
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="body1" mb={2}>
        This Painting Contract Agreement (&ldquo;Agreement&rdquo;) is entered
        into on <strong>{formatDate(data.agreementDate)}</strong> by and between{" "}
        <strong>INRI Paint &amp; Wall LLC (&ldquo;Contractor&rdquo;)</strong>,
        located in Dallas, TX, and{" "}
        <strong>{blank(data.clientName)} (&ldquo;Client&rdquo;)</strong>{" "}
        residing at <strong>{blank(data.clientAddress)}</strong>.
      </Typography>

      <Divider />

      {/* 1. Contact Information */}
      <SectionTitle>1. Contact Information</SectionTitle>

      <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
        Contractor:
      </Typography>
      <Box sx={{ pl: 2, mb: 1 }}>
        <Field label="Company" value="INRI Paint & Wall LLC" />
        <Field
          label="Address"
          value="5900 Balcones Drive, STE 100, Austin, TX 78731"
        />
        <Field label="Phone" value="214-400-1397" />
        <Field label="Email" value="samuel@inripaintwall.com" />
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
        Client:
      </Typography>
      <Box sx={{ pl: 2, mb: 1 }}>
        <Field label="Name" value={blank(data.clientName)} />
        <Field label="Address" value={blank(data.clientAddress)} />
        <Field label="Phone" value={blank(data.clientPhone)} />
        <Field label="Email" value={blank(data.clientEmail)} />
      </Box>

      <Divider />

      {/* 2. Scope of Work */}
      <SectionTitle>2. Scope of Work</SectionTitle>
      <Typography variant="body1" mb={1}>
        Contractor agrees to provide painting and/or drywall services at the
        address provided by the Client.
      </Typography>
      <Field label="Type of project" value={blank(data.typeOfProject)} />
      <Typography variant="body1" mt={1} mb={0.5}>
        Customer&apos;s Details:
      </Typography>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ pl: 2, mb: 1, whiteSpace: "pre-wrap" }}
      >
        {blank(data.customerDetails)}
      </Typography>
      <Field label="Areas/Rooms" value={blank(data.areasRooms)} />
      <Field label="Prep Work" value={blank(data.prepWork)} />
      <Field label="Number of coats" value={blank(data.numberOfCoats)} />
      <Field label="Paint brand/type" value={blank(data.paintBrand)} />
      <Typography variant="body1" mt={1} mb={0.5}>
        Exclusions:
      </Typography>
      <Typography
        variant="body1"
        fontWeight="bold"
        sx={{ pl: 2, mb: 1, whiteSpace: "pre-wrap" }}
      >
        {blank(data.exclusions)}
      </Typography>
      <Typography variant="body1" mt={1}>
        Photos may be taken before and after for clarity and project tracking.
      </Typography>

      <Divider />

      {/* 3. Project Timeline */}
      <SectionTitle>3. Project Timeline</SectionTitle>
      <Typography variant="body1" mb={1}>
        Work is to begin on <strong>{formatDate(data.startDate)}</strong> and is
        estimated to be completed by{" "}
        <strong>{formatDate(data.completionDate)}</strong>, excluding weather
        delays or material backorders.
      </Typography>
      <Typography variant="body1">
        Work hours will be from{" "}
        <strong>{formatTime(data.workStartTime)}</strong> to{" "}
        <strong>{formatTime(data.workEndTime)}</strong>.
      </Typography>

      <Divider />

      {/* 4. Payment Terms */}
      <SectionTitle>4. Payment Terms</SectionTitle>
      <Field label="Total Cost" value={formatCurrency(data.totalCost)} />
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

      <Divider />

      {/* 5. Warranty */}
      <SectionTitle>5. Warranty &amp; Satisfaction Guarantee</SectionTitle>
      <Typography variant="body1" mb={1}>
        INRI Paint &amp; Wall LLC stands behind the quality of our craftsmanship
        and is committed to your satisfaction.
      </Typography>
      <Typography variant="body1" mb={1}>
        We offer a <strong>{blank(data.warrantyMonths)} month(s)</strong>{" "}
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

      <Divider />

      {/* 6. Client Responsibilities */}
      <SectionTitle>6. Client Responsibilities</SectionTitle>
      <Typography variant="body1">
        The Client agrees to provide access to the work areas during scheduled
        work hours. Furniture, personal items, and fragile objects should be
        moved away from work areas prior to the start date. INRI Paint &amp;
        Wall LLC is not responsible for items left in work areas.
      </Typography>

      <Divider />

      {/* 7. Change Orders */}
      <SectionTitle>7. Change Orders</SectionTitle>
      <Typography variant="body1">
        Any changes to the scope of work after this Agreement is signed must be
        agreed upon in writing by both parties. Additional work may result in
        additional charges and extended timelines.
      </Typography>

      <Divider />

      {/* 8. Cancellation Policy */}
      <SectionTitle>8. Cancellation Policy</SectionTitle>
      <Typography variant="body1">
        Either party may cancel this Agreement with written notice. If the
        Client cancels after work has begun, the Client is responsible for
        payment of all work completed to date. The deposit is non-refundable
        once materials have been purchased or work has commenced.
      </Typography>

      <Divider />

      {/* 9. Liability */}
      <SectionTitle>9. Liability</SectionTitle>
      <Typography variant="body1">
        INRI Paint &amp; Wall LLC carries general liability insurance. The
        Contractor is not responsible for pre-existing conditions including but
        not limited to: mold, rot, structural damage, or surfaces not part of
        the agreed scope.
      </Typography>

      <Divider />

      {/* 10. Dispute Resolution */}
      <SectionTitle>10. Dispute Resolution</SectionTitle>
      <Typography variant="body1">
        In the event of a dispute, both parties agree to attempt resolution
        through direct communication. If a resolution cannot be reached, both
        parties agree to seek mediation before pursuing legal action. This
        Agreement is governed by the laws of the State of Texas.
      </Typography>

      <Divider />

      {/* 11. Entire Agreement */}
      <SectionTitle>11. Entire Agreement</SectionTitle>
      <Typography variant="body1">
        This document constitutes the entire agreement between the parties and
        supersedes all prior discussions, negotiations, and agreements. Any
        amendments must be made in writing and signed by both parties.
      </Typography>

      <Divider />

      {/* 12. Signatures */}
      <SectionTitle>12. Acceptance &amp; Signatures</SectionTitle>
      <Typography variant="body1" mb={2}>
        By signing below, both parties agree to the terms and conditions
        outlined in this Agreement.
      </Typography>

      <Box>
        <Typography variant="body1" mb={0.5}>
          Client Signature &amp; Date:
        </Typography>
        <Box
          sx={{ borderBottom: "2px solid #000", width: 300, mt: 5, mb: 0.5 }}
        />
        <Typography variant="body1" fontWeight="bold">
          {blank(data.clientSignatureName)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: ___________________
        </Typography>
      </Box>

      <Box mt={4}>
        <Typography variant="body1" mb={0.5}>
          Contractor Signature &amp; Date:
        </Typography>
        <Box
          sx={{ borderBottom: "2px solid #000", width: 300, mt: 5, mb: 0.5 }}
        />
        <Typography variant="body1" fontWeight="bold">
          INRI Paint &amp; Wall LLC
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {blank(data.contractorName)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Date: ___________________
        </Typography>
      </Box>
    </Box>
  );
};

export default ContractPreview;
