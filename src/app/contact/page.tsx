"use client";

import React, { useState } from "react";
import { Container, Box, Typography, TextField, Button } from "@mui/material";
import { useRouter } from "next/navigation";

const ContactPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  const validate = () => {
    const newErrors = { fullName: "", email: "", message: "" };
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

    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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
      alert("Message sent successfully!");
      // You can replace the above line with your actual form handler
      setFormData({ fullName: "", email: "", message: "" });
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: "bold", mb: 2 }}
        >
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Have questions or need a quote? We&apos;d love to hear from you.
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

          <Box sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
            >
              Send Message
            </Button>
          </Box>
        </form>

        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button
            variant="text"
            color="secondary"
            onClick={() => router.push("/")}
          >
            ← Back to Home
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactPage;
