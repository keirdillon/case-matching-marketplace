import type { CaseWithAdvisor } from "@/lib/database.types";
import { getInitials, AVATAR_COLORS, NEEDS_LABELS } from "@/lib/mock-data";

interface CaseCardProps {
  caseData: CaseWithAdvisor;
  isNew?: boolean;
  onClick?: () => void;
}

export function CaseCard({ caseData, isNew = false, onClick }: CaseCardProps) {
  const initials = getInitials(caseData.advisor.full_name);
  const avatarColor = AVATAR_COLORS[initials] || "var(--coastal-600)";

  const meetingDate = new Date(caseData.meeting_date + "T00:00:00");
  const formattedDate = meetingDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
      style={{
        background: "var(--white)",
        border: "1px solid var(--gray-200)",
        padding: "var(--space-5)",
        transition: "all 300ms var(--ease-out)",
      }}
    >
      {/* Gradient top border on hover */}
      <div
        className="absolute top-0 left-0 right-0 origin-left scale-x-0 group-hover:scale-x-100"
        style={{
          height: "3px",
          background: "linear-gradient(90deg, var(--coastal-600), var(--coastal-400))",
          transition: "transform 300ms var(--ease-out)",
        }}
      />

      {/* Top row: tags + complexity */}
      <div
        className="flex justify-between items-start"
        style={{ marginBottom: "var(--space-3)" }}
      >
        <div className="flex flex-wrap" style={{ gap: "6px" }}>
          <Tag variant="type">{caseData.client_type}</Tag>
          {caseData.industry.map((ind) => (
            <Tag key={ind} variant="industry">
              {ind}
            </Tag>
          ))}
          <Tag variant="aum">{caseData.aum_range}</Tag>
          {isNew && <Tag variant="new">New</Tag>}
        </div>
        <ComplexityDots level={caseData.complexity} />
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "17px",
          fontWeight: 500,
          color: "var(--coastal-900)",
          marginBottom: "var(--space-2)",
          lineHeight: 1.3,
        }}
      >
        {caseData.title}
      </div>

      {/* Description */}
      <div
        style={{
          fontFamily: "var(--font-body-serif)",
          fontSize: "14px",
          color: "var(--gray-500)",
          lineHeight: 1.65,
          fontWeight: 300,
          marginBottom: "var(--space-4)",
        }}
      >
        {caseData.additional_context}
      </div>

      {/* Specialization tags */}
      <div
        className="flex flex-wrap"
        style={{ gap: "4px", marginBottom: "var(--space-4)" }}
      >
        {caseData.tags.map((tag) => (
          <span
            key={tag.id}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "3px 8px",
              background: "var(--gray-100)",
              color: "var(--gray-600)",
              fontWeight: 400,
            }}
          >
            {tag.name}
          </span>
        ))}
      </div>

      {/* Needs chips */}
      <div
        className="flex flex-wrap"
        style={{ gap: "4px", marginBottom: "var(--space-3)" }}
      >
        {caseData.needs.map((need) => (
          <span
            key={need}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "3px 8px",
              background: "var(--coastal-50)",
              color: "var(--coastal-700)",
              border: "1px solid var(--coastal-100)",
              fontWeight: 500,
            }}
          >
            {NEEDS_LABELS[need] || need}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div
        className="flex justify-between items-center"
        style={{
          paddingTop: "var(--space-3)",
          borderTop: "1px solid var(--gray-100)",
        }}
      >
        <div className="flex items-center" style={{ gap: "10px" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: avatarColor,
              fontSize: "10px",
              fontWeight: 500,
              color: "var(--white)",
            }}
          >
            {initials}
          </div>
          <div className="flex flex-col">
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--coastal-900)",
              }}
            >
              {caseData.advisor.full_name}
            </span>
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                color: "var(--gray-400)",
              }}
            >
              {caseData.advisor.years_experience} yrs &middot;{" "}
              {caseData.advisor.region}
            </span>
          </div>
        </div>

        <div
          className="flex items-center"
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "12px",
            color: "var(--gray-400)",
            gap: "6px",
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {formattedDate}
        </div>
      </div>
    </div>
  );
}

function Tag({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: "type" | "industry" | "aum" | "new";
}) {
  const styles: Record<string, React.CSSProperties> = {
    type: {
      background: "var(--coastal-100)",
      color: "var(--coastal-700)",
    },
    industry: {
      background: "var(--sand-100)",
      color: "var(--sand-500)",
      border: "1px solid var(--sand-200)",
    },
    aum: {
      background: "var(--coastal-900)",
      color: "var(--white)",
    },
    new: {
      background: "var(--success)",
      color: "var(--white)",
      fontSize: "9px",
      letterSpacing: "1px",
    },
  };

  return (
    <span
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "10px",
        padding: "4px 10px",
        fontWeight: 500,
        letterSpacing: "0.3px",
        textTransform: "uppercase",
        ...styles[variant],
      }}
    >
      {children}
    </span>
  );
}

function ComplexityDots({ level }: { level: number }) {
  return (
    <div className="flex items-center" style={{ gap: "3px" }} title={`Complexity: ${level}/5`}>
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= level;
        const isHigh = filled && n === 4;
        const isCritical = filled && n >= 4 && level >= 5;

        let bg = "var(--gray-200)";
        if (filled) bg = "var(--coastal-600)";
        if (isHigh && level === 4) bg = "var(--warning)";
        if (isCritical) bg = "var(--error)";

        return (
          <span
            key={n}
            style={{
              width: "8px",
              height: "8px",
              background: bg,
              borderRadius: "50%",
              transition: "background var(--duration-fast)",
            }}
          />
        );
      })}
    </div>
  );
}
