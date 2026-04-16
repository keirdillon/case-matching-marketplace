"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { CaseWithAdvisor } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";
import { MOCK_SENIOR } from "@/lib/mock-user";
import { getInitials, AVATAR_COLORS } from "@/lib/mock-data";
import { pluralYr } from "@/lib/format";
import { InfoTooltip } from "@/components/InfoTooltip";
import { HelpAnnotation } from "@/components/HelpAnnotation";
import { useExtraHelp } from "@/components/ExtraHelpProvider";

const SWIPE_THRESHOLD = 120;
const FLY_DURATION = 400;

function formatMeetingDateTime(dateStr: string, timeStr: string | null): string {
  const date = new Date(dateStr + "T00:00:00");
  const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
  const month = date.toLocaleDateString("en-US", { month: "long" });
  const day = date.getDate();

  if (!timeStr) return `${dayName}, ${month} ${day}`;

  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHour = hours % 12 || 12;
  const displayMin = minutes > 0 ? `:${minutes.toString().padStart(2, "0")}` : ":00";
  return `${dayName}, ${month} ${day} · ${displayHour}${displayMin} ${period}`;
}

function getThisWeekCaseCount(cases: CaseWithAdvisor[]): number {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  return cases.filter((c) => {
    const meetingDate = new Date(c.meeting_date + "T00:00:00");
    return meetingDate >= startOfWeek && meetingDate < endOfWeek;
  }).length;
}

export function DiscoverDeck({ cases, profileSetUp = true }: { cases: CaseWithAdvisor[]; profileSetUp?: boolean }) {
  const router = useRouter();
  const { isHelpEnabled } = useExtraHelp();
  const [deck, setDeck] = useState(cases);
  const [swiping, setSwiping] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [tipDismissed, setTipDismissed] = useState(true);

  useEffect(() => {
    const dismissed = localStorage.getItem("ac_discover_tip_dismissed");
    if (!dismissed) setTipDismissed(false);
  }, []);

  function dismissTip() {
    setTipDismissed(true);
    localStorage.setItem("ac_discover_tip_dismissed", "true");
  }

  const thisWeekCount = getThisWeekCaseCount(cases);
  const currentIndex = cases.length - deck.length + 1;

  async function resetDemo() {
    setResetting(true);
    const supabase = getSupabase();
    if (supabase) {
      await Promise.all([
        supabase.from("matches").delete().eq("senior_advisor_id", MOCK_SENIOR.id),
        supabase.from("swipe_history").delete().eq("advisor_id", MOCK_SENIOR.id),
      ]);
    }
    router.refresh();
    setDeck(cases);
    setResetting(false);
  }

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (deck.length === 0 || swiping) return;
      const current = deck[0];
      setSwiping(true);

      const supabase = getSupabase();
      if (supabase) {
        // Always write to swipe_history
        await supabase.from("swipe_history").insert({
          case_id: current.id,
          advisor_id: MOCK_SENIOR.id,
          action: direction === "right" ? "interested" : "pass",
        });

        // Right swipe also creates match
        if (direction === "right") {
          await supabase.from("matches").insert({
            case_id: current.id,
            senior_advisor_id: MOCK_SENIOR.id,
            status: "interested",
          });
        }
      }

      setTimeout(() => {
        setDeck((prev) => prev.slice(1));
        setSwiping(false);
      }, FLY_DURATION);
    },
    [deck, swiping]
  );

  return (
    <div
      style={{
        background: "#252f4a",
        minHeight: "calc(100vh - 65px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Radial gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "800px",
          background: "radial-gradient(circle, rgba(107,149,186,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Background watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontFamily: "var(--font-display)",
          fontSize: "clamp(200px, 30vw, 400px)",
          color: "rgba(255,255,255,0.02)",
          fontWeight: 400,
          lineHeight: 0.85,
          letterSpacing: "-0.03em",
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        AC
      </div>

      <div
        className="flex flex-col items-center"
        style={{ padding: "var(--space-5) var(--space-5) var(--space-7)", position: "relative", zIndex: 1 }}
      >
        {/* Extra Help banner */}
        {isHelpEnabled && (
          <div
            style={{
              maxWidth: "460px",
              width: "100%",
              marginBottom: "var(--space-3)",
              padding: "12px 16px",
              background: "rgba(107,149,186,0.12)",
              borderLeft: "3px solid var(--coastal-600)",
            }}
          >
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-300)", lineHeight: 1.5 }}>
              Swipe right on cases you want to join. Swipe left to pass. Cards are matched to your specializations and licensed states.
            </span>
          </div>
        )}

        {/* Onboarding: profile not set up */}
        {!profileSetUp && (
          <div
            style={{
              maxWidth: "460px",
              width: "100%",
              marginBottom: "var(--space-4)",
              padding: "16px 20px",
              background: "rgba(107,149,186,0.15)",
              border: "1px solid rgba(107,149,186,0.25)",
            }}
          >
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "14px", fontWeight: 500, color: "var(--text-on-brand)", marginBottom: "6px" }}>
              Set up your profile to get matched
            </div>
            <p style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-300)", lineHeight: 1.5, marginBottom: "12px" }}>
              We need your specializations and licensed states to show you the right opportunities.
            </p>
            <Link
              href="/profile"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "12px",
                fontWeight: 500,
                color: "var(--text-on-brand)",
                padding: "8px 16px",
                background: "var(--coastal-600)",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Complete Your Profile &rarr;
            </Link>
          </div>
        )}

        {/* Onboarding tip for returning users */}
        {profileSetUp && !tipDismissed && (
          <div
            className="flex items-center justify-between"
            style={{
              maxWidth: "460px",
              width: "100%",
              marginBottom: "var(--space-3)",
              padding: "10px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-300)" }}>
              Swipe through this week&apos;s opportunities. Right = interested, left = pass.
            </span>
            <button
              onClick={dismissTip}
              className="cursor-pointer"
              style={{ background: "none", border: "none", color: "var(--coastal-400)", fontSize: "16px", marginLeft: "12px", flexShrink: 0 }}
            >
              &times;
            </button>
          </div>
        )}

        {/* Top bar: counter + board view toggle */}
        <div
          className="flex justify-between items-center w-full"
          style={{ maxWidth: "460px", marginBottom: "var(--space-5)" }}
        >
          <div
            className="flex items-center"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "13px",
              color: "var(--coastal-400)",
              letterSpacing: "0.3px",
              gap: "6px",
            }}
          >
            {deck.length > 0 ? (
              <>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--text-on-brand)" }}>
                  {currentIndex}
                </span>
                {" "}of{" "}
                <span style={{ fontFamily: "var(--font-display)", fontSize: "16px", color: "var(--text-on-brand)" }}>
                  {cases.length}
                </span>
                {" "}opportunities{thisWeekCount > 0 && ` · ${thisWeekCount} this week`}
                <InfoTooltip text="We show you cases that match your specializations and licensed states." />
              </>
            ) : (
              <span>{cases.length} opportunities reviewed</span>
            )}
          </div>

          <Link
            href="/board"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              color: "var(--coastal-400)",
              textDecoration: "none",
              padding: "6px 14px",
              border: "1px solid rgba(255,255,255,0.12)",
              transition: "all 200ms",
              letterSpacing: "0.3px",
            }}
          >
            Board View &rarr;
          </Link>
        </div>

        {deck.length > 0 ? (
          <>
            {/* Card stack area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "460px",
                height: "620px",
                marginBottom: "var(--space-5)",
              }}
            >
              {/* Stack shadow cards */}
              {deck.length > 2 && (
                <div
                  style={{
                    position: "absolute",
                    top: "12px",
                    left: "12px",
                    right: "12px",
                    bottom: "0",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.04)",
                  }}
                />
              )}
              {deck.length > 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "6px",
                    left: "6px",
                    right: "6px",
                    bottom: "0",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}
                />
              )}

              <SwipeCard
                key={deck[0].id}
                caseData={deck[0]}
                onSwipe={handleSwipe}
                swiping={swiping}
              />
            </div>

            {/* Action buttons */}
            <div className="flex items-center" style={{ gap: "var(--space-6)" }}>
              <button
                onClick={() => handleSwipe("left")}
                disabled={swiping}
                className="flex items-center justify-center cursor-pointer"
                title="Pass"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "2px solid var(--error)",
                  color: "var(--error)",
                  transition: "all var(--duration-fast)",
                  opacity: swiping ? 0.4 : 1,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

              <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-400)", letterSpacing: "0.5px" }}>
                {deck.length} remaining
              </div>

              <button
                onClick={() => handleSwipe("right")}
                disabled={swiping}
                className="flex items-center justify-center cursor-pointer"
                title="I'm Interested"
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)",
                  border: "2px solid var(--success)",
                  color: "var(--success)",
                  transition: "all var(--duration-fast)",
                  opacity: swiping ? 0.4 : 1,
                }}
              >
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            </div>

            <ResetButton resetting={resetting} onClick={resetDemo} />
          </>
        ) : (
          /* Empty state */
          <div
            className="flex flex-col items-center"
            style={{
              padding: "var(--space-9) var(--space-6)",
              textAlign: "center",
              maxWidth: "420px",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "var(--space-6)",
              }}
            >
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--coastal-400)" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "32px",
                color: "var(--text-on-brand)",
                fontWeight: 400,
                lineHeight: 1.1,
                marginBottom: "var(--space-4)",
              }}
            >
              You&apos;re all <em style={{ fontStyle: "italic", color: "var(--coastal-400)" }}>caught up</em>
            </h2>
            <p
              style={{
                fontFamily: "var(--font-body-serif)",
                fontSize: "16px",
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.7,
                fontWeight: 300,
                marginBottom: "var(--space-7)",
              }}
            >
              Check back Monday for new opportunities. New cases are posted throughout the week as advisors prepare for client meetings.
            </p>
            <Link
              href="/board"
              className="btn btn-accent btn-sm"
              style={{ textDecoration: "none" }}
            >
              Browse the Board
            </Link>
            <ResetButton resetting={resetting} onClick={resetDemo} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================
   MEETING-FIRST SWIPE CARD
   ======================================== */

function SwipeCard({
  caseData,
  onSwipe,
  swiping,
}: {
  caseData: CaseWithAdvisor;
  onSwipe: (dir: "left" | "right") => void;
  swiping: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [drag, setDrag] = useState({ x: 0, y: 0, dragging: false, startX: 0, startY: 0 });
  const [flyDir, setFlyDir] = useState<"left" | "right" | null>(null);

  const initials = getInitials(caseData.advisor.full_name);
  const avatarColor = AVATAR_COLORS[initials] || "var(--coastal-600)";
  const dateTimeStr = formatMeetingDateTime(caseData.meeting_date, caseData.meeting_time ?? null);

  const locationIcon = caseData.meeting_format === "zoom" ? "\uD83D\uDCBB" : caseData.meeting_format === "phone" ? "\uD83D\uDCDE" : "\uD83D\uDCCD";
  const locationText = caseData.meeting_location || caseData.region;

  function onPointerDown(e: React.PointerEvent) {
    if (swiping) return;
    setDrag({ x: 0, y: 0, dragging: true, startX: e.clientX, startY: e.clientY });
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!drag.dragging) return;
    setDrag((d) => ({
      ...d,
      x: e.clientX - d.startX,
      y: (e.clientY - d.startY) * 0.3,
    }));
  }

  function onPointerUp() {
    if (!drag.dragging) return;
    if (Math.abs(drag.x) > SWIPE_THRESHOLD) {
      const dir = drag.x > 0 ? "right" : "left";
      setFlyDir(dir);
      onSwipe(dir);
    }
    setDrag({ x: 0, y: 0, dragging: false, startX: 0, startY: 0 });
  }

  const rotation = drag.dragging ? drag.x * 0.08 : 0;
  const opacity = drag.dragging ? Math.max(0.5, 1 - Math.abs(drag.x) / 400) : 1;
  const flyX = flyDir === "right" ? "120vw" : flyDir === "left" ? "-120vw" : `${drag.x}px`;
  const flyRotation = flyDir ? (flyDir === "right" ? 30 : -30) : rotation;

  const showInterest = drag.dragging && drag.x > 60;
  const showPass = drag.dragging && drag.x < -60;

  return (
    <div
      ref={cardRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--card-bg)",
        boxShadow: "var(--shadow-xl)",
        cursor: drag.dragging ? "grabbing" : "grab",
        transform: `translate(${flyX}, ${drag.y}px) rotate(${flyRotation}deg)`,
        opacity: flyDir ? 0 : opacity,
        transition: drag.dragging ? "none" : `all ${FLY_DURATION}ms var(--ease-out)`,
        touchAction: "none",
        userSelect: "none",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Swipe overlay indicators */}
      {showInterest && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            left: "24px",
            padding: "8px 20px",
            border: "3px solid var(--success)",
            color: "var(--success)",
            fontFamily: "var(--font-ui)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            transform: "rotate(-15deg)",
            zIndex: 10,
            opacity: Math.min(1, (drag.x - 60) / 80),
          }}
        >
          Interested
        </div>
      )}
      {showPass && (
        <div
          style={{
            position: "absolute",
            top: "24px",
            right: "24px",
            padding: "8px 20px",
            border: "3px solid var(--error)",
            color: "var(--error)",
            fontFamily: "var(--font-ui)",
            fontSize: "20px",
            fontWeight: 700,
            letterSpacing: "2px",
            textTransform: "uppercase",
            transform: "rotate(15deg)",
            zIndex: 10,
            opacity: Math.min(1, (-drag.x - 60) / 80),
          }}
        >
          Pass
        </div>
      )}

      {/* MEETING-FIRST HEADER — Date + Time as headline */}
      <div
        style={{
          background: "#252f4a",
          padding: "var(--space-5) var(--space-5) var(--space-4)",
        }}
      >
        {/* Date + Time — biggest text */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "24px",
            color: "var(--text-on-brand)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            marginBottom: "var(--space-3)",
          }}
        >
          {dateTimeStr}
        </div>

        {/* Meeting type badge */}
        <div className="flex flex-wrap items-center" style={{ gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              padding: "4px 12px",
              background: "rgba(255,255,255,0.15)",
              color: "var(--text-on-brand)",
              fontWeight: 500,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {caseData.meeting_type}
          </span>

          {/* State badge */}
          {caseData.state && (
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                padding: "4px 10px",
                background: "var(--coastal-600)",
                color: "var(--text-on-brand)",
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              {caseData.state}
            </span>
          )}

          {/* Compensation split */}
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              padding: "4px 10px",
              background: "rgba(255,255,255,0.08)",
              color: "var(--coastal-300)",
              fontWeight: 500,
              letterSpacing: "0.3px",
              marginLeft: "auto",
            }}
          >
            {caseData.compensation_split || "50/50"} Split
          </span>
          <InfoTooltip text="This is the standard compensation split for joint work. It's pre-set — no negotiation needed." />
        </div>
      </div>

      {/* CARD BODY */}
      <div style={{ padding: "var(--space-4) var(--space-5)", flex: 1, overflow: "auto" }}>
        {/* Location + Format */}
        <div
          className="flex items-center"
          style={{
            gap: "8px",
            marginBottom: "var(--space-3)",
            fontFamily: "var(--font-ui)",
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          <span>{locationIcon}</span>
          <span>{locationText}</span>
        </div>

        {/* Client Summary */}
        {caseData.client_summary && (
          <p
            style={{
              fontFamily: "var(--font-body-serif)",
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              fontWeight: 300,
              fontStyle: "normal",
              marginBottom: "var(--space-4)",
            }}
          >
            {caseData.client_summary}
          </p>
        )}

        {/* Fallback to additional_context if no client_summary */}
        {!caseData.client_summary && caseData.additional_context && (
          <p
            style={{
              fontFamily: "var(--font-body-serif)",
              fontSize: "14px",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              fontWeight: 300,
              marginBottom: "var(--space-4)",
            }}
          >
            {caseData.additional_context}
          </p>
        )}

        {/* Specialization tags */}
        <div className="flex flex-wrap" style={{ gap: "4px", marginBottom: "var(--space-4)" }}>
          {caseData.tags.map((tag) => (
            <span
              key={tag.id}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                padding: "4px 10px",
                background: "var(--tag-specialization-bg)",
                color: "var(--tag-specialization-text)",
                fontWeight: 500,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* Bottom details: Complexity + AUM */}
        <div
          className="flex justify-between items-center"
          style={{ borderTop: "1px solid var(--gray-100)", paddingTop: "var(--space-3)" }}
        >
          <div className="flex items-center" style={{ gap: "8px" }}>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-muted)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Complexity
            </span>
            <div className="flex items-center" style={{ gap: "3px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= caseData.complexity;
                let bg = "var(--gray-200)";
                if (filled) bg = "var(--coastal-600)";
                if (filled && n >= 4 && caseData.complexity >= 4) bg = n === 4 && caseData.complexity === 4 ? "var(--warning)" : "var(--error)";
                return <span key={n} style={{ width: "8px", height: "8px", borderRadius: "50%", background: bg }} />;
              })}
            </div>
            <InfoTooltip text="1 = Routine, 3 = Moderate, 5 = Enterprise-grade complexity requiring a team approach." />
          </div>
          <span
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "4px 10px",
              background: "#252f4a",
              color: "var(--text-on-brand)",
              fontWeight: 500,
              letterSpacing: "0.3px",
              textTransform: "uppercase",
            }}
          >
            {caseData.aum_range}
          </span>
        </div>

        {/* Poster info */}
        <div
          className="flex items-center"
          style={{
            gap: "10px",
            marginTop: "var(--space-3)",
            paddingTop: "var(--space-3)",
            borderTop: "1px solid var(--gray-100)",
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: avatarColor,
              fontSize: "11px",
              fontWeight: 500,
              color: "var(--text-on-brand)",
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div>
            <Link
              href={`/directory/${caseData.advisor.id}`}
              onClick={(e) => e.stopPropagation()}
              style={{ fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", textDecoration: "none" }}
            >
              {caseData.advisor.full_name}
            </Link>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-muted)" }}>
              {caseData.advisor.years_experience} {pluralYr(caseData.advisor.years_experience)} &middot; {caseData.advisor.region}
            </div>
          </div>
          <span
            style={{
              marginLeft: "auto",
              fontFamily: "var(--font-ui)",
              fontSize: "10px",
              padding: "3px 8px",
              background: "var(--sand-100)",
              color: "var(--sand-500)",
              border: "1px solid var(--sand-200)",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Posted by
          </span>
        </div>
      </div>
    </div>
  );
}

function ResetButton({ resetting, onClick }: { resetting: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={resetting}
      className="cursor-pointer"
      style={{
        marginTop: "var(--space-6)",
        background: "none",
        border: "none",
        fontFamily: "var(--font-ui)",
        fontSize: "12px",
        color: "var(--coastal-600)",
        opacity: resetting ? 0.5 : 0.7,
        transition: "opacity var(--duration-fast)",
        padding: "8px 16px",
      }}
    >
      {resetting ? "Resetting..." : "Reset Demo"}
    </button>
  );
}
