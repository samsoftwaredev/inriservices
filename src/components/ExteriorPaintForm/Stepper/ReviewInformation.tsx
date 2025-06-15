import React from "react";
import { Box, Button, Typography, Stack } from "@mui/material";

interface Props {
  formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    squareFootage: number;
    stories: string;
    material: string;
    lastPainted: string;
    areas: string[];
    issues: string[];
    paintType: string;
    colorsSelected: boolean;
    startDate: string;
    accessInfo?: string;
    extras: string[];
    package: string;
  };
}

const fieldLabels: {
  key: keyof Props["formData"];
  label: string;
  render?: (value: any) => React.ReactNode;
}[] = [
  { key: "name", label: "Full Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "address", label: "Address" },
  { key: "squareFootage", label: "Square Footage" },
  { key: "stories", label: "Stories" },
  { key: "material", label: "Material" },
  { key: "lastPainted", label: "Last Painted" },
  {
    key: "areas",
    label: "Areas to Paint",
    render: (v: string[]) => (v.length > 0 ? v.join(", ") : "None"),
  },
  {
    key: "issues",
    label: "Preparation Issues",
    render: (v: string[]) => (v.length > 0 ? v.join(", ") : "None"),
  },
  { key: "paintType", label: "Paint Type" },
  {
    key: "colorsSelected",
    label: "Colors Selected",
    render: (v: boolean) => (v ? "Yes" : "No"),
  },
  { key: "startDate", label: "Preferred Start Date" },
  {
    key: "accessInfo",
    label: "Access Info",
    render: (v: string | undefined) => v || "None",
  },
  {
    key: "extras",
    label: "Extras",
    render: (v: string[]) => (v.length > 0 ? v.join(", ") : "None"),
  },
  { key: "package", label: "Selected Package" },
];

const ReviewInformation = ({ formData }: Props) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    const info = fieldLabels
      .map(({ key, label, render }) => {
        const value = formData[key];
        const display = render ? render(value) : value;
        return `${label}: ${display}`;
      })
      .join("\n");
    await navigator.clipboard.writeText(info);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box>
      <Typography variant="h6">Review Your Info</Typography>
      <Box sx={{ my: 2 }}>
        {fieldLabels.map(({ key, label, render }) => (
          <Typography variant="subtitle1" gutterBottom key={key as string}>
            <strong>{label}:</strong>{" "}
            {render ? render(formData[key]) : formData[key]}
          </Typography>
        ))}
      </Box>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => alert("Submitted! (Connect to DB here)")}
        >
          Submit
        </Button>
        <Button variant="outlined" color="primary" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Stack>
    </Box>
  );
};

export default ReviewInformation;
