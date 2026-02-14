import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { CompanyFinancialProfile } from "@/types";

export const financialProfileApi = {
  async get(): Promise<CompanyFinancialProfile | null> {
    // company_id is the PK; you likely have exactly one row per company
    const { data, error } = await supabase
      .from("company_financial_profiles")
      .select("*")
      .maybeSingle();

    if (error) throw error;
    return (data ?? null) as CompanyFinancialProfile | null;
  },

  async upsert(
    input: Omit<
      CompanyFinancialProfile,
      | "sellable_man_hours"
      | "overhead_per_hour_cents"
      | "direct_labor_cost_per_hour_cents"
      | "true_cost_per_hour_cents"
      | "billable_rate_per_hour_cents"
      | "created_at"
      | "updated_at"
    >,
  ): Promise<CompanyFinancialProfile> {
    // If company_id is PK, upsert works cleanly.
    const res = await supabase
      .from("company_financial_profiles")
      .upsert(input, { onConflict: "company_id" })
      .select("*")
      .single();

    return assertOk(
      res,
      "Failed to upsert financial profile",
    ) as CompanyFinancialProfile;
  },

  async update(
    patch: Partial<
      Omit<CompanyFinancialProfile, "company_id" | "created_at" | "updated_at">
    >,
  ): Promise<CompanyFinancialProfile> {
    // There is exactly one row per company; easiest is update without filtering by company_id
    // because RLS will scope it. If you prefer, pass company_id and .eq("company_id", ...)
    const res = await supabase
      .from("company_financial_profiles")
      .update(patch)
      .select("*")
      .single();

    return assertOk(
      res,
      "Failed to update financial profile",
    ) as CompanyFinancialProfile;
  },
};
