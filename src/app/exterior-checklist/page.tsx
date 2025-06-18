import { Container, Paper } from "@mui/material";
import { Footer, TopNavbar } from "@/components";
import ExteriorPaintForm from "@/components/ExteriorPaintForm";

export default function ExteriorChecklist() {
  return (
    <>
      <TopNavbar />
      <Container
        maxWidth="lg"
        sx={{
          py: { xs: 2, md: 4 },
          px: { xs: 0.5, sm: 2, md: 0 },
        }}
      >
        <Paper elevation={3}>
          <ExteriorPaintForm />
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
