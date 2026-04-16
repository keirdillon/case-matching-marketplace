"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { BaseballCard, BaseballCardModal } from "@/components/BaseballCard";
import type { BaseballCardAdvisor } from "@/components/BaseballCard";
import { useExtraHelp } from "@/components/ExtraHelpProvider";

const REGIONS = ["All Regions", "South Florida", "Central Florida", "Tampa Bay", "Georgia"];
const STATES = ["All States", "FL", "GA", "NY", "NJ", "CT", "TX", "NC", "SC", "AL"];

export function DirectoryGrid({ advisors }: { advisors: BaseballCardAdvisor[] }) {
  const { isHelpEnabled } = useExtraHelp();
  const [tab, setTab] = useState<"senior" | "all">("senior");
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("All Regions");
  const [stateFilter, setStateFilter] = useState("All States");
  const [selectedAdvisor, setSelectedAdvisor] = useState<BaseballCardAdvisor | null>(null);

  const filtered = useMemo(() => {
    return advisors.filter((a) => {
      if (tab === "senior" && a.role !== "senior") return false;
      if (search && !a.full_name.toLowerCase().includes(search.toLowerCase())) return false;
      if (region !== "All Regions" && a.region !== region) return false;
      if (stateFilter !== "All States" && !a.licensed_states.includes(stateFilter)) return false;
      return true;
    });
  }, [advisors, tab, search, region, stateFilter]);

  const seniorCount = advisors.filter((a) => a.role === "senior").length;

  return (
    <div style={{ minHeight: "calc(100vh - 65px)" }}>
      {/* Header */}
      <div
        style={{
          background: "var(--sand-100)",
          padding: "var(--space-7) var(--space-6)",
          borderBottom: "1px solid var(--gray-200)",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="overline" style={{ marginBottom: "var(--space-4)" }}>
            Advisor Directory
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(28px, 3vw, 40px)",
              color: "var(--text-primary)",
              fontWeight: 400,
              lineHeight: 1.1,
              marginBottom: "var(--space-5)",
            }}
          >
            {seniorCount} Senior Advisors <em style={{ fontStyle: "italic", color: "var(--coastal-600)" }}>Available</em>
          </h1>

          {isHelpEnabled && (
            <div style={{ marginBottom: "var(--space-4)", padding: "8px 12px", background: "var(--coastal-100)", borderLeft: "2px solid var(--coastal-600)", fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--coastal-600)", lineHeight: 1.4 }}>
              Browse advisor profiles. Verified (&#10003;) = above-average production &amp; closing rate. Platinum = top tier, Gold = high performer. Closing rate = % of prospects that become clients.
            </div>
          )}

          {/* Tabs */}
          <div className="flex" style={{ gap: "var(--space-4)", marginBottom: "var(--space-5)" }}>
            {(["senior", "all"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="cursor-pointer"
                style={{
                  fontFamily: "var(--font-ui)",
                  fontSize: "13px",
                  padding: "8px 20px",
                  background: tab === t ? "#252f4a" : "var(--card-bg)",
                  color: tab === t ? "var(--text-on-brand)" : "var(--text-secondary)",
                  border: `1px solid ${tab === t ? "#252f4a" : "var(--card-border)"}`,
                  fontWeight: 500,
                  transition: "all 200ms",
                }}
              >
                {t === "senior" ? "Senior Advisors" : "All Advisors"}
              </button>
            ))}
          </div>

          {/* Filters row */}
          <div className="flex flex-wrap items-center" style={{ gap: "var(--space-3)" }}>
            <input
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "10px 14px",
                fontFamily: "var(--font-ui)",
                fontSize: "13px",
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                width: "220px",
                outline: "none",
              }}
            />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="cursor-pointer"
              style={{
                padding: "10px 32px 10px 12px",
                fontFamily: "var(--font-ui)",
                fontSize: "13px",
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                appearance: "none",
                outline: "none",
              }}
            >
              {REGIONS.map((r) => <option key={r}>{r}</option>)}
            </select>
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="cursor-pointer"
              style={{
                padding: "10px 32px 10px 12px",
                fontFamily: "var(--font-ui)",
                fontSize: "13px",
                border: "1px solid var(--input-border)",
                background: "var(--input-bg)",
                color: "var(--text-primary)",
                appearance: "none",
                outline: "none",
              }}
            >
              {STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            <span style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
              {filtered.length} advisor{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "var(--space-6)" }}>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "16px" }}>
            {filtered.map((advisor) => (
              <Link
                key={advisor.id}
                href={`/directory/${advisor.id}`}
                style={{ textDecoration: "none", color: "inherit" }}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAdvisor(advisor);
                }}
              >
                <BaseballCard advisor={advisor} variant="compact" />
              </Link>
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center"
            style={{
              padding: "var(--space-9)",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              textAlign: "center",
            }}
          >
            <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--text-primary)", marginBottom: "var(--space-3)" }}>
              No advisors found
            </div>
            <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--text-muted)" }}>
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </div>

      <BaseballCardModal advisor={selectedAdvisor} onClose={() => setSelectedAdvisor(null)} />
    </div>
  );
}
