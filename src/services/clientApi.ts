import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import {
  Client,
  ClientStatus,
  ClientWithProperties,
  ListResult,
  Project,
  Property,
} from "@/types";

export type ClientWithRelations = Client & {
  properties: Array<
    Property & {
      projects: Project[];
    }
  >;
};

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

  async getClient(id: string): Promise<ClientWithRelations> {
    const res = await supabase
      .from("clients")
      .select(
        `
      *,
      properties (
        *,
        projects (*)
      )
    `
      )
      .eq("id", id)
      .single();

    return assertOk(res, `Client not found: ${id}`);
  },

  async createClient(
    input: Omit<
      Client,
      "id" | "created_at" | "normalized_email" | "normalized_phone"
    >
  ): Promise<Client> {
    const res = await supabase
      .from("clients")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create client");
  },

  async updateClient(
    id: string,
    patch: Partial<
      Omit<
        Client,
        | "id"
        | "company_id"
        | "created_at"
        | "normalized_email"
        | "normalized_phone"
      >
    >
  ): Promise<Client> {
    const res = await supabase
      .from("clients")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
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
  async findDuplicates(args: {
    company_id: string;
    email?: string | null;
    phone?: string | null;
  }): Promise<Client[]> {
    const normEmail =
      args.email && args.email.trim() ? args.email.trim().toLowerCase() : null;
    const normPhone =
      args.phone && args.phone.trim()
        ? args.phone.replace(/[^0-9]/g, "")
        : null;

    // If no keys, return empty
    if (!normEmail && !normPhone) return [];

    let query = supabase
      .from("clients")
      .select("*")
      .eq("company_id", args.company_id);

    if (normEmail && normPhone) {
      query = query.or(
        `normalized_email.eq.${normEmail},normalized_phone.eq.${normPhone}`
      );
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
    let query = supabase.from("clients").select(
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
      items: (data ?? []) as unknown as ClientWithProperties[],
      total: count ?? undefined,
    };
  },

  async getClientWithAddresses(
    clientId: string
  ): Promise<ClientWithProperties> {
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

    return assertOk(
      res,
      `Client not found: ${clientId}`
    ) as unknown as ClientWithProperties;
  },
};
