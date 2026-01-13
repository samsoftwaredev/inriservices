"use client";

import React, { useCallback, useEffect, useState } from "react";

import AppLayout from "@/components/AppLayout";
import { ProtectedRoute } from "@/components";
import { useRouter } from "next/navigation";
import { projectApi } from "@/services/projectApi";
import {
  ClientTransformed,
  ProjectTransformed,
  PropertyRoomTransformed,
  PropertyTransformed,
} from "@/types";
import {
  allRoomPropertyTransformer,
  clientTransformer,
  projectTransformer,
  propertyTransformer,
} from "@/tools/transformers";

interface Props {
  params: Promise<{
    projectId: string;
  }>;
}

type ProjectFullData = ProjectTransformed & {
  client: ClientTransformed;
  property: PropertyTransformed & { rooms: PropertyRoomTransformed[] };
};

const ProjectPage = ({ params }: Props) => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [project, setProject] = useState<null | ProjectFullData>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    params.then(({ projectId }) => {
      setProjectId(projectId);
    });
  }, [params]);

  const onInit = useCallback(
    async (id: string) => {
      setIsLoading(true);
      try {
        const projectData = await projectApi.getProject(id);
        const transformedProject: ProjectFullData = {
          ...projectTransformer(projectData),
          client: clientTransformer(projectData.client),
          property: {
            ...propertyTransformer(projectData.property),
            rooms: allRoomPropertyTransformer(projectData.property.rooms),
          },
        };
        setProject(transformedProject);
      } catch (error) {
        console.error("Error fetching project data:", error);
        router.push("/dashboard");
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (projectId) {
      onInit(projectId);
    }
  }, [projectId, onInit]);

  return (
    <ProtectedRoute>
      <AppLayout>
        {project ? (
          <div>
            <h1>Project: {project.name}</h1>
            <p>Client: {project.client.displayName}</p>
            <p>Property: {project.property.name}</p>
            {/* Additional project details can be rendered here */}
          </div>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <p>Project not found.</p>
        )}
      </AppLayout>
    </ProtectedRoute>
  );
};

export default ProjectPage;
