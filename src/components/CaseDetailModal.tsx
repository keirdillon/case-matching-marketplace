"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CaseWithAdvisor, Advisor } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";
import { MOCK_USER, MOCK_SENIOR } from "@/lib/mock-user";
import { getInitials, AVATAR_COLORS, NEEDS_LABELS } from "@/lib/mock-data";
import { pluralYr } from "@/lib/format";

interface MatchRow {
  id: string;
  senior_advisor_id: string;
  status: string;
  advisor?: Pick<Advisor, "id" | "full_name" | "years_experience" | "region" | "bio">;
}

interface CaseDetailModalProps {
  caseData: CaseWithAdvisor | null;
  onClose: () => void;
}

export function CaseDetailModal({ caseData, onClose }: CaseDetailModalProps) {
  const router = useRouter();
  const [matches, setMatches] = useState<MatchRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [expressing, setExpressing] = useState(false);
  const [userMatch, setUserMatch] = useState<MatchRow | null>(null);

  const isPoster = caseData?.poster_id === MOCK_USER.id;
  const isSenior = MOCK_SENIOR.id !== MOCK_USER.id; // always true in dev

  const loadMatches = useCallback(async () => {
    if (!caseData) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setLoading(true);

    // Load matches for this case
    const { data } = await supabase
      .from("matches")
      .select("id, senior_advisor_id, status")
      .eq("case_id", caseData.id);

    if (data && data.length > 0) {
      // Look up advisor details for each match
      const seniorIds = data.map((m) => m.senior_advisor_id);
      const { data: advisors } = await supabase
        .from("advisors")
        .select("id, full_name, years_experience, region, bio")
        .in("id", seniorIds);

      const advisorMap = new Map<string, Pick<Advisor, "id" | "full_name" | "years_experience" | "region" | "bio">>();
      for (const a of advisors || []) {
        advisorMap.set(a.id, a);
      }

      const enriched: MatchRow[] = data.map((m) => ({
        ...m,
        advisor: advisorMap.get(m.senior_advisor_id),
      }));
      setMatches(enriched);

      // Check if mock senior already expressed interest
      const existing = enriched.find((m) => m.senior_advisor_id === MOCK_SENIOR.id);
      setUserMatch(existing || null);
    } else {
      setMatches([]);
      setUserMatch(null);
    }

    setLoading(false);
  }, [caseData]);

  useEffect(() => {
    if (caseData) loadMatches();
  }, [caseData, loadMatches]);

  async function expressInterest() {
    if (!caseData) return;
    const supabase = getSupabase();
    if (!supabase) return;

    setExpressing(true);
    const { error } = await supabase.from("matches").insert({
      case_id: caseData.id,
      senior_advisor_id: MOCK_SENIOR.id,
      status: "interested",
    });

    if (error) {
      console.error("Error expressing interest:", error);
      alert("Failed: " + error.message);
    } else {
      await loadMatches();
    }
    setExpressing(false);
  }

  async function updateMatchStatus(matchId: string, status: string) {
    const supabase = getSupabase();
    if (!supabase) return;

    await supabase.from("matches").update({ status }).eq("id", matchId);
    await loadMatches();
    if (status === "accepted") {
      router.refresh();
    }
  }

  if (!caseData) return null;

  const initials = getInitials(caseData.advisor.full_name);
  const avatarColor = AVATAR_COLORS[initials] || "var(--coastal-600)";
  const meetingDate = new Date(caseData.meeting_date + "T00:00:00");

  const interestedMatches = matches.filter((m) => m.status === "interested");

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center"
      style={{ background: "rgba(37, 47, 74, 0.6)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{ display: "grid", gridTemplateColumns: interestedMatches.length > 0 && isPoster ? "1fr 1fr" : "1fr", width: interestedMatches.length > 0 && isPoster ? "820px" : "480px", maxWidth: "95vw", background: "var(--card-bg)", boxShadow: "var(--shadow-xl)", maxHeight: "90vh", overflow: "auto" }}>
        {/* Left — Case detail */}
        <div style={{ padding: "var(--space-6)", borderRight: interestedMatches.length > 0 && isPoster ? "1px solid var(--card-border)" : "none", background: "var(--coastal-50)" }}>
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500, marginBottom: "var(--space-4)" }}>
            The Opportunity
          </div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "26px", color: "var(--text-primary)", lineHeight: 1.1, letterSpacing: "-0.01em", fontWeight: 400, marginBottom: "var(--space-4)" }}>
            {caseData.title}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap" style={{ gap: "6px", marginBottom: "var(--space-4)" }}>
            <Tag bg="var(--coastal-100)" color="var(--coastal-700)">{caseData.client_type}</Tag>
            {caseData.industry.map((ind) => (
              <Tag key={ind} bg="var(--sand-100)" color="var(--sand-500)">{ind}</Tag>
            ))}
            <Tag bg="#252f4a" color="var(--text-on-brand)">{caseData.aum_range}</Tag>
          </div>

          {/* Details */}
          <DetailRow label="Meeting" value={caseData.meeting_type} />
          <DetailRow label="Complexity" value={`${caseData.complexity} / 5`} />
          <DetailRow label="Date" value={meetingDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />
          <DetailRow label="Region" value={caseData.region} />
          <DetailRow label="Needs" value={(caseData.needs || []).map((n) => NEEDS_LABELS[n] || n).join(", ")} />

          {caseData.additional_context && (
            <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.65, fontWeight: 300, marginTop: "var(--space-4)", fontStyle: "italic" }}>
              {caseData.additional_context}
            </p>
          )}

          {/* Poster info */}
          <div className="flex items-center" style={{ gap: "10px", marginTop: "var(--space-5)" }}>
            <div className="flex items-center justify-center" style={{ width: "28px", height: "28px", borderRadius: "50%", background: avatarColor, fontSize: "10px", fontWeight: 500, color: "var(--text-on-brand)" }}>
              {initials}
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)" }}>{caseData.advisor.full_name}</div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-muted)" }}>{caseData.advisor.years_experience} {pluralYr(caseData.advisor.years_experience)} &middot; {caseData.advisor.region}</div>
            </div>
          </div>
        </div>

        {/* Right — Interested advisors (poster view) */}
        {isPoster && interestedMatches.length > 0 && (
          <div style={{ padding: "var(--space-6)" }}>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500, marginBottom: "var(--space-4)" }}>
              Interested Senior Advisors ({interestedMatches.length})
            </div>

            {interestedMatches.map((match) => (
              <div key={match.id} style={{ marginBottom: "var(--space-5)", paddingBottom: "var(--space-5)", borderBottom: "1px solid var(--card-border)" }}>
                <div className="flex items-center" style={{ gap: "14px", marginBottom: "var(--space-3)" }}>
                  <div className="flex items-center justify-center" style={{ width: "44px", height: "44px", borderRadius: "50%", background: "var(--coastal-600)", color: "var(--text-on-brand)", fontSize: "16px", fontWeight: 500 }}>
                    {match.advisor ? getInitials(match.advisor.full_name) : "?"}
                  </div>
                  <div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: "15px", fontWeight: 500, color: "var(--text-primary)" }}>{match.advisor?.full_name || "Unknown"}</div>
                    <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)" }}>{match.advisor?.years_experience} {pluralYr(match.advisor?.years_experience ?? 0)} &middot; {match.advisor?.region}</div>
                  </div>
                </div>
                {match.advisor?.bio && (
                  <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "13px", color: "var(--text-secondary)", lineHeight: 1.65, fontStyle: "italic", marginBottom: "var(--space-3)" }}>
                    &ldquo;{match.advisor.bio}&rdquo;
                  </p>
                )}
                <div className="flex" style={{ gap: "var(--space-2)" }}>
                  <button onClick={() => updateMatchStatus(match.id, "accepted")} className="btn btn-primary btn-xs">Accept</button>
                  <button onClick={() => updateMatchStatus(match.id, "saved")} className="btn btn-sand btn-xs">Save</button>
                  <button onClick={() => updateMatchStatus(match.id, "declined")} className="btn btn-outline btn-xs">Decline</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions bar */}
        <div className="flex justify-center" style={{ gridColumn: "1 / -1", padding: "var(--space-5)", borderTop: "1px solid var(--card-border)", gap: "var(--space-3)" }}>
          <button onClick={onClose} className="btn btn-outline btn-sm">Close</button>

          {/* Senior advisor: express interest */}
          {!isPoster && isSenior && !userMatch && (
            <button onClick={expressInterest} disabled={expressing} className="btn btn-primary btn-sm" style={{ opacity: expressing ? 0.6 : 1 }}>
              {expressing ? "Sending..." : "I'm Interested"}
            </button>
          )}
          {!isPoster && userMatch && (
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--coastal-600)", fontWeight: 500, padding: "10px 24px" }}>
              {userMatch.status === "interested" ? "Interest Sent" : userMatch.status === "accepted" ? "Match Accepted!" : `Status: ${userMatch.status}`}
            </span>
          )}

          {isPoster && interestedMatches.length === 0 && !loading && (
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-muted)", padding: "10px 24px" }}>
              No interest yet — check back soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between" style={{ padding: "8px 0", borderBottom: "1px solid var(--card-border)" }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-primary)", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Tag({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "4px 10px", fontWeight: 500, letterSpacing: "0.3px", textTransform: "uppercase", background: bg, color }}>
      {children}
    </span>
  );
}
