import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools/general";
import { Accounts, AccountType, ListResult } from "@/types";

/** ----------------------------
 * ACCOUNTS
 * ---------------------------- */
export const accountsApi = {
  async list(params?: {
    type?: AccountType;
    is_active?: boolean;
    q?: string; // name/code
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Accounts>> {
    const limit = params?.limit ?? 100;
    const offset = params?.offset ?? 0;

    let query = supabase.from("accounts").select("*", { count: "exact" });

    if (params?.type) query = query.eq("type", params.type);
    if (typeof params?.is_active === "boolean")
      query = query.eq("is_active", params.is_active);

    if (params?.q?.trim()) {
      const q = params.q.trim();
      query = query.or([`name.ilike.%${q}%`, `code.ilike.%${q}%`].join(","));
    }

    const { data, error, count } = await query
      .order("type", { ascending: true })
      .order("name", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { items: (data ?? []) as Accounts[], total: count ?? undefined };
  },

  async get(id: string): Promise<Accounts> {
    const res = await supabase
      .from("accounts")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Account not found: ${id}`) as Accounts;
  },

  async create(
    input: Omit<Accounts, "id" | "created_at" | "updated_at">,
  ): Promise<Accounts> {
    const res = await supabase
      .from("accounts")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create account") as Accounts;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<Accounts, "id" | "company_id" | "created_at" | "updated_at">
    >,
  ): Promise<Accounts> {
    const res = await supabase
      .from("accounts")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update account") as Accounts;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from("accounts").delete().eq("id", id);
    if (error) throw error;
  },
};
