"use client";

import { getInitials, AVATAR_COLORS } from "@/lib/mock-data";
import { pluralYr } from "@/lib/format";
import { InfoTooltip } from "@/components/InfoTooltip";

export interface BaseballCardAdvisor {
  id: string;
  full_name: string;
  email: string;
  role: string;
  region: string;
  office: string | null;
  years_experience: number;
  bio: string | null;
  availability_status: string;
  mentorship_styles: string[];
  licensed_states: string[];
  production_level: string | null;
  closing_rate: number | null;
  avg_appointments_per_week: number | null;
  total_joint_work_completed: number;
  education: string | null;
  certifications: string[];
  joined_date: string | null;
  calendly_url: string | null;
  phone: string | null;
  verified: boolean;
  tags?: { id: string; name: string; category: string }[];
}

const NEEDS_LABELS: Record<string, string> = {
  co_attend: "Co-attend meetings",
  strategy_call: "Strategy calls",
  case_review: "Case review",
  ongoing: "Ongoing mentorship",
  referral: "Referral partner",
};

const PRODUCTION_COLORS: Record<string, { bg: string; color: string }> = {
  Platinum: { bg: "linear-gradient(135deg, #d4af37, #f0d060)", color: "#5a4a00" },
  Gold: { bg: "linear-gradient(135deg, #d4a853, #e6c47a)", color: "#6b5200" },
  Silver: { bg: "linear-gradient(135deg, #a8b5c4, #c8d0d8)", color: "#3a4550" },
  Bronze: { bg: "linear-gradient(135deg, #b87333, #d4955a)", color: "#4a2800" },
};

export function BaseballCard({
  advisor,
  variant = "full",
  onClose,
}: {
  advisor: BaseballCardAdvisor;
  variant?: "full" | "compact";
  onClose?: () => void;
}) {
  const initials = getInitials(advisor.full_name);
  const avatarColor = AVATAR_COLORS[initials] || "var(--coastal-600)";
  const specTags = (advisor.tags || []).filter((t) => t.category === "specialization");
  const industryTags = (advisor.tags || []).filter((t) => t.category === "industry");
  const prodColors = PRODUCTION_COLORS[advisor.production_level || ""] || null;

  const joinedStr = advisor.joined_date
    ? new Date(advisor.joined_date + "T00:00:00").toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : null;

  if (variant === "compact") {
    return <CompactCard advisor={advisor} initials={initials} avatarColor={avatarColor} specTags={specTags} prodColors={prodColors} />;
  }

  return (
    <div style={{ background: "var(--card-bg)", maxWidth: "560px", width: "100%" }}>
      {/* Header */}
      <div
        style={{
          background: "#252f4a",
          padding: "var(--space-6)",
          position: "relative",
        }}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="cursor-pointer"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "var(--text-on-brand)",
              width: "32px",
              height: "32px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}
          >
            &times;
          </button>
        )}
        <div className="flex items-center" style={{ gap: "var(--space-5)" }}>
          {/* Avatar */}
          <div
            className="flex items-center justify-center"
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: avatarColor,
              fontSize: "24px",
              fontWeight: 500,
              color: "var(--text-on-brand)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center" style={{ gap: "8px", marginBottom: "4px" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "24px",
                  color: "var(--text-on-brand)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                }}
              >
                {advisor.full_name}
              </span>
              {advisor.verified && (
                <span title="Verified" style={{ color: "var(--coastal-400)", fontSize: "18px" }}>&#10003;</span>
              )}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--coastal-400)" }}>
              {advisor.role.charAt(0).toUpperCase() + advisor.role.slice(1)} Advisor
              {advisor.office && ` \u00B7 ${advisor.office}`}
              {` \u00B7 ${advisor.region}`}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(4, 1fr)",
          borderBottom: "1px solid var(--card-border)",
        }}
      >
        <StatCell value={`${advisor.years_experience}`} label="Years Exp" />
        <StatCell value={advisor.closing_rate ? `${Math.round(advisor.closing_rate * 100)}%` : "\u2014"} label="Close Rate" />
        <StatCell value={advisor.avg_appointments_per_week ? `${advisor.avg_appointments_per_week}` : "\u2014"} label="Appts/Week" />
        <StatCell value={`${advisor.total_joint_work_completed}`} label="Joint Work" />
      </div>

      {/* Body */}
      <div style={{ padding: "var(--space-5) var(--space-6)" }}>
        {/* Production level badge */}
        {advisor.production_level && prodColors && (
          <div style={{ marginBottom: "var(--space-4)" }}>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                padding: "5px 14px",
                background: prodColors.bg,
                color: prodColors.color,
                fontWeight: 600,
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {advisor.production_level} Producer
            </span>
          </div>
        )}

        {/* Certifications */}
        {advisor.certifications.length > 0 && (
          <Section label="Certifications">
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {advisor.certifications.map((cert) => (
                <span
                  key={cert}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    padding: "4px 12px",
                    background: "var(--sand-100)",
                    color: "var(--sand-500)",
                    border: "1px solid var(--sand-200)",
                    fontWeight: 500,
                  }}
                >
                  {cert}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Licensed states */}
        {advisor.licensed_states.length > 0 && (
          <Section label="Licensed States">
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {advisor.licensed_states.map((st) => (
                <span
                  key={st}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    padding: "4px 10px",
                    background: "var(--coastal-100)",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {st}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Specializations */}
        {specTags.length > 0 && (
          <Section label="Specializations">
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {specTags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    padding: "4px 12px",
                    background: "var(--tag-specialization-bg)",
                    color: "var(--tag-specialization-text)",
                    fontWeight: 400,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Industries */}
        {industryTags.length > 0 && (
          <Section label="Industries">
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {industryTags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    padding: "4px 12px",
                    background: "var(--tag-specialization-bg)",
                    color: "var(--tag-specialization-text)",
                    fontWeight: 400,
                  }}
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Bio */}
        {advisor.bio && (
          <Section label="About">
            <p
              style={{
                fontFamily: "var(--font-body-serif)",
                fontSize: "14px",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              {advisor.bio}
            </p>
          </Section>
        )}

        {/* Mentorship style */}
        {advisor.mentorship_styles.length > 0 && (
          <Section label="Collaboration Style">
            <div className="flex flex-wrap" style={{ gap: "6px" }}>
              {advisor.mentorship_styles.map((style) => (
                <span
                  key={style}
                  style={{
                    fontFamily: "var(--font-ui)",
                    fontSize: "11px",
                    padding: "4px 12px",
                    background: "var(--coastal-50)",
                    color: "var(--text-primary)",
                    border: "1px solid var(--coastal-100)",
                    fontWeight: 500,
                  }}
                >
                  {NEEDS_LABELS[style] || style}
                </span>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {advisor.education && (
          <Section label="Education">
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
              {advisor.education}
            </span>
          </Section>
        )}

        {/* Contact */}
        <Section label="Contact">
          <div className="flex flex-wrap items-center" style={{ gap: "var(--space-3)" }}>
            {advisor.phone && (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
                {advisor.phone}
              </span>
            )}
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-secondary)" }}>
              {advisor.email}
            </span>
            {advisor.calendly_url && (
              <a
                href={advisor.calendly_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-sm"
                style={{ textDecoration: "none", fontSize: "12px", padding: "6px 14px" }}
              >
                Check Availability
              </a>
            )}
          </div>
        </Section>

        {/* Footer: availability + joined date */}
        <div className="flex justify-between items-center" style={{ paddingTop: "var(--space-4)", borderTop: "1px solid var(--card-border)" }}>
          <div className="flex items-center" style={{ gap: "8px" }}>
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: advisor.availability_status === "active" ? "var(--success)" : "var(--gray-300)",
              }}
            />
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-secondary)" }}>
              {advisor.availability_status === "active" ? "Active" : "Paused"}
            </span>
          </div>
          {joinedStr && (
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)" }}>
              Joined {joinedStr}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function CompactCard({
  advisor,
  initials,
  avatarColor,
  specTags,
  prodColors,
}: {
  advisor: BaseballCardAdvisor;
  initials: string;
  avatarColor: string;
  specTags: { id: string; name: string; category: string }[];
  prodColors: { bg: string; color: string } | null;
}) {
  return (
    <div
      className="group relative cursor-pointer"
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        transition: "all 300ms var(--ease-out)",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 origin-left scale-x-0 group-hover:scale-x-100"
        style={{
          height: "3px",
          background: "linear-gradient(90deg, var(--coastal-600), var(--coastal-400))",
          transition: "transform 300ms var(--ease-out)",
        }}
      />
      <div style={{ padding: "var(--space-5)" }}>
        <div className="flex items-center" style={{ gap: "var(--space-4)", marginBottom: "var(--space-4)" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: avatarColor,
              fontSize: "16px",
              fontWeight: 500,
              color: "var(--text-on-brand)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <div className="flex items-center" style={{ gap: "6px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--text-primary)", fontWeight: 400 }}>
                {advisor.full_name}
              </span>
              {advisor.verified && (
                <>
                  <span style={{ color: "var(--coastal-600)", fontSize: "14px" }}>&#10003;</span>
                  <InfoTooltip text="Verified advisors have above-average production and closing rates." />
                </>
              )}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)" }}>
              {advisor.years_experience} {pluralYr(advisor.years_experience)} &middot; {advisor.region}
              {advisor.office && ` \u00B7 ${advisor.office}`}
            </div>
          </div>
          {prodColors && advisor.production_level && (
            <span
              style={{
                marginLeft: "auto",
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                padding: "3px 10px",
                background: prodColors.bg,
                color: prodColors.color,
                fontWeight: 600,
                letterSpacing: "0.3px",
                textTransform: "uppercase",
              }}
            >
              {advisor.production_level}
            </span>
          )}
        </div>

        {/* Mini stats row */}
        <div className="flex" style={{ gap: "var(--space-4)", marginBottom: "var(--space-3)" }}>
          <MiniStat value={advisor.closing_rate ? `${Math.round(advisor.closing_rate * 100)}%` : "\u2014"} label="Close" />
          <MiniStat value={`${advisor.total_joint_work_completed}`} label="Joint Work" />
          <MiniStat value={advisor.avg_appointments_per_week ? `${advisor.avg_appointments_per_week}/wk` : "\u2014"} label="Appts" />
        </div>

        {/* Certifications + licensed states */}
        <div className="flex flex-wrap" style={{ gap: "4px", marginBottom: "var(--space-3)" }}>
          {advisor.certifications.map((cert) => (
            <span
              key={cert}
              style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "3px 8px", background: "var(--sand-100)", color: "var(--sand-500)", border: "1px solid var(--sand-200)", fontWeight: 500 }}
            >
              {cert}
            </span>
          ))}
          {advisor.licensed_states.map((st) => (
            <span
              key={st}
              style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "3px 8px", background: "var(--coastal-100)", color: "var(--text-primary)", fontWeight: 500 }}
            >
              {st}
            </span>
          ))}
        </div>

        {/* Specialization tags */}
        {specTags.length > 0 && (
          <div className="flex flex-wrap" style={{ gap: "4px" }}>
            {specTags.slice(0, 4).map((tag) => (
              <span
                key={tag.id}
                style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "3px 8px", background: "var(--tag-specialization-bg)", color: "var(--tag-specialization-text)" }}
              >
                {tag.name}
              </span>
            ))}
            {specTags.length > 4 && (
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "3px 8px", color: "var(--text-muted)" }}>
                +{specTags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Availability indicator */}
        <div className="flex items-center" style={{ gap: "6px", marginTop: "var(--space-3)", paddingTop: "var(--space-3)", borderTop: "1px solid var(--card-border)" }}>
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: advisor.availability_status === "active" ? "var(--success)" : "var(--gray-300)",
            }}
          />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-muted)" }}>
            {advisor.availability_status === "active" ? "Active" : "Paused"}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatCell({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ padding: "var(--space-4)", textAlign: "center", borderRight: "1px solid var(--card-border)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text-primary)", fontWeight: 400, lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: "4px" }}>
        {label}
      </div>
    </div>
  );
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--text-primary)", fontWeight: 400 }}>
        {value}
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "10px", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.3px" }}>
        {label}
      </div>
    </div>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--space-4)" }}>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "var(--space-2)" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/* Modal wrapper for displaying baseball card as overlay */
export function BaseballCardModal({
  advisor,
  onClose,
}: {
  advisor: BaseballCardAdvisor | null;
  onClose: () => void;
}) {
  if (!advisor) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.5)", zIndex: 200 }}
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxHeight: "90vh", overflow: "auto" }}>
        <BaseballCard advisor={advisor} variant="full" onClose={onClose} />
      </div>
    </div>
  );
}
