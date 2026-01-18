import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import {
  Invoice,
  InvoiceItem,
  InvoiceStatus,
  InvoiceWithItems,
  InvoiceWithRelations,
  ListResult,
} from "@/types";

export const invoiceApi = {
  async listInvoices(params?: {
    status?: InvoiceStatus;
    client_id?: string;
    project_id?: string;
    q?: string; // invoice_number
    issued_year?: number; // filter by issued_date year
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Invoice>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("invoices").select("*", { count: "exact" });

    if (params?.status) query = query.eq("status", params.status);
    if (params?.client_id) query = query.eq("client_id", params.client_id);
    if (params?.project_id) query = query.eq("project_id", params.project_id);

    if (params?.issued_year) {
      const y = params.issued_year;
      query = query
        .gte("issued_date", `${y}-01-01`)
        .lte("issued_date", `${y}-12-31`);
    }

    if (params?.q && params.q.trim()) {
      query = query.ilike("invoice_number", `%${params.q.trim()}%`);
    }

    const { data, error, count } = await query
      .order("issued_date", { ascending: false })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { items: (data ?? []) as Invoice[], total: count ?? undefined };
  },

  async getInvoice(id: string): Promise<Invoice> {
    const res = await supabase
      .from("invoices")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Invoice not found: ${id}`) as Invoice;
  },

  async getInvoiceWithItems(id: string): Promise<InvoiceWithItems> {
    const res = await supabase
      .from("invoices")
      .select(
        `
        *,
        items:invoice_items(*)
      `
      )
      .eq("id", id)
      .single();

    return assertOk(
      res,
      `Invoice not found: ${id}`
    ) as unknown as InvoiceWithItems;
  },

  async getInvoiceFull(id: string): Promise<InvoiceWithRelations> {
    const res = await supabase
      .from("invoices")
      .select(
        `
        *,
        client:clients(*),
        property:properties(*),
        project:projects(*),
        items:invoice_items(*)
      `
      )
      .eq("id", id)
      .single();

    return assertOk(
      res,
      `Invoice not found: ${id}`
    ) as unknown as InvoiceWithRelations;
  },

  async createInvoice(
    input: Omit<
      Invoice,
      "id" | "created_at" | "updated_at" | "paid_cents" | "balance_cents"
    >
  ): Promise<Invoice> {
    // totals will be enforced by triggers; paid/balance will be rolled up from receipts
    const res = await supabase
      .from("invoices")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create invoice") as Invoice;
  },

  async updateInvoice(
    id: string,
    patch: Partial<
      Omit<
        Invoice,
        | "id"
        | "company_id"
        | "created_at"
        | "updated_at"
        | "balance_cents"
        | "paid_cents"
      >
    >
  ): Promise<Invoice> {
    const res = await supabase
      .from("invoices")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update invoice") as Invoice;
  },

  async voidInvoice(id: string, reason?: string): Promise<Invoice> {
    // Recommended instead of delete
    return this.updateInvoice(id, { status: "void", notes: reason ?? null });
  },

  // Optional: allow delete only for drafts; otherwise use void
  async deleteInvoice(id: string): Promise<void> {
    const { error } = await supabase.from("invoices").delete().eq("id", id);
    if (error) throw error;
  },
};

/** ---------- invoiceItemApi ---------- */

export const invoiceItemApi = {
  async listInvoiceItems(invoiceId: string): Promise<InvoiceItem[]> {
    const { data, error } = await supabase
      .from("invoice_items")
      .select("*")
      .eq("invoice_id", invoiceId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error) throw error;
    return (data ?? []) as InvoiceItem[];
  },

  async createInvoiceItem(
    input: Omit<
      InvoiceItem,
      | "id"
      | "created_at"
      | "updated_at"
      | "line_subtotal_cents"
      | "line_tax_cents"
      | "line_total_cents"
    >
  ) {
    // line totals are computed by trigger; invoice totals roll up automatically
    const res = await supabase
      .from("invoice_items")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create invoice item") as InvoiceItem;
  },

  async updateInvoiceItem(
    id: string,
    patch: Partial<
      Omit<
        InvoiceItem,
        | "id"
        | "company_id"
        | "invoice_id"
        | "created_at"
        | "updated_at"
        | "line_subtotal_cents"
        | "line_tax_cents"
        | "line_total_cents"
      >
    >
  ): Promise<InvoiceItem> {
    const res = await supabase
      .from("invoice_items")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update invoice item") as InvoiceItem;
  },

  async deleteInvoiceItem(id: string): Promise<void> {
    const { error } = await supabase
      .from("invoice_items")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  async reorderInvoiceItems(
    invoiceId: string,
    orderedItemIds: string[]
  ): Promise<void> {
    // simple reorder: update each item's sort_order
    // NOTE: sequential to avoid race conditions
    for (let i = 0; i < orderedItemIds.length; i++) {
      const { error } = await supabase
        .from("invoice_items")
        .update({ sort_order: i })
        .eq("id", orderedItemIds[i])
        .eq("invoice_id", invoiceId);
      if (error) throw error;
    }
  },
};
