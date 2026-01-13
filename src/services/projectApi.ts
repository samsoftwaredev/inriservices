import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { ListResult, Project, ProjectStatus, ProjectType, ProjectWithRelationsAndRooms,   } from "@/types";

type ProjectInsert = Omit<Project, "id" | "created_at" | "updated_at">;
type ProjectUpdate = Partial<Omit<Project, "id" | "company_id" | "client_id" | "property_id" | "created_at" | "updated_at">> &
  // allow these to be updated intentionally if you want; remove if you want to lock them
  Partial<Pick<Project, "client_id" | "property_id">>;

export const projectApi = {
  async listProjectsWithClientPropertyAndRooms(params?: {
    status?: ProjectStatus;
    project_type?: ProjectType;
    q?: string; // reliable search is project.name; cross-table search => use RPC
    limit?: number;
    offset?: number;
  }): Promise<ListResult<ProjectWithRelationsAndRooms>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase
      .from("projects")
      .select(
        `
        *,
        client:clients(*),
        property:properties(
          *,
          rooms:property_rooms(*)
        )
        `,
        { count: "exact" }
      );

    if (params?.status) query = query.eq("status", params.status);
    if (params?.project_type) query = query.eq("project_type", params.project_type);

    if (params?.q && params.q.trim()) {
      const q = params.q.trim();
      // Keep this reliable. Cross-table searching embedded relations is often inconsistent.
      query = query.ilike("name", `%${q}%`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as unknown as ProjectWithRelationsAndRooms[],
      total: count ?? undefined,
    };
  },

  async getProjectWithClientPropertyAndRooms(projectId: string): Promise<ProjectWithRelationsAndRooms> {
    const res = await supabase
      .from("projects")
      .select(
        `
        *,
        client:clients(*),
        property:properties(
          *,
          rooms:property_rooms(*)
        )
        `
      )
      .eq("id", projectId)
      .single();

    return assertOk(res, `Project not found: ${projectId}`) as unknown as ProjectWithRelationsAndRooms;
  },

  async listProjects(params?: {
    status?: ProjectStatus;
    project_type?: ProjectType;
    client_id?: string;
    property_id?: string;
    year_end_date?: number; // filters by end_date year
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Project>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("projects").select("*", { count: "exact" });

    if (params?.status) query = query.eq("status", params.status);
    if (params?.project_type) query = query.eq("project_type", params.project_type);
    if (params?.client_id) query = query.eq("client_id", params.client_id);
    if (params?.property_id) query = query.eq("property_id", params.property_id);

    // end_date year filter (requires end_date not null)
    if (typeof params?.year_end_date === "number") {
      const y = params.year_end_date;
      query = query.gte("end_date", `${y}-01-01`).lte("end_date", `${y}-12-31`);
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as Project[],
      total: count ?? undefined,
    };
  },

  /** ----------------------------------------
   * Get single (no embeds)
   * --------------------------------------- */
  async getProject(projectId: string): Promise<Project> {
    const res = await supabase
        .from("projects")
        .select(`
            *,
            client:clients(*),
            property:properties(
            *,
            rooms:property_rooms(*)
            )
        `)
        .eq("id", projectId)
        .single();
    return assertOk(res, `Project not found: ${projectId}`) as Project;
  },

  /** ----------------------------------------
   * Create
   * Notes:
   * - RLS expects company_id = current_company_id()
   * - Triggers enforce company consistency vs client/property
   * --------------------------------------- */
  async createProject(input: ProjectInsert): Promise<Project> {
    const res = await supabase.from("projects").insert(input).select("*").single();
    return assertOk(res, "Failed to create project") as Project;
  },

  /** Create + return embedded relations (client/property/rooms) */
  async createProjectWithRelations(input: ProjectInsert): Promise<ProjectWithRelationsAndRooms> {
    // Insert first
    const created = await this.createProject(input);

    // Fetch with embeds
    return this.getProjectWithClientPropertyAndRooms(created.id);
  },

  /** ----------------------------------------
   * Update
   * --------------------------------------- */
  async updateProject(projectId: string, patch: ProjectUpdate): Promise<Project> {
    const res = await supabase.from("projects").update(patch).eq("id", projectId).select("*").single();
    return assertOk(res, "Failed to update project") as Project;
  },

  /** Update + return embedded relations */
  async updateProjectWithRelations(projectId: string, patch: ProjectUpdate): Promise<ProjectWithRelationsAndRooms> {
    await this.updateProject(projectId, patch);
    return this.getProjectWithClientPropertyAndRooms(projectId);
  },

  /** ----------------------------------------
   * Delete (hard delete)
   * --------------------------------------- */
  async deleteProject(projectId: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", projectId);
    if (error) throw error;
  },

  /** ----------------------------------------
   * Convenience helpers (optional)
   * --------------------------------------- */

  async setStatus(projectId: string, status: ProjectStatus): Promise<Project> {
    return this.updateProject(projectId, { status });
  },

  async setDates(projectId: string, patch: { start_date?: string | null; end_date?: string | null }): Promise<Project> {
    return this.updateProject(projectId, patch);
  },

  async setInvoiceTotal(projectId: string, invoice_total_cents: number | null): Promise<Project> {
    return this.updateProject(projectId, { invoice_total_cents } as unknown as ProjectUpdate);
  },
};