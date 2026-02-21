import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools";
import { FinancialDocument, ListResult, DocumentType } from "@/types";

/** ----------------------------
 * FINANCIAL DOCUMENTS (Receipt photos, PDFs)
 * ---------------------------- */
const bucket = "financial-documents";
export const financialDocumentsApi = {
  async list(params?: {
    transaction_id?: string;
    project_id?: string;
    vendor_id?: string;
    document_type?: DocumentType;
    year?: number; // uploaded_at year
    limit?: number;
    offset?: number;
  }): Promise<ListResult<FinancialDocument>> {
    const limit = params?.limit ?? 50;
    const offset = params?.offset ?? 0;

    let query = supabase
      .from("financial_documents")
      .select("*", { count: "exact" });

    if (params?.transaction_id)
      query = query.eq("transaction_id", params.transaction_id);
    if (params?.project_id) query = query.eq("project_id", params.project_id);
    if (params?.vendor_id) query = query.eq("vendor_id", params.vendor_id);
    if (params?.document_type)
      query = query.eq("document_type", params.document_type);

    if (params?.year) {
      const y = params.year;
      query = query
        .gte("uploaded_at", `${y}-01-01T00:00:00.000Z`)
        .lte("uploaded_at", `${y}-12-31T23:59:59.999Z`);
    }

    const { data, error, count } = await query
      .order("uploaded_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return {
      items: (data ?? []) as FinancialDocument[],
      total: count ?? undefined,
    };
  },

  async get(id: string): Promise<FinancialDocument> {
    const res = await supabase
      .from("financial_documents")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Document not found: ${id}`) as FinancialDocument;
  },

  async create(
    input: Omit<FinancialDocument, "id" | "uploaded_at" | "created_at">,
  ): Promise<FinancialDocument> {
    const res = await supabase
      .from("financial_documents")
      .insert(input)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to create document record",
    ) as FinancialDocument;
  },

  async update(
    id: string,
    patch: Partial<Omit<FinancialDocument, "id" | "company_id" | "created_at">>,
  ): Promise<FinancialDocument> {
    const res = await supabase
      .from("financial_documents")
      .update(patch)
      .eq("id", id)
      .select("*")
      .single();
    return assertOk(
      res,
      "Failed to update document record",
    ) as FinancialDocument;
  },

  /**
   * Correct upload flow (recommended):
   * 1) Upload file to Storage (private bucket)
   * 2) Insert row into financial_documents with bucket+file_path+metadata+links
   */
  async uploadAndCreate(params: {
    file: File | Blob;
    file_name: string; // display name
    file_path: string; // storage path (you build this)
    document_type: DocumentType;
    transaction_id?: string | null;
    project_id?: string | null;
    vendor_id?: string | null;
    description?: string | null;
    company_id: string; // optional, can be inferred from session in create()
  }): Promise<FinancialDocument> {
    // Upload to Storage
    const { error: uploadErr } = await supabase.storage
      .from(bucket)
      .upload(params.file_path, params.file, {
        upsert: false,
        contentType: (params.file as any).type ?? undefined,
      });
    if (uploadErr) throw uploadErr;

    // Create DB record
    const mime = (params.file as any).type ?? null;
    const size = (params.file as any).size ?? null;

    return await this.create({
      company_id: params.company_id,
      bucket: bucket,
      file_path: params.file_path,
      file_name: params.file_name,
      mime_type: mime,
      size_bytes: size,
      document_type: params.document_type,
      transaction_id: params.transaction_id ?? null,
      project_id: params.project_id ?? null,
      vendor_id: params.vendor_id ?? null,
      description: params.description ?? null,
      uploaded_by: null, // optional: set to profile id if you store it
    });
  },

  /**
   * Delete flow:
   * 1) Delete storage object
   * 2) Delete DB record
   */
  async delete(id: string): Promise<void> {
    const doc = await this.get(id);

    const { error: storageErr } = await supabase.storage
      .from(doc.bucket)
      .remove([doc.file_path]);
    if (storageErr) throw storageErr;

    const { error: dbErr } = await supabase
      .from("financial_documents")
      .delete()
      .eq("id", id);
    if (dbErr) throw dbErr;
  },

  /**
   * Use signed URL for private access (recommended for private buckets)
   */
  async getSignedUrl(id: string, expiresInSeconds = 60): Promise<string> {
    const doc = await this.get(id);
    const { data, error } = await supabase.storage
      .from(doc.bucket)
      .createSignedUrl(doc.file_path, expiresInSeconds);
    if (error) throw error;
    return data.signedUrl;
  },
};
