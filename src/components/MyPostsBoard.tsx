"use client";

interface PostItem {
  id: string;
  title: string;
  client_type: string;
  industry: string[];
  aum_range: string;
  complexity: number;
  meeting_date: string;
  status: string;
  created_at: string;
  region: string;
  tags: { id: string; name: string; category: string }[];
  matchCounts: { interested: number; accepted: number };
}

export function MyPostsBoard({ posts }: { posts: PostItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ padding: "var(--space-9) var(--space-6)", background: "var(--card-bg)", border: "1px solid var(--card-border)", textAlign: "center" }}>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>No cases posted yet</div>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--text-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
          Head to the Case Board and post your first opportunity to get matched with a senior advisor.
        </p>
        <a href="/" className="btn btn-primary btn-sm" style={{ marginTop: "var(--space-5)", textDecoration: "none" }}>Go to Case Board</a>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ gap: "12px" }}>
      {posts.map((post) => {
        const meetingDate = new Date(post.meeting_date + "T00:00:00");
        const formattedDate = meetingDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        const postedDate = new Date(post.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
        const totalInterest = post.matchCounts.interested + post.matchCounts.accepted;

        return (
          <div key={post.id} style={{ background: "var(--card-bg)", border: "1px solid var(--card-border)", padding: "var(--space-5)" }}>
            <div className="flex justify-between items-start" style={{ marginBottom: "var(--space-3)" }}>
              <div className="flex flex-wrap" style={{ gap: "6px" }}>
                <StatusBadge status={post.status} />
                <Tag bg="var(--coastal-100)" color="var(--coastal-700)">{post.client_type}</Tag>
                {post.industry.map((ind) => (
                  <Tag key={ind} bg="var(--sand-100)" color="var(--sand-500)">{ind}</Tag>
                ))}
                <Tag bg="#252f4a" color="var(--text-on-brand)">{post.aum_range}</Tag>
              </div>
              <div className="flex items-center" style={{ gap: "3px" }} title={`Complexity: ${post.complexity}/5`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <span key={n} style={{ width: "6px", height: "6px", borderRadius: "50%", background: n <= post.complexity ? "var(--coastal-600)" : "var(--gray-200)" }} />
                ))}
              </div>
            </div>

            <div style={{ fontFamily: "var(--font-ui)", fontSize: "17px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "var(--space-2)", lineHeight: 1.3 }}>
              {post.title}
            </div>

            {/* Tags */}
            <div className="flex flex-wrap" style={{ gap: "4px", marginBottom: "var(--space-4)" }}>
              {post.tags.map((tag) => (
                <span key={tag.id} style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "3px 8px", background: "var(--tag-specialization-bg)", color: "var(--tag-specialization-text)" }}>
                  {tag.name}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-center" style={{ paddingTop: "var(--space-3)", borderTop: "1px solid var(--card-border)" }}>
              <div className="flex items-center" style={{ gap: "var(--space-5)" }}>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)" }}>
                  Posted {postedDate}
                </span>
                <span className="flex items-center" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)", gap: "6px" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                  Meeting {formattedDate}
                </span>
                <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)" }}>
                  {post.region}
                </span>
              </div>
              <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
                {totalInterest > 0 && (
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--coastal-600)" }}>
                    {totalInterest} interested
                  </span>
                )}
                {post.matchCounts.accepted > 0 && (
                  <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", padding: "3px 10px", background: "var(--success)", color: "var(--text-on-brand)", fontWeight: 500 }}>
                    {post.matchCounts.accepted} matched
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, { bg: string; color: string }> = {
    active: { bg: "var(--success)", color: "var(--text-on-brand)" },
    matched: { bg: "var(--coastal-600)", color: "var(--text-on-brand)" },
    closed: { bg: "var(--gray-400)", color: "var(--text-on-brand)" },
    expired: { bg: "var(--warning)", color: "var(--text-on-brand)" },
  };
  const c = colors[status] || colors.active;
  return (
    <span style={{ fontFamily: "var(--font-ui)", fontSize: "9px", padding: "4px 10px", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", background: c.bg, color: c.color }}>
      {status}
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
