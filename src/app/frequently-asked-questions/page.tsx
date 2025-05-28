"use client";

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Head from "next/head";
import { motion } from "framer-motion";
import { Footer, TopNavbar } from "@/components";
import { companyName } from "@/constants";

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve homeowners throughout Garland and surrounding areas. Not sure if we cover your neighborhood? Just give us a call!",
  },
  {
    question: "Do you provide free estimates?",
    answer:
      "Yes! We offer 100% free, no-obligation estimates. We'll visit your home, assess the project, and provide a detailed written quote.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Absolutely. INRI Paint & Wall LLC is fully licensed and insured for your peace of mind. Safety and professionalism are our top priorities.",
  },
  {
    question: "How long will my project take?",
    answer:
      "Every project is unique. Small drywall repairs may take a few hours, while larger painting jobs could take several days. We’ll give you a clear timeline before starting.",
  },
  {
    question: "Do I need to move my furniture before painting or drywall work?",
    answer:
      "We appreciate it if small items are moved out of the way, but we’re happy to help with larger furniture. We also cover and protect everything to keep your home clean and safe.",
  },
  {
    question: "What kind of paint do you use?",
    answer:
      "We use premium, top-quality paints (like Sherwin-Williams and Benjamin Moore) to ensure a long-lasting, beautiful finish. Eco-friendly paint options are also available upon request.",
  },
  {
    question: "Can you match my existing wall color?",
    answer:
      "Yes! We specialize in color matching. Whether you have a leftover can or just need us to match what's on your walls, we can get it spot-on.",
  },
  {
    question: "What if there’s unexpected damage behind the drywall?",
    answer:
      "If we discover hidden issues (like water damage or mold), we'll immediately inform you, explain your options, and adjust the plan if needed — with full transparency.",
  },
  // {
  //   question: "Do you offer any warranties or guarantees?",
  //   answer:
  //     "Yes! We back our workmanship with a 2-Year Warranty. If anything isn’t right, we’ll make it right — no stress, no hassle.",
  // },
  {
    question: "How do I schedule a service?",
    answer:
      "Simple! Just call us, text us, or fill out the quick form on our website. We'll get back to you within 24 hours to set up your free estimate.",
  },
];

export default function FAQPage() {
  return (
    <>
      <TopNavbar />
      <Head>
        <title>FAQs - {companyName} Services</title>
        <meta
          name="description"
          content="Find answers to the most common questions about our expert painting and drywall repair services in Garland. Family-owned, insured, and trusted."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            align="center"
            sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}
          >
            Frequently Asked Questions
          </Typography>

          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Accordion
                sx={{ backgroundColor: "#e3f2fd", mb: 2, borderRadius: 2 }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#1976d2" }} />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography sx={{ fontWeight: "bold", color: "#1565c0" }}>
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography sx={{ color: "#424242" }}>
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </motion.div>
          ))}
        </motion.div>
      </Container>
      <Footer />
    </>
  );
}
