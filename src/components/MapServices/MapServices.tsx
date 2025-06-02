import React from "react";
import { Grid, Typography } from "@mui/material";
import ContactForm from "../ContactForm";

const MapServices = () => {
  return (
    <section>
      <Grid
        container
        spacing={4}
        alignItems="flex-start"
        sx={{ display: "flex", flexDirection: { xs: "column", md: "row" } }}
      >
        {/* Map Section */}
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <article aria-label="Map showing Dallas, TX and surrounding areas">
            <Typography
              variant="h5"
              sx={{
                textAlign: "center",
                fontWeight: "bold",
                my: { xs: 2, md: 4 },
                px: { xs: 2, md: 0 },
              }}
              gutterBottom
            >
              Where We Serve
            </Typography>
            <Typography
              variant="body2"
              component="p"
              sx={{ marginTop: 2, textAlign: "center" }}
            >
              Our services cover a wide range of areas, including{" "}
              <strong>Garland</strong>, <strong>Dallas</strong>,{" "}
              <strong>Richardson</strong>, <strong>Rowlett</strong>,{" "}
              <strong>Plano</strong>, <strong>Mesquite</strong> and{" "}
              <strong>Addison</strong>.
            </Typography>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d237224.96571434004!2d-96.89724851381499!3d32.81868418651351!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x864c19f77b45974b%3A0xb9ec9ba4f647678f!2sDallas%2C%20TX!5e1!3m2!1sen!2sus!4v1745886916344!5m2!1sen!2sus"
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{
                border: "0",
                minHeight: "500px",
              }}
              title="Google Maps Embed showing Dallas, TX"
            ></iframe>
          </article>
        </Grid>
        <Grid
          size={{ xs: 12, md: 6 }}
          sx={{
            opacity: 1,
            transform: "translateY(0)",
            transition: "opacity 0.8s ease, transform 0.8s ease",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              fontWeight: "bold",
              my: { xs: 2, md: 4 },
              px: { xs: 2, md: 0 },
            }}
            gutterBottom
          >
            Book Your Service Today!
          </Typography>
          <Typography
            variant="body2"
            component="p"
            sx={{ marginTop: 2, textAlign: "center" }}
          >
            Free estimates are available for all our services.
          </Typography>
          <ContactForm />
        </Grid>
      </Grid>
    </section>
  );
};

export default MapServices;
