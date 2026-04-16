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
  { value: "active", label: "Active \u2014 accepting new matches" },
  { value: "paused", label: "Paused \u2014 not accepting right now" },
];

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA",
  "KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ",
  "NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT",
  "VA","WA","WV","WI","WY",
];

const PRODUCTION_LEVELS = ["Platinum", "Gold", "Silver", "Bronze"];

const CERTIFICATION_OPTIONS = ["CFP", "ChFC", "CLU", "CIMA", "CFA", "RICP", "QKA", "AEP", "CEPA"];

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

  // New v2 fields
  const [licensedStates, setLicensedStates] = useState<string[]>(
    (advisor?.licensed_states as string[]) || []
  );
  const [productionLevel, setProductionLevel] = useState(
    (advisor?.production_level as string) || ""
  );
  const [certifications, setCertifications] = useState<string[]>(
    (advisor?.certifications as string[]) || []
  );
  const [education, setEducation] = useState(
    (advisor?.education as string) || ""
  );
  const [phone, setPhone] = useState(
    (advisor?.phone as string) || ""
  );
  const [calendlyUrl, setCalendlyUrl] = useState(
    (advisor?.calendly_url as string) || ""
  );
  const [closingRate, setClosingRate] = useState(
    advisor?.closing_rate ? String(Math.round((advisor.closing_rate as number) * 100)) : ""
  );
  const [avgAppts, setAvgAppts] = useState(
    advisor?.avg_appointments_per_week ? String(advisor.avg_appointments_per_week) : ""
  );

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

  function toggleState(st: string) {
    setLicensedStates((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  }

  function toggleCert(cert: string) {
    setCertifications((prev) =>
      prev.includes(cert) ? prev.filter((c) => c !== cert) : [...prev, cert]
    );
  }

  async function handleSave() {
    const supabase = getSupabase();
    if (!supabase) return;

    setSaving(true);

    const { error: advError } = await supabase
      .from("advisors")
      .update({
        bio: bio || null,
        availability_status: availability,
        mentorship_styles: mentorshipStyles,
        is_senior_profile_active: true,
        licensed_states: licensedStates,
        production_level: productionLevel || null,
        certifications,
        education: education || null,
        phone: phone || null,
        calendly_url: calendlyUrl || null,
        closing_rate: closingRate ? parseFloat(closingRate) / 100 : null,
        avg_appointments_per_week: avgAppts ? parseInt(avgAppts) : null,
      })
      .eq("id", MOCK_SENIOR.id);

    if (advError) {
      console.error("Error saving profile:", advError);
      alert("Failed to save: " + advError.message);
      setSaving(false);
      return;
    }

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

        {/* Licensed States */}
        <FormSection label="Licensed States" description="Select all states where you hold an active license. This determines which cases you can see.">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {US_STATES.map((st) => (
              <TagChip key={st} active={licensedStates.includes(st)} onClick={() => toggleState(st)}>
                {st}
              </TagChip>
            ))}
          </div>
        </FormSection>

        {/* Production Level */}
        <FormSection label="Production Level" description="Your current production tier at Coastal Wealth.">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {PRODUCTION_LEVELS.map((level) => (
              <TagChip key={level} active={productionLevel === level} onClick={() => setProductionLevel(productionLevel === level ? "" : level)}>
                {level}
              </TagChip>
            ))}
          </div>
        </FormSection>

        {/* Certifications */}
        <FormSection label="Certifications" description="Professional designations and certifications.">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {CERTIFICATION_OPTIONS.map((cert) => (
              <TagChip key={cert} active={certifications.includes(cert)} onClick={() => toggleCert(cert)}>
                {cert}
              </TagChip>
            ))}
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

        {/* Education */}
        <FormSection label="Education" description="School and degree.">
          <input
            type="text"
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="e.g., University of Florida, M.B.A."
            style={{
              width: "100%", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: "14px",
              color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
            }}
          />
        </FormSection>

        {/* Contact info */}
        <FormSection label="Contact Information" description="How advisors can reach you.">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", display: "block", marginBottom: "4px" }}>Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(813) 555-1234"
                style={{
                  width: "100%", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: "14px",
                  color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", display: "block", marginBottom: "4px" }}>Calendly URL</label>
              <input
                type="url"
                value={calendlyUrl}
                onChange={(e) => setCalendlyUrl(e.target.value)}
                placeholder="https://calendly.com/your-name"
                style={{
                  width: "100%", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: "14px",
                  color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
                }}
              />
            </div>
          </div>
        </FormSection>

        {/* Performance stats */}
        <FormSection label="Performance Stats" description="Optional — helps build your baseball card profile.">
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <div>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", display: "block", marginBottom: "4px" }}>Closing Rate (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={closingRate}
                onChange={(e) => setClosingRate(e.target.value)}
                placeholder="e.g., 72"
                style={{
                  width: "100%", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: "14px",
                  color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", display: "block", marginBottom: "4px" }}>Avg Appointments/Week</label>
              <input
                type="number"
                min="0"
                max="50"
                value={avgAppts}
                onChange={(e) => setAvgAppts(e.target.value)}
                placeholder="e.g., 12"
                style={{
                  width: "100%", padding: "12px 14px", fontFamily: "var(--font-ui)", fontSize: "14px",
                  color: "var(--coastal-900)", border: "1px solid var(--gray-200)", background: "var(--white)", outline: "none",
                }}
              />
            </div>
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
