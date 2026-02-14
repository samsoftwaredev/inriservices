import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import {
  EstimateStatus,
  ListResult,
  ProjectEstimate,
  ProjectEstimateLine,
} from "@/types";

export const estimateComputeApi = {
  async recalcProjectEstimate(projectId: string): Promise<{
    estimate_id: string;
    project_id: string;
    estimated_man_hours: number;
    labor_price_cents: number;
    material_cost_cents: number;
    material_price_cents: number;
    tax_cents: number;
    total_cents: number;
  }> {
    const { data, error } = await supabase.rpc("recalc_project_estimate", {
      p_project_id: projectId,
    });

    if (error) throw error;
    return data as any;
  },
};

export const projectEstimateApi = {
  async list(params?: {
    project_id?: string;
    status?: EstimateStatus;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<ProjectEstimate>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase
      .from("project_estimates")
      .select("*", { count: "exact" });

    if (params?.project_id) query = query.eq("project_id", params.project_id);
    if (params?.status) query = query.eq("status", params.status);

    const { data, error, count } = await query
      .order("updated_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as ProjectEstimate[],
      total: count ?? undefined,
    };
  },

  async getByProjectId(projectId: string): Promise<ProjectEstimate | null> {
    const { data, error } = await supabase
      .from("project_estimates")
      .select("*")
      .eq("project_id", projectId)
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as ProjectEstimate | null;
  },

  async get(id: string): Promise<ProjectEstimate> {
    const res = await supabase
      .from("project_estimates")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Estimate not found: ${id}`) as ProjectEstimate;
  },

  async create(
    input: Omit<ProjectEstimate, "id" | "created_at" | "updated_at">,
  ): Promise<ProjectEstimate> {
    const res = await supabase
      .from("project_estimates")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create estimate") as ProjectEstimate;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<
        ProjectEstimate,
        "id" | "company_id" | "project_id" | "created_at" | "updated_at"
      >
    >,
  ): Promise<ProjectEstimate> {
    const res = await supabase
      .from("project_estimates")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update estimate") as ProjectEstimate;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("project_estimates")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async getFull(projectId: string): Promise<{
    estimate: ProjectEstimate | null;
    lines: ProjectEstimateLine[];
  }> {
    const res = await supabase
      .from("project_estimates")
      .select(
        `
        *,
        lines:project_estimate_lines(*)
      `,
      )
      .eq("project_id", projectId)
      .maybeSingle();

    if (res.error) throw res.error;

    if (!res.data) return { estimate: null, lines: [] };

    const { lines, ...estimate } = res.data as any;
    return {
      estimate: estimate as ProjectEstimate,
      lines: (lines ?? []) as ProjectEstimateLine[],
    };
  },
};
