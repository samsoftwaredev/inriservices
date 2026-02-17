import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { ListResult, Vendor, VendorType } from "@/types";

/** ----------------------------
 * VENDORS
 * ---------------------------- */
export const vendorsApi = {
  async list(params?: {
    type?: VendorType;
    q?: string; // name/email/phone
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Vendor>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("vendors").select("*", { count: "exact" });

    if (params?.type) query = query.eq("type", params.type);

    if (params?.q?.trim()) {
      const q = params.q.trim();
      query = query.or(
        [`name.ilike.%${q}%`, `email.ilike.%${q}%`, `phone.ilike.%${q}%`].join(
          ",",
        ),
      );
    }

    const { data, error, count } = await query
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { items: (data ?? []) as Vendor[], total: count ?? undefined };
  },

  async get(id: string): Promise<Vendor> {
    const res = await supabase
      .from("vendors")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Vendor not found: ${id}`) as Vendor;
  },

  async create(
    input: Omit<Vendor, "id" | "created_at" | "updated_at">,
  ): Promise<Vendor> {
    const res = await supabase
      .from("vendors")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create vendor") as Vendor;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<Vendor, "id" | "company_id" | "created_at" | "updated_at">
    >,
  ): Promise<Vendor> {
    const res = await supabase
      .from("vendors")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update vendor") as Vendor;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("vendors").delete().eq("id", id);
    if (error) throw error;
  },
};
