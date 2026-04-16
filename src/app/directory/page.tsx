import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { DirectoryGrid } from "@/components/DirectoryGrid";
import { getSupabase } from "@/lib/supabase";
import type { BaseballCardAdvisor } from "@/components/BaseballCard";

export const dynamic = "force-dynamic";

async function getAdvisors(): Promise<BaseballCardAdvisor[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data: advisors, error } = await supabase
    .from("advisors")
    .select("*")
    .eq("is_senior_profile_active", true)
    .order("verified", { ascending: false })
    .order("years_experience", { ascending: false });

  if (error || !advisors) return [];

  const advisorIds = advisors.map((a: Record<string, unknown>) => a.id as string);

  const { data: advisorTagRows } = await supabase
    .from("advisor_tags")
    .select("advisor_id, tag_id, tags(id, name, category)")
    .in("advisor_id", advisorIds);

  interface TagRow { id: string; name: string; category: string }
  const tagMap = new Map<string, TagRow[]>();
  for (const row of advisorTagRows || []) {
    const raw = row as Record<string, unknown>;
    const advId = raw.advisor_id as string;
    const tags = raw.tags as TagRow | TagRow[] | null;
    if (!tags) continue;
    const tagList = Array.isArray(tags) ? tags : [tags];
    const existing = tagMap.get(advId) || [];
    for (const t of tagList) existing.push(t);
    tagMap.set(advId, existing);
  }

  return advisors.map((a: Record<string, unknown>) => ({
    id: a.id as string,
    full_name: a.full_name as string,
    email: a.email as string,
    role: a.role as string,
    region: a.region as string,
    office: (a.office as string) || null,
    years_experience: a.years_experience as number,
    bio: (a.bio as string) || null,
    availability_status: (a.availability_status as string) || "active",
    mentorship_styles: (a.mentorship_styles as string[]) || [],
    licensed_states: (a.licensed_states as string[]) || [],
    production_level: (a.production_level as string) || null,
    closing_rate: (a.closing_rate as number) || null,
    avg_appointments_per_week: (a.avg_appointments_per_week as number) || null,
    total_joint_work_completed: (a.total_joint_work_completed as number) || 0,
    education: (a.education as string) || null,
    certifications: (a.certifications as string[]) || [],
    joined_date: (a.joined_date as string) || null,
    calendly_url: (a.calendly_url as string) || null,
    phone: (a.phone as string) || null,
    verified: (a.verified as boolean) || false,
    tags: tagMap.get(a.id as string) || [],
  }));
}

export default async function DirectoryPage() {
  const advisors = await getAdvisors();

  return (
    <>
      <Nav />
      <DirectoryGrid advisors={advisors} />
      <Footer />
    </>
  );
}
