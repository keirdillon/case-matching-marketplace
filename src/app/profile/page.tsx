import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ProfileForm } from "@/components/ProfileForm";
import { getSupabase } from "@/lib/supabase";
import { MOCK_SENIOR } from "@/lib/mock-user";

export const dynamic = "force-dynamic";

async function getProfileData() {
  const supabase = getSupabase();
  if (!supabase) return { advisor: null, advisorTags: [] };

  const { data: advisor } = await supabase
    .from("advisors")
    .select("*")
    .eq("id", MOCK_SENIOR.id)
    .single();

  const { data: advisorTags } = await supabase
    .from("advisor_tags")
    .select("tag_id, tags(id, name, category)")
    .eq("advisor_id", MOCK_SENIOR.id);

  return { advisor, advisorTags: advisorTags || [] };
}

async function getTags() {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("tags")
    .select("id, name, category")
    .order("display_order");

  return data || [];
}

export default async function ProfilePage() {
  const [{ advisor, advisorTags }, tags] = await Promise.all([
    getProfileData(),
    getTags(),
  ]);

  // Extract current tag IDs
  const currentTagIds = advisorTags
    .map((at) => {
      const raw = at as Record<string, unknown>;
      return raw.tag_id as string;
    });

  return (
    <>
      <Nav />
      <div
        className="mx-auto"
        style={{ maxWidth: "800px", padding: "var(--space-7) var(--space-6)" }}
      >
        <div className="overline" style={{ marginBottom: "var(--space-5)" }}>
          Senior Advisor Profile
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "36px",
            color: "var(--coastal-900)",
            fontWeight: 400,
            marginBottom: "var(--space-3)",
            lineHeight: 1.1,
          }}
        >
          Set up your <em style={{ fontStyle: "italic", color: "var(--coastal-700)" }}>expertise</em> profile
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body-serif)",
            fontSize: "16px",
            color: "var(--gray-500)",
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: "var(--space-7)",
            maxWidth: "560px",
          }}
        >
          Help junior advisors find you by sharing your specializations, industries, and mentorship preferences.
        </p>

        <ProfileForm
          advisor={advisor}
          tags={tags}
          currentTagIds={currentTagIds}
        />
      </div>
      <Footer />
    </>
  );
}
