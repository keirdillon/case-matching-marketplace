"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { CaseWithAdvisor } from "@/lib/database.types";
import { getSupabase } from "@/lib/supabase";
import { MOCK_SENIOR } from "@/lib/mock-user";
import { getInitials, AVATAR_COLORS, NEEDS_LABELS } from "@/lib/mock-data";

const SWIPE_THRESHOLD = 120;
const FLY_DURATION = 400;

export function DiscoverDeck({ cases }: { cases: CaseWithAdvisor[] }) {
  const router = useRouter();
  const [deck, setDeck] = useState(cases);
  const [swiping, setSwiping] = useState(false);

  const handleSwipe = useCallback(
    async (direction: "left" | "right") => {
      if (deck.length === 0 || swiping) return;
      const current = deck[0];
      setSwiping(true);

      if (direction === "right") {
        const supabase = getSupabase();
        if (supabase) {
          await supabase.from("matches").insert({
            case_id: current.id,
            senior_advisor_id: MOCK_SENIOR.id,
            status: "interested",
          });
        }
      }

      // Small delay for fly-off animation to finish
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
        background: "var(--coastal-900)",
        minHeight: "calc(100vh - 65px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
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
        style={{ padding: "var(--space-7) var(--space-5)", position: "relative", zIndex: 1 }}
      >
        {/* Header */}
        <div className="overline" style={{ marginBottom: "var(--space-5)", color: "var(--coastal-400)" }}>
          Discover Opportunities
        </div>

        {deck.length > 0 ? (
          <>
            {/* Card stack area */}
            <div
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "420px",
                height: "580px",
                marginBottom: "var(--space-6)",
              }}
            >
              {/* Background cards (stack effect) */}
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

              {/* Active card */}
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
                color: "var(--white)",
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
            <a
              href="/"
              className="btn btn-accent btn-sm"
              style={{ textDecoration: "none" }}
            >
              Back to Case Board
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

/* ========================================
   SWIPE CARD — Drag-to-swipe with physics
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
  const meetingDate = new Date(caseData.meeting_date + "T00:00:00");
  const formattedDate = meetingDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

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

  // Calculate card transform
  const rotation = drag.dragging ? drag.x * 0.08 : 0;
  const opacity = drag.dragging ? Math.max(0.5, 1 - Math.abs(drag.x) / 400) : 1;
  const flyX = flyDir === "right" ? "120vw" : flyDir === "left" ? "-120vw" : `${drag.x}px`;
  const flyRotation = flyDir ? (flyDir === "right" ? 30 : -30) : rotation;

  // Interest indicator
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
        background: "var(--white)",
        boxShadow: "var(--shadow-xl)",
        cursor: drag.dragging ? "grabbing" : "grab",
        transform: `translate(${flyX}, ${drag.y}px) rotate(${flyRotation}deg)`,
        opacity: flyDir ? 0 : opacity,
        transition: drag.dragging ? "none" : `all ${FLY_DURATION}ms var(--ease-out)`,
        touchAction: "none",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      {/* Interest / Pass overlay indicators */}
      {showInterest && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "8px 16px",
            border: "3px solid var(--success)",
            color: "var(--success)",
            fontFamily: "var(--font-ui)",
            fontSize: "18px",
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
            top: "20px",
            right: "20px",
            padding: "8px 16px",
            border: "3px solid var(--error)",
            color: "var(--error)",
            fontFamily: "var(--font-ui)",
            fontSize: "18px",
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

      {/* Card header — dark bar */}
      <div
        style={{
          background: "var(--coastal-900)",
          padding: "var(--space-4) var(--space-5)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex flex-wrap" style={{ gap: "6px" }}>
          <CardTag bg="rgba(255,255,255,0.12)" color="var(--white)">{caseData.client_type}</CardTag>
          {caseData.industry.map((ind) => (
            <CardTag key={ind} bg="rgba(255,255,255,0.08)" color="var(--coastal-300)">{ind}</CardTag>
          ))}
        </div>
        <CardTag bg="var(--coastal-600)" color="var(--white)">{caseData.aum_range}</CardTag>
      </div>

      {/* Card body */}
      <div style={{ padding: "var(--space-5)" }}>
        {/* Title */}
        <div
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "22px",
            color: "var(--coastal-900)",
            fontWeight: 400,
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            marginBottom: "var(--space-3)",
          }}
        >
          {caseData.title}
        </div>

        {/* Description */}
        {caseData.additional_context && (
          <p
            style={{
              fontFamily: "var(--font-body-serif)",
              fontSize: "13px",
              color: "var(--gray-500)",
              lineHeight: 1.65,
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
                background: "var(--coastal-100)",
                color: "var(--coastal-700)",
                fontWeight: 500,
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>

        {/* What they need */}
        <div className="flex flex-wrap" style={{ gap: "4px", marginBottom: "var(--space-4)" }}>
          {(caseData.needs || []).map((need) => (
            <span
              key={need}
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "10px",
                padding: "4px 10px",
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

        {/* Detail rows */}
        <div style={{ borderTop: "1px solid var(--gray-100)", paddingTop: "var(--space-3)" }}>
          <DetailRow label="Complexity">
            <div className="flex items-center" style={{ gap: "3px" }}>
              {[1, 2, 3, 4, 5].map((n) => {
                const filled = n <= caseData.complexity;
                let bg = "var(--gray-200)";
                if (filled) bg = "var(--coastal-600)";
                if (filled && n >= 4 && caseData.complexity >= 4) bg = n === 4 && caseData.complexity === 4 ? "var(--warning)" : "var(--error)";
                return <span key={n} style={{ width: "8px", height: "8px", borderRadius: "50%", background: bg }} />;
              })}
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-500)", marginLeft: "6px" }}>{caseData.complexity}/5</span>
            </div>
          </DetailRow>
          <DetailRow label="Meeting">
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-900)" }}>{formattedDate}</span>
          </DetailRow>
          <DetailRow label="Region">
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-900)" }}>{caseData.region}</span>
          </DetailRow>
          <DetailRow label="Type">
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-900)" }}>{caseData.meeting_type}</span>
          </DetailRow>
        </div>

        {/* Poster info */}
        <div
          className="flex items-center"
          style={{
            gap: "10px",
            marginTop: "var(--space-4)",
            paddingTop: "var(--space-4)",
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
              color: "var(--white)",
            }}
          >
            {initials}
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: 500, color: "var(--coastal-900)" }}>
              {caseData.advisor.full_name}
            </div>
            <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)" }}>
              {caseData.advisor.years_experience} yrs &middot; {caseData.advisor.region}
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

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center" style={{ padding: "6px 0" }}>
      <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{label}</span>
      {children}
    </div>
  );
}

function CardTag({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span style={{ fontFamily: "var(--font-ui)", fontSize: "10px", padding: "4px 10px", fontWeight: 500, letterSpacing: "0.3px", textTransform: "uppercase", background: bg, color }}>
      {children}
    </span>
  );
}
