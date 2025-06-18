import { Container } from "@mui/material";
import { Footer, TopNavbar } from "@/components";
import InteriorPaintForm from "@/components/InteriorPaintForm";

export default function InteriorChecklist() {
  return (
    <>
      <TopNavbar />
      <Container
        maxWidth="md"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 0.5, sm: 2, md: 0 },
        }}
      >
        <InteriorPaintForm />
      </Container>
      <Footer />
    </>
  );
}
