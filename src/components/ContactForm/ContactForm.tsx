"use client";

import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import emailjs from "emailjs-com";

const ContactForm = () => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    phone: "",
    message: "",
    address: "",
    zipcode: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    service: "",
    phone: "",
    message: "",
    address: "",
    zipcode: "",
  });

  const validate = () => {
    const newErrors = {
      name: "",
      service: "",
      phone: "",
      message: "",
      address: "",
      zipcode: "",
    };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    if (!formData.service.trim()) {
      newErrors.service = "Service selection is required.";
      valid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
      valid = false;
    } else if (formData.phone.replace(/\D/g, "").length < 10) {
      newErrors.phone = "Phone number must have at least 10 digits.";
      valid = false;
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
      valid = false;
    }

    if (!formData.zipcode.trim()) {
      newErrors.zipcode = "Zipcode is required.";
      valid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipcode)) {
      newErrors.zipcode = "Invalid zipcode format.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const sendEmail = (e: React.FormEvent) => {
    setIsSuccess(false);
    setIsLoading(true);
    const textarea = document.querySelector('textarea[name="message"]');
    if (textarea) {
      // @ts-expect-error passing form data
      textarea.value =
        formData.message +
        "\n\n\nPHONE:" +
        formData.phone +
        "\n\n\nSERVICE:" +
        formData.service +
        "\n\n\nADDRESS:" +
        formData.address +
        "\n\n\nZIPCODE:" +
        formData.zipcode;
    }
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
          name: "",
          service: "",
          phone: "",
          message: "",
          address: "",
          zipcode: "",
        });
        setIsLoading(false);
      });
  };

  const handleChange = (
    e:
      | React.ChangeEvent<
          | HTMLInputElement
          | HTMLTextAreaElement
          | { name?: string; value: unknown }
        >
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name as string]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      sendEmail(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <TextField
        label="Full Name"
        name="name"
        value={formData.name}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.name}
        helperText={errors.name}
      />

      <FormControl fullWidth margin="normal" error={!!errors.service}>
        <InputLabel sx={{ px: 1, backgroundColor: "white" }} id="service-label">
          Select Service
        </InputLabel>
        <Select
          labelId="service-label"
          name="service"
          value={formData.service}
          onChange={handleChange}
        >
          <MenuItem value="Trim Repair and Installation">
            🪚 Trim Repair and Installation
          </MenuItem>
          <MenuItem value="Cabinet Painting">🎨 Cabinet Painting</MenuItem>
          <MenuItem value="ReTexture Walls">🖌️ ReTexture Walls</MenuItem>
          <MenuItem value="Interior Painting">🏠 Interior Painting</MenuItem>
          <MenuItem value="Exterior Painting">🌳 Exterior Painting</MenuItem>
          <MenuItem value="Wallpaper Removal">🧹 Wallpaper Removal</MenuItem>
          <MenuItem value="Popcorn Ceiling Removal">
            🪜 Popcorn Ceiling Removal
          </MenuItem>
          <MenuItem value="Deck Staining and Sealing">
            🌞 Deck Staining and Sealing
          </MenuItem>
          <MenuItem value="Drywall Installation">
            🔧 Drywall Installation
          </MenuItem>
          <MenuItem value="Pressure Washing">💦 Pressure Washing</MenuItem>
        </Select>
        {errors.service && (
          <Typography
            pl={1}
            color="error.main"
            variant="body1"
            fontSize="small"
          >
            {errors.service}
          </Typography>
        )}
      </FormControl>

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
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.address}
        helperText={errors.address}
      />

      <TextField
        label="Zipcode"
        name="zipcode"
        value={formData.zipcode}
        onChange={handleChange}
        fullWidth
        margin="normal"
        error={!!errors.zipcode}
        helperText={errors.zipcode}
      />

      <TextField
        label="Notes/Service Details"
        name="message"
        value={formData.message}
        onChange={handleChange}
        multiline
        rows={1}
        fullWidth
        margin="normal"
        error={!!errors.message}
        helperText={errors.message}
      />

      {isSuccess && (
        <Alert color="success" icon={<CheckIcon fontSize="inherit" />}>
          <strong>Thank you for reaching out! </strong>
          We will get back to you within 24 hours!
        </Alert>
      )}
      <Box sx={{ mt: 3 }}>
        <Button
          disabled={isLoading}
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
  );
};

export default ContactForm;
