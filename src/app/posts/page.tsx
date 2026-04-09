import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { getSupabase } from "@/lib/supabase";
import { MOCK_USER } from "@/lib/mock-user";
import { MyPostsBoard } from "@/components/MyPostsBoard";

export const dynamic = "force-dynamic";

async function getMyPosts() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: cases, error } = await supabase
    .from("cases")
    .select("*")
    .eq("poster_id", MOCK_USER.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching posts:", error);
    return [];
  }

  if (!cases || cases.length === 0) return [];

  // Get match counts per case
  const caseIds = cases.map((c: Record<string, unknown>) => c.id as string);
  const { data: matches } = await supabase
    .from("matches")
    .select("case_id, status")
    .in("case_id", caseIds);

  // Get case tags
  const { data: caseTags } = await supabase
    .from("case_tags")
    .select("case_id, tags(id, name, category)")
    .in("case_id", caseIds);

  const matchCountMap = new Map<string, { interested: number; accepted: number }>();
  for (const m of matches || []) {
    const existing = matchCountMap.get(m.case_id) || { interested: 0, accepted: 0 };
    if (m.status === "interested") existing.interested++;
    if (m.status === "accepted") existing.accepted++;
    matchCountMap.set(m.case_id, existing);
  }

  interface TagRow { id: string; name: string; category: string }
  const caseTagsMap = new Map<string, TagRow[]>();
  for (const ct of caseTags || []) {
    const raw = ct as Record<string, unknown>;
    const caseId = raw.case_id as string;
    const tags = raw.tags as TagRow | TagRow[] | null;
    if (!tags) continue;
    const tagList = Array.isArray(tags) ? tags : [tags];
    const existing = caseTagsMap.get(caseId) || [];
    for (const t of tagList) existing.push(t);
    caseTagsMap.set(caseId, existing);
  }

  return cases.map((c: Record<string, unknown>) => ({
    id: c.id as string,
    title: c.title as string,
    client_type: c.client_type as string,
    industry: c.industry as string[],
    aum_range: c.aum_range as string,
    complexity: c.complexity as number,
    meeting_date: c.meeting_date as string,
    status: c.status as string,
    created_at: c.created_at as string,
    region: c.region as string,
    tags: caseTagsMap.get(c.id as string) || [],
    matchCounts: matchCountMap.get(c.id as string) || { interested: 0, accepted: 0 },
  }));
}

export default async function MyPostsPage() {
  const posts = await getMyPosts();

  return (
    <>
      <Nav />
      <div className="mx-auto" style={{ maxWidth: "1000px", padding: "var(--space-7) var(--space-6)" }}>
        <div className="overline" style={{ marginBottom: "var(--space-5)" }}>My Posts</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "36px", color: "var(--coastal-900)", fontWeight: 400, marginBottom: "var(--space-3)", lineHeight: 1.1 }}>
          Your <em style={{ fontStyle: "italic", color: "var(--coastal-700)" }}>posted</em> cases
        </h1>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "16px", color: "var(--gray-500)", lineHeight: 1.7, fontWeight: 300, marginBottom: "var(--space-7)", maxWidth: "560px" }}>
          Track the cases you&apos;ve posted and see which senior advisors have expressed interest.
        </p>
        <MyPostsBoard posts={posts} />
      </div>
      <Footer />
    </>
  );
}
