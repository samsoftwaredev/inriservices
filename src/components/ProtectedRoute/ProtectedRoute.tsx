"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/context";
import Spinner from "../Spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { authError, authSuccess, session, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <Spinner />;
  }

  if (authError) {
    router.push("/auth/login");
    return (
      <div>
        <h1>Authentication Error</h1>
        <p>Navigation to login...</p>
      </div>
    );
  }
  // Show loading spinner while checking authentication
  if (authSuccess && !session) {
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

  if (!session) {
    router.push("/auth/login");
    return (
      <div>
        <h1>Invalid Session</h1>
        <p>Navigation to login...</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
