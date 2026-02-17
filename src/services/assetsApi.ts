import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { Asset, AssetStatus, ListResult } from "@/types";

/** ----------------------------
 * ASSETS
 * ---------------------------- */
export const assetsApi = {
  async list(params?: {
    status?: AssetStatus;
    vendor_id?: string;
    year?: number; // purchase_date year
    q?: string; // name/category/notes
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Asset>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("assets").select("*", { count: "exact" });

    if (params?.status) query = query.eq("status", params.status);
    if (params?.vendor_id) query = query.eq("vendor_id", params.vendor_id);

    if (params?.year) {
      const y = params.year;
      query = query
        .gte("purchase_date", `${y}-01-01`)
        .lte("purchase_date", `${y}-12-31`);
    }

    if (params?.q?.trim()) {
      const q = params.q.trim();
      query = query.or(
        [
          `name.ilike.%${q}%`,
          `category.ilike.%${q}%`,
          `notes.ilike.%${q}%`,
        ].join(","),
      );
    }

    const { data, error, count } = await query
      .order("purchase_date", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { items: (data ?? []) as Asset[], total: count ?? undefined };
  },

  async get(id: string): Promise<Asset> {
    const res = await supabase.from("assets").select("*").eq("id", id).single();
    return assertOk(res, `Asset not found: ${id}`) as Asset;
  },

  async create(
    input: Omit<Asset, "id" | "created_at" | "updated_at">,
  ): Promise<Asset> {
    const res = await supabase
      .from("assets")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create asset") as Asset;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<Asset, "id" | "company_id" | "created_at" | "updated_at">
    >,
  ): Promise<Asset> {
    const res = await supabase
      .from("assets")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update asset") as Asset;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("assets").delete().eq("id", id);
    if (error) throw error;
  },
};
