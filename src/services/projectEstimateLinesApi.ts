import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { ListResult, ProjectEstimateLine } from "@/types";

export const projectEstimateLineApi = {
  async list(params: {
    estimate_id: string;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<ProjectEstimateLine>> {
    const limit = params.limit ?? 200;
    const offset = params.offset ?? 0;

    const { data, error, count } = await supabase
      .from("project_estimate_lines")
      .select("*", { count: "exact" })
      .eq("estimate_id", params.estimate_id)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as ProjectEstimateLine[],
      total: count ?? undefined,
    };
  },

  async get(id: string): Promise<ProjectEstimateLine> {
    const res = await supabase
      .from("project_estimate_lines")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(
      res,
      `Estimate line not found: ${id}`,
    ) as ProjectEstimateLine;
  },

  async create(
    input: Omit<ProjectEstimateLine, "id" | "created_at">,
  ): Promise<ProjectEstimateLine> {
    const res = await supabase
      .from("project_estimate_lines")
      .insert(input)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to create estimate line",
    ) as ProjectEstimateLine;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<
        ProjectEstimateLine,
        "id" | "company_id" | "estimate_id" | "created_at"
      >
    >,
  ): Promise<ProjectEstimateLine> {
    const res = await supabase
      .from("project_estimate_lines")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to update estimate line",
    ) as ProjectEstimateLine;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("project_estimate_lines")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async reorder(estimateId: string, orderedLineIds: string[]): Promise<void> {
    // simple sequential reorder
    for (let i = 0; i < orderedLineIds.length; i++) {
      const { error } = await supabase
        .from("project_estimate_lines")
        .update({ sort_order: i })
        .eq("id", orderedLineIds[i])
        .eq("estimate_id", estimateId);

      if (error) throw error;
    }
  },
};
