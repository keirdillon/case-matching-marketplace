"use client";

import { useState, useMemo } from "react";
import type { CaseWithAdvisor } from "@/lib/database.types";
import { CaseCard } from "@/components/CaseCard";
import {
  SPECIALIZATION_TAGS,
  CLIENT_TYPES,
  INDUSTRIES,
  AUM_RANGES,
  REGIONS,
} from "@/lib/mock-data";

type SortOption = "newest" | "meeting_date" | "complexity";

interface CaseBoardProps {
  cases: CaseWithAdvisor[];
}

export function CaseBoard({ cases }: CaseBoardProps) {
  // Filter state
  const [activeSpecs, setActiveSpecs] = useState<string[]>(["All"]);
  const [clientType, setClientType] = useState("All Client Types");
  const [industry, setIndustry] = useState("All Industries");
  const [aumRange, setAumRange] = useState("Any AUM");
  const [region, setRegion] = useState("All Regions");
  const [activeComplexity, setActiveComplexity] = useState<number[]>([1, 2, 3, 4, 5]);
  const [sort, setSort] = useState<SortOption>("newest");

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
      const next = activeComplexity.filter((c) => c !== n);
      setActiveComplexity(next.length === 0 ? [1, 2, 3, 4, 5] : next);
    } else {
      setActiveComplexity([...activeComplexity, n]);
    }
  }

  function resetFilters() {
    setActiveSpecs(["All"]);
    setClientType("All Client Types");
    setIndustry("All Industries");
    setAumRange("Any AUM");
    setRegion("All Regions");
    setActiveComplexity([1, 2, 3, 4, 5]);
  }

  // Filter + sort
  const filtered = useMemo(() => {
    let result = cases.filter((c) => {
      // Specialization
      if (!activeSpecs.includes("All")) {
        const caseTagNames = c.tags.map((t) => t.name.toLowerCase());
        const hasMatch = activeSpecs.some((spec) =>
          caseTagNames.some((tn) => tn.includes(spec.toLowerCase()))
        );
        if (!hasMatch) return false;
      }
      // Client type
      if (clientType !== "All Client Types" && c.client_type !== clientType) return false;
      // Industry
      if (industry !== "All Industries" && !c.industry.includes(industry)) return false;
      // AUM
      if (aumRange !== "Any AUM" && c.aum_range !== aumRange) return false;
      // Region
      if (region !== "All Regions" && c.region !== region) return false;
      // Complexity
      if (!activeComplexity.includes(c.complexity)) return false;
      return true;
    });

    // Sort
    if (sort === "newest") {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === "meeting_date") {
      result.sort((a, b) => new Date(a.meeting_date).getTime() - new Date(b.meeting_date).getTime());
    } else if (sort === "complexity") {
      result.sort((a, b) => b.complexity - a.complexity);
    }

    return result;
  }, [cases, activeSpecs, clientType, industry, aumRange, region, activeComplexity, sort]);

  // New this week count
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = cases.filter((c) => new Date(c.created_at) >= oneWeekAgo).length;

  // IDs of cases created in last 7 days for "New" badge
  const newCaseIds = new Set(
    cases.filter((c) => new Date(c.created_at) >= oneWeekAgo).map((c) => c.id)
  );

  return (
    <div
      className="grid mx-auto"
      style={{
        gridTemplateColumns: "280px 1fr",
        maxWidth: "1400px",
        minHeight: "80vh",
      }}
    >
      {/* FILTER SIDEBAR */}
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

        <FilterGroup label="Specialization">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            <Chip active={activeSpecs.includes("All")} onClick={() => toggleSpec("All")}>All</Chip>
            {SPECIALIZATION_TAGS.map((tag) => (
              <Chip key={tag.id} active={activeSpecs.includes(tag.name)} onClick={() => toggleSpec(tag.name)}>
                {tag.name}
              </Chip>
            ))}
          </div>
        </FilterGroup>

        <FilterGroup label="Client Type">
          <FilterSelect options={CLIENT_TYPES} value={clientType} onChange={setClientType} />
        </FilterGroup>

        <FilterGroup label="Industry">
          <FilterSelect options={INDUSTRIES} value={industry} onChange={setIndustry} />
        </FilterGroup>

        <FilterGroup label="AUM Range">
          <FilterSelect options={AUM_RANGES} value={aumRange} onChange={setAumRange} />
        </FilterGroup>

        <FilterGroup label="Region">
          <FilterSelect options={REGIONS} value={region} onChange={setRegion} />
        </FilterGroup>

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

        <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--gray-200)" }}>
          <SidebarTitle>Saved Presets</SidebarTitle>
          {["Business Succession + $2M+ + SoFla", "Dental Practice + Estate Planning"].map((preset) => (
            <div
              key={preset}
              className="flex items-center cursor-pointer"
              style={{
                gap: "8px",
                padding: "8px 12px",
                background: "var(--sand-100)",
                border: "1px solid var(--sand-200)",
                marginBottom: "6px",
              }}
            >
              <span style={{ width: "6px", height: "6px", background: "var(--coastal-600)", flexShrink: 0 }} />
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--coastal-900)", fontWeight: 400 }}>
                {preset}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* BOARD */}
      <main style={{ padding: "var(--space-6)" }}>
        {/* Header with sort */}
        <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-5)" }}>
          <h2
            className="flex items-center"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--gray-400)",
              fontWeight: 500,
              gap: "12px",
            }}
          >
            Active Opportunities
            <span style={{ width: "80px", height: "1px", background: "var(--gray-200)" }} />
          </h2>
          <select
            className="cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              color: "var(--gray-500)",
              border: "1px solid var(--gray-200)",
              padding: "8px 32px 8px 12px",
              background: "var(--white)",
              appearance: "none",
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              outline: "none",
            }}
          >
            <option value="newest">Newest First</option>
            <option value="meeting_date">Meeting Date (Soonest)</option>
            <option value="complexity">Complexity (Highest)</option>
          </select>
        </div>

        {/* New this week banner */}
        <div
          className="flex items-center"
          style={{
            background: "var(--coastal-100)",
            border: "1px solid var(--coastal-200)",
            padding: "12px 20px",
            marginBottom: "var(--space-5)",
            gap: "12px",
          }}
        >
          <span style={{ width: "8px", height: "8px", background: "var(--coastal-600)", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--coastal-800)", fontWeight: 500 }}>
            New This Week
          </span>
          <span className="ml-auto" style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--coastal-600)", fontWeight: 400 }}>
            {newThisWeek} new case{newThisWeek !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Results count */}
        {filtered.length !== cases.length && (
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", marginBottom: "var(--space-4)" }}>
            Showing {filtered.length} of {cases.length} cases
          </div>
        )}

        {/* Card grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "16px" }}>
            {filtered.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} isNew={newCaseIds.has(caseData.id)} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: "var(--space-9) var(--space-6)",
              background: "var(--white)",
              border: "1px solid var(--gray-200)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--coastal-900)", marginBottom: "var(--space-3)" }}>
              No matching cases
            </div>
            <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--gray-400)", maxWidth: "360px", lineHeight: 1.6 }}>
              Try adjusting your filters or check back later for new opportunities.
            </p>
            <button onClick={resetFilters} className="btn btn-outline btn-sm" style={{ marginTop: "var(--space-5)" }}>
              Reset Filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Sub-components (same visual style as before)
function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ fontFamily: "var(--font-ui)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--gray-400)", fontWeight: 500, marginBottom: "var(--space-5)", gap: "12px" }}>
      {children}
      <span style={{ flex: 1, height: "1px", background: "var(--gray-200)" }} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <label className="block" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--coastal-900)", marginBottom: "var(--space-2)" }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Chip({ children, active, onClick }: { children: React.ReactNode; active: boolean; onClick: () => void }) {
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

function FilterSelect({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <select
      className="w-full cursor-pointer"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        padding: "10px 12px",
        fontFamily: "var(--font-ui)",
        fontSize: "13px",
        color: "var(--coastal-900)",
        border: "1px solid var(--gray-200)",
        background: "var(--white)",
        outline: "none",
        appearance: "none",
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
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
