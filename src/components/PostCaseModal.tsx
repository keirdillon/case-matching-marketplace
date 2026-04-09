"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { MOCK_USER } from "@/lib/mock-user";

const INDUSTRIES = [
  "Healthcare", "Dental", "Legal", "Technology", "Real Estate",
  "Manufacturing", "Retail", "Construction", "Finance", "Hospitality",
];

const SPECIALIZATIONS = [
  "Retirement", "Estate Planning", "Business Planning", "Insurance & Risk",
  "Tax Strategy", "Investment Mgmt", "Exec Comp", "Special Situations",
];

const NEEDS_OPTIONS = [
  { value: "co_attend", label: "Co-attend meeting" },
  { value: "strategy_call", label: "Pre-meeting strategy call" },
  { value: "case_review", label: "Case review / second opinion" },
  { value: "ongoing", label: "Ongoing mentorship" },
  { value: "referral", label: "Referral / warm handoff" },
];

interface PostCaseModalProps {
  open: boolean;
  onClose: () => void;
}

export function PostCaseModal({ open, onClose }: PostCaseModalProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [clientType, setClientType] = useState("");
  const [aumRange, setAumRange] = useState("");
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [selectedSpecs, setSelectedSpecs] = useState<string[]>([]);
  const [meetingType, setMeetingType] = useState("");
  const [meetingDate, setMeetingDate] = useState("");
  const [complexity, setComplexity] = useState(3);
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);
  const [additionalContext, setAdditionalContext] = useState("");

  function toggleChip(arr: string[], setArr: (v: string[]) => void, val: string) {
    setArr(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  }

  function resetForm() {
    setTitle("");
    setClientType("");
    setAumRange("");
    setSelectedIndustries([]);
    setSelectedSpecs([]);
    setMeetingType("");
    setMeetingDate("");
    setComplexity(3);
    setSelectedNeeds([]);
    setAdditionalContext("");
    setSuccess(false);
  }

  async function handleSubmit() {
    if (!title || !clientType || !aumRange || !meetingType || !meetingDate || selectedNeeds.length === 0) return;

    setSubmitting(true);

    const supabase = getSupabase();
    if (!supabase) {
      alert("Supabase not configured");
      setSubmitting(false);
      return;
    }

    const { data: caseData, error: caseError } = await supabase
      .from("cases")
      .insert({
        poster_id: MOCK_USER.id,
        title,
        client_type: clientType,
        industry: selectedIndustries,
        aum_range: aumRange,
        meeting_type: meetingType,
        complexity,
        region: MOCK_USER.region,
        meeting_date: meetingDate,
        needs: selectedNeeds,
        additional_context: additionalContext || null,
        status: "active",
      })
      .select("id")
      .single();

    if (caseError) {
      console.error("Error posting case:", caseError);
      alert("Failed to post case: " + caseError.message);
      setSubmitting(false);
      return;
    }

    // Insert case_tags for selected specializations
    if (caseData && selectedSpecs.length > 0) {
      // Look up tag IDs by name
      const { data: tags } = await supabase
        .from("tags")
        .select("id, name")
        .in("name", selectedSpecs);

      if (tags && tags.length > 0) {
        await supabase.from("case_tags").insert(
          tags.map((t) => ({ case_id: caseData.id, tag_id: t.id }))
        );
      }
    }

    setSubmitting(false);
    setSuccess(true);

    // Auto-close after 1.5s and refresh
    setTimeout(() => {
      resetForm();
      onClose();
      router.refresh();
    }, 1500);
  }

  if (!open) return null;

  if (success) {
    return (
      <div
        className="fixed inset-0 z-200 flex items-start justify-center"
        style={{ background: "rgba(37, 47, 74, 0.6)", paddingTop: "var(--space-8)", backdropFilter: "blur(4px)" }}
        onClick={(e) => { if (e.target === e.currentTarget) { resetForm(); onClose(); } }}
      >
        <div style={{ width: "640px", maxWidth: "95vw", background: "var(--white)", boxShadow: "var(--shadow-xl)" }}>
          <div className="flex flex-col items-center justify-center" style={{ padding: "var(--space-9) var(--space-6)", textAlign: "center" }}>
            <div style={{ width: "56px", height: "56px", background: "var(--success)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "var(--space-5)" }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--coastal-900)", marginBottom: "var(--space-3)" }}>
              Case Posted
            </div>
            <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--gray-500)", lineHeight: 1.6 }}>
              Your opportunity is now live on the Case Board. Senior advisors will be notified.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-200 flex items-start justify-center overflow-y-auto"
      style={{ background: "rgba(37, 47, 74, 0.6)", paddingTop: "var(--space-8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ width: "640px", maxWidth: "95vw", background: "var(--white)", boxShadow: "var(--shadow-xl)", marginBottom: "var(--space-8)" }}>
        {/* Header */}
        <div className="flex justify-between items-center" style={{ padding: "var(--space-5) var(--space-6)", borderBottom: "1px solid var(--gray-200)" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--coastal-900)", fontWeight: 400 }}>Post a Case</h2>
          <button onClick={onClose} className="flex items-center justify-center cursor-pointer" style={{ width: "32px", height: "32px", border: "1px solid var(--gray-200)", background: "var(--white)", fontSize: "18px", color: "var(--gray-400)" }}>
            &times;
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "var(--space-6)" }}>
          {/* Title */}
          <FormRow label="Case Title" required>
            <input
              type="text"
              className="form-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Business owner succession planning"
              maxLength={60}
              style={inputStyle}
            />
          </FormRow>

          {/* Client Type + AUM */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <FormRow label="Client Type" required>
              <select value={clientType} onChange={(e) => setClientType(e.target.value)} style={inputStyle}>
                <option value="">Select type...</option>
                <option>Business Owner</option>
                <option>Professional (Dr/DDS/JD)</option>
                <option>Executive</option>
                <option>Individual</option>
                <option>Family / Multi-gen</option>
                <option>Nonprofit</option>
              </select>
            </FormRow>
            <FormRow label="AUM Range" required>
              <select value={aumRange} onChange={(e) => setAumRange(e.target.value)} style={inputStyle}>
                <option value="">Select range...</option>
                <option>&lt; $250K</option>
                <option>$250K - $500K</option>
                <option>$500K - $1M</option>
                <option>$1M - $3M</option>
                <option>$3M - $5M</option>
                <option>$5M - $10M</option>
                <option>$10M+</option>
              </select>
            </FormRow>
          </div>

          {/* Industry chips */}
          <FormRow label="Industry" required>
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {INDUSTRIES.map((ind) => (
                <FormChip key={ind} active={selectedIndustries.includes(ind)} onClick={() => toggleChip(selectedIndustries, setSelectedIndustries, ind)}>
                  {ind}
                </FormChip>
              ))}
            </div>
          </FormRow>

          {/* Specialization chips */}
          <FormRow label="Specialization Needed" required>
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {SPECIALIZATIONS.map((spec) => (
                <FormChip key={spec} active={selectedSpecs.includes(spec)} onClick={() => toggleChip(selectedSpecs, setSelectedSpecs, spec)}>
                  {spec}
                </FormChip>
              ))}
            </div>
          </FormRow>

          {/* Meeting Type + Date */}
          <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "var(--space-4)" }}>
            <FormRow label="Meeting Type" required>
              <select value={meetingType} onChange={(e) => setMeetingType(e.target.value)} style={inputStyle}>
                <option value="">Select type...</option>
                <option>Initial Discovery</option>
                <option>Plan Presentation</option>
                <option>Annual Review</option>
                <option>Complex Case Review</option>
                <option>Estate/Trust Discussion</option>
                <option>Business Valuation</option>
                <option>Insurance Review</option>
              </select>
            </FormRow>
            <FormRow label="Meeting Date" required>
              <input type="date" value={meetingDate} onChange={(e) => setMeetingDate(e.target.value)} style={inputStyle} />
            </FormRow>
          </div>

          {/* Complexity */}
          <FormRow label="Complexity" required>
            <div className="flex items-center" style={{ gap: "8px" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setComplexity(n)}
                  className="flex items-center justify-center cursor-pointer"
                  style={{
                    width: "36px", height: "36px",
                    fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500,
                    color: complexity === n ? "var(--white)" : "var(--gray-400)",
                    background: complexity === n ? "var(--coastal-600)" : "transparent",
                    border: `1px solid ${complexity === n ? "var(--coastal-600)" : "var(--gray-200)"}`,
                  }}
                >
                  {n}
                </button>
              ))}
            </div>
          </FormRow>

          {/* Needs */}
          <FormRow label="What I'm Looking For" required>
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {NEEDS_OPTIONS.map((need) => (
                <FormChip key={need.value} active={selectedNeeds.includes(need.value)} onClick={() => toggleChip(selectedNeeds, setSelectedNeeds, need.value)}>
                  {need.label}
                </FormChip>
              ))}
            </div>
          </FormRow>

          {/* Additional Context */}
          <FormRow label="Additional Context">
            <textarea
              value={additionalContext}
              onChange={(e) => setAdditionalContext(e.target.value)}
              placeholder="Any additional details about the opportunity..."
              maxLength={300}
              style={{ ...inputStyle, resize: "vertical", minHeight: "80px" }}
            />
            <div
              className="flex items-start"
              style={{
                background: "var(--sand-100)", border: "1px solid var(--sand-200)",
                padding: "12px 16px", gap: "10px", marginTop: "var(--space-3)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warning)" strokeWidth="2" style={{ flexShrink: 0, marginTop: "1px" }}>
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-600)", lineHeight: 1.5 }}>
                Do not include any personally identifiable client information. This platform is for matching purposes only. All case descriptions should use anonymized descriptors.
              </span>
            </div>
          </FormRow>
        </div>

        {/* Footer */}
        <div className="flex justify-end" style={{ padding: "var(--space-5) var(--space-6)", borderTop: "1px solid var(--gray-200)", gap: "var(--space-3)" }}>
          <button onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !title || !clientType || !aumRange || !meetingType || !meetingDate || selectedNeeds.length === 0}
            className="btn btn-primary btn-sm"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "Posting..." : "Post Opportunity"}
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  fontFamily: "var(--font-ui)",
  fontSize: "14px",
  color: "var(--coastal-900)",
  border: "1px solid var(--gray-200)",
  background: "var(--white)",
  outline: "none",
};

function FormRow({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <label className="block" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--coastal-900)", marginBottom: "var(--space-2)" }}>
        {label}{required && <span style={{ color: "var(--error)", marginLeft: "2px" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

function FormChip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
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
