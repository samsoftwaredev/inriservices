import { Container, Paper } from "@mui/material";
import { Footer, TopNavbar } from "@/components";
import CleaningEstimateStepper from "@/components/CleaningEstimateStepper/CleaningEstimateStepper";

export default function CleaningEstimate() {
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
        <Paper
          elevation={3}
          sx={{
            backgroundColor: "#f1f2f3",
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: { xs: 2, sm: 3 },
          }}
        >
          <CleaningEstimateStepper />
        </Paper>
      </Container>
      <Footer />
    </>
  );
}
