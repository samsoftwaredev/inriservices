import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools/general";
import {
  FinancialDocument,
  FinancialTransaction,
  ListResult,
  TransactionSource,
} from "@/types";

/** ----------------------------
 * FINANCIAL TRANSACTIONS (General Ledger)
 * ---------------------------- */
export const financialTransactionsApi = {
  async list(params?: {
    account_id?: string;
    vendor_id?: string;
    project_id?: string;
    client_id?: string;
    invoice_id?: string;
    receipt_id?: string;
    source?: TransactionSource;
    year?: number; // filter by transaction_date year
    q?: string; // description/memo/reference
    limit?: number;
    offset?: number;
  }): Promise<
    ListResult<{ tx: FinancialTransaction; docs: FinancialDocument[] }>
  > {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase.from("financial_transactions").select(
      `
        *,
        documents:financial_documents(*)
        `,
      { count: "exact" },
    );

    if (params?.account_id) query = query.eq("account_id", params.account_id);
    if (params?.vendor_id) query = query.eq("vendor_id", params.vendor_id);
    if (params?.project_id) query = query.eq("project_id", params.project_id);
    if (params?.client_id) query = query.eq("client_id", params.client_id);
    if (params?.invoice_id) query = query.eq("invoice_id", params.invoice_id);
    if (params?.receipt_id) query = query.eq("receipt_id", params.receipt_id);
    if (params?.source) query = query.eq("source", params.source);

    if (params?.year) {
      const y = params.year;
      query = query
        .gte("transaction_date", `${y}-01-01`)
        .lte("transaction_date", `${y}-12-31`);
    }

    if (params?.q?.trim()) {
      const q = params.q.trim();
      query = query.or(
        [
          `description.ilike.%${q}%`,
          `memo.ilike.%${q}%`,
          `reference_number.ilike.%${q}%`,
        ].join(","),
      );
    }

    const { data, error, count } = await query
      .order("transaction_date", { ascending: false })
      .order("posted_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: (data ?? []).map((row) => {
        const { documents, ...tx } = row;
        return {
          id: tx.id,
          tx: tx as FinancialTransaction,
          docs: (documents ?? []) as FinancialDocument[],
        };
      }),
      total: count ?? undefined,
    };
  },

  async get(id: string): Promise<FinancialTransaction> {
    const res = await supabase
      .from("financial_transactions")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(
      res,
      `Transaction not found: ${id}`,
    ) as FinancialTransaction;
  },

  async create(
    input: Omit<
      FinancialTransaction,
      "id" | "posted_at" | "created_at" | "updated_at"
    >,
  ): Promise<FinancialTransaction> {
    const res = await supabase
      .from("financial_transactions")
      .insert(input)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to create transaction",
    ) as FinancialTransaction;
  },

  async update(
    id: string,
    patch: Partial<
      Omit<
        FinancialTransaction,
        "id" | "company_id" | "created_at" | "updated_at"
      >
    >,
  ): Promise<FinancialTransaction> {
    const res = await supabase
      .from("financial_transactions")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to update transaction",
    ) as FinancialTransaction;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from("financial_transactions")
      .delete()
      .eq("id", id);
    if (error) throw error;
  },

  // One call: transaction + attached docs
  async getWithDocuments(
    id: string,
  ): Promise<{ tx: FinancialTransaction; docs: FinancialDocument[] }> {
    const res = await supabase
      .from("financial_transactions")
      .select(
        `
        *,
        documents:financial_documents(*)
      `,
      )
      .eq("id", id)
      .single();

    const row = assertOk(res, `Transaction not found: ${id}`) as any;
    const { documents, ...tx } = row;

    return {
      tx: tx as FinancialTransaction,
      docs: (documents ?? []) as FinancialDocument[],
    };
  },
};
