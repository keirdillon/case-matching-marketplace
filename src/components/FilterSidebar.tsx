"use client";

import { useState } from "react";
import {
  SPECIALIZATION_TAGS,
  CLIENT_TYPES,
  INDUSTRIES,
  AUM_RANGES,
  REGIONS,
} from "@/lib/mock-data";

export function FilterSidebar() {
  const [activeSpecs, setActiveSpecs] = useState<string[]>(["All"]);
  const [activeComplexity, setActiveComplexity] = useState<number[]>([1, 2, 3, 4, 5]);

  function toggleSpec(name: string) {
    if (name === "All") {
      setActiveSpecs(["All"]);
      return;
    }
    const next = activeSpecs.filter((s) => s !== "All");
    if (next.includes(name)) {
      const filtered = next.filter((s) => s !== name);
      setActiveSpecs(filtered.length === 0 ? ["All"] : filtered);
    } else {
      setActiveSpecs([...next, name]);
    }
  }

  function toggleComplexity(n: number) {
    if (activeComplexity.includes(n)) {
      setActiveComplexity(activeComplexity.filter((c) => c !== n));
    } else {
      setActiveComplexity([...activeComplexity, n]);
    }
  }

  function resetFilters() {
    setActiveSpecs(["All"]);
    setActiveComplexity([1, 2, 3, 4, 5]);
  }

  return (
    <aside
      className="sticky hidden md:block overflow-y-auto"
      style={{
        padding: "var(--space-6) var(--space-5)",
        background: "var(--white)",
        borderRight: "1px solid var(--gray-200)",
        top: "65px",
        height: "calc(100vh - 65px)",
      }}
    >
      <SidebarTitle>Filters</SidebarTitle>

      {/* Specialization chips */}
      <FilterGroup label="Specialization">
        <div className="flex flex-wrap" style={{ gap: "6px" }}>
          <Chip active={activeSpecs.includes("All")} onClick={() => toggleSpec("All")}>
            All
          </Chip>
          {SPECIALIZATION_TAGS.map((tag) => (
            <Chip
              key={tag.id}
              active={activeSpecs.includes(tag.name)}
              onClick={() => toggleSpec(tag.name)}
            >
              {tag.name}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      {/* Dropdowns */}
      <FilterGroup label="Client Type">
        <FilterSelect options={CLIENT_TYPES} />
      </FilterGroup>

      <FilterGroup label="Industry">
        <FilterSelect options={INDUSTRIES} />
      </FilterGroup>

      <FilterGroup label="AUM Range">
        <FilterSelect options={AUM_RANGES} />
      </FilterGroup>

      <FilterGroup label="Region">
        <FilterSelect options={REGIONS} />
      </FilterGroup>

      {/* Complexity dots */}
      <FilterGroup label="Complexity">
        <div className="flex items-center" style={{ gap: "6px" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              onClick={() => toggleComplexity(n)}
              className="flex items-center justify-center cursor-pointer"
              style={{
                width: "28px",
                height: "28px",
                fontFamily: "var(--font-ui)",
                fontSize: "12px",
                fontWeight: 500,
                color: activeComplexity.includes(n) ? "var(--white)" : "var(--gray-400)",
                background: activeComplexity.includes(n) ? "var(--coastal-600)" : "transparent",
                border: `1px solid ${activeComplexity.includes(n) ? "var(--coastal-600)" : "var(--gray-200)"}`,
                transition: "all var(--duration-fast)",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </FilterGroup>

      <button
        onClick={resetFilters}
        className="cursor-pointer"
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "12px",
          color: "var(--coastal-600)",
          background: "none",
          border: "none",
          marginTop: "var(--space-4)",
          padding: 0,
          fontWeight: 500,
        }}
      >
        Reset All Filters
      </button>

      {/* Saved Presets */}
      <div
        style={{
          marginTop: "var(--space-5)",
          paddingTop: "var(--space-5)",
          borderTop: "1px solid var(--gray-200)",
        }}
      >
        <SidebarTitle>Saved Presets</SidebarTitle>
        {[
          "Business Succession + $2M+ + SoFla",
          "Dental Practice + Estate Planning",
        ].map((preset) => (
          <div
            key={preset}
            className="flex items-center cursor-pointer"
            style={{
              gap: "8px",
              padding: "8px 12px",
              background: "var(--sand-100)",
              border: "1px solid var(--sand-200)",
              marginBottom: "6px",
              transition: "all var(--duration-fast)",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                background: "var(--coastal-600)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "12px",
                color: "var(--coastal-900)",
                fontWeight: 400,
              }}
            >
              {preset}
            </span>
          </div>
        ))}
      </div>
    </aside>
  );
}

function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex items-center"
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "11px",
        letterSpacing: "3px",
        textTransform: "uppercase",
        color: "var(--gray-400)",
        fontWeight: 500,
        marginBottom: "var(--space-5)",
        gap: "12px",
      }}
    >
      {children}
      <span style={{ flex: 1, height: "1px", background: "var(--gray-200)" }} />
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <label
        className="block"
        style={{
          fontFamily: "var(--font-ui)",
          fontSize: "12px",
          fontWeight: 500,
          color: "var(--coastal-900)",
          marginBottom: "var(--space-2)",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className="cursor-pointer"
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "11px",
        padding: "6px 12px",
        background: active ? "var(--coastal-600)" : "var(--coastal-100)",
        color: active ? "var(--white)" : "var(--coastal-800)",
        fontWeight: 400,
        border: "1px solid transparent",
        transition: "all var(--duration-fast)",
      }}
    >
      {children}
    </span>
  );
}

function FilterSelect({ options }: { options: string[] }) {
  return (
    <select
      className="w-full cursor-pointer"
      style={{
        padding: "10px 12px",
        fontFamily: "var(--font-ui)",
        fontSize: "13px",
        color: "var(--coastal-900)",
        border: "1px solid var(--gray-200)",
        background: "var(--white)",
        outline: "none",
        appearance: "none",
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 12px center",
        transition: "border-color var(--duration-fast)",
      }}
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}
