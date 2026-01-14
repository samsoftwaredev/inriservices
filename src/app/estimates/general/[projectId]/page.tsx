"use client";

import React, { useEffect } from "react";

import AppLayout from "@/components/AppLayout";
import { GeneralEstimate, ProtectedRoute } from "@/components";
import { ProjectCostProvider } from "@/context/ProjectCostContext";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Estimates = ({ params }: Props) => {
  const [projectId, setProjectId] = React.useState<string | null>(null);

  // Resolve params first
  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <ProjectCostProvider>
          <GeneralEstimate paramsProjectId={projectId ?? undefined} />
        </ProjectCostProvider>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Estimates;
