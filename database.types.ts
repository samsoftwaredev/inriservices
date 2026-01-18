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
      get_project_metrics_by_year_json: {
        Args: { p_year: number }
        Returns: Json
      }
      recalc_invoice_paid: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
      recalc_invoice_totals: {
        Args: { p_invoice_id: string }
        Returns: undefined
      }
    }
    Enums: {
      client_status: "lead" | "active" | "inactive"
      client_type: "person" | "business"
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
      client_status: ["lead", "active", "inactive"],
      client_type: ["person", "business"],
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
    },
  },
} as const
