import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools/general";
import {
  CompanyProductionRate,
  ListResult,
  ServiceType,
  UnitType,
} from "@/types";

export const companyProductionRateApi = {
  async list(params?: {
    service?: ServiceType;
    unit?: UnitType;
    q?: string; // optional search in notes
    limit?: number;
    offset?: number;
  }): Promise<ListResult<CompanyProductionRate>> {
    const limit = params?.limit ?? 200;
    const offset = params?.offset ?? 0;

    let query = supabase
      .from("company_production_rates")
      .select("*", { count: "exact" });

    if (params?.service) query = query.eq("service", params.service);
    if (params?.unit) query = query.eq("unit", params.unit);
    if (params?.q && params.q.trim())
      query = query.ilike("notes", `%${params.q.trim()}%`);

    const { data, error, count } = await query
      .order("service", { ascending: true })
      .order("unit", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as CompanyProductionRate[],
      total: count ?? undefined,
    };
  },

  async upsert(
    input: Omit<CompanyProductionRate, "id" | "created_at" | "updated_at">,
  ): Promise<CompanyProductionRate> {
    // conflict key = (company_id, service, unit)
    const res = await supabase
      .from("company_production_rates")
      .upsert(input, { onConflict: "company_id,service,unit" })
      .select("*")
      .single();

    return assertOk(
      res,
      "Failed to upsert company production rate",
    ) as CompanyProductionRate;
  },

  async update(
    id: string,
    patch: Partial<Pick<CompanyProductionRate, "units_per_hour" | "notes">>,
  ): Promise<CompanyProductionRate> {
    const res = await supabase
      .from("company_production_rates")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to update company production rate",
    ) as CompanyProductionRate;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("company_production_rates")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },
};
