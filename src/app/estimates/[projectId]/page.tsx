"use client";

import React, { useEffect } from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import { useRouter } from "next/navigation";
import { ProjectTransformed } from "@/types";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

const Estimates = ({ params }: Props) => {
  const router = useRouter();
  const [projectId, setProjectId] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [project, setProject] = React.useState<null | ProjectTransformed>(null);

  // Resolve params first
  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  return (
    <ProtectedRoute>
      <AppLayout>
        <h1>Estimate Project ID: {projectId}</h1>
      </AppLayout>
    </ProtectedRoute>
  );
};

export default Estimates;
