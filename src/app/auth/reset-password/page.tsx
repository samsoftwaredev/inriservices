"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
  CircularProgress,
  Container,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  CheckCircle,
} from "@mui/icons-material";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/context";

// Form data interface
interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Validation rules
const validationRules = {
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
};

const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);
  const { confirmPasswordReset } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm<ResetPasswordFormData>({
    mode: "onChange",
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    // Get the oobCode from URL parameters
    const code = searchParams.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      setError(
        "Invalid or missing reset code. Please request a new password reset."
      );
    }
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!oobCode) {
      setError("Invalid reset code");
      return;
    }

    try {
      setError("");
      setLoading(true);

      // Check password confirmation
      if (data.password !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      await confirmPasswordReset(oobCode, data.password);

      setSuccess(true);

      // Redirect to login after success
      setTimeout(() => {
        router.push("/auth/login");
      }, 3000);
    } catch (error: any) {
      let errorMessage = "Failed to reset password";

      if (error.message.includes("expired-action-code")) {
        errorMessage = "Reset link has expired. Please request a new one.";
      } else if (error.message.includes("invalid-action-code")) {
        errorMessage = "Invalid reset link. Please request a new one.";
      } else if (error.message.includes("weak-password")) {
        errorMessage = "Password is too weak";
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

  // Success view
  if (success) {
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
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <CheckCircle
                sx={{
                  fontSize: 64,
                  color: "success.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Password Reset Successfully!
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Your password has been reset successfully. You can now sign in
                with your new password.
              </Typography>
              <Alert severity="info" sx={{ mb: 3 }}>
                You will be redirected to the sign in page in a few seconds...
              </Alert>
              <Button
                variant="contained"
                fullWidth
                onClick={() => router.push("/auth/login")}
                size="large"
              >
                Go to Sign In
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Container>
    );
  }

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
              <Lock
                sx={{
                  fontSize: 48,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom>
                Reset Password
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enter your new password below
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {oobCode && (
              <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                {/* Password Field */}
                <Controller
                  name="password"
                  control={control}
                  rules={validationRules.password}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="New Password"
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
                              {showPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      disabled={loading}
                      autoFocus
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
                      label="Confirm New Password"
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

                {/* Password Requirements */}
                <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    <strong>Password Requirements:</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    component="ul"
                    sx={{ pl: 2, mb: 0 }}
                  >
                    <li>At least 8 characters long</li>
                    <li>Contains uppercase and lowercase letters</li>
                    <li>Contains at least one number</li>
                  </Typography>
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={!isValid || loading || !oobCode}
                  sx={{
                    mt: 3,
                    mb: 2,
                    height: 48,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </Box>
            )}

            {/* Back to Login Link */}
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Remember your password?{" "}
                <Link href="/auth/login" style={{ textDecoration: "none" }}>
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
                    Sign in here
                  </Typography>
                </Link>
              </Typography>
            </Box>

            {/* Request New Reset Link */}
            {error && error.includes("expired") && (
              <Box sx={{ textAlign: "center", mt: 2 }}>
                <Link
                  href="/auth/forgot-password"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="outlined" size="small">
                    Request New Reset Link
                  </Button>
                </Link>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default ResetPasswordPage;
