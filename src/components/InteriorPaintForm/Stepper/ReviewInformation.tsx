"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import React from "react";

const faqItems = [
  {
    icon: "💰",
    question: "How much will it cost?",
    answer: "“Can I get a quote or estimate? Is it fixed or can it change?”",
  },
  {
    icon: "🕒",
    question: "How long will it take?",
    answer: "“When can you start and how many days will it take to finish?”",
  },
  {
    icon: "🎨",
    question: "What paint and materials do you use?",
    answer:
      "“Are the paints high quality? Will it smell? Is it safe for kids/pets?”",
  },
  {
    icon: "👷",
    question: "Who will be doing the work?",
    answer:
      "“Is it your crew or subcontractors? Are they insured, background-checked, or professional?”",
  },
  {
    icon: "📅",
    question: "Do I need to be home during the project?",
    answer:
      "“Can you work while I’m at work? What do I need to move or prep ahead of time?”",
  },
  {
    icon: "🧼",
    question: "How will you protect my furniture and floors?",
    answer:
      "“Will you cover everything? What happens if something gets damaged?”",
  },
  {
    icon: "📏",
    question: "What exactly is included (and not included) in the job?",
    answer:
      "“Does the price include prep work, patching holes, moving furniture, cleanup, etc.?”",
  },
  {
    icon: "📝",
    question: "Do you offer a warranty or guarantee?",
    answer: "“What happens if paint peels or cracks in a few months?”",
  },
  {
    icon: "🔄",
    question: "What if I want to make changes after you start?",
    answer: "“Can I add a room, change a color, or upgrade later?”",
  },
  {
    icon: "🔒",
    question: "Are you licensed and insured?",
    answer: "“What if someone gets hurt or something breaks in my house?”",
  },
];

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
      <Typography variant="h5" gutterBottom fontWeight="bold">
        🎯 Top 10 Customer Questions Before a Project Starts
      </Typography>
      {faqItems.map((item, index) => (
        <Accordion key={index}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">
              {item.icon} {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ReviewInformation;
