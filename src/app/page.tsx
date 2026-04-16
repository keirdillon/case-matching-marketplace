import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DiscoverDeck } from "@/components/DiscoverDeck";
import { getSupabase } from "@/lib/supabase";
import { MOCK_SENIOR } from "@/lib/mock-user";
import type { CaseWithAdvisor } from "@/lib/database.types";

export const dynamic = "force-dynamic";

async function getMatchingCases(): Promise<CaseWithAdvisor[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: advisorTags } = await supabase
    .from("advisor_tags")
    .select("tag_id")
    .eq("advisor_id", MOCK_SENIOR.id);

  const myTagIds = (advisorTags || []).map((t) => t.tag_id);

  // Check swipe_history instead of just matches
  const { data: swipeRecords } = await supabase
    .from("swipe_history")
    .select("case_id")
    .eq("advisor_id", MOCK_SENIOR.id);

  const swipedCaseIds = new Set((swipeRecords || []).map((s) => s.case_id));

  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .eq("status", "active")
    .neq("poster_id", MOCK_SENIOR.id)
    .order("meeting_date", { ascending: true });

  if (error || !cases || cases.length === 0) return [];

  const caseIds = cases.map((c: Record<string, unknown>) => c.id as string);
  const posterIds = [...new Set(cases.map((c: Record<string, unknown>) => c.poster_id as string))];

  const [advisorsResult, caseTagsResult, matchesResult] = await Promise.all([
    supabase.from("advisors").select("id, full_name, years_experience, region, role").in("id", posterIds),
    supabase.from("case_tags").select("case_id, tag_id, tags(id, name, category)").in("case_id", caseIds),
    supabase.from("matches").select("case_id, status").in("case_id", caseIds),
  ]);

  const advisorMap = new Map<string, Record<string, unknown>>();
  for (const a of advisorsResult.data || []) advisorMap.set(a.id, a);

  interface TagRow { id: string; name: string; category: string }
  const caseTagsMap = new Map<string, TagRow[]>();
  for (const ct of caseTagsResult.data || []) {
    const raw = ct as Record<string, unknown>;
    const caseId = raw.case_id as string;
    const tags = raw.tags as TagRow | TagRow[] | null;
    if (!tags) continue;
    const tagList = Array.isArray(tags) ? tags : [tags];
    const existing = caseTagsMap.get(caseId) || [];
    for (const t of tagList) existing.push(t);
    caseTagsMap.set(caseId, existing);
  }

  const matchCountMap = new Map<string, { interested: number; matched: number }>();
  for (const m of matchesResult.data || []) {
    const caseId = (m as Record<string, unknown>).case_id as string;
    const status = (m as Record<string, unknown>).status as string;
    const counts = matchCountMap.get(caseId) || { interested: 0, matched: 0 };
    if (status === "interested") counts.interested++;
    if (status === "accepted") counts.matched++;
    matchCountMap.set(caseId, counts);
  }

  const allCases: CaseWithAdvisor[] = cases.map((c: Record<string, unknown>) => {
    const advisor = advisorMap.get(c.poster_id as string);
    return {
      id: c.id, poster_id: c.poster_id, title: c.title, client_type: c.client_type,
      industry: c.industry, aum_range: c.aum_range, meeting_type: c.meeting_type,
      complexity: c.complexity, region: c.region, meeting_date: c.meeting_date,
      needs: c.needs, additional_context: c.additional_context, status: c.status,
      state: c.state, meeting_time: c.meeting_time, meeting_location: c.meeting_location,
      meeting_format: c.meeting_format, compensation_split: c.compensation_split || "50/50",
      client_summary: c.client_summary,
      created_at: c.created_at, updated_at: c.updated_at,
      advisor: advisor
        ? { id: advisor.id as string, full_name: advisor.full_name as string, years_experience: advisor.years_experience as number, region: advisor.region as string, role: advisor.role as string }
        : { id: c.poster_id as string, full_name: "Unknown", years_experience: 0, region: "Unknown", role: "junior" },
      tags: caseTagsMap.get(c.id as string) || [],
      interested_count: matchCountMap.get(c.id as string)?.interested || 0,
      matched_count: matchCountMap.get(c.id as string)?.matched || 0,
    } as CaseWithAdvisor;
  });

  // Filter: licensed states, tag overlap, not already swiped
  return allCases.filter((c) => {
    if (swipedCaseIds.has(c.id)) return false;
    // State licensing filter
    if (c.state && MOCK_SENIOR.licensed_states.length > 0) {
      if (!MOCK_SENIOR.licensed_states.includes(c.state)) return false;
    }
    // Tag overlap filter
    if (myTagIds.length === 0) return true;
    const caseTagIds = c.tags.map((t) => t.id);
    return caseTagIds.some((id) => myTagIds.includes(id));
  });
}

export default async function DiscoverPage() {
  const cases = await getMatchingCases();

  return (
    <>
      <Nav />
      <DiscoverDeck cases={cases} />
      <Footer />
    </>
  );
}
