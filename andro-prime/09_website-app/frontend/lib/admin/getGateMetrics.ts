import { createSupabaseAdminClient } from '@/lib/supabase/admin'

// Mirrors the columns of `public.v_gate_tracker` defined in
// `database/views/pipeline_overview.sql`. `total_deposits_paid` is the
// historical-only deposit column kept on the view for legacy dashboards;
// not surfaced here — see view header note.
export interface GateMetrics {
  totalKitsSold: number
  fmListOptins: number
  kit23ToSubConversionPct: number | null
  supplementMrrGbp: number
  activeSubCount: number
  fetchedAt: string
  error?: string
}

interface GateTrackerRow {
  total_kits_sold: number | string | null
  fm_list_optins: number | string | null
  kit23_to_sub_conversion_pct: number | string | null
  supplement_mrr_gbp: number | string | null
  active_sub_count: number | string | null
}

export async function getGateMetrics(): Promise<GateMetrics> {
  const fetchedAt = new Date().toISOString()
  try {
    const supabase = createSupabaseAdminClient()
    const { data, error } = await supabase
      .from('v_gate_tracker')
      .select(
        'total_kits_sold, fm_list_optins, kit23_to_sub_conversion_pct, supplement_mrr_gbp, active_sub_count',
      )
      .single<GateTrackerRow>()

    if (error) throw new Error(error.message)
    if (!data) throw new Error('v_gate_tracker returned no row')

    return {
      totalKitsSold: Number(data.total_kits_sold ?? 0),
      fmListOptins: Number(data.fm_list_optins ?? 0),
      kit23ToSubConversionPct:
        data.kit23_to_sub_conversion_pct === null
          ? null
          : Number(data.kit23_to_sub_conversion_pct),
      supplementMrrGbp: Number(data.supplement_mrr_gbp ?? 0),
      activeSubCount: Number(data.active_sub_count ?? 0),
      fetchedAt,
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'gate metrics fetch error'
    return {
      totalKitsSold: 0,
      fmListOptins: 0,
      kit23ToSubConversionPct: null,
      supplementMrrGbp: 0,
      activeSubCount: 0,
      fetchedAt,
      error: message,
    }
  }
}
