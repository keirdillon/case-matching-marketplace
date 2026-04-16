import { getMeetingStage, getProspectStages } from "@/lib/pipeline";

export function SalesPipelineFull({ meetingType }: { meetingType: string }) {
  const result = getMeetingStage(meetingType);
  const stages = getProspectStages();

  if (!result.isProspect) {
    return (
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "4px 12px",
          background: "rgba(255,255,255,0.08)",
          fontFamily: "var(--font-ui)",
          fontSize: "11px",
          color: "var(--coastal-300)",
          letterSpacing: "0.3px",
        }}
      >
        <span style={{ fontWeight: 600 }}>Existing Client</span>
        <span style={{ opacity: 0.5 }}>&middot;</span>
        <span>{result.meetingType}</span>
      </div>
    );
  }

  const currentNum = result.stage.number;

  return (
    <div className="flex items-center" style={{ gap: "2px", width: "100%" }}>
      {stages.map((s, i) => {
        const isCurrent = s.number === currentNum;
        const isPast = s.number < currentNum;
        const isFuture = s.number > currentNum;

        let bg = "transparent";
        let color = "rgba(255,255,255,0.3)";
        let border = "1px solid rgba(255,255,255,0.12)";

        if (isCurrent) {
          bg = "var(--coastal-600)";
          color = "#ffffff";
          border = "1px solid var(--coastal-600)";
        } else if (isPast) {
          bg = "rgba(107,149,186,0.25)";
          color = "var(--coastal-300)";
          border = "1px solid rgba(107,149,186,0.2)";
        }

        return (
          <div
            key={s.number}
            className="flex items-center justify-center"
            style={{
              flex: isCurrent ? 1.5 : 1,
              padding: "3px 2px",
              background: bg,
              border,
              fontFamily: "var(--font-ui)",
              fontSize: isCurrent ? "10px" : "9px",
              fontWeight: isCurrent ? 600 : 400,
              color,
              textAlign: "center",
              whiteSpace: "nowrap",
              overflow: "hidden",
              transition: "all 200ms",
            }}
            title={`Stage ${s.number}: ${s.label}`}
          >
            {isCurrent ? `${s.number} ${s.shortLabel}` : isFuture ? s.number : s.number}
          </div>
        );
      })}
    </div>
  );
}

export function SalesPipelineCompact({ meetingType }: { meetingType: string }) {
  const result = getMeetingStage(meetingType);

  if (!result.isProspect) {
    return (
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "10px",
          padding: "3px 10px",
          background: "rgba(255,255,255,0.08)",
          color: "var(--coastal-300)",
          fontWeight: 500,
          letterSpacing: "0.3px",
        }}
      >
        Existing Client
      </span>
    );
  }

  const stage = result.stage;

  return (
    <div className="flex items-center" style={{ gap: "4px" }}>
      <span
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "10px",
          padding: "3px 10px",
          background: "var(--coastal-600)",
          color: "#ffffff",
          fontWeight: 600,
          letterSpacing: "0.3px",
        }}
      >
        Stage {stage.number}
      </span>
      <div className="flex items-center" style={{ gap: "3px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: n <= stage.number ? "var(--coastal-600)" : "var(--gray-200)",
              transition: "background 200ms",
            }}
          />
        ))}
      </div>
    </div>
  );
}
