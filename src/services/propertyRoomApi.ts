
import { supabase } from "@/app/supabaseConfig"; 
import { assertOk } from "@/tools";
import { ListResult,  PropertyRoom } from "@/types";

type PropertyRoomInsert = Omit<PropertyRoom, "id" | "created_at" | "updated_at">;

// Allow editing most fields; keep company_id locked.
// Allow project_id/property_id updates if you want to reassign; remove if you want them locked.
type PropertyRoomUpdate = Partial<
  Omit<PropertyRoom, "id" | "company_id" | "created_at" | "updated_at">
>;

export const propertyRoomApi = {
  /** List rooms (optionally filtered) */
  async listRooms(params?: {
    property_id?: string;
    project_id?: string | null;
    level?: number;
    q?: string; // name/description
    limit?: number;
    offset?: number;
    orderBy?: "sort_order" | "name" | "created_at";
    ascending?: boolean;
  }): Promise<ListResult<PropertyRoom>> {
    const limit = params?.limit ?? 100;
    const offset = params?.offset ?? 0;
    const orderBy = params?.orderBy ?? "sort_order";
    const ascending = params?.ascending ?? true;

    let query = supabase.from("property_rooms").select("*", { count: "exact" });

    if (params?.property_id) query = query.eq("property_id", params.property_id);

    // project_id filter:
    // - pass a string to filter to that project
    // - pass null to get unassigned rooms only
    if (params?.project_id === null) query = query.is("project_id", null);
    if (typeof params?.project_id === "string") query = query.eq("project_id", params.project_id);

    if (typeof params?.level === "number") query = query.eq("level", params.level);

    if (params?.q && params.q.trim()) {
      const q = params.q.trim();
      query = query.or([`name.ilike.%${q}%`, `description.ilike.%${q}%`].join(","));
    }

    const { data, error, count } = await query
      .order(orderBy, { ascending })
      // Secondary ordering for stable UI lists
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as PropertyRoom[],
      total: count ?? undefined,
    };
  },

  /** Get one room */
  async getRoom(roomId: string): Promise<PropertyRoom> {
    const res = await supabase.from("property_rooms").select("*").eq("id", roomId).single();
    return assertOk(res, `Room not found: ${roomId}`) as PropertyRoom;
  },

  /** Create a room */
  async createRoom(input: PropertyRoomInsert): Promise<PropertyRoom> {
    // DB triggers enforce: company_id matches property.company_id
    // and if project_id provided: company_id matches project.company_id
    const res = await supabase.from("property_rooms").insert(input).select("*").single();
    return assertOk(res, "Failed to create room") as PropertyRoom;
  },

  /** Update a room */
  async updateRoom(roomId: string, patch: PropertyRoomUpdate): Promise<PropertyRoom> {
    const res = await supabase
      .from("property_rooms")
      .update(patch)
      .eq("id", roomId)
      .select("*")
      .single();

    return assertOk(res, "Failed to update room") as PropertyRoom;
  },

  /** Delete a room (hard delete) */
  async deleteRoom(roomId: string): Promise<void> {
    const { error } = await supabase.from("property_rooms").delete().eq("id", roomId);
    if (error) throw error;
  },

  /** Assign a room to a project (Option A) */
  async assignRoomToProject(roomId: string, projectId: string): Promise<PropertyRoom> {
    return this.updateRoom(roomId, { project_id: projectId });
  },

  /** Unassign a room from a project */
  async unassignRoomFromProject(roomId: string): Promise<PropertyRoom> {
    return this.updateRoom(roomId, { project_id: null });
  },

  /** Bulk assign rooms to a project (useful for UI multi-select) */
  async bulkAssignRoomsToProject(args: {
    projectId: string;
    roomIds: string[];
  }): Promise<void> {
    if (!args.roomIds.length) return;

    const { error } = await supabase
      .from("property_rooms")
      .update({ project_id: args.projectId })
      .in("id", args.roomIds);

    if (error) throw error;
  },

  /**
   * "Sync" project rooms for a given property:
   * - Assign provided roomIds to project
   * - Unassign other rooms in that property currently assigned to the project (optional)
   *
   * This is the most common UI behavior: "these are the rooms in this project".
   */
  async syncProjectRooms(args: {
    projectId: string;
    propertyId: string;
    roomIds: string[];
  }): Promise<void> {
    // 1) Unassign rooms in property currently assigned to this project but not in the new list
    const { data: current, error: curErr } = await supabase
      .from("property_rooms")
      .select("id")
      .eq("property_id", args.propertyId)
      .eq("project_id", args.projectId);

    if (curErr) throw curErr;

    const currentIds = new Set((current ?? []).map((r) => r.id));
    const nextIds = new Set(args.roomIds);

    const toUnassign = [...currentIds].filter((id) => !nextIds.has(id));
    const toAssign = args.roomIds.filter((id) => !currentIds.has(id));

    if (toUnassign.length) {
      const { error } = await supabase
        .from("property_rooms")
        .update({ project_id: null })
        .in("id", toUnassign);
      if (error) throw error;
    }

    if (toAssign.length) {
      const { error } = await supabase
        .from("property_rooms")
        .update({ project_id: args.projectId })
        .in("id", toAssign);
      if (error) throw error;
    }
  },
};

