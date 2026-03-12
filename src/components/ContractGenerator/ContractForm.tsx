"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import {
  Description as DescriptionIcon,
  Download as DownloadIcon,
  Preview as PreviewIcon,
  Edit as EditIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { toast } from "react-toastify";
import { PageHeader } from "@/components";
import ContractPDF from "./ContractPDF";
import ContractPreview from "./ContractPreview";
import { ContractFormData, defaultContractValues } from "./types";

const SectionHeader: React.FC<{ title: string; number: number }> = ({
  title,
  number,
}) => (
  <Typography
    variant="h6"
    fontWeight="bold"
    sx={{
      mt: number > 1 ? 3 : 0,
      mb: 2,
      pb: 1,
      borderBottom: "2px solid",
      borderColor: "primary.main",
    }}
  >
    Section {number} — {title}
  </Typography>
);

const ContractForm: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ContractFormData>({
    defaultValues: defaultContractValues,
    mode: "onChange",
  });

  const formValues = watch();

  const onSubmit = () => {
    setActiveTab(1);
    toast.success("Contract is ready! You can preview and download it.");
  };

  return (
    <Box>
      <PageHeader
        title="New Contract"
        subtitle="Fill in the contract details and generate a PDF"
        icon={<DescriptionIcon />}
        onBack={() => router.push("/contracts")}
      />

      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3 }}
      >
        <Tab icon={<EditIcon />} iconPosition="start" label="Edit Contract" />
        <Tab
          icon={<PreviewIcon />}
          iconPosition="start"
          label="Preview Contract"
        />
      </Tabs>

      {/* Tab 0: Form */}
      {activeTab === 0 && (
        <Card>
          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Section 1 — Agreement Information */}
              <SectionHeader number={1} title="Agreement Information" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="agreementDate"
                    control={control}
                    rules={{ required: "Agreement date is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Agreement Date"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.agreementDate}
                        helperText={errors.agreementDate?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="clientName"
                    control={control}
                    rules={{ required: "Client name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Client Name"
                        fullWidth
                        error={!!errors.clientName}
                        helperText={errors.clientName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="clientAddress"
                    control={control}
                    rules={{ required: "Client address is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Client Address"
                        fullWidth
                        error={!!errors.clientAddress}
                        helperText={errors.clientAddress?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 2 — Client Contact Information */}
              <SectionHeader number={2} title="Client Contact Information" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="clientPhone"
                    control={control}
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Client Phone"
                        fullWidth
                        error={!!errors.clientPhone}
                        helperText={errors.clientPhone?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="clientEmail"
                    control={control}
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Client Email"
                        type="email"
                        fullWidth
                        error={!!errors.clientEmail}
                        helperText={errors.clientEmail?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 3 — Scope of Work */}
              <SectionHeader number={3} title="Scope of Work" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="typeOfProject"
                    control={control}
                    rules={{ required: "Project type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Type of Project"
                        fullWidth
                        placeholder="e.g., Interior Painting, Exterior Painting, Drywall Repair"
                        error={!!errors.typeOfProject}
                        helperText={errors.typeOfProject?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="areasRooms"
                    control={control}
                    rules={{ required: "Areas/Rooms is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Areas / Rooms"
                        fullWidth
                        placeholder="e.g., Living room, Kitchen, Master bedroom"
                        error={!!errors.areasRooms}
                        helperText={errors.areasRooms?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="customerDetails"
                    control={control}
                    rules={{ required: "Customer details are required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Customer Details"
                        fullWidth
                        multiline
                        minRows={3}
                        placeholder="Describe the customer's specific requests and project details..."
                        error={!!errors.customerDetails}
                        helperText={errors.customerDetails?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="prepWork"
                    control={control}
                    rules={{ required: "Prep work is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Prep Work"
                        fullWidth
                        placeholder="e.g., Sanding, patching holes, priming"
                        error={!!errors.prepWork}
                        helperText={errors.prepWork?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name="numberOfCoats"
                    control={control}
                    rules={{ required: "Number of coats is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Number of Coats"
                        fullWidth
                        error={!!errors.numberOfCoats}
                        helperText={errors.numberOfCoats?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Controller
                    name="paintBrand"
                    control={control}
                    rules={{ required: "Paint brand is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Paint Brand / Type"
                        fullWidth
                        placeholder="e.g., Sherwin-Williams, Benjamin Moore"
                        error={!!errors.paintBrand}
                        helperText={errors.paintBrand?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <Controller
                    name="exclusions"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Exclusions"
                        fullWidth
                        multiline
                        minRows={2}
                        placeholder="List any areas or work excluded from this contract..."
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 4 — Project Timeline */}
              <SectionHeader number={4} title="Project Timeline" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="startDate"
                    control={control}
                    rules={{ required: "Start date is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Start Date"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="completionDate"
                    control={control}
                    rules={{ required: "Completion date is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Estimated Completion Date"
                        type="date"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.completionDate}
                        helperText={errors.completionDate?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="workStartTime"
                    control={control}
                    rules={{ required: "Work start time is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Work Start Time"
                        type="time"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.workStartTime}
                        helperText={errors.workStartTime?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="workEndTime"
                    control={control}
                    rules={{ required: "Work end time is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Work End Time"
                        type="time"
                        fullWidth
                        slotProps={{ inputLabel: { shrink: true } }}
                        error={!!errors.workEndTime}
                        helperText={errors.workEndTime?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 5 — Payment Terms */}
              <SectionHeader number={5} title="Payment Terms" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="totalCost"
                    control={control}
                    rules={{
                      required: "Total cost is required",
                      pattern: {
                        value: /^\d+(\.\d{0,2})?$/,
                        message: "Enter a valid dollar amount",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Total Cost"
                        fullWidth
                        placeholder="0.00"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          },
                        }}
                        error={!!errors.totalCost}
                        helperText={errors.totalCost?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="depositAmount"
                    control={control}
                    rules={{
                      required: "Deposit amount is required",
                      pattern: {
                        value: /^\d+(\.\d{0,2})?$/,
                        message: "Enter a valid dollar amount",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Deposit Amount"
                        fullWidth
                        placeholder="0.00"
                        slotProps={{
                          input: {
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          },
                        }}
                        error={!!errors.depositAmount}
                        helperText={errors.depositAmount?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 6 — Warranty */}
              <SectionHeader number={6} title="Warranty" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="warrantyMonths"
                    control={control}
                    rules={{ required: "Warranty months is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Warranty Months"
                        fullWidth
                        type="number"
                        error={!!errors.warrantyMonths}
                        helperText={errors.warrantyMonths?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Section 7 — Signatures */}
              <SectionHeader number={7} title="Signatures" />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="clientSignatureName"
                    control={control}
                    rules={{ required: "Client signature name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Client Name (for signature line)"
                        fullWidth
                        error={!!errors.clientSignatureName}
                        helperText={errors.clientSignatureName?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Controller
                    name="contractorName"
                    control={control}
                    rules={{ required: "Contractor name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Contractor Name"
                        fullWidth
                        error={!!errors.contractorName}
                        helperText={errors.contractorName?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Form Actions */}
              <Box
                sx={{
                  mt: 4,
                  display: "flex",
                  gap: 2,
                  flexDirection: { xs: "column", sm: "row" },
                }}
              >
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<PreviewIcon />}
                  onClick={() => setActiveTab(1)}
                >
                  Preview Contract
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<DescriptionIcon />}
                >
                  Generate Contract
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tab 1: Preview + Download */}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              mb: 3,
              display: "flex",
              gap: 2,
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Button
              variant="outlined"
              startIcon={<EditIcon />}
              onClick={() => setActiveTab(0)}
            >
              Back to Edit
            </Button>
            <PDFDownloadLink
              document={<ContractPDF data={formValues} />}
              fileName={`contract-${formValues.clientName?.replace(/\s+/g, "-").toLowerCase() || "draft"}-${formValues.agreementDate || "undated"}.pdf`}
              style={{ textDecoration: "none" }}
            >
              {({ loading }) => (
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<DownloadIcon />}
                  disabled={loading}
                >
                  {loading ? "Generating PDF..." : "Download PDF"}
                </Button>
              )}
            </PDFDownloadLink>
            <Button
              variant="contained"
              color="success"
              size="large"
              startIcon={<SendIcon />}
              onClick={() => router.push("/contracts/sign/demo")}
            >
              Preview Signing Experience
            </Button>
          </Box>
          <ContractPreview data={formValues} />
        </Box>
      )}
    </Box>
  );
};

export default ContractForm;
