/* supabaseService.ts
 *
 * Supabase CRUD helpers for CURRENT schema:
 * - companies
 * - profiles (users)
 * - clients
 * - properties
 *
 * Notes:
 * - This schema does NOT have soft-delete or audit columns (createdBy/updatedBy/isDeleted/etc).
 * - Use DB columns: created_at (timestamptz) and generated normalized_* fields on clients.
 * - user -> profiles (id = auth.users.id), user belongs to exactly one company via profiles.company_id
 */

import { createClient } from "@/app/supabaseConfig";
import type { PostgrestError } from "@supabase/supabase-js";
import { Database } from "../../database.types";

export type Company = Database["public"]["Tables"]["companies"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type Property = Database["public"]["Tables"]["properties"]["Row"];
export type Project = Database["public"]["Tables"]["projects"]["Row"]; 
export type PropertyRoom = Database["public"]["Tables"]["property_rooms"]["Row"];


export type ClientWithProperties = Client & {
  properties: Property[];
};

export type MemberRole = Database["public"]["Enums"]["member_role"];
export type ClientType = Database["public"]["Enums"]["client_type"];
export type ClientStatus = Database["public"]["Enums"]["client_status"];
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type ProjectType = Database["public"]["Enums"]["project_type"];

export type ProjectWithRelationsAndRooms = Project & {
  client: Client;
  property: Property & { rooms: PropertyRoom[] };
};


const supabase = createClient();

/** -------------------------------------------------------
 * Types (match DB)
 * ------------------------------------------------------ */

export type PropertyType = "residential" | "commercial";

export type WithMeta<T> = T & { id: string };

export interface ListResult<T> {
  items: WithMeta<T>[];
  total?: number;
}
 
/** -------------------------------------------------------
 * Helpers
 * ------------------------------------------------------ */

function assertOk<T>(res: { data: T | null; error: PostgrestError | null }, msg?: string): T {
  if (res.error) throw res.error;
  if (res.data == null) throw new Error(msg ?? "No data returned");
  return res.data;
}

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

/** -------------------------------------------------------
 * Profiles API (Users)
 * ------------------------------------------------------ */

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

/** -------------------------------------------------------
 * Clients API
 * ------------------------------------------------------ */

export const clientApi = {
  async listClients(params?: {
    status?: ClientStatus;
    q?: string; // searches display_name, primary_email, primary_phone
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Client>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("clients").select("*", { count: "exact" });

    if (params?.status) query = query.eq("status", params.status);

    if (params?.q && params.q.trim()) {
      const q = params.q.trim();
      // ilike across a few fields
      query = query.or(
        [
          `display_name.ilike.%${q}%`,
          `primary_email.ilike.%${q}%`,
          `primary_phone.ilike.%${q}%`,
        ].join(",")
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as Client[],
      total: count ?? undefined,
    };
  },

  async getClient(id: string): Promise<Client> {
    const res = await supabase.from("clients").select("*").eq("id", id).single();
    return assertOk(res, `Client not found: ${id}`);
  },

  async createClient(input: Omit<Client, "id" | "created_at" | "normalized_email" | "normalized_phone">): Promise<Client> {
    const res = await supabase.from("clients").insert(input).select("*").single();
    return assertOk(res, "Failed to create client");
  },

  async updateClient(
    id: string,
    patch: Partial<Omit<Client, "id" | "company_id" | "created_at" | "normalized_email" | "normalized_phone">>
  ): Promise<Client> {
    const res = await supabase.from("clients").update(patch).eq("id", id).select("*").single();
    return assertOk(res, "Failed to update client");
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw error;
  },

  /**
   * Convenience: find possible duplicates WITHIN the company by normalized keys.
   * Pass raw email/phone; DB has generated normalized columns but we also normalize here for query.
   */
  async findDuplicates(args: { company_id: string; email?: string | null; phone?: string | null }): Promise<Client[]> {
    const normEmail =
      args.email && args.email.trim() ? args.email.trim().toLowerCase() : null;
    const normPhone =
      args.phone && args.phone.trim()
        ? args.phone.replace(/[^0-9]/g, "")
        : null;

    // If no keys, return empty
    if (!normEmail && !normPhone) return [];

    let query = supabase.from("clients").select("*").eq("company_id", args.company_id);

    if (normEmail && normPhone) {
      query = query.or(`normalized_email.eq.${normEmail},normalized_phone.eq.${normPhone}`);
    } else if (normEmail) {
      query = query.eq("normalized_email", normEmail);
    } else if (normPhone) {
      query = query.eq("normalized_phone", normPhone);
    }

    const { data, error } = await query.limit(10);
    if (error) throw error;
    return (data ?? []) as Client[];
  },

  async listClientsWithAddresses(params?: {
    q?: string; // searches client display_name/email/phone + property address fields
    status?: ClientStatus;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<ClientWithProperties>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    // Join properties as nested array: properties(*)
    let query = supabase
      .from("clients")
      .select(
        `
        *,
        properties:properties(*)
      `,
        { count: "exact" }
      );

    if (params?.status) query = query.eq("status", params.status);

    // Search across clients + properties
    if (params?.q && params.q.trim()) {
      const q = params.q.trim();

      // NOTE: PostgREST "or" does not reliably span nested relations in all cases.
      // This works for many setups, but if it doesn't in your project,
      // use the RPC approach (below).
      query = query.or(
        [
          `display_name.ilike.%${q}%`,
          `primary_email.ilike.%${q}%`,
          `primary_phone.ilike.%${q}%`,
          // property fields (may or may not work depending on PostgREST config)
          `properties.name.ilike.%${q}%`,
          `properties.address_line1.ilike.%${q}%`,
          `properties.address_line2.ilike.%${q}%`,
          `properties.city.ilike.%${q}%`,
          `properties.state.ilike.%${q}%`,
          `properties.zip.ilike.%${q}%`,
        ].join(",")
      );
    }

    const { data, error, count } = await query
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: ((data ?? []) as unknown) as ClientWithProperties[],
      total: count ?? undefined,
    };
  },

  async getClientWithAddresses(clientId: string): Promise<ClientWithProperties> {
    const res = await supabase
      .from("clients")
      .select(
        `
        *,
        properties:properties(*)
      `
      )
      .eq("id", clientId)
      .single();

    return assertOk(res, `Client not found: ${clientId}`) as unknown as ClientWithProperties;
  },
};

/** -------------------------------------------------------
 * Properties API (replaces "buildings")
 * ------------------------------------------------------ */

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
};