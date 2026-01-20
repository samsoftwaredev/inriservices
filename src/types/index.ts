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
export type Receipt = Database["public"]["Tables"]["receipts"]["Row"];
export type Invoice = Database["public"]["Tables"]["invoices"]["Row"];
export type InvoiceItem = Database["public"]["Tables"]["invoice_items"]["Row"];
export type PropertyRoom =
  Database["public"]["Tables"]["property_rooms"]["Row"];

export type ClientWithProperties = Client & {
  properties: Property[];
};

export type UserProfile = {
  fullName: string;
  companyId: string;
  id: string;
  createdAt: string;
  phone: string;
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

export type DateFilterType =
  | "current-year"
  | "current-month"
  | "last-3-months"
  | "last-6-months"
  | "custom-year"
  | "custom-month";

export interface DateFilter {
  type: DateFilterType;
  year?: number;
  month?: number;
}

export interface WorkHistoryItem {
  id: string;
  customerName: string;
  address: string;
  city: string;
  state: string;
  totalCostCents: number;
  numberOfRooms: number;
  date: string;
  status: ProjectStatus;
  projectType: ProjectType;
}

export interface SummaryCard {
  jobsCompleted: number;
  amountEarnedCents: number;
  numberOfCustomers: number;
  pendingWork: number;
  laborCostCents: number;
  taxesCents: number;
  averageAmountSpentByClientCents: number;
  profitCents: number;
}

export interface MetricCard {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  iconWrapperColor: string;
  bgColor: string;
  format: (value: number) => string;
}

export type ClientTransformed = {
  id: string;
  notes: string | null;
  status: ClientStatus;
  companyId: string;
  createdAt: string;
  clientType: ClientType;
  displayName: string;
  email: string;
  phone: string;
};

export type PropertyTransformed = {
  id: string;
  zip: string;
  city: string;
  name: string;
  state: string;
  country: string;
  clientId: string;
  companyId: string;
  createdAt: string;
  addressLine1: string;
  addressLine2: string | null;
  propertyType: PropertyType;
};

export type PropertyRoomTransformed = {
  id: string;
  name: string;
  level: number;
  companyId: string;
  createdAt: string;
  paintTrim: boolean;
  projectId: string | null;
  sortOrder: number;
  updatedAt: string;
  description: string;
  paintDoors: boolean;
  paintWalls: boolean;
  propertyId: string;
  paintCeiling: boolean;
  notesCustomer: string | null;
  notesInternal: string | null;
  roomHeightFt: number | null;
  wallAreaSqft: number | null;
  floorAreaSqft: number | null;
  ceilingAreaSqft: number | null;
  ceilingHeightFt: number | null;
  wallPerimeterFt: number | null;
  openingsAreaSqft: number | null;
};

export type ProjectTransformed = {
  id: string;
  companyId: string;
  clientId: string;
  propertyId: string;
  name: string;
  projectType: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  scopeNotes: string;
  materialCostCents: number;
  laborCostCents: number;
  markupBps: number;
  taxRateBps: number;
  taxAmountCents: number;
  laborHoursEstimated: number;
  createdAt: string;
  updatedAt: string;
  invoiceTotalCents: number;
};

export type ReceiptTransformed = {
  amountCents: number;
  clientId: string;
  companyId: string;
  createdAt: string;
  createdBy: string | null;
  currency: string;
  id: string;
  invoiceId: string | null;
  notes: string | null;
  paidAt: string;
  paymentMethod: PaymentMethod;
  projectId: string | null;
  referenceNumber: string | null;
  status: ReceiptStatus;
};

export type ProfileTransformed = {
  id: string;
  companyId: string;
  fullName: string;
  phone: string | null;
  role: MemberRole;
  createdAt: string;
};

export type CompanyTransformed = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  billingEmail: string;
};

export type ClientFullData = ClientTransformed & {
  properties: Array<PropertyTransformed & { projects: ProjectTransformed[] }>;
};

export type ProjectFullData = ProjectTransformed & {
  client: ClientTransformed;
  property: PropertyTransformed & { rooms: PropertyRoomTransformed[] };
};

export interface ProjectCost {
  laborCost: number;
  materialCost: number;
  companyFee: number;
  taxes: number;
  companyProfit: number;
  total: number;
}

export interface ProjectFormData {
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  scopeNotes: string;
}

export type InvoiceStatus =
  | "draft"
  | "sent"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "void";

export type PaymentMethod =
  | "cash"
  | "check"
  | "zelle"
  | "cash_app"
  | "venmo"
  | "credit_card"
  | "debit_card"
  | "ach"
  | "wire"
  | "other";

export type InvoiceWithItems = Invoice & { items: InvoiceItem[] };

export type InvoiceWithRelations = Invoice & {
  client?: Client | null;
  property?: Property | null;
  project?: Project | null;
  items: InvoiceItem[];
};

export type ReceiptStatus = "posted" | "refunded" | "voided";

// Define types for receipt data
export interface ReceiptDisplayData {
  id: string;
  receiptNumber: string;
  date: string;
  customerName: string;
  customerEmail?: string;
  customerAddress?: string;
  amount: number;
  paymentMethod: string;
  referenceNumber?: string;
  projectDescription?: string;
  notes?: string;
  status: string;
}
