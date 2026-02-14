import { supabase } from "@/app/supabaseConfig";
import { assertOk } from "@/tools/general";
import {
  ListResult,
  ProductionRateTemplate,
  ServiceType,
  UnitType,
} from "@/types";

export const productionRateTemplateApi = {
  async list(params?: {
    service?: ServiceType;
    unit?: UnitType;
    limit?: number;
    offset?: number;
  }): Promise<ListResult<ProductionRateTemplate>> {
    const limit = params?.limit ?? 200;
    const offset = params?.offset ?? 0;

    let query = supabase
      .from("production_rate_templates")
      .select("*", { count: "exact" });

    if (params?.service) query = query.eq("service", params.service);
    if (params?.unit) query = query.eq("unit", params.unit);

    const { data, error, count } = await query
      .order("service", { ascending: true })
      .order("unit", { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return {
      items: (data ?? []) as ProductionRateTemplate[],
      total: count ?? undefined,
    };
  },

  async get(id: string): Promise<ProductionRateTemplate> {
    const res = await supabase
      .from("production_rate_templates")
      .select("*")
      .eq("id", id)
      .single();
    return assertOk(res, `Template not found: ${id}`) as ProductionRateTemplate;
  },
};
