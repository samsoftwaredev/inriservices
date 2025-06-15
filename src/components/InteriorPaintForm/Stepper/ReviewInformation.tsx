import { Box, Typography, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";

interface Props {
  formData: {
    name: string;
    phone: string;
    email: string;
    address: string;
    selectedRooms: string[];
    numRooms: number;
    squareFootage: number;
    ceilingHeight: string;
    paintFinish: string;
    paintBrand?: string;
    ecoFriendly: boolean;
    wallsPainted: boolean;
    repairsNeeded: string[];
    furnitureHelp: string;
    date?: string;
    budget?: string;
    isRemodel?: string;
    notes?: string;
    emailEstimate?: boolean;
    package?: string;
  };
}

const fieldLabels: { [K in keyof Props["formData"]]: string } = {
  name: "Name",
  phone: "Phone",
  email: "Email",
  address: "Address",
  selectedRooms: "Project Areas",
  numRooms: "Number of Rooms",
  squareFootage: "Square Footage",
  ceilingHeight: "Ceiling Height",
  paintFinish: "Paint Finish",
  paintBrand: "Preferred Brand/Color",
  ecoFriendly: "Eco-Friendly Paint",
  wallsPainted: "Walls Currently Painted",
  repairsNeeded: "Repairs Needed",
  furnitureHelp: "Furniture Help",
  date: "Preferred Completion Date",
  budget: "Budget Range",
  isRemodel: "Project Type",
  notes: "Additional Notes",
  emailEstimate: "Email Estimate",
  package: "Selected Package",
};

const formatValue = (key: keyof Props["formData"], value: any) => {
  switch (key) {
    case "selectedRooms":
      return value.length ? value.join(", ") : "None";
    case "paintBrand":
    case "date":
    case "budget":
    case "package":
      return value || "N/A";
    case "ecoFriendly":
    case "wallsPainted":
    case "emailEstimate":
      return value ? "Yes" : "No";
    case "repairsNeeded":
      return value.length ? value.join(", ") : "None";
    case "furnitureHelp":
      return value === "handle"
        ? "The Client can handle it"
        : value === "need_help"
        ? "The Client will need help ($100 - $300 fee)"
        : "N/A";
    case "isRemodel":
      return value === "remodel"
        ? "Remodel"
        : value === "sale"
        ? "Real Estate Prep"
        : value === "other"
        ? "Other"
        : "N/A";
    case "notes":
      return value || "None";
    case "squareFootage":
      return `${value} sq ft`;
    default:
      return value;
  }
};

const displayOrder: (keyof Props["formData"])[] = [
  "name",
  "phone",
  "email",
  "address",
  "selectedRooms",
  "numRooms",
  "squareFootage",
  "ceilingHeight",
  "paintFinish",
  "paintBrand",
  "ecoFriendly",
  "wallsPainted",
  "repairsNeeded",
  "furnitureHelp",
  "date",
  "budget",
  "isRemodel",
  "notes",
  "emailEstimate",
  "package",
];

const formatFormData = (formData: Props["formData"]) =>
  displayOrder
    .map(
      (key) => `${fieldLabels[key]}: ${formatValue(key, formData[key] as any)}`
    )
    .join("\n");

const ReviewInformation = ({ formData }: Props) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formatFormData(formData));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" gutterBottom>
          Review Your Information
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopy}
        >
          {copied ? "Copied!" : "Copy"}
        </Button>
      </Box>
      <Box>
        {displayOrder.map((key) => (
          <Typography key={key}>
            <b>{fieldLabels[key]}:</b> {formatValue(key, formData[key] as any)}
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default ReviewInformation;
