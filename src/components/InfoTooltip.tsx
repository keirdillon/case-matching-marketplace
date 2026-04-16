"use client";

import { useState, useRef, useEffect } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<"above" | "below">("above");
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (visible && iconRef.current) {
      const rect = iconRef.current.getBoundingClientRect();
      setPosition(rect.top < 120 ? "below" : "above");
    }
  }, [visible]);

  return (
    <span
      ref={iconRef}
      className="relative inline-flex items-center justify-center cursor-help"
      style={{ width: "16px", height: "16px", flexShrink: 0 }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onClick={() => setVisible((v) => !v)}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--coastal-400)" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
      {visible && (
        <span
          style={{
            position: "absolute",
            [position === "above" ? "bottom" : "top"]: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            width: "240px",
            padding: "10px 14px",
            background: "#252f4a",
            color: "#ffffff",
            fontFamily: "var(--font-ui)",
            fontSize: "12px",
            lineHeight: 1.55,
            fontWeight: 400,
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            zIndex: 50,
            pointerEvents: "none",
            animation: "tooltipFadeIn 200ms ease-out",
          }}
        >
          {/* Arrow */}
          <span
            style={{
              position: "absolute",
              [position === "above" ? "bottom" : "top"]: "-5px",
              left: "50%",
              transform: `translateX(-50%) rotate(${position === "above" ? "0" : "180"}deg)`,
              width: 0,
              height: 0,
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid #252f4a",
            }}
          />
          {text}
        </span>
      )}
    </span>
  );
}
