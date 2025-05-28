import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Footer, Meta, TopNavbar } from "@/components";

const faqs = [
  {
    question: "What areas do you serve?",
    answer:
      "We proudly serve homeowners and businesses in Garland, Dallas, and surrounding areas across the DFW metroplex. Not sure if we cover your neighborhood? Give us a call or message — we're happy to help!",
  },
  {
    question: "Do you provide free estimates?",
    answer:
      "Absolutely! We offer 100% free, no-obligation estimates. We'll visit your property, evaluate the project, and provide a clear, detailed written quote with no hidden fees.",
  },
  {
    question: "Are you licensed and insured?",
    answer:
      "Yes. INRI Paint & Wall LLC is fully licensed and insured in the state of Texas. You can rest easy knowing your home or business is protected by professionals who value safety, integrity, and accountability.",
  },
  {
    question: "How long will my project take?",
    answer:
      "Project timelines depend on the size and scope. Minor drywall repairs can take just a few hours, while full interior or exterior painting may take several days. We'll provide a realistic schedule before starting and keep you updated throughout.",
  },
  {
    question: "Do I need to move my furniture before painting or drywall work?",
    answer:
      "We recommend clearing smaller items, but don’t worry about the heavy lifting! We’ll carefully move and cover larger furniture, floors, and fixtures to ensure your space stays clean and damage-free.",
  },
  {
    question: "What kind of paint do you use?",
    answer:
      "We use only premium-grade paints from trusted brands like Sherwin-Williams and Benjamin Moore. These products offer superior coverage, durability, and color retention. We also offer eco-friendly and low-VOC paint options by request.",
  },
  {
    question: "Can you match my existing wall color?",
    answer:
      "Yes! Our expert color-matching services can replicate your existing wall color — even if you don't have the original paint can. We use modern tools and techniques to achieve seamless blending.",
  },
  {
    question: "What if there’s unexpected damage behind the drywall?",
    answer:
      "If we uncover hidden problems like mold, water damage, or structural issues, we'll stop work immediately to inform you. We'll clearly explain your options, recommend solutions, and only proceed with your approval. No surprises, just transparency.",
  },
  {
    question: "Do you offer any warranties or guarantees?",
    answer:
      "Yes. We stand behind our work with a 6-month workmanship warranty. This covers issues like peeling or improper application — not damage caused by wear, water, or accidents. Our goal is your complete satisfaction.",
  },
  {
    question: "How do I schedule a service?",
    answer:
      "It’s easy! You can call or text us directly, or fill out the contact form on our website. One of our team members will respond within 24 hours to schedule your free in-person estimate.",
  },
];

export default function FAQPage() {
  return (
    <>
      <TopNavbar />
      <Meta pageName="Frequently Asked Questions" location="Garland" />
      <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 4 }}
        >
          Frequently Asked Questions
        </Typography>

        {faqs.map((faq, index) => (
          <Accordion
            key={index}
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
              <Typography sx={{ color: "#424242" }}>{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Container>
      <Footer />
    </>
  );
}
