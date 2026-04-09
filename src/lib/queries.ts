import type { CaseWithAdvisor } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";

export async function getActiveCases(): Promise<CaseWithAdvisor[]> {
  const supabase = getSupabase();
  if (!supabase) {
    console.warn("Supabase env vars missing — falling back to mock data");
    return [];
  }

  const { data: cases, error: casesError } = await supabase
    .from("cases")
    .select("*")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (casesError) {
    console.error("Error fetching cases:", casesError);
    return [];
  }

  if (!cases || cases.length === 0) return [];

  const posterIds = [...new Set(cases.map((c: Record<string, unknown>) => c.poster_id as string))];
  const caseIds = cases.map((c: Record<string, unknown>) => c.id as string);

  const [advisorsResult, caseTagsResult] = await Promise.all([
    supabase
      .from("advisors")
      .select("id, full_name, years_experience, region, role")
      .in("id", posterIds),
    supabase
      .from("case_tags")
      .select("case_id, tag_id, tags(id, name, category)")
      .in("case_id", caseIds),
  ]);

  if (advisorsResult.error) {
    console.error("Error fetching advisors:", advisorsResult.error);
    return [];
  }

  const advisorMap = new Map<string, Record<string, unknown>>();
  for (const a of advisorsResult.data || []) {
    advisorMap.set(a.id, a);
  }

  interface TagRow { id: string; name: string; category: string }

  const caseTagsMap = new Map<string, TagRow[]>();
  for (const ct of caseTagsResult.data || []) {
    const raw = ct as Record<string, unknown>;
    const caseId = raw.case_id as string;
    const tags = raw.tags as TagRow | TagRow[] | null;
    if (!tags) continue;
    const tagList = Array.isArray(tags) ? tags : [tags];
    const existing = caseTagsMap.get(caseId) || [];
    for (const t of tagList) {
      existing.push({ id: t.id, name: t.name, category: t.category });
    }
    caseTagsMap.set(caseId, existing);
  }

  return cases.map((c: Record<string, unknown>) => {
    const advisor = advisorMap.get(c.poster_id as string);
    return {
      id: c.id,
      poster_id: c.poster_id,
      title: c.title,
      client_type: c.client_type,
      industry: c.industry,
      aum_range: c.aum_range,
      meeting_type: c.meeting_type,
      complexity: c.complexity,
      region: c.region,
      meeting_date: c.meeting_date,
      needs: c.needs,
      additional_context: c.additional_context,
      status: c.status,
      created_at: c.created_at,
      updated_at: c.updated_at,
      advisor: advisor
        ? {
            id: advisor.id as string,
            full_name: advisor.full_name as string,
            years_experience: advisor.years_experience as number,
            region: advisor.region as string,
            role: advisor.role as string,
          }
        : {
            id: c.poster_id as string,
            full_name: "Unknown Advisor",
            years_experience: 0,
            region: "Unknown",
            role: "junior",
          },
      tags: caseTagsMap.get(c.id as string) || [],
    } as CaseWithAdvisor;
  });
}
