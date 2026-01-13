import { supabase } from "@/app/supabaseConfig";
import { DashboardMetricsJson } from "@/types";

export async function getDashboardMetrics(year: number): Promise<DashboardMetricsJson> {
  const { data, error } = await supabase.rpc("get_project_metrics_by_year_json", {
    p_year: year,
  });
  if (error) throw error;
  return data as DashboardMetricsJson; // JSON comes back as an object
}
