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

  // Get senior advisor's specialization tag IDs
  const { data: advisorTags } = await supabase
    .from("advisor_tags")
    .select("tag_id")
    .eq("advisor_id", MOCK_SENIOR.id);

  const myTagIds = (advisorTags || []).map((t) => t.tag_id);

  // Get cases the senior has already swiped on
  const { data: existingMatches } = await supabase
    .from("matches")
    .select("case_id")
    .eq("senior_advisor_id", MOCK_SENIOR.id);

  const swipedCaseIds = new Set((existingMatches || []).map((m) => m.case_id));

  // Get all active cases not posted by the senior
  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .eq("status", "active")
    .neq("poster_id", MOCK_SENIOR.id)
    .order("created_at", { ascending: false });

  if (error || !cases || cases.length === 0) return [];

  const caseIds = cases.map((c: Record<string, unknown>) => c.id as string);

  // Fetch advisors and case_tags in parallel
  const posterIds = [...new Set(cases.map((c: Record<string, unknown>) => c.poster_id as string))];
  const [advisorsResult, caseTagsResult] = await Promise.all([
    supabase.from("advisors").select("id, full_name, years_experience, region, role").in("id", posterIds),
    supabase.from("case_tags").select("case_id, tag_id, tags(id, name, category)").in("case_id", caseIds),
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

  // Build case objects, filter to matching tags and not-yet-swiped
  const allCases: CaseWithAdvisor[] = cases.map((c: Record<string, unknown>) => {
    const advisor = advisorMap.get(c.poster_id as string);
    return {
      id: c.id, poster_id: c.poster_id, title: c.title, client_type: c.client_type,
      industry: c.industry, aum_range: c.aum_range, meeting_type: c.meeting_type,
      complexity: c.complexity, region: c.region, meeting_date: c.meeting_date,
      needs: c.needs, additional_context: c.additional_context, status: c.status,
      created_at: c.created_at, updated_at: c.updated_at,
      advisor: advisor
        ? { id: advisor.id as string, full_name: advisor.full_name as string, years_experience: advisor.years_experience as number, region: advisor.region as string, role: advisor.role as string }
        : { id: c.poster_id as string, full_name: "Unknown", years_experience: 0, region: "Unknown", role: "junior" },
      tags: caseTagsMap.get(c.id as string) || [],
    } as CaseWithAdvisor;
  });

  // Filter: only cases with at least one overlapping tag, and not already swiped
  return allCases.filter((c) => {
    if (swipedCaseIds.has(c.id)) return false;
    if (myTagIds.length === 0) return true; // if no tags, show all
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
