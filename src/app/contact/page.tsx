"use client";

import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import Head from "next/head";
import { Footer, TopNavbar, TrustBadges } from "@/components";
import { ThemeRegistry } from "../ThemeRegistry";
import { red } from "@mui/material/colors";
import CheckIcon from "@mui/icons-material/Check";

import emailjs from "emailjs-com";

const ContactPage = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const validate = () => {
    const newErrors = { fullName: "", email: "", phone: "", message: "" };
    let valid = true;

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email format is invalid.";
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
      valid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const sendEmail = (e: React.FormEvent) => {
    setIsSuccess(false);
    emailjs
      .sendForm(
        "service_iq0k3g9",
        "template_oqdz2yo",
        // @ts-expect-error passing form data
        e.target,
        "lh-EE7Ydp27tFht5R"
      )
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          setIsSuccess(true);
        },
        (error) => {
          console.error("Email sending error:", error.text);
          setIsSuccess(false);
        }
      )
      .finally(() => {
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          message: "",
        });
      });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sendEmail(e);
    }
  };

  return (
    <ThemeRegistry>
      <Head>
        <title>Contact Us - INRI Services</title>
        <meta
          name="description"
          content="Get in touch with INRI Services for expert painting and drywall repair in Texas. We're here to help you!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://inriservices.com/contact" />
      </Head>
      <TopNavbar />
      <Container maxWidth="sm">
        <TrustBadges />
        <Box sx={{ my: 4 }}>
          <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 2 }}
              color="primary"
            >
              Contact Us
            </Typography>
            <Box fontSize="small" component="span" sx={{ color: red[500] }}>
              Get a Free Quote!
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              <Typography
                color="primary.main"
                component={"a"}
                href="/frequently-asked-questions"
              >
                Have questions
              </Typography>{" "}
              or need a quote? We&apos;d love to hear from you.
            </Typography>

            <form onSubmit={handleSubmit} noValidate>
              <TextField
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.fullName}
                helperText={errors.fullName}
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email}
              />

              <TextField
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                fullWidth
                margin="normal"
                error={!!errors.phone}
                helperText={errors.phone}
              />

              <TextField
                label="Message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                multiline
                rows={4}
                fullWidth
                margin="normal"
                error={!!errors.message}
                helperText={errors.message}
              />

              {isSuccess && (
                <Alert
                  icon={<CheckIcon fontSize="inherit" />}
                  severity="success"
                >
                  <strong>Thank you for reaching out! </strong>
                  We will get back to you within 24 hours!
                </Alert>
              )}
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  color="warning"
                  type="submit"
                  fullWidth
                  size="large"
                  sx={{
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
                  Send Message
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>
      </Container>
      <Footer />
    </ThemeRegistry>
  );
};

export default ContactPage;
