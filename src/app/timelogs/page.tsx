import { ProtectedRoute } from "@/components";
import AppLayout from "@/components/AppLayout/AppLayout";
import { TimeTracker } from "@/components/TimeTracker";
import React from "react";

const TimeLogsPage = () => {
  return (
    <ProtectedRoute>
      <AppLayout>
        <TimeTracker />
      </AppLayout>
    </ProtectedRoute>
  );
};

export default TimeLogsPage;
