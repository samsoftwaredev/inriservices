import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { Company } from "@/types";
/**
 * Fetch current user's company_id from profiles (RLS-safe).
 * Useful when callers don't want to pass company_id around.
 */
export async function getMyCompanyId(): Promise<string> {
  const { data, error } = await supabase
    .from("profiles")
    .select("company_id")
    .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
    .single();

  if (error) throw error;
  if (!data?.company_id) throw new Error("No company_id found for current user profile");
  return data.company_id;
}

/** -------------------------------------------------------
 * Companies API
 * ------------------------------------------------------ */

export const companyApi = {
  async getMyCompany(): Promise<Company> {
    // RLS allows select for company matching current_company_id()
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .single();
    if (pErr) throw pErr;
    if (!profile?.company_id) throw new Error("Profile/company not found");

    const res = await supabase
      .from("companies")
      .select("*")
      .eq("id", profile.company_id)
      .single();

    return assertOk(res, "Company not found");
  },

  async updateMyCompany(patch: Partial<Pick<Company, "name" | "billing_email" | "phone">>): Promise<Company> {
    const { data: profile, error: pErr } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", (await supabase.auth.getUser()).data.user?.id ?? "")
      .single();
    if (pErr) throw pErr;
    if (!profile?.company_id) throw new Error("Profile/company not found");

    const res = await supabase
      .from("companies")
      .update(patch)
      .eq("id", profile.company_id)
      .select("*")
      .single();

    return assertOk(res, "Failed to update company");
  },
};

  