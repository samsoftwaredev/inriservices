"use client";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import ImagesearchRollerIcon from "@mui/icons-material/ImagesearchRoller";

interface Props {
  services?: string;
  heroImage?: string;
}

const Hero = ({
  services = "Expert Painting & Drywall Repair",
  heroImage = "/workers.png"
}: Props) => {
  return (
    <Box
      component="header" // Use semantic HTML
      sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}
      justifyContent="center"
      display="flex"
      flexDirection="column"
    >
      <Typography
        variant="h1"
        component="h3" // Use h1 for the main heading
        color="primary.main"
        sx={{
          fontSize: { xs: "2rem", sm: "2.5rem", md: "2.8rem" },
          textTransform: "uppercase",
          fontWeight: "500",
        }}
      >
        {services}
        <Box
          sx={{
            fontWeight: "500",
            fontSize: { xs: "1.5rem", sm: "2rem", md: "3.5rem" },
          }}
          color="warning.main"
          display="block"
          component="span"
        >
          <AutoAwesomeIcon
            fontSize="large"
            sx={{
              mx: { xs: 1, sm: 1.5, md: 2 },
              color: "primary.main",
              transform: "scaleX(-1)",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
            aria-hidden="true" // Mark icons as decorative
          />
          <span>Services</span> {/* Wrap text in a span for better semantics */}
          <AutoAwesomeIcon
            fontSize="large"
            sx={{
              mx: { xs: 1, sm: 1.5, md: 2 },
              color: "primary.main",
              fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
            }}
            aria-hidden="true" // Mark icons as decorative
          />
        </Box>
      </Typography>
      <Box sx={{ width: "100%", position: "relative", mt: 2 }}>
        <Image
          src={heroImage}
          alt="Painter"
          layout="responsive"
          width={1920}
          height={1080}
          style={{ borderRadius: "62px" }} // Add rounded corners
        />
        <Typography
          variant="subtitle1"
          component="p"
          color="text.secondary"
          sx={{ mt: 1, textAlign: "center", fontStyle: "italic" }}
        >
          Family Owned & Operated
        </Typography>
        <Typography
          variant="body2"
          component="p"
          color="text.secondary"
          sx={{ mt: 0.5, textAlign: "center" }}
        >
          Delivering quality craftsmanship and personalized service you can
          trust.
        </Typography>
      </Box>
      <Box mt={3} display="flex" justifyContent="center">
        <Button
          href="/contact"
          sx={{
            my: 5,
            px: 4,
            py: 1.5,
            backgroundColor: "warning.main",
            color: "white",
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            textTransform: "uppercase",
            "&:hover": {
              backgroundColor: "warning.dark",
            },
          }}
        >
          <ImagesearchRollerIcon /> Book Service
        </Button>
      </Box>
    </Box>
  );
};

export default Hero;
