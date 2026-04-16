"use client";

import { useState, useRef, useEffect, useCallback } from "react";

export function InfoTooltip({ text }: { text: string }) {
  const [visible, setVisible] = useState(false);
  const [placement, setPlacement] = useState<{
    vertical: "above" | "below";
    offsetX: number;
    arrowLeft: string;
    isMobile: boolean;
  }>({ vertical: "above", offsetX: 0, arrowLeft: "50%", isMobile: false });
  const iconRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const updatePosition = useCallback(() => {
    if (!iconRef.current) return;
    const iconRect = iconRef.current.getBoundingClientRect();
    const vw = window.innerWidth;
    const isMobile = vw < 640;

    if (isMobile) {
      setPlacement({ vertical: "below", offsetX: 0, arrowLeft: "50%", isMobile: true });
      return;
    }

    const vertical = iconRect.top < 120 ? "below" : "above";
    const tooltipWidth = 240;
    const tooltipCenter = iconRect.left + iconRect.width / 2;
    const tooltipLeft = tooltipCenter - tooltipWidth / 2;
    const tooltipRight = tooltipCenter + tooltipWidth / 2;

    let offsetX = 0;
    let arrowLeft = "50%";

    if (tooltipRight > vw - 8) {
      offsetX = vw - 8 - tooltipRight;
      arrowLeft = `${tooltipWidth / 2 - offsetX}px`;
    } else if (tooltipLeft < 8) {
      offsetX = 8 - tooltipLeft;
      arrowLeft = `${tooltipWidth / 2 - offsetX}px`;
    }

    setPlacement({ vertical, offsetX, arrowLeft, isMobile });
  }, []);

  useEffect(() => {
    if (visible) updatePosition();
  }, [visible, updatePosition]);

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
        <>
          {placement.isMobile ? (
            <span
              className="fixed inset-0"
              style={{ zIndex: 50, background: "rgba(0,0,0,0.3)" }}
              onClick={(e) => { e.stopPropagation(); setVisible(false); }}
            >
              <span
                ref={tooltipRef}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "fixed",
                  bottom: "24px",
                  left: "16px",
                  right: "16px",
                  padding: "14px 18px",
                  background: "#252f4a",
                  color: "#ffffff",
                  fontFamily: "var(--font-ui)",
                  fontSize: "13px",
                  lineHeight: 1.55,
                  fontWeight: 400,
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.3)",
                  animation: "tooltipFadeIn 200ms ease-out",
                }}
              >
                {text}
              </span>
            </span>
          ) : (
            <span
              ref={tooltipRef}
              style={{
                position: "absolute",
                [placement.vertical === "above" ? "bottom" : "top"]: "calc(100% + 8px)",
                left: "50%",
                transform: `translateX(calc(-50% + ${placement.offsetX}px))`,
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
              <span
                style={{
                  position: "absolute",
                  [placement.vertical === "above" ? "bottom" : "top"]: "-5px",
                  left: placement.arrowLeft,
                  transform: `translateX(-50%) rotate(${placement.vertical === "above" ? "0" : "180"}deg)`,
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
        </>
      )}
    </span>
  );
}
