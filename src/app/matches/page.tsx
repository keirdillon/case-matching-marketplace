import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getSupabase } from "@/lib/supabase";
import { MOCK_USER, MOCK_SENIOR } from "@/lib/mock-user";
import { MyMatchesBoard } from "@/components/MyMatchesBoard";

export const dynamic = "force-dynamic";

export interface MatchItem {
  id: string;
  status: string;
  created_at: string;
  role: "poster" | "senior";
  case_title: string;
  case_client_type: string;
  case_aum_range: string;
  case_meeting_date: string;
  case_region: string;
  other_party_name: string;
  other_party_experience: number;
  other_party_region: string;
}

async function getMyMatches(): Promise<MatchItem[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  // Matches where user is the senior advisor
  const { data: seniorMatches } = await supabase
    .from("matches")
    .select("id, status, created_at, case_id")
    .eq("senior_advisor_id", MOCK_SENIOR.id)
    .order("created_at", { ascending: false });

  // Matches on cases the user posted
  const { data: myCases } = await supabase
    .from("cases")
    .select("id")
    .eq("poster_id", MOCK_USER.id);

  const myCaseIds = (myCases || []).map((c) => c.id);

  let posterMatches: typeof seniorMatches = [];
  if (myCaseIds.length > 0) {
    const { data } = await supabase
      .from("matches")
      .select("id, status, created_at, case_id, senior_advisor_id")
      .in("case_id", myCaseIds)
      .order("created_at", { ascending: false });
    posterMatches = data || [];
  }

  // Gather all case IDs and advisor IDs we need
  const allCaseIds = [
    ...new Set([
      ...(seniorMatches || []).map((m) => m.case_id),
      ...(posterMatches || []).map((m: Record<string, unknown>) => m.case_id as string),
    ]),
  ];
  const seniorAdvisorIds = (posterMatches || []).map((m: Record<string, unknown>) => m.senior_advisor_id as string);
  const posterIds = (seniorMatches || []).map((m) => m.case_id); // we'll get poster from cases

  // Fetch cases
  const { data: cases } = allCaseIds.length > 0
    ? await supabase.from("cases").select("id, title, client_type, aum_range, meeting_date, region, poster_id").in("id", allCaseIds)
    : { data: [] };

  const caseMap = new Map<string, Record<string, unknown>>();
  for (const c of cases || []) caseMap.set(c.id, c);

  // Fetch all relevant advisors
  const allAdvisorIds = [
    ...new Set([
      ...seniorAdvisorIds,
      ...(cases || []).map((c) => c.poster_id),
    ]),
  ].filter(Boolean);

  const { data: advisors } = allAdvisorIds.length > 0
    ? await supabase.from("advisors").select("id, full_name, years_experience, region").in("id", allAdvisorIds)
    : { data: [] };

  const advisorMap = new Map<string, Record<string, unknown>>();
  for (const a of advisors || []) advisorMap.set(a.id, a);

  const results: MatchItem[] = [];

  // Senior matches (user expressed interest)
  for (const m of seniorMatches || []) {
    const c = caseMap.get(m.case_id);
    if (!c) continue;
    const poster = advisorMap.get(c.poster_id as string);
    results.push({
      id: m.id,
      status: m.status,
      created_at: m.created_at,
      role: "senior",
      case_title: c.title as string,
      case_client_type: c.client_type as string,
      case_aum_range: c.aum_range as string,
      case_meeting_date: c.meeting_date as string,
      case_region: c.region as string,
      other_party_name: (poster?.full_name as string) || "Unknown",
      other_party_experience: (poster?.years_experience as number) || 0,
      other_party_region: (poster?.region as string) || "",
    });
  }

  // Poster matches (others expressed interest in user's cases)
  for (const m of posterMatches || []) {
    const raw = m as Record<string, unknown>;
    const c = caseMap.get(raw.case_id as string);
    if (!c) continue;
    const senior = advisorMap.get(raw.senior_advisor_id as string);
    results.push({
      id: raw.id as string,
      status: raw.status as string,
      created_at: raw.created_at as string,
      role: "poster",
      case_title: c.title as string,
      case_client_type: c.client_type as string,
      case_aum_range: c.aum_range as string,
      case_meeting_date: c.meeting_date as string,
      case_region: c.region as string,
      other_party_name: (senior?.full_name as string) || "Unknown",
      other_party_experience: (senior?.years_experience as number) || 0,
      other_party_region: (senior?.region as string) || "",
    });
  }

  // Sort by newest
  results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return results;
}

export default async function MyMatchesPage() {
  const matches = await getMyMatches();

  return (
    <>
      <Nav />
      <div className="mx-auto" style={{ maxWidth: "1000px", padding: "var(--space-7) var(--space-6)" }}>
        <div className="overline" style={{ marginBottom: "var(--space-5)" }}>My Matches</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--coastal-900)", fontWeight: 400, marginBottom: "var(--space-3)", lineHeight: 1.1 }}>
          Your <em style={{ fontStyle: "italic", color: "var(--coastal-700)" }}>connections</em>
        </h1>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "16px", color: "var(--gray-500)", lineHeight: 1.7, fontWeight: 300, marginBottom: "var(--space-7)", maxWidth: "560px" }}>
          All your match activity — cases you&apos;ve expressed interest in and advisors who want to collaborate on your cases.
        </p>
        <MyMatchesBoard matches={matches} />
      </div>
      <Footer />
    </>
  );
}
