"use client";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { Box, Button, Typography } from "@mui/material";
import Image from "next/image";
import ImagesearchRollerIcon from "@mui/icons-material/ImagesearchRoller";
// import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";

interface Props {
  services?: string;
  heroImage?: string;
  freeEstimateURL?: string;
}

const Hero = ({
  services = "Expert Painting & Drywall Repair",
  heroImage = "/gusWorking.png",
}: // freeEstimateURL = "/get-painting-estimate-in-minutes",
Props) => {
  return (
    <Box
      component="header" // Use semantic HTML
      sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}
      justifyContent="center"
      display="flex"
      flexDirection="column"
    >
      <Typography
        variant="h3"
        component="h1" // Use h1 for the main heading
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
          priority
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
          Get a Free Quote Ready to bring your vision to life?
        </Typography>
      </Box>
      <Box
        mt={3}
        display="flex"
        justifyContent="center"
        sx={{
          flexDirection: { xs: "column", sm: "row" },
          gap: { xs: 0, sm: 2 },
        }}
      >
        <Button
          href="/booking"
          color="warning"
          variant="contained"
          sx={{
            my: 1,
            px: 4,
            py: 1.5,
            fontSize: "1rem",
            fontWeight: "bold",
            borderRadius: "8px",
            border: "none",

            "&:hover": {
              backgroundColor: "warning.dark",
            },
          }}
        >
          <ImagesearchRollerIcon /> Appointment Request
        </Button>
        {/* <Button
          href={freeEstimateURL}
          color="primary"
          variant="contained"
          sx={{
            my: 1,
            px: 4,
            py: 1.5,
          }}
        >
          <CardGiftcardIcon /> Free Estimate in Minutes!
        </Button> */}
      </Box>
    </Box>
  );
};

export default Hero;
