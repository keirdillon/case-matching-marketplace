import type { CaseWithAdvisor } from "@/lib/database.types";
import { getInitials, AVATAR_COLORS } from "@/lib/mock-data";

interface CaseCardProps {
  caseData: CaseWithAdvisor;
  isNew?: boolean;
  onClick?: () => void;
}

function formatCardDateTime(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr + "T00:00:00");
  const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();

  if (!timeStr) return `${dayName}, ${month} ${day}`;

  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayMin = minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ":00";
  return `${dayName}, ${month} ${day} \u00B7 ${displayHour}${displayMin} ${period}`;
}

export function CaseCard({ caseData, isNew = false, onClick }: CaseCardProps) {
  const initials = getInitials(caseData.advisor.full_name);
  const avatarColor = AVATAR_COLORS[initials] || "var(--coastal-600)";
  const dateTimeStr = formatCardDateTime(caseData.meeting_date, caseData.meeting_time ?? null);

  const locationIcon = caseData.meeting_format === "zoom" ? "\uD83D\uDCBB" : caseData.meeting_format === "phone" ? "\uD83D\uDCDE" : "\uD83D\uDCCD";
  const locationText = caseData.meeting_location || caseData.region;

  return (
    <div
      className="group relative cursor-pointer"
      onClick={onClick}
      style={{
        background: "var(--white)",
        border: "1px solid var(--gray-200)",
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

      {/* Meeting-first header */}
      <div
        style={{
          background: "var(--coastal-900)",
          padding: "var(--space-4) var(--space-5)",
        }}
      >
        {/* Date + Time as headline */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            color: "var(--white)",
            fontWeight: 400,
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            marginBottom: "var(--space-2)",
          }}
        >
          {dateTimeStr}
        </div>
        <div className="flex flex-wrap items-center" style={{ gap: "6px" }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "3px 10px",
              background: "rgba(255,255,255,0.15)",
              color: "var(--white)",
              fontWeight: 500,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {caseData.meeting_type}
          </span>
          {caseData.state && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                padding: "3px 8px",
                background: "var(--coastal-600)",
                color: "var(--white)",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {caseData.state}
            </span>
          )}
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "3px 8px",
              background: "rgba(255,255,255,0.08)",
              color: "var(--coastal-300)",
              fontWeight: 500,
              marginLeft: "auto",
            }}
          >
            {caseData.compensation_split || "50/50"} Split
          </span>
          {isNew && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "9px",
                padding: "3px 8px",
                background: "var(--success)",
                color: "var(--white)",
                fontWeight: 600,
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              New
            </span>
          )}
        </div>
      </div>

      {/* Card body */}
      <div style={{ padding: "var(--space-4) var(--space-5)" }}>
        {/* Location */}
        <div
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "12px",
            color: "var(--gray-500)",
            marginBottom: "var(--space-3)",
          }}
        >
          {locationIcon} {locationText}
        </div>

        {/* Client summary or fallback to additional_context */}
        <div
          style={{
            fontFamily: "var(--font-body-serif)",
            fontSize: "14px",
            color: "var(--gray-500)",
            lineHeight: 1.65,
            fontWeight: 300,
            marginBottom: "var(--space-3)",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {caseData.client_summary || caseData.additional_context}
        </div>

        {/* Specialization tags */}
        <div
          className="flex flex-wrap"
          style={{ gap: "4px", marginBottom: "var(--space-3)" }}
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

        {/* Footer: poster + complexity + AUM */}
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
                {caseData.advisor.years_experience} yrs &middot; {caseData.advisor.region}
              </span>
            </div>
          </div>

          <div className="flex items-center" style={{ gap: "8px" }}>
            <ComplexityDots level={caseData.complexity} />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                padding: "3px 8px",
                background: "var(--coastal-900)",
                color: "var(--white)",
                fontWeight: 500,
                letterSpacing: "0.3px",
                textTransform: "uppercase",
              }}
            >
              {caseData.aum_range}
            </span>
          </div>
        </div>
      </div>
    </div>
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
