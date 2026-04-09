"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { MOCK_SENIOR } from "@/lib/mock-user";

interface TagOption {
  id: string;
  name: string;
  category: string;
}

interface ProfileFormProps {
  advisor: Record<string, unknown> | null;
  tags: TagOption[];
  currentTagIds: string[];
}

const MENTORSHIP_STYLES = [
  { value: "co_attend", label: "Co-attend meetings" },
  { value: "strategy_call", label: "Pre-meeting strategy calls" },
  { value: "case_review", label: "Case review / second opinion" },
  { value: "ongoing", label: "Ongoing mentorship" },
  { value: "referral", label: "Referral / warm handoff" },
];

const AVAILABILITY_OPTIONS = [
  { value: "active", label: "Active — accepting new matches" },
  { value: "paused", label: "Paused — not accepting right now" },
];

export function ProfileForm({ advisor, tags, currentTagIds }: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [bio, setBio] = useState((advisor?.bio as string) || "");
  const [availability, setAvailability] = useState(
    (advisor?.availability_status as string) || "active"
  );
  const [mentorshipStyles, setMentorshipStyles] = useState<string[]>(
    (advisor?.mentorship_styles as string[]) || []
  );
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(currentTagIds);

  const specTags = tags.filter((t) => t.category === "specialization");
  const industryTags = tags.filter((t) => t.category === "industry");

  function toggleTag(id: string) {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  }

  function toggleStyle(value: string) {
    setMentorshipStyles((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  }

  async function handleSave() {
    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);

    // Update advisor profile
    const { error: advError } = await supabase
      .from("advisors")
      .update({
        bio: bio || null,
        availability_status: availability,
        mentorship_styles: mentorshipStyles,
        is_senior_profile_active: true,
      })
      .eq("id", MOCK_SENIOR.id);

    if (advError) {
      console.error("Error saving profile:", advError);
      alert("Failed to save: " + advError.message);
      setSaving(false);
      return;
    }

    // Replace advisor_tags: delete existing, insert new
    await supabase.from("advisor_tags").delete().eq("advisor_id", MOCK_SENIOR.id);

    if (selectedTagIds.length > 0) {
      const tagInserts = selectedTagIds.map((tagId) => {
        const tag = tags.find((t) => t.id === tagId);
        return {
          advisor_id: MOCK_SENIOR.id,
          tag_id: tagId,
          tag_category: tag?.category || "specialization",
        };
      });
      await supabase.from("advisor_tags").insert(tagInserts);
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    router.refresh();
  }

  return (
    <div style={{ background: "var(--white)", border: "1px solid var(--gray-200)" }}>
      <div style={{ padding: "var(--space-6)" }}>
        {/* Bio */}
        <FormSection label="About You" description="Share what you specialize in and why advisors should work with you.">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={500}
            placeholder="Tell junior advisors about your expertise, experience, and approach..."
            style={{
              width: "100%", padding: "14px", fontFamily: "var(--font-ui)", fontSize: "14px",
              color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)",
              outline: "none", resize: "vertical", minHeight: "120px",
            }}
          />
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", marginTop: "var(--space-2)", textAlign: "right" }}>
            {bio.length}/500
          </div>
        </FormSection>

        {/* Specializations */}
        <FormSection label="Specializations" description="What areas of expertise can you offer?">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {specTags.map((tag) => (
              <TagChip key={tag.id} active={selectedTagIds.includes(tag.id)} onClick={() => toggleTag(tag.id)}>
                {tag.name}
              </TagChip>
            ))}
          </div>
        </FormSection>

        {/* Industries */}
        <FormSection label="Industry Expertise" description="Which industries do you know best?">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {industryTags.map((tag) => (
              <TagChip key={tag.id} active={selectedTagIds.includes(tag.id)} onClick={() => toggleTag(tag.id)}>
                {tag.name}
              </TagChip>
            ))}
          </div>
        </FormSection>

        {/* Mentorship Styles */}
        <FormSection label="How I Like to Help" description="Select the types of collaboration you prefer.">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {MENTORSHIP_STYLES.map((style) => (
              <TagChip key={style.value} active={mentorshipStyles.includes(style.value)} onClick={() => toggleStyle(style.value)}>
                {style.label}
              </TagChip>
            ))}
          </div>
        </FormSection>

        {/* Availability */}
        <FormSection label="Availability" description="Control whether you appear in match suggestions.">
          <div className="flex flex-col" style={{ gap: "var(--space-2)" }}>
            {AVAILABILITY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center cursor-pointer"
                style={{ gap: "var(--space-3)", padding: "10px 14px", border: `1px solid ${availability === opt.value ? "var(--coastal-600)" : "var(--gray-200)"}`, background: availability === opt.value ? "var(--coastal-50)" : "var(--white)" }}
              >
                <input
                  type="radio"
                  name="availability"
                  checked={availability === opt.value}
                  onChange={() => setAvailability(opt.value)}
                  style={{ accentColor: "var(--coastal-600)" }}
                />
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "14px", color: "var(--coastal-900)" }}>
                  {opt.label}
                </span>
              </label>
            ))}
          </div>
        </FormSection>
      </div>

      {/* Save bar */}
      <div className="flex items-center justify-between" style={{ padding: "var(--space-5) var(--space-6)", borderTop: "1px solid var(--gray-200)", background: "var(--gray-50)" }}>
        <div>
          {saved && (
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--success)", fontWeight: 500 }}>
              Profile saved successfully
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn btn-primary btn-sm"
          style={{ opacity: saving ? 0.6 : 1 }}
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

function FormSection({ label, description, children }: { label: string; description: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--space-6)", paddingBottom: "var(--space-6)", borderBottom: "1px solid var(--gray-100)" }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "15px", fontWeight: 500, color: "var(--coastal-900)", marginBottom: "var(--space-1)" }}>
        {label}
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", marginBottom: "var(--space-4)" }}>
        {description}
      </div>
      {children}
    </div>
  );
}

function TagChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer"
      style={{
        fontFamily: "var(--font-ui)", fontSize: "12px", padding: "8px 14px",
        background: active ? "var(--coastal-600)" : "var(--gray-100)",
        color: active ? "var(--white)" : "var(--gray-600)",
        border: `1px solid ${active ? "var(--coastal-600)" : "transparent"}`,
        transition: "all var(--duration-fast)",
      }}
    >
      {children}
    </span>
  );
}
