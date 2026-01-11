"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  CircularProgress,
  Container,
} from "@mui/material";
import { Email, ArrowBack, LockReset } from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context";

// Form data interface
interface ForgotPasswordFormData {
  email: string;
}

// Validation rules
const validationRules = {
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  },
};

const ForgotPasswordPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { resetPassword, checkUserIsLoggedIn } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ForgotPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      await resetPassword(data.email);

      setSuccess(
        "Password reset email sent! Please check your inbox and follow the instructions to reset your password."
      );
    } catch (error: any) {
      let errorMessage = "Failed to send reset email";

      if (error.message.includes("user-not-found")) {
        errorMessage = "No account found with this email address";
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Invalid email address";
      } else if (error.message.includes("too-many-requests")) {
        errorMessage = "Too many requests. Please try again later";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserIsLoggedIn();
  }, []);

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
          py: 4,
        }}
      >
        <Card
          elevation={3}
          sx={{
            width: "100%",
            maxWidth: 400,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <LockReset
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Forgot Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your email address and we'll send you a link to reset your
                password
              </Typography>
            </Box>

            {/* Error/Success Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            {!success && (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {/* Email Field */}
                <Controller
                  name="email"
                  control={control}
                  rules={validationRules.email}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Email Address"
                      type="email"
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                      autoFocus
                    />
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!isValid || loading}
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 48,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Send Reset Email"
                  )}
                </Button>
              </Box>
            )}

            {/* Additional Information */}
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <strong>What happens next?</strong>
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                component="ul"
                sx={{ pl: 2, mb: 0 }}
              >
                <li>We'll send a password reset link to your email</li>
                <li>Click the link in the email to open the reset page</li>
                <li>Enter and confirm your new password</li>
                <li>Sign in with your new password</li>
              </Typography>
            </Box>

            {/* Back to Login Link */}
            <Box sx={{ textAlign: "center", mt: 3 }}>
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <Button
                  variant="text"
                  startIcon={<ArrowBack />}
                  sx={{
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  Back to Sign In
                </Button>
              </Link>
            </Box>

            {/* Help Text */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Still having trouble?{" "}
                <Link href="/contact" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Contact support
                  </Typography>
                </Link>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage;
