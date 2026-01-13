import { supabase } from "@/app/supabaseConfig"; 
import { assertOk } from "@/tools";
import { ListResult, Property,   } from "@/types";
 
export const propertyApi = {
  async listProperties(params?: {
    client_id?: string;
    q?: string; // name/address/city/state/zip
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Property>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("properties").select("*", { count: "exact" });

    if (params?.client_id) query = query.eq("client_id", params.client_id);

    if (params?.q && params.q.trim()) {
      const q = params.q.trim();
      query = query.or(
        [
          `name.ilike.%${q}%`,
          `address_line1.ilike.%${q}%`,
          `address_line2.ilike.%${q}%`,
          `city.ilike.%${q}%`,
          `state.ilike.%${q}%`,
          `zip.ilike.%${q}%`,
        ].join(",")
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as Property[],
      total: count ?? undefined,
    };
  },

  async getProperty(id: string): Promise<Property> {
    const res = await supabase.from("properties").select("*").eq("id", id).single();
    return assertOk(res, `Property not found: ${id}`);
  },

  async createProperty(input: Omit<Property, "id" | "created_at">): Promise<Property> {
    // Trigger enforces company_id matches client's company_id
    const res = await supabase.from("properties").insert(input).select("*").single();
    return assertOk(res, "Failed to create property");
  },

  async updateProperty(
    id: string,
    patch: Partial<Omit<Property, "id" | "company_id" | "client_id" | "created_at">>
  ): Promise<Property> {
    const res = await supabase.from("properties").update(patch).eq("id", id).select("*").single();
    return assertOk(res, "Failed to update property");
  },

  async deleteProperty(id: string): Promise<void> {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (error) throw error;
  },
};

