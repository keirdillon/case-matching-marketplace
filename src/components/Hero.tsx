"use client";

import { useState, useEffect } from "react";

const LS_KEY = "ac_hero_collapsed";

const STATS = [
  { num: "23", label: "Active Cases This Week" },
  { num: "87", label: "Senior Advisors Available" },
  { num: "94%", label: "Match Satisfaction Rate" },
];

export function Hero({ onPostCase }: { onPostCase?: () => void }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(LS_KEY);
    if (stored === "true") setCollapsed(true);
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(LS_KEY, String(next));
  }

  if (!mounted) return null;

  if (collapsed) {
    return (
      <div
        className="flex items-center justify-between"
        style={{
          padding: "12px 32px",
          background: "var(--coastal-900)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="flex items-center" style={{ gap: "var(--space-6)" }}>
          {STATS.map((stat) => (
            <div key={stat.label} className="flex items-center" style={{ gap: "8px" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "20px", color: "var(--white)", fontWeight: 400 }}>
                {stat.num}
              </span>
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--coastal-400)", letterSpacing: "0.3px" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center" style={{ gap: "var(--space-3)" }}>
          <button className="btn btn-accent btn-xs" onClick={onPostCase}>Post a Case</button>
          <button
            onClick={toggle}
            className="cursor-pointer flex items-center justify-center"
            title="Expand hero"
            style={{
              width: "28px",
              height: "28px",
              background: "rgba(255,255,255,0.08)",
              border: "none",
              color: "var(--coastal-400)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <section
      className="grid min-h-[420px] relative"
      style={{
        gridTemplateColumns: "1fr 1fr",
        borderBottom: "1px solid var(--gray-200)",
      }}
    >
      {/* Left — Content */}
      <div
        className="flex flex-col justify-center"
        style={{
          padding: "var(--space-8)",
          background: "var(--sand-100)",
        }}
      >
        <div className="overline" style={{ marginBottom: "var(--space-5)" }}>
          The Case Board
        </div>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(36px, 4vw, 56px)",
            lineHeight: 0.96,
            letterSpacing: "-0.02em",
            color: "var(--coastal-900)",
            marginBottom: "var(--space-5)",
            fontWeight: 400,
          }}
        >
          Find your <em style={{ fontStyle: "italic", color: "var(--coastal-700)" }}>perfect</em>{" "}
          collaboration
        </h1>
        <p
          style={{
            fontFamily: "var(--font-body-serif)",
            fontSize: "17px",
            color: "var(--gray-500)",
            maxWidth: "420px",
            lineHeight: 1.7,
            fontWeight: 300,
            marginBottom: "var(--space-7)",
          }}
        >
          Post an upcoming client opportunity. Get matched with a senior advisor
          who has the exact expertise you need. Collaborate and close together.
        </p>
        <div className="flex flex-wrap items-center" style={{ gap: "var(--space-3)" }}>
          <button className="btn btn-primary" onClick={onPostCase}>Post a Case</button>
          <button className="btn btn-outline">Browse Opportunities</button>
        </div>
      </div>

      {/* Right — Dark with stats */}
      <div
        className="relative overflow-hidden hidden md:block"
        style={{ background: "var(--coastal-900)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, var(--coastal-800), var(--coastal-900) 60%, #1a2540)",
          }}
        />
        <div
          className="absolute"
          style={{
            bottom: "-30px",
            right: "24px",
            fontFamily: "var(--font-display)",
            fontSize: "200px",
            color: "rgba(255,255,255,0.03)",
            lineHeight: 0.85,
            letterSpacing: "-0.03em",
            fontWeight: 400,
          }}
        >
          AC
        </div>
        <div
          className="relative z-10 flex flex-col justify-center h-full"
          style={{
            padding: "var(--space-8)",
            gap: "var(--space-7)",
          }}
        >
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "48px",
                  color: "var(--white)",
                  lineHeight: 1,
                  marginBottom: "var(--space-2)",
                  fontWeight: 400,
                }}
              >
                {stat.num}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "12px",
                  color: "var(--coastal-400)",
                  fontWeight: 400,
                  letterSpacing: "0.5px",
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Collapse button */}
      <button
        onClick={toggle}
        className="absolute cursor-pointer flex items-center justify-center"
        title="Collapse hero"
        style={{
          bottom: "12px",
          right: "12px",
          width: "28px",
          height: "28px",
          background: "rgba(255,255,255,0.1)",
          border: "none",
          color: "var(--coastal-400)",
          zIndex: 10,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </section>
  );
}
