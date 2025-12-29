"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/context";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = "/auth/login",
  requireEmailVerification = false,
}) => {
  const { firebaseUser, loading } = useAuth();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!firebaseUser) {
        router.push(redirectTo);
      } else if (requireEmailVerification && !firebaseUser.emailVerified) {
        router.push("/auth/verify-email");
      } else {
        setIsChecking(false);
      }
    }
  }, [firebaseUser, loading, router, redirectTo, requireEmailVerification]);

  // Show loading spinner while checking authentication
  if (loading || isChecking) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  // Show nothing if not authenticated (user will be redirected)
  if (!firebaseUser) {
    return null;
  }

  // Show nothing if email verification is required but not completed
  if (requireEmailVerification && !firebaseUser.emailVerified) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
