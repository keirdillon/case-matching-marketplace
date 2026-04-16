"use client";

import { useExtraHelp } from "@/components/ExtraHelpProvider";

interface HelpAnnotationProps {
  text: string;
  position?: "top" | "bottom" | "left" | "right";
}

export function HelpAnnotation({ text, position = "top" }: HelpAnnotationProps) {
  const { isHelpEnabled } = useExtraHelp();

  if (!isHelpEnabled) return null;

  const positionStyles: Record<string, React.CSSProperties> = {
    top: { bottom: "calc(100% + 6px)", left: "0", right: "auto" },
    bottom: { top: "calc(100% + 6px)", left: "0", right: "auto" },
    left: { right: "calc(100% + 6px)", top: "0" },
    right: { left: "calc(100% + 6px)", top: "0" },
  };

  return (
    <span
      style={{
        position: "absolute",
        ...positionStyles[position],
        padding: "4px 10px",
        background: "var(--coastal-100)",
        color: "var(--coastal-600)",
        fontFamily: "var(--font-ui)",
        fontSize: "11px",
        fontWeight: 400,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
        zIndex: 40,
        pointerEvents: "none",
        animation: "tooltipFadeIn 200ms ease-out",
        borderLeft: "2px solid var(--coastal-600)",
      }}
    >
      {text}
    </span>
  );
}
