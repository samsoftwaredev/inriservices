import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { ListResult, ReceiptStatus, Receipt } from "@/types";

export const receiptApi = {
  async listReceipts(params?: {
    client_id?: string;
    project_id?: string;
    invoice_id?: string;
    status?: ReceiptStatus;
    paid_year?: number; // paid_at year
    limit?: number;
    offset?: number;
  }): Promise<ListResult<Receipt>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("receipts").select("*", { count: "exact" });

    if (params?.client_id) query = query.eq("client_id", params.client_id);
    if (params?.project_id) query = query.eq("project_id", params.project_id);
    if (params?.invoice_id) query = query.eq("invoice_id", params.invoice_id);
    if (params?.status) query = query.eq("status", params.status);

    if (params?.paid_year) {
      const y = params.paid_year;
      query = query
        .gte("paid_at", `${y}-01-01T00:00:00.000Z`)
        .lte("paid_at", `${y}-12-31T23:59:59.999Z`);
    }

    const { data, error, count } = await query
      .order("paid_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return { items: (data ?? []) as Receipt[], total: count ?? undefined };
  },

  async getReceipt(id: string): Promise<Receipt> {
    const res = await supabase
      .from("receipts")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Receipt not found: ${id}`) as Receipt;
  },

  async createReceipt(
    input: Omit<Receipt, "id" | "created_at" | "created_by">
  ): Promise<Receipt> {
    // triggers enforce company consistency; invoice paid rollups happen automatically
    const res = await supabase
      .from("receipts")
      .insert(input)
      .select("*")
      .single();
    return assertOk(res, "Failed to create receipt") as Receipt;
  },

  async updateReceipt(
    id: string,
    patch: Partial<
      Omit<
        Receipt,
        | "id"
        | "company_id"
        | "client_id"
        | "project_id"
        | "invoice_id"
        | "created_at"
        | "created_by"
      >
    >
  ): Promise<Receipt> {
    // Keep updates limited. For accounting safety, you typically only update status/notes/reference.
    const res = await supabase
      .from("receipts")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(res, "Failed to update receipt") as Receipt;
  },

  async voidReceipt(id: string, note?: string): Promise<Receipt> {
    return this.updateReceipt(id, { status: "voided", notes: note ?? null });
  },

  async refundReceipt(id: string, note?: string): Promise<Receipt> {
    // This marks it refunded; your invoice rollup function treats refunded as negative amount.
    return this.updateReceipt(id, { status: "refunded", notes: note ?? null });
  },

  // Optional: hard delete (NOT recommended; only if you decide to allow it)
  async deleteReceipt(id: string): Promise<void> {
    const { error } = await supabase.from("receipts").delete().eq("id", id);
    if (error) throw error;
  },
};
