import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { Profile } from "@/types";

export const profileApi = {
  async getMe(): Promise<Profile> {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) throw new Error("Not authenticated");

    const res = await supabase.from("profiles").select("*").eq("id", uid).single();
    return assertOk(res, "Profile not found");
  },

  async updateMe(patch: Partial<Pick<Profile, "full_name" | "phone">>): Promise<Profile> {
    const uid = (await supabase.auth.getUser()).data.user?.id;
    if (!uid) throw new Error("Not authenticated");

    const res = await supabase
      .from("profiles")
      .update(patch)
      .eq("id", uid)
      .select("*")
      .single();

    return assertOk(res, "Failed to update profile");
  },

  /**
   * Note: profiles INSERT is usually done by a signup trigger or admin/service role.
   * Keep this here only if your app is creating profiles client-side.
   */
  async createProfile(input: Profile): Promise<Profile> {
    const res = await supabase.from("profiles").insert(input).select("*").single();
    return assertOk(res, "Failed to create profile");
  },
};

