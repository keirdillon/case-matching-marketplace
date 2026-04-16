"use client";

import { useState, useMemo } from "react";
import type { CaseWithAdvisor } from "@/lib/database.types";
import { CaseCard } from "@/components/CaseCard";
import { CaseDetailModal } from "@/components/CaseDetailModal";
import {
  SPECIALIZATION_TAGS,
  CLIENT_TYPES,
  INDUSTRIES,
  AUM_RANGES,
  REGIONS,
} from "@/lib/mock-data";
import { InfoTooltip } from "@/components/InfoTooltip";
import { useExtraHelp } from "@/components/ExtraHelpProvider";
import { AnnotatedOverlay } from "@/components/AnnotatedCardOverlay";

type SortOption = "newest" | "meeting_date" | "complexity";
type DateRange = "all" | "this_week" | "next_week";

const STATES = ["All States", "FL", "GA", "NY", "NJ", "CT", "TX", "NC", "SC", "AL"];
const MEETING_FORMATS = ["All Formats", "In-Person", "Zoom", "Phone"];

interface CaseBoardProps {
  cases: CaseWithAdvisor[];
}

export function CaseBoard({ cases }: CaseBoardProps) {
  const { isHelpEnabled } = useExtraHelp();
  // Filter state
  const [activeSpecs, setActiveSpecs] = useState<string[]>(["All"]);
  const [clientType, setClientType] = useState("All Client Types");
  const [industry, setIndustry] = useState("All Industries");
  const [aumRange, setAumRange] = useState("Any AUM");
  const [region, setRegion] = useState("All Regions");
  const [stateFilter, setStateFilter] = useState("All States");
  const [formatFilter, setFormatFilter] = useState("All Formats");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [activeComplexity, setActiveComplexity] = useState<number[]>([1, 2, 3, 4, 5]);
  const [sort, setSort] = useState<SortOption>("meeting_date");
  const [selectedCase, setSelectedCase] = useState<CaseWithAdvisor | null>(null);

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
    setStateFilter("All States");
    setFormatFilter("All Formats");
    setDateRange("all");
    setActiveComplexity([1, 2, 3, 4, 5]);
  }

  // Filter + sort
  const filtered = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
    const endOfNextWeek = new Date(endOfWeek);
    endOfNextWeek.setDate(endOfWeek.getDate() + 7);

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
      // State
      if (stateFilter !== "All States" && c.state !== stateFilter) return false;
      // Meeting format
      if (formatFilter !== "All Formats") {
        const formatMap: Record<string, string> = { "In-Person": "in_person", "Zoom": "zoom", "Phone": "phone" };
        if (c.meeting_format !== formatMap[formatFilter]) return false;
      }
      // Date range
      if (dateRange !== "all") {
        const meetingDate = new Date(c.meeting_date + "T00:00:00");
        if (dateRange === "this_week" && (meetingDate < startOfWeek || meetingDate >= endOfWeek)) return false;
        if (dateRange === "next_week" && (meetingDate < endOfWeek || meetingDate >= endOfNextWeek)) return false;
      }
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
  }, [cases, activeSpecs, clientType, industry, aumRange, region, stateFilter, formatFilter, dateRange, activeComplexity, sort]);

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
          background: "var(--card-bg)",
          borderRight: "1px solid var(--card-border)",
          top: "65px",
          height: "calc(100vh - 65px)",
        }}
      >
        <SidebarTitle>Filters <InfoTooltip text="Filter cases by specialization, client type, industry, and more to find the right opportunities." /></SidebarTitle>

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

        <FilterGroup label="State">
          <FilterSelect options={STATES} value={stateFilter} onChange={setStateFilter} />
        </FilterGroup>

        <FilterGroup label="Meeting Format">
          <FilterSelect options={MEETING_FORMATS} value={formatFilter} onChange={setFormatFilter} />
        </FilterGroup>

        <FilterGroup label="Date Range">
          <div className="flex flex-wrap" style={{ gap: "6px" }}>
            {([["all", "All"], ["this_week", "This Week"], ["next_week", "Next Week"]] as const).map(([value, label]) => (
              <Chip key={value} active={dateRange === value} onClick={() => setDateRange(value)}>
                {label}
              </Chip>
            ))}
          </div>
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
                  color: activeComplexity.includes(n) ? "var(--text-on-brand)" : "var(--text-muted)",
                  background: activeComplexity.includes(n) ? "var(--coastal-600)" : "transparent",
                  border: `1px solid ${activeComplexity.includes(n) ? "var(--coastal-600)" : "var(--card-border)"}`,
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

        <div style={{ marginTop: "var(--space-5)", paddingTop: "var(--space-5)", borderTop: "1px solid var(--card-border)" }}>
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
              <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-primary)", fontWeight: 400 }}>
                {preset}
              </span>
            </div>
          ))}
        </div>
      </aside>

      {/* BOARD */}
      <main style={{ padding: "var(--space-6)" }}>
        {isHelpEnabled && <AnnotatedOverlay page="board" />}

        {/* Header with sort */}
        <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-5)" }}>
          <h2
            className="flex items-center"
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "var(--text-muted)",
              fontWeight: 500,
              gap: "12px",
            }}
          >
            Active Opportunities
            <span style={{ width: "80px", height: "1px", background: "var(--card-border)" }} />
          </h2>
          <select
            className="cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              color: "var(--text-secondary)",
              border: "1px solid var(--card-border)",
              padding: "8px 32px 8px 12px",
              background: "var(--card-bg)",
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
            border: "1px solid var(--card-border)",
            padding: "12px 20px",
            marginBottom: "var(--space-5)",
            gap: "12px",
          }}
        >
          <span style={{ width: "8px", height: "8px", background: "var(--coastal-600)", borderRadius: "50%", animation: "pulse 2s ease-in-out infinite" }} />
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--text-primary)", fontWeight: 500 }}>
            Joint Work Needed This Week <InfoTooltip text="These are upcoming meetings where advisors need collaboration support." />
          </span>
          <span className="ml-auto" style={{ fontFamily: "var(--font-display)", fontSize: "18px", color: "var(--coastal-600)", fontWeight: 400 }}>
            {newThisWeek} case{newThisWeek !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Results count */}
        {filtered.length !== cases.length && (
          <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)", marginBottom: "var(--space-4)" }}>
            Showing {filtered.length} of {cases.length} cases
          </div>
        )}

        {/* Card grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "16px" }}>
            {filtered.map((caseData) => (
              <CaseCard key={caseData.id} caseData={caseData} isNew={newCaseIds.has(caseData.id)} onClick={() => setSelectedCase(caseData)} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: "var(--space-9) var(--space-6)",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
              No matching cases
            </div>
            <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--text-muted)", maxWidth: "360px", lineHeight: 1.6 }}>
              Try adjusting your filters or check back later for new opportunities.
            </p>
            <button onClick={resetFilters} className="btn btn-outline btn-sm" style={{ marginTop: "var(--space-5)" }}>
              Reset Filters
            </button>
          </div>
        )}
      </main>

      <CaseDetailModal caseData={selectedCase} onClose={() => setSelectedCase(null)} />
    </div>
  );
}

// Sub-components (same visual style as before)
function SidebarTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center" style={{ fontFamily: "var(--font-ui)", fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: 500, marginBottom: "var(--space-5)", gap: "12px" }}>
      {children}
      <span style={{ flex: 1, height: "1px", background: "var(--card-border)" }} />
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "var(--space-5)" }}>
      <label className="block" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "var(--space-2)" }}>
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
        color: active ? "var(--text-on-brand)" : "var(--text-primary)",
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
        color: "var(--text-primary)",
        border: "1px solid var(--card-border)",
        background: "var(--card-bg)",
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
