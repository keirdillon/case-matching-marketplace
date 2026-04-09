"use client";

import type { MatchItem } from "@/app/matches/page";

export function MyMatchesBoard({ matches }: { matches: MatchItem[] }) {
  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: "var(--space-9) var(--space-6)", background: "var(--white)", border: "1px solid var(--gray-200)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--coastal-900)", marginBottom: "var(--space-3)" }}>No matches yet</div>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--gray-400)", maxWidth: "360px", lineHeight: 1.6 }}>
          Browse the Case Board and express interest in opportunities, or post a case to receive matches.
        </p>
        <a href="/" className="btn btn-primary btn-sm" style={{ marginTop: "var(--space-5)", textDecoration: "none" }}>Go to Case Board</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: "12px" }}>
      {matches.map((match) => {
        const meetingDate = new Date(match.case_meeting_date + "T00:00:00");
        const formattedDate = meetingDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const matchDate = new Date(match.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });

        return (
          <div key={match.id} style={{ background: "var(--white)", border: "1px solid var(--gray-200)", padding: "var(--space-5)" }}>
            <div className="flex justify-between items-start" style={{ marginBottom: "var(--space-3)" }}>
              <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                <StatusBadge status={match.status} />
                <RoleBadge role={match.role} />
                <Tag bg="var(--coastal-100)" color="var(--coastal-700)">{match.case_client_type}</Tag>
                <Tag bg="var(--coastal-900)" color="var(--white)">{match.case_aum_range}</Tag>
              </div>
            </div>

            <div style={{ fontFamily: "var(--font-ui)", fontSize: "17px", fontWeight: 500, color: "var(--coastal-900)", marginBottom: "var(--space-3)", lineHeight: 1.3 }}>
              {match.case_title}
            </div>

            {/* Other party info */}
            <div className="flex items-center" style={{ gap: "10px", marginBottom: "var(--space-3)" }}>
              <div className="flex items-center justify-center" style={{ width: "28px", height: "28px", borderRadius: "50%", background: "var(--coastal-600)", fontSize: "10px", fontWeight: 500, color: "var(--white)" }}>
                {match.other_party_name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: 500, color: "var(--coastal-900)" }}>
                  {match.other_party_name}
                </div>
                <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)" }}>
                  {match.other_party_experience} yrs &middot; {match.other_party_region}
                </div>
              </div>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", marginLeft: "auto" }}>
                {match.role === "poster" ? "interested in your case" : "you expressed interest"}
              </span>
            </div>

            {/* Footer */}
            <div className="flex items-center" style={{ paddingTop: "var(--space-3)", borderTop: "1px solid var(--gray-100)", gap: "var(--space-5)" }}>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)" }}>
                Matched {matchDate}
              </span>
              <span className="flex items-center" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", gap: "6px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                Meeting {formattedDate}
              </span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)" }}>
                {match.case_region}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    interested: { bg: "var(--coastal-600)", color: "var(--white)" },
    accepted: { bg: "var(--success)", color: "var(--white)" },
    declined: { bg: "var(--error)", color: "var(--white)" },
    saved: { bg: "var(--sand-200)", color: "var(--coastal-900)" },
    expired: { bg: "var(--warning)", color: "var(--white)" },
  };
  const c = colors[status] || colors.interested;
  return (
    <span style={{ fontFamily: "var(--font-ui)", fontSize: "9px", padding: "4px 10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", background: c.bg, color: c.color }}>
      {status}
    </span>
  );
}

function RoleBadge({ role }: { role: "poster" | "senior" }) {
  return (
    <span style={{
      fontFamily: "var(--font-ui)", fontSize: "9px", padding: "4px 10px", fontWeight: 500, letterSpacing: "1px", textTransform: "uppercase",
      background: role === "poster" ? "var(--sand-100)" : "var(--coastal-50)",
      color: role === "poster" ? "var(--sand-500)" : "var(--coastal-700)",
      border: `1px solid ${role === "poster" ? "var(--sand-200)" : "var(--coastal-100)"}`,
    }}>
      {role === "poster" ? "Your Case" : "You Applied"}
    </span>
  );
}

function Tag({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "4px 10px", fontWeight: 500, letterSpacing: "0.3px", textTransform: "uppercase", background: bg, color }}>
      {children}
    </span>
  );
}
