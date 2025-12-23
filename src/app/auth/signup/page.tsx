"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
  Divider,
  CircularProgress,
  Container,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  PersonAdd,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context";

// Form data interface
interface SignupFormData {
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

// Validation rules
const validationRules = {
  displayName: {
    required: "Full name is required",
    minLength: {
      value: 2,
      message: "Name must be at least 2 characters",
    },
    pattern: {
      value: /^[a-zA-Z\s'-]+$/,
      message:
        "Name can only contain letters, spaces, hyphens, and apostrophes",
    },
  },
  email: {
    required: "Email is required",
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: "Please enter a valid email address",
    },
  },
  password: {
    required: "Password is required",
    minLength: {
      value: 8,
      message: "Password must be at least 8 characters",
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
    },
  },
  confirmPassword: {
    required: "Please confirm your password",
  },
  acceptTerms: {
    required: "You must accept the terms and conditions",
  },
};

const SignupPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<SignupFormData>({
    mode: "onChange",
    defaultValues: {
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignupFormData) => {
    try {
      setError("");
      setSuccess("");
      setLoading(true);

      // Check password confirmation
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await signup(data.email, data.password, data.displayName);

      setSuccess(
        "Account created successfully! Please check your email to verify your account."
      );

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/auth/login");
      }, 2000);
    } catch (error: any) {
      let errorMessage = "Failed to create account";

      if (error.message.includes("email-already-in-use")) {
        errorMessage = "An account with this email already exists";
      } else if (error.message.includes("weak-password")) {
        errorMessage = "Password is too weak";
      } else if (error.message.includes("invalid-email")) {
        errorMessage = "Invalid email address";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

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
            maxWidth: 450,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <PersonAdd
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join us today! Please fill in your information
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

            {/* Signup Form */}
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              {/* Display Name Field */}
              <Controller
                name="displayName"
                control={control}
                rules={validationRules.displayName}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Full Name"
                    margin="normal"
                    error={!!errors.displayName}
                    helperText={errors.displayName?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                )}
              />

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
                  />
                )}
              />

              {/* Password Field */}
              <Controller
                name="password"
                control={control}
                rules={validationRules.password}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    margin="normal"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={togglePasswordVisibility}
                            edge="end"
                            disabled={loading}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                )}
              />

              {/* Confirm Password Field */}
              <Controller
                name="confirmPassword"
                control={control}
                rules={{
                  ...validationRules.confirmPassword,
                  validate: (value) =>
                    value === password || "Passwords do not match",
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Confirm Password"
                    type={showConfirmPassword ? "text" : "password"}
                    margin="normal"
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={toggleConfirmPasswordVisibility}
                            edge="end"
                            disabled={loading}
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                  />
                )}
              />

              {/* Accept Terms Checkbox */}
              <Controller
                name="acceptTerms"
                control={control}
                rules={validationRules.acceptTerms}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        {...field}
                        checked={field.value}
                        disabled={loading}
                        color="primary"
                      />
                    }
                    label={
                      <Typography variant="body2" color="text.secondary">
                        I agree to the{" "}
                        <Link href="/terms" style={{ color: "inherit" }}>
                          Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" style={{ color: "inherit" }}>
                          Privacy Policy
                        </Link>
                      </Typography>
                    }
                    sx={{ mt: 2, alignItems: "flex-start" }}
                  />
                )}
              />
              {errors.acceptTerms && (
                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                  {errors.acceptTerms.message}
                </Typography>
              )}

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
                  "Create Account"
                )}
              </Button>
            </Box>

            {/* Divider */}
            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            {/* Sign In Link */}
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link href="/auth/login" style={{ textDecoration: "none" }}>
                  <Typography
                    component="span"
                    variant="body2"
                    color="primary"
                    sx={{
                      fontWeight: "medium",
                      "&:hover": {
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign in here
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

export default SignupPage;
