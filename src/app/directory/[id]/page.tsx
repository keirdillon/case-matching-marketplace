import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { BaseballCard } from "@/components/BaseballCard";
import type { BaseballCardAdvisor } from "@/components/BaseballCard";
import { getSupabase } from "@/lib/supabase";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function getAdvisor(id: string): Promise<BaseballCardAdvisor | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  const { data: advisor, error } = await supabase
    .from("advisors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !advisor) return null;

  const { data: advisorTagRows } = await supabase
    .from("advisor_tags")
    .select("advisor_id, tag_id, tags(id, name, category)")
    .eq("advisor_id", id);

  interface TagRow { id: string; name: string; category: string }
  const tags: TagRow[] = [];
  for (const row of advisorTagRows || []) {
    const raw = row as Record<string, unknown>;
    const t = raw.tags as TagRow | TagRow[] | null;
    if (!t) continue;
    const tagList = Array.isArray(t) ? t : [t];
    for (const tag of tagList) tags.push(tag);
  }

  const a = advisor as Record<string, unknown>;
  return {
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
    tags,
  };
}

export default async function AdvisorProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const advisor = await getAdvisor(id);

  return (
    <>
      <Nav />
      <div
        className="flex justify-center"
        style={{
          minHeight: "calc(100vh - 65px)",
          padding: "var(--space-7) var(--space-5)",
          background: "var(--sand-100)",
        }}
      >
        {advisor ? (
          <BaseballCard advisor={advisor} variant="full" />
        ) : (
          <div style={{ textAlign: "center", padding: "var(--space-9)" }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--coastal-900)", marginBottom: "var(--space-4)" }}>
              Advisor Not Found
            </h2>
            <Link href="/directory" className="btn btn-outline btn-sm" style={{ textDecoration: "none" }}>
              Back to Directory
            </Link>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
