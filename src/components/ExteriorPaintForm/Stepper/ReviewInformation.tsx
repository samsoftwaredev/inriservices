"use client";
import React from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Stack,
  Button,
} from "@mui/material";

const faqItems = [
  {
    icon: "🏡",
    question: "What surfaces are included in an exterior paint job?",
    answer:
      "“Does it include siding, trim, doors, shutters, garage doors, and fences?”",
  },
  {
    icon: "🧽",
    question: "Do you pressure wash before painting?",
    answer:
      "“Will you clean the surfaces first to remove dirt, mildew, or loose paint?”",
  },
  {
    icon: "🧱",
    question: "Do you repair damaged wood or siding?",
    answer:
      "“What if there’s rotted wood or cracked stucco — do you fix that before painting?”",
  },
  {
    icon: "⛅",
    question: "What if it rains or the weather changes?",
    answer:
      "“Do you reschedule if it rains? Will that affect the timeline or paint quality?”",
  },
  {
    icon: "🖌️",
    question: "What type of paint and finish will you use?",
    answer:
      "“Is it weather-resistant? Will it fade, peel, or hold up to UV and rain?”",
  },
  {
    icon: "🚫",
    question: "Will this disturb my landscaping or garden?",
    answer:
      "“Will plants, flowers, or outdoor furniture be protected during painting?”",
  },
  {
    icon: "🕒",
    question: "How long will the exterior painting take?",
    answer:
      "“How many days should I plan for this? Will you work full days or part-time?”",
  },
  {
    icon: "👥",
    question: "How many people will be working on my home?",
    answer:
      "“Is it a one-man crew or a full team? Will I meet the lead painter?”",
  },
  {
    icon: "🔧",
    question: "Do you do caulking and scraping?",
    answer:
      "“Do you prep all seams and cracks? Will you scrape peeling areas or just paint over them?”",
  },
  {
    icon: "🛡️",
    question: "Is there a warranty for exterior painting?",
    answer:
      "“What if it peels in a year? Do you offer a workmanship or weather-related guarantee?”",
  },
];

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
      <Typography>Frequently Asked Questions:</Typography>
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
