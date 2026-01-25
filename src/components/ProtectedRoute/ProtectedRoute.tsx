"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context";
import Spinner from "../Spinner";
import ErrorPage from "../ErrorPage";

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
      <ErrorPage
        title="Authentication Error"
        message="Navigation to login..."
      />
    );
  }
  // Show loading spinner while checking authentication
  if (authSuccess && !session) {
    return <Spinner />;
  }

  if (!session) {
    router.push("/auth/login");
    return (
      <ErrorPage
        title="Invalid Session"
        message="You must be logged in to access this page. Redirecting to login..."
      />
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
