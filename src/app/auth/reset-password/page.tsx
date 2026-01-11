"use client";

import React from "react";

import { ProtectedRoute } from "@/components";
import { ResetPassword } from "@/components/ResetPassword";

const ResetPasswordPage = () => {
  return (
    <ProtectedRoute>
      <ResetPassword />
    </ProtectedRoute>
  );
};

export default ResetPasswordPage;
