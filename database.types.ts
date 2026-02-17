export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      accounts: {
        Row: {
          code: string | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          parent_account_id: string | null
          type: Database["public"]["Enums"]["account_type"]
          updated_at: string
        }
        Insert: {
          code?: string | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          parent_account_id?: string | null
          type: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Update: {
          code?: string | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          parent_account_id?: string | null
          type?: Database["public"]["Enums"]["account_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "accounts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      assets: {
        Row: {
          category: string | null
          company_id: string
          created_at: string
          id: string
          name: string
          notes: string | null
          purchase_date: string
          purchase_price_cents: number
          status: Database["public"]["Enums"]["asset_status"]
          transaction_id: string | null
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          category?: string | null
          company_id: string
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          purchase_date: string
          purchase_price_cents: number
          status?: Database["public"]["Enums"]["asset_status"]
          transaction_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          category?: string | null
          company_id?: string
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          purchase_date?: string
          purchase_price_cents?: number
          status?: Database["public"]["Enums"]["asset_status"]
          transaction_id?: string | null
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assets_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assets_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_type: Database["public"]["Enums"]["client_type"]
          company_id: string
          created_at: string
          display_name: string
          id: string
          normalized_email: string | null
          normalized_phone: string | null
          notes: string | null
          primary_email: string | null
          primary_phone: string | null
          status: Database["public"]["Enums"]["client_status"]
        }
        Insert: {
          client_type: Database["public"]["Enums"]["client_type"]
          company_id: string
          created_at?: string
          display_name: string
          id?: string
          normalized_email?: string | null
          normalized_phone?: string | null
          notes?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
        }
        Update: {
          client_type?: Database["public"]["Enums"]["client_type"]
          company_id?: string
          created_at?: string
          display_name?: string
          id?: string
          normalized_email?: string | null
          normalized_phone?: string | null
          notes?: string | null
          primary_email?: string | null
          primary_phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
        }
        Relationships: [
          {
            foreignKeyName: "clients_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          billing_email: string | null
          created_at: string
          id: string
          name: string
          phone: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string
          id?: string
          name: string
          phone?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string
          id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      company_financial_profiles: {
        Row: {
          annual_overhead_cents: number
          avg_wage_cents: number
          billable_rate_per_hour_cents: number
          company_id: string
          created_at: string
          currency: string
          direct_labor_cost_per_hour_cents: number
          field_employee_count: number
          hours_per_week: number
          labor_burden_bps: number
          material_profit_margin_bps: number
          overhead_per_hour_cents: number
          sellable_man_hours: number
          target_profit_margin_bps: number
          true_cost_per_hour_cents: number
          updated_at: string
          weeks_per_year: number
        }
        Insert: {
          annual_overhead_cents?: number
          avg_wage_cents?: number
          billable_rate_per_hour_cents?: number
          company_id: string
          created_at?: string
          currency?: string
          direct_labor_cost_per_hour_cents?: number
          field_employee_count?: number
          hours_per_week?: number
          labor_burden_bps?: number
          material_profit_margin_bps?: number
          overhead_per_hour_cents?: number
          sellable_man_hours?: number
          target_profit_margin_bps?: number
          true_cost_per_hour_cents?: number
          updated_at?: string
          weeks_per_year?: number
        }
        Update: {
          annual_overhead_cents?: number
          avg_wage_cents?: number
          billable_rate_per_hour_cents?: number
          company_id?: string
          created_at?: string
          currency?: string
          direct_labor_cost_per_hour_cents?: number
          field_employee_count?: number
          hours_per_week?: number
          labor_burden_bps?: number
          material_profit_margin_bps?: number
          overhead_per_hour_cents?: number
          sellable_man_hours?: number
          target_profit_margin_bps?: number
          true_cost_per_hour_cents?: number
          updated_at?: string
          weeks_per_year?: number
        }
        Relationships: [
          {
            foreignKeyName: "company_financial_profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: true
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_production_rates: {
        Row: {
          company_id: string
          created_at: string
          id: string
          notes: string | null
          service: Database["public"]["Enums"]["service_type"]
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          notes?: string | null
          service: Database["public"]["Enums"]["service_type"]
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          service?: Database["public"]["Enums"]["service_type"]
          unit?: Database["public"]["Enums"]["unit_type"]
          units_per_hour?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_production_rates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_documents: {
        Row: {
          bucket: string
          company_id: string
          created_at: string
          description: string | null
          document_type: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          id: string
          mime_type: string | null
          project_id: string | null
          size_bytes: number | null
          transaction_id: string | null
          uploaded_at: string
          uploaded_by: string | null
          vendor_id: string | null
        }
        Insert: {
          bucket?: string
          company_id: string
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name: string
          file_path: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          transaction_id?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Update: {
          bucket?: string
          company_id?: string
          created_at?: string
          description?: string | null
          document_type?: Database["public"]["Enums"]["document_type"]
          file_name?: string
          file_path?: string
          id?: string
          mime_type?: string | null
          project_id?: string | null
          size_bytes?: number | null
          transaction_id?: string | null
          uploaded_at?: string
          uploaded_by?: string | null
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_documents_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_transaction_id_fkey"
            columns: ["transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_documents_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          account_id: string
          amount_cents: number
          client_id: string | null
          company_id: string
          created_at: string
          currency: string
          description: string
          external_id: string | null
          id: string
          invoice_id: string | null
          memo: string | null
          posted_at: string
          project_id: string | null
          receipt_id: string | null
          reference_number: string | null
          source: Database["public"]["Enums"]["transaction_source"]
          transaction_date: string
          updated_at: string
          vendor_id: string | null
        }
        Insert: {
          account_id: string
          amount_cents: number
          client_id?: string | null
          company_id: string
          created_at?: string
          currency?: string
          description: string
          external_id?: string | null
          id?: string
          invoice_id?: string | null
          memo?: string | null
          posted_at?: string
          project_id?: string | null
          receipt_id?: string | null
          reference_number?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          transaction_date: string
          updated_at?: string
          vendor_id?: string | null
        }
        Update: {
          account_id?: string
          amount_cents?: number
          client_id?: string | null
          company_id?: string
          created_at?: string
          currency?: string
          description?: string
          external_id?: string | null
          id?: string
          invoice_id?: string | null
          memo?: string | null
          posted_at?: string
          project_id?: string | null
          receipt_id?: string | null
          reference_number?: string | null
          source?: Database["public"]["Enums"]["transaction_source"]
          transaction_date?: string
          updated_at?: string
          vendor_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_receipt_id_fkey"
            columns: ["receipt_id"]
            isOneToOne: false
            referencedRelation: "receipts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_items: {
        Row: {
          company_id: string
          created_at: string
          description: string | null
          id: string
          invoice_id: string
          line_subtotal_cents: number
          line_tax_cents: number
          line_total_cents: number
          name: string
          quantity: number
          sort_order: number
          tax_rate_bps: number | null
          unit_price_cents: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_id: string
          line_subtotal_cents?: number
          line_tax_cents?: number
          line_total_cents?: number
          name: string
          quantity?: number
          sort_order?: number
          tax_rate_bps?: number | null
          unit_price_cents?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          invoice_id?: string
          line_subtotal_cents?: number
          line_tax_cents?: number
          line_total_cents?: number
          name?: string
          quantity?: number
          sort_order?: number
          tax_rate_bps?: number | null
          unit_price_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoice_items_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          balance_cents: number | null
          client_id: string
          company_id: string
          created_at: string
          currency: string
          due_date: string | null
          id: string
          invoice_number: string
          issued_date: string
          notes: string | null
          paid_cents: number
          project_id: string | null
          property_id: string | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents: number
          tax_cents: number
          tax_rate_bps: number
          terms: string | null
          total_cents: number
          updated_at: string
        }
        Insert: {
          balance_cents?: number | null
          client_id: string
          company_id: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number: string
          issued_date?: string
          notes?: string | null
          paid_cents?: number
          project_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents?: number
          tax_cents?: number
          tax_rate_bps?: number
          terms?: string | null
          total_cents?: number
          updated_at?: string
        }
        Update: {
          balance_cents?: number | null
          client_id?: string
          company_id?: string
          created_at?: string
          currency?: string
          due_date?: string | null
          id?: string
          invoice_number?: string
          issued_date?: string
          notes?: string | null
          paid_cents?: number
          project_id?: string | null
          property_id?: string | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_cents?: number
          tax_cents?: number
          tax_rate_bps?: number
          terms?: string | null
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      production_rate_templates: {
        Row: {
          created_at: string
          id: string
          label: string
          notes: string | null
          service: Database["public"]["Enums"]["service_type"]
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          notes?: string | null
          service: Database["public"]["Enums"]["service_type"]
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          notes?: string | null
          service?: Database["public"]["Enums"]["service_type"]
          unit?: Database["public"]["Enums"]["unit_type"]
          units_per_hour?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_id: string
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["member_role"]
        }
        Insert: {
          company_id: string
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["member_role"]
        }
        Update: {
          company_id?: string
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["member_role"]
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      project_estimate_lines: {
        Row: {
          company_id: string
          created_at: string
          estimate_id: string
          id: string
          labor_price_cents: number
          man_hours: number
          notes: string | null
          quantity: number
          room_id: string | null
          service: Database["public"]["Enums"]["service_type"]
          sort_order: number
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
        }
        Insert: {
          company_id: string
          created_at?: string
          estimate_id: string
          id?: string
          labor_price_cents?: number
          man_hours?: number
          notes?: string | null
          quantity?: number
          room_id?: string | null
          service: Database["public"]["Enums"]["service_type"]
          sort_order?: number
          unit: Database["public"]["Enums"]["unit_type"]
          units_per_hour: number
        }
        Update: {
          company_id?: string
          created_at?: string
          estimate_id?: string
          id?: string
          labor_price_cents?: number
          man_hours?: number
          notes?: string | null
          quantity?: number
          room_id?: string | null
          service?: Database["public"]["Enums"]["service_type"]
          sort_order?: number
          unit?: Database["public"]["Enums"]["unit_type"]
          units_per_hour?: number
        }
        Relationships: [
          {
            foreignKeyName: "project_estimate_lines_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_estimate_lines_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "project_estimates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_estimate_lines_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "property_rooms"
            referencedColumns: ["id"]
          },
        ]
      }
      project_estimates: {
        Row: {
          company_id: string
          created_at: string
          estimated_man_hours: number
          id: string
          labor_price_cents: number
          material_price_cents: number
          project_id: string
          snapshot_billable_rate_per_hour_cents: number
          snapshot_direct_labor_cost_per_hour_cents: number
          snapshot_labor_margin_bps: number
          snapshot_material_margin_bps: number
          snapshot_overhead_per_hour_cents: number
          snapshot_true_cost_per_hour_cents: number
          status: Database["public"]["Enums"]["estimate_status"]
          tax_cents: number
          total_cents: number
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          estimated_man_hours?: number
          id?: string
          labor_price_cents?: number
          material_price_cents?: number
          project_id: string
          snapshot_billable_rate_per_hour_cents: number
          snapshot_direct_labor_cost_per_hour_cents: number
          snapshot_labor_margin_bps: number
          snapshot_material_margin_bps: number
          snapshot_overhead_per_hour_cents: number
          snapshot_true_cost_per_hour_cents: number
          status?: Database["public"]["Enums"]["estimate_status"]
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          estimated_man_hours?: number
          id?: string
          labor_price_cents?: number
          material_price_cents?: number
          project_id?: string
          snapshot_billable_rate_per_hour_cents?: number
          snapshot_direct_labor_cost_per_hour_cents?: number
          snapshot_labor_margin_bps?: number
          snapshot_material_margin_bps?: number
          snapshot_overhead_per_hour_cents?: number
          snapshot_true_cost_per_hour_cents?: number
          status?: Database["public"]["Enums"]["estimate_status"]
          tax_cents?: number
          total_cents?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_estimates_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_estimates_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_images: {
        Row: {
          caption: string | null
          company_id: string
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["project_image_kind"]
          mime_type: string | null
          project_id: string
          size_bytes: number | null
          sort_order: number
          storage_bucket: string
          storage_path: string
        }
        Insert: {
          caption?: string | null
          company_id: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["project_image_kind"]
          mime_type?: string | null
          project_id: string
          size_bytes?: number | null
          sort_order?: number
          storage_bucket?: string
          storage_path: string
        }
        Update: {
          caption?: string | null
          company_id?: string
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["project_image_kind"]
          mime_type?: string | null
          project_id?: string
          size_bytes?: number | null
          sort_order?: number
          storage_bucket?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_images_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          client_id: string
          company_id: string
          created_at: string
          end_date: string | null
          id: string
          invoice_total_cents: number | null
          labor_cost_cents: number
          labor_hours_estimated: number | null
          markup_bps: number
          material_cost_cents: number
          name: string
          project_type: Database["public"]["Enums"]["project_type"]
          property_id: string
          scope_notes: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["project_status"]
          tax_amount_cents: number
          tax_rate_bps: number
          updated_at: string
        }
        Insert: {
          client_id: string
          company_id: string
          created_at?: string
          end_date?: string | null
          id?: string
          invoice_total_cents?: number | null
          labor_cost_cents?: number
          labor_hours_estimated?: number | null
          markup_bps?: number
          material_cost_cents?: number
          name: string
          project_type?: Database["public"]["Enums"]["project_type"]
          property_id: string
          scope_notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tax_amount_cents?: number
          tax_rate_bps?: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          company_id?: string
          created_at?: string
          end_date?: string | null
          id?: string
          invoice_total_cents?: number | null
          labor_cost_cents?: number
          labor_hours_estimated?: number | null
          markup_bps?: number
          material_cost_cents?: number
          name?: string
          project_type?: Database["public"]["Enums"]["project_type"]
          property_id?: string
          scope_notes?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          tax_amount_cents?: number
          tax_rate_bps?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "projects_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      properties: {
        Row: {
          address_line1: string
          address_line2: string | null
          city: string
          client_id: string
          company_id: string
          country: string
          created_at: string
          id: string
          name: string
          property_type: Database["public"]["Enums"]["property_type"]
          state: string
          zip: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          city: string
          client_id: string
          company_id: string
          country?: string
          created_at?: string
          id?: string
          name: string
          property_type?: Database["public"]["Enums"]["property_type"]
          state: string
          zip: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          city?: string
          client_id?: string
          company_id?: string
          country?: string
          created_at?: string
          id?: string
          name?: string
          property_type?: Database["public"]["Enums"]["property_type"]
          state?: string
          zip?: string
        }
        Relationships: [
          {
            foreignKeyName: "properties_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "properties_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      property_rooms: {
        Row: {
          ceiling_area_sqft: number | null
          ceiling_height_ft: number | null
          company_id: string
          created_at: string
          description: string | null
          floor_area_sqft: number | null
          id: string
          level: number
          name: string
          notes_customer: string | null
          notes_internal: string | null
          openings_area_sqft: number | null
          paint_ceiling: boolean
          paint_doors: boolean
          paint_trim: boolean
          paint_walls: boolean
          project_id: string | null
          property_id: string
          room_height_ft: number | null
          sort_order: number
          updated_at: string
          wall_area_sqft: number | null
          wall_perimeter_ft: number | null
        }
        Insert: {
          ceiling_area_sqft?: number | null
          ceiling_height_ft?: number | null
          company_id: string
          created_at?: string
          description?: string | null
          floor_area_sqft?: number | null
          id?: string
          level?: number
          name: string
          notes_customer?: string | null
          notes_internal?: string | null
          openings_area_sqft?: number | null
          paint_ceiling?: boolean
          paint_doors?: boolean
          paint_trim?: boolean
          paint_walls?: boolean
          project_id?: string | null
          property_id: string
          room_height_ft?: number | null
          sort_order?: number
          updated_at?: string
          wall_area_sqft?: number | null
          wall_perimeter_ft?: number | null
        }
        Update: {
          ceiling_area_sqft?: number | null
          ceiling_height_ft?: number | null
          company_id?: string
          created_at?: string
          description?: string | null
          floor_area_sqft?: number | null
          id?: string
          level?: number
          name?: string
          notes_customer?: string | null
          notes_internal?: string | null
          openings_area_sqft?: number | null
          paint_ceiling?: boolean
          paint_doors?: boolean
          paint_trim?: boolean
          paint_walls?: boolean
          project_id?: string | null
          property_id?: string
          room_height_ft?: number | null
          sort_order?: number
          updated_at?: string
          wall_area_sqft?: number | null
          wall_perimeter_ft?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "property_rooms_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_rooms_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "property_rooms_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      receipts: {
        Row: {
          amount_cents: number
          client_id: string
          company_id: string
          created_at: string
          created_by: string | null
          currency: string
          id: string
          invoice_id: string | null
          notes: string | null
          paid_at: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          project_id: string | null
          reference_number: string | null
          status: Database["public"]["Enums"]["receipt_status"]
        }
        Insert: {
          amount_cents: number
          client_id: string
          company_id: string
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_at?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          project_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["receipt_status"]
        }
        Update: {
          amount_cents?: number
          client_id?: string
          company_id?: string
          created_at?: string
          created_by?: string | null
          currency?: string
          id?: string
          invoice_id?: string | null
          notes?: string | null
          paid_at?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          project_id?: string | null
          reference_number?: string | null
          status?: Database["public"]["Enums"]["receipt_status"]
        }
        Relationships: [
          {
            foreignKeyName: "receipts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "receipts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors: {
        Row: {
          company_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          tax_id_last4: string | null
          type: Database["public"]["Enums"]["vendor_type"]
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          tax_id_last4?: string | null
          type?: Database["public"]["Enums"]["vendor_type"]
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          tax_id_last4?: string | null
          type?: Database["public"]["Enums"]["vendor_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      my_profile: {
        Row: {
          company_id: string | null
          created_at: string | null
          full_name: string | null
          id: string | null
          phone: string | null
          role: Database["public"]["Enums"]["member_role"] | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["member_role"] | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["member_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      current_company_id: { Args: never; Returns: string }
      get_production_rate: {
        Args: {
          p_company_id: string
          p_service: Database["public"]["Enums"]["service_type"]
          p_unit: Database["public"]["Enums"]["unit_type"]
        }
        Returns: number
      }
      get_project_metrics_by_year_json: {
        Args: { p_year: number }
        Returns: Json
      }
      recalc_company_gpp_rates: {
        Args: { p_company_id: string }
        Returns: {
          annual_overhead_cents: number
          avg_wage_cents: number
          billable_rate_per_hour_cents: number
          company_id: string
          created_at: string
          currency: string
          direct_labor_cost_per_hour_cents: number
          field_employee_count: number
          hours_per_week: number
          labor_burden_bps: number
          material_profit_margin_bps: number
          overhead_per_hour_cents: number
          sellable_man_hours: number
          target_profit_margin_bps: number
          true_cost_per_hour_cents: number
          updated_at: string
          weeks_per_year: number
        }
        SetofOptions: {
          from: "*"
          to: "company_financial_profiles"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      recalc_invoice_paid: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      recalc_invoice_totals: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      recalc_project_estimate: { Args: { p_project_id: string }; Returns: Json }
    }
    Enums: {
      account_type:
        | "revenue"
        | "cogs"
        | "expense"
        | "asset"
        | "liability"
        | "equity"
      asset_status: "active" | "sold" | "disposed"
      client_status: "lead" | "active" | "inactive"
      client_type: "person" | "business"
      document_type:
        | "expense_receipt"
        | "supplier_invoice"
        | "client_payment_proof"
        | "bank_statement"
        | "tax_document"
        | "asset_purchase"
        | "warranty"
        | "other"
      estimate_status: "draft" | "final"
      invoice_status:
        | "draft"
        | "sent"
        | "partially_paid"
        | "paid"
        | "overdue"
        | "void"
      member_role: "owner" | "admin" | "staff" | "viewer"
      payment_method:
        | "cash"
        | "check"
        | "zelle"
        | "cash_app"
        | "venmo"
        | "credit_card"
        | "debit_card"
        | "ach"
        | "wire"
        | "other"
      project_image_kind: "before" | "after" | "progress" | "other"
      project_status:
        | "draft"
        | "scheduled"
        | "in_progress"
        | "on_hold"
        | "completed"
        | "canceled"
      project_type:
        | "interior_paint"
        | "exterior_paint"
        | "drywall_repair"
        | "trim_paint"
        | "cabinet_paint"
        | "wallpaper"
        | "other"
      property_type: "residential" | "commercial"
      receipt_status: "posted" | "refunded" | "voided"
      service_type:
        | "interior_paint"
        | "exterior_paint"
        | "drywall_patch"
        | "drywall_finish"
        | "trim_paint"
        | "door_paint"
        | "cabinet_paint"
      transaction_source:
        | "manual"
        | "receipt_posted"
        | "receipt_refunded"
        | "receipt_voided"
        | "invoice_created"
        | "invoice_updated"
        | "import"
      unit_type:
        | "sqft_wall"
        | "sqft_ceiling"
        | "sqft_floor"
        | "linear_ft_trim"
        | "each_door"
        | "each_patch"
      vendor_type: "supplier" | "subcontractor" | "service" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: [
        "revenue",
        "cogs",
        "expense",
        "asset",
        "liability",
        "equity",
      ],
      asset_status: ["active", "sold", "disposed"],
      client_status: ["lead", "active", "inactive"],
      client_type: ["person", "business"],
      document_type: [
        "expense_receipt",
        "supplier_invoice",
        "client_payment_proof",
        "bank_statement",
        "tax_document",
        "asset_purchase",
        "warranty",
        "other",
      ],
      estimate_status: ["draft", "final"],
      invoice_status: [
        "draft",
        "sent",
        "partially_paid",
        "paid",
        "overdue",
        "void",
      ],
      member_role: ["owner", "admin", "staff", "viewer"],
      payment_method: [
        "cash",
        "check",
        "zelle",
        "cash_app",
        "venmo",
        "credit_card",
        "debit_card",
        "ach",
        "wire",
        "other",
      ],
      project_image_kind: ["before", "after", "progress", "other"],
      project_status: [
        "draft",
        "scheduled",
        "in_progress",
        "on_hold",
        "completed",
        "canceled",
      ],
      project_type: [
        "interior_paint",
        "exterior_paint",
        "drywall_repair",
        "trim_paint",
        "cabinet_paint",
        "wallpaper",
        "other",
      ],
      property_type: ["residential", "commercial"],
      receipt_status: ["posted", "refunded", "voided"],
      service_type: [
        "interior_paint",
        "exterior_paint",
        "drywall_patch",
        "drywall_finish",
        "trim_paint",
        "door_paint",
        "cabinet_paint",
      ],
      transaction_source: [
        "manual",
        "receipt_posted",
        "receipt_refunded",
        "receipt_voided",
        "invoice_created",
        "invoice_updated",
        "import",
      ],
      unit_type: [
        "sqft_wall",
        "sqft_ceiling",
        "sqft_floor",
        "linear_ft_trim",
        "each_door",
        "each_patch",
      ],
      vendor_type: ["supplier", "subcontractor", "service", "other"],
    },
  },
} as const
