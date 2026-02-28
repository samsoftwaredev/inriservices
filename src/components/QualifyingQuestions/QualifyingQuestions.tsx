"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Paper,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from "@mui/icons-material";
import PageHeader from "../PageHeader";

// ============================================================================
// DATA MODEL
// ============================================================================

type Phase = {
  id: string;
  title: string;
  emoji: string;
  questions: string[];
};

type AccordionItem = {
  title: string;
  bullets: string[];
  salesAngle?: string;
  important?: string;
};

type AccordionSection = {
  id: string;
  title: string;
  emoji: string;
  items: AccordionItem[];
};

const PHASES: Phase[] = [
  {
    id: "phase1",
    title: "Timeline & Urgency (Motivation)",
    emoji: "🔥",
    questions: [
      "Is there a specific event or deadline driving this project?",
      "If everything made sense, how soon would you want us to start?",
      "What happens if this doesn't get done in the next few months?",
    ],
  },
  {
    id: "phase2",
    title: "Decision Authority",
    emoji: "🔥",
    questions: [
      "Will anyone else be involved in approving the project?",
      "Is everyone comfortable moving forward once we agree on details?",
    ],
  },
  {
    id: "phase3",
    title: "Current Pain Level",
    emoji: "🔥",
    questions: [
      "What's bothering you most about the current condition?",
      "On a scale of 1–10, how important is fixing this right now?",
      "Have you had issues with this before?",
    ],
  },
  {
    id: "phase4",
    title: "Experience & Expectations",
    emoji: "🔥",
    questions: [
      "Have you worked with painters or drywall contractors before?",
      "What did you like or dislike about that experience?",
      "What would make this project feel like a win for you?",
    ],
  },
  {
    id: "phase5",
    title: "Budget (Better Framing)",
    emoji: "🔥",
    questions: [
      "For projects like this, homeowners typically invest between $1,500–$3,000 depending on prep and finish. Does that align with what you were expecting?",
    ],
  },
  {
    id: "phase6",
    title: "Commitment Test (Soft Close)",
    emoji: "🔥",
    questions: [
      "If we can address your concerns and stay within range, are you comfortable moving forward?",
      "Is there anything that would stop you from getting this done?",
    ],
  },
  {
    id: "bonus",
    title: "Enthusiasm Builders",
    emoji: "🔥",
    questions: [
      "Imagine this finished — what would that feel like?",
      "What made you decide to look into this now?",
      "If we did this right, what would matter most?",
    ],
  },
];

const ACCORDION_SECTIONS: AccordionSection[] = [
  {
    id: "drywall",
    title: "Drywall Repair – Professional Prep Process",
    emoji: "🔧",
    items: [
      {
        title: "Job Site Protection",
        bullets: [
          "Cover flooring with heavy-duty drop cloths or plastic sheeting",
          "Mask baseboards, trim, and adjacent surfaces",
          "Seal off affected area with plastic containment (especially for sanding)",
          "Protect HVAC vents to prevent dust circulation",
          "Move or cover furniture",
        ],
        salesAngle: "Dust control and protection are built into every repair.",
      },
      {
        title: "Damage Assessment",
        bullets: [
          "Identify source of damage (water, structural shift, impact)",
          "Check for soft spots or moisture behind wall",
          "Determine if full patch replacement or surface repair is required",
          "Inspect for nail pops, tape failure, cracks, joint separation",
        ],
        salesAngle: "We fix the root cause — not just the surface.",
      },
      {
        title: "Remove Damaged Material",
        bullets: [
          "Cut out compromised drywall cleanly (square/rectangle cut)",
          "Remove loose joint tape and crumbling compound",
          "Scrape away peeling paint or damaged surface areas",
          "Clean debris from cavity",
        ],
      },
      {
        title: "Backing & Structural Support (for patches)",
        bullets: [
          "Install wood backing cleats if necessary",
          "Secure replacement drywall piece flush to surface",
          "Ensure screws are properly countersunk",
        ],
      },
      {
        title: "Taping & Mudding (Multi-Stage Process)",
        bullets: [
          "Apply first coat of joint compound",
          "Embed paper or mesh tape into seams",
          "Apply second coat to widen and feather edges",
          "Apply third finishing coat for smooth blend",
          "Allow proper dry time between coats",
        ],
        important:
          "No rushing dry times — prevents flashing and cracking later.",
      },
      {
        title: "Sanding & Feathering",
        bullets: [
          "Sand between coats for smooth transitions",
          "Use fine-grit for finish pass",
          "Check with work light to eliminate imperfections",
          "Remove dust before priming",
        ],
      },
      {
        title: "Texture Matching (if required)",
        bullets: [
          "Match orange peel, knockdown, or hand texture",
          "Adjust thickness and spray pattern",
          "Blend into surrounding wall",
          "Allow full dry before priming",
        ],
      },
      {
        title: "Priming",
        bullets: [
          "Apply high-quality drywall primer to seal compound",
          "Prevent flashing through finish coat",
          "Ensure uniform paint absorption",
        ],
      },
    ],
  },
  {
    id: "painting",
    title: "Professional Painting – Prep Process",
    emoji: "🎨",
    items: [
      {
        title: "Surface Protection",
        bullets: [
          "Cover floors with canvas drop cloths",
          "Mask trim, hardware, fixtures, outlets",
          "Remove switch plates",
          "Protect landscaping (exterior jobs)",
          "Use plastic containment for dust control",
        ],
      },
      {
        title: "Surface Cleaning",
        bullets: [
          "Wipe down walls to remove dust and oils",
          "Degrease kitchen areas",
          "Remove mildew (if present)",
          "Power wash (exterior jobs)",
          "Allow proper dry time",
        ],
      },
      {
        title: "Surface Repair",
        bullets: [
          "Fill nail holes and minor dents",
          "Repair hairline cracks",
          "Caulk gaps around trim and windows",
          "Replace loose or cracked drywall tape",
          "Spot prime patched areas",
        ],
      },
      {
        title: "Sanding & Smoothing",
        bullets: [
          "Sand glossy surfaces for adhesion",
          "Feather patch areas",
          "De-gloss trim if required",
          "Remove dust with tack cloth or vacuum",
        ],
      },
      {
        title: "Priming (Critical Step)",
        bullets: [
          "Prime raw drywall",
          "Prime stained areas (water, smoke, tannin bleed)",
          "Use bonding primer on glossy or challenging surfaces",
          "Tint primer when needed for deep colors",
        ],
        salesAngle: "Most failures happen because primer gets skipped.",
      },
      {
        title: "Caulking & Sealing",
        bullets: [
          "Caulk trim joints",
          "Seal small cracks",
          "Smooth caulk lines cleanly",
          "Allow cure time before painting",
        ],
      },
      {
        title: "Final Pre-Paint Inspection",
        bullets: [
          "Walk surfaces with work light",
          "Check for ridges, scratches, missed repairs",
          "Ensure clean edges and masked lines",
          "Verify environment is dust-free",
        ],
      },
    ],
  },
  {
    id: "objections",
    title: "Common Client Objections & How to Overcome Them",
    emoji: "💬",
    items: [
      {
        title: '"Your price is too high."',
        bullets: [
          "What they really mean: They don't see the value difference.",
          "How to handle it: Don't defend. Compare.",
          "Break down what's included (prep, materials, protection, cleanup).",
          'Ask: "Compared to who?"',
          "Offer tiered options (Good / Better / Best).",
          'Strong response: "Totally fair. Some guys are cheaper because they skip prep or use contractor-grade paint. We include full surface prep, premium materials, and a 2-year workmanship guarantee. Most of our clients prefer paying once instead of repainting in 18 months."',
        ],
      },
      {
        title: '"We need to think about it."',
        bullets: [
          "What they really mean: They're unsure or uncomfortable committing.",
          "How to handle it: Stay calm. Isolate the real hesitation.",
          'Ask: "Is it the timing or the investment?"',
          'Strong response: "Of course. Just so I understand — is there something specific you\'d like clarified, or are you comparing other quotes?"',
        ],
      },
      {
        title: '"Another company quoted less."',
        bullets: [
          "What they really mean: They're testing you.",
          "How to handle it: Don't compete on price. Ask what was included.",
          "Point out missing items.",
          "Strong response: \"No problem at all. Did their quote include drywall prep, sanding, caulking, and two full coats? A lot of lower bids don't include that — and that's usually where problems show up later.\"",
        ],
      },
      {
        title: '"We\'re worried about the mess."',
        bullets: [
          "What they really mean: They're afraid of disruption.",
          "How to handle it: Sell cleanliness. Sell protection systems.",
          "Show photos of clean jobs.",
          'Strong response: "We treat your home like it\'s ours. Full floor protection, plastic containment, daily cleanup, and final walkthrough. Most clients say we left it cleaner than when we arrived."',
        ],
      },
      {
        title: '"How do we know you\'ll do a good job?"',
        bullets: [
          "What they really mean: Trust issue.",
          "How to handle it: Show reviews. Show before/after photos.",
          "Offer guarantee. Mention insurance.",
          "Strong response: \"We're licensed and insured, and we back our work with a written warranty. I can also send you before-and-after photos of similar drywall repairs we've done.\"",
        ],
      },
      {
        title: '"We\'re not ready yet."',
        bullets: [
          "What they really mean: Low urgency.",
          "How to handle it: Ask about timeline. Tie job to benefit.",
          "Create light urgency.",
          "Strong response: \"Totally fine. Most clients book 2–4 weeks out. If you're thinking about spring, I'd recommend reserving a slot — we can always adjust dates.\"",
        ],
      },
    ],
  },
];

const QualifyingQuestions = () => {
  const STORAGE_KEY_CHECKLIST = "qualifying-questions-checklist";
  const STORAGE_KEY_NOTES = "qualifying-questions-notes";

  // State for checklist
  const [checkedQuestions, setCheckedQuestions] = useState<
    Record<string, boolean>
  >({});

  // State for notes per phase
  const [phaseNotes, setPhaseNotes] = useState<Record<string, string>>({});

  // State for accordions
  const [expandedAccordions, setExpandedAccordions] = useState<
    Record<string, boolean>
  >({});

  const [searchTerm, setSearchTerm] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedChecklist = localStorage.getItem(STORAGE_KEY_CHECKLIST);
      if (savedChecklist) {
        setCheckedQuestions(JSON.parse(savedChecklist));
      }

      const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
      if (savedNotes) {
        setPhaseNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error("Failed to load from localStorage", error);
    }
  }, []);

  // Save checklist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY_CHECKLIST,
        JSON.stringify(checkedQuestions),
      );
    } catch (error) {
      console.error("Failed to save checklist", error);
    }
  }, [checkedQuestions]);

  // Save notes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(phaseNotes));
    } catch (error) {
      console.error("Failed to save notes", error);
    }
  }, [phaseNotes]);

  // Generate unique key for each question
  const getQuestionKey = (phaseId: string, questionIndex: number): string => {
    return `${phaseId}-q${questionIndex}`;
  };

  // Toggle question
  const handleToggleQuestion = (key: string) => {
    setCheckedQuestions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Mark all in phase
  const handleMarkAllInPhase = (phase: Phase) => {
    const updates: Record<string, boolean> = {};
    phase.questions.forEach((_, idx) => {
      const key = getQuestionKey(phase.id, idx);
      updates[key] = true;
    });
    setCheckedQuestions((prev) => ({ ...prev, ...updates }));
  };

  // Toggle accordion
  const handleToggleAccordion = (id: string) => {
    setExpandedAccordions((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter questions based on search
  const filteredPhases = useMemo(() => {
    if (!searchTerm.trim()) return PHASES;
    const search = searchTerm.toLowerCase();
    return PHASES.map((phase) => ({
      ...phase,
      questions: phase.questions.filter((q) =>
        q.toLowerCase().includes(search),
      ),
    })).filter((phase) => phase.questions.length > 0);
  }, [searchTerm]);

  // Filter accordion sections based on search
  const filteredAccordions = useMemo(() => {
    if (!searchTerm.trim()) return ACCORDION_SECTIONS;
    const search = searchTerm.toLowerCase();
    return ACCORDION_SECTIONS.map((section) => ({
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(search) ||
          item.bullets.some((b) => b.toLowerCase().includes(search)) ||
          (item.salesAngle && item.salesAngle.toLowerCase().includes(search)) ||
          (item.important && item.important.toLowerCase().includes(search)),
      ),
    })).filter((section) => section.items.length > 0);
  }, [searchTerm]);

  return (
    <Box>
      {/* Header */}
      <PageHeader
        title="Qualifying Questions & Sales Guide"
        subtitle="Use this checklist during client consultations to gather key information and address concerns professionally."
      />

      {/* Checklist Sections */}
      <Box sx={{ mb: 4 }}>
        {filteredPhases.length === 0 && (
          <Alert severity="info">
            No questions match your search. Try different keywords.
          </Alert>
        )}

        {filteredPhases.map((phase) => {
          const phaseCompleted = phase.questions.every((_, idx) => {
            const key = getQuestionKey(phase.id, idx);
            return checkedQuestions[key];
          });

          return (
            <Paper
              key={phase.id}
              elevation={0}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid",
                borderColor: phaseCompleted ? "success.main" : "divider",
                borderRadius: 2,
                bgcolor: phaseCompleted ? "success.50" : "background.paper",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ mb: 1 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {phase.emoji} PHASE{" "}
                  {phase.id === "bonus" ? "" : phase.id.replace("phase", "")}
                  {phase.id === "bonus" ? "Bonus" : ""}: {phase.title}
                </Typography>
                <Button
                  size="small"
                  variant="text"
                  onClick={() => handleMarkAllInPhase(phase)}
                >
                  Mark All
                </Button>
              </Stack>

              <Stack spacing={1}>
                {phase.questions.map((question, idx) => {
                  const key = getQuestionKey(phase.id, idx);
                  return (
                    <FormControlLabel
                      key={key}
                      control={
                        <Checkbox
                          checked={!!checkedQuestions[key]}
                          onChange={() => handleToggleQuestion(key)}
                          icon={<UncheckedIcon />}
                          checkedIcon={<CheckCircleIcon />}
                        />
                      }
                      label={
                        <Typography
                          variant="body2"
                          sx={{
                            textDecoration: checkedQuestions[key]
                              ? "line-through"
                              : "none",
                            color: checkedQuestions[key]
                              ? "text.secondary"
                              : "text.primary",
                          }}
                        >
                          {question}
                        </Typography>
                      }
                    />
                  );
                })}
              </Stack>
            </Paper>
          );
        })}
      </Box>

      {/* Accordion Sections */}
      <Box>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
          📖 Professional Process Guide
        </Typography>

        {filteredAccordions.length === 0 && (
          <Alert severity="info">
            No process steps match your search. Try different keywords.
          </Alert>
        )}

        {filteredAccordions.map((section) => (
          <Accordion
            key={section.id}
            expanded={!!expandedAccordions[section.id]}
            onChange={() => handleToggleAccordion(section.id)}
            sx={{
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "8px !important",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`${section.id}-content`}
              id={`${section.id}-header`}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {section.emoji} {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack spacing={2} divider={<Divider />}>
                {section.items.map((item, idx) => (
                  <Box key={idx}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, mb: 1 }}
                    >
                      {item.title}
                    </Typography>
                    <Stack spacing={0.5} sx={{ pl: 2 }}>
                      {item.bullets.map((bullet, bulletIdx) => (
                        <Typography
                          key={bulletIdx}
                          variant="body2"
                          sx={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <Box
                            component="span"
                            sx={{ mr: 1, color: "text.secondary" }}
                          >
                            •
                          </Box>
                          <Box component="span">{bullet}</Box>
                        </Typography>
                      ))}
                    </Stack>

                    {item.salesAngle && (
                      <Alert
                        severity="success"
                        sx={{ mt: 1.5, fontSize: "0.875rem" }}
                        icon={false}
                      >
                        <strong>Sales Angle:</strong> {item.salesAngle}
                      </Alert>
                    )}

                    {item.important && (
                      <Alert
                        severity="warning"
                        sx={{ mt: 1.5, fontSize: "0.875rem" }}
                        icon={false}
                      >
                        <strong>Important:</strong> {item.important}
                      </Alert>
                    )}
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
};

export default QualifyingQuestions;
