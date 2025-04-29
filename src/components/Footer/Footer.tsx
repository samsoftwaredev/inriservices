import { theme } from "@/app/theme";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box sx={{ my: { xs: 2, md: 4 }, textAlign: "center" }}>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.8rem", md: "1rem" } }}
      >
        © {new Date().getFullYear()} INRIservices.com. All rights reserved.{" "}
        <a
          href="/about"
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
          }}
        >
          About Us
        </a>
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: { xs: "0.8rem", md: "1rem" }, mt: 1 }}
      >
        Contact us:{" "}
        <a
          href="mailto:contact@inriservices.com"
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
          }}
        >
          contact@inriservices.com
        </a>{" "}
        | Phone:{" "}
        {/* <a
          href="tel:+1234567890"
          style={{
            color: theme.palette.primary.main,
            textDecoration: "none",
          }}
        >
          +1 (234) 567-890
        </a> */}
      </Typography>
    </Box>
  );
};
export default Footer;
