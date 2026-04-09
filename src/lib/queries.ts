import { createClient } from "@supabase/supabase-js";
import type { CaseWithAdvisor } from "@/lib/database.types";

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getActiveCases(): Promise<CaseWithAdvisor[]> {
  const supabase = getServiceClient();

  // Fetch active cases with poster (advisor) info
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

  // Gather poster IDs and case IDs
  const posterIds = [...new Set(cases.map((c: Record<string, unknown>) => c.poster_id as string))];
  const caseIds = cases.map((c: Record<string, unknown>) => c.id as string);

  // Fetch advisors and case_tags+tags in parallel
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

  // Build lookup maps
  const advisorMap = new Map<string, Record<string, unknown>>();
  for (const a of advisorsResult.data || []) {
    advisorMap.set(a.id, a);
  }

  const caseTagsMap = new Map<string, { id: string; name: string; category: string }[]>();
  for (const ct of (caseTagsResult.data || []) as Array<{
    case_id: string;
    tags: { id: string; name: string; category: string } | null;
  }>) {
    if (!ct.tags) continue;
    const existing = caseTagsMap.get(ct.case_id) || [];
    existing.push({
      id: ct.tags.id,
      name: ct.tags.name,
      category: ct.tags.category,
    });
    caseTagsMap.set(ct.case_id, existing);
  }

  // Assemble CaseWithAdvisor objects
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
