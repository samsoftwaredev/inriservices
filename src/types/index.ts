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

export type UserProfile = {
    fullName: string;
    companyId: string;
    id: string;
    createdAt: string;
    phone: string;
}

export type MemberRole = Database["public"]["Enums"]["member_role"];
export type ClientType = Database["public"]["Enums"]["client_type"];
export type ClientStatus = Database["public"]["Enums"]["client_status"];
export type ProjectStatus = Database["public"]["Enums"]["project_status"];
export type ProjectType = Database["public"]["Enums"]["project_type"];

export type ProjectWithRelationsAndRooms = Project & {
  client: Client;
  property: Property & { rooms: PropertyRoom[] };
};

export type DashboardMetricsJson = {
  year: number;
  jobsCompleted: number;
  amountEarnedCents: number;
  numberOfCustomers: number;
  pendingWork: number;
  laborCostCents: number;
  taxesCents: number;
  averageAmountSpentByClientCents: number;
};

/** -------------------------------------------------------
 * Types (match DB)
 * ------------------------------------------------------ */

export type PropertyType = "residential" | "commercial";

export type WithMeta<T> = T & { id: string };

export interface ListResult<T> {
  items: WithMeta<T>[];
  total?: number;
}
 