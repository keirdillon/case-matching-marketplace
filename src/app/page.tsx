import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { StatsBar } from "@/components/StatsBar";
import { FilterSidebar } from "@/components/FilterSidebar";
import { CaseCard } from "@/components/CaseCard";
import { CtaDark } from "@/components/CtaDark";
import { Footer } from "@/components/Footer";
import { getActiveCases } from "@/lib/queries";
import { MOCK_CASES } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function CaseBoardPage() {
  const liveCases = await getActiveCases();
  const cases = liveCases.length > 0 ? liveCases : MOCK_CASES;

  // Count cases created in the last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const newThisWeek = cases.filter(
    (c) => new Date(c.created_at) >= oneWeekAgo
  ).length;
  return (
    <>
      <Nav />
      <Hero />
      <StatsBar />

      <div
        className="grid mx-auto"
        style={{
          gridTemplateColumns: "280px 1fr",
          maxWidth: "1400px",
          minHeight: "80vh",
        }}
      >
        <FilterSidebar />

        <main style={{ padding: "var(--space-6)" }}>
          {/* Board header */}
          <div
            className="flex justify-between items-center"
            style={{ marginBottom: "var(--space-5)" }}
          >
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
              <span
                style={{
                  width: "80px",
                  height: "1px",
                  background: "var(--gray-200)",
                }}
              />
            </h2>
            <select
              className="cursor-pointer"
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "12px",
                color: "var(--gray-500)",
                border: "1px solid var(--gray-200)",
                padding: "8px 32px 8px 12px",
                background: "var(--white)",
                appearance: "none",
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23a3a3a3' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 10px center",
                outline: "none",
              }}
            >
              <option>Newest First</option>
              <option>Meeting Date (Soonest)</option>
              <option>Complexity (Highest)</option>
              <option>Best Match</option>
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
            <span
              style={{
                width: "8px",
                height: "8px",
                background: "var(--coastal-600)",
                borderRadius: "50%",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-ui)",
                fontSize: "13px",
                color: "var(--coastal-800)",
                fontWeight: 500,
              }}
            >
              New This Week
            </span>
            <span
              className="ml-auto"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "18px",
                color: "var(--coastal-600)",
                fontWeight: 400,
              }}
            >
              {newThisWeek} new case{newThisWeek !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Card grid */}
          <div
            className="grid grid-cols-1 lg:grid-cols-2"
            style={{ gap: "16px" }}
          >
            {cases.map((caseData, i) => (
              <CaseCard
                key={caseData.id}
                caseData={caseData}
                isNew={i < 3}
              />
            ))}
          </div>
        </main>
      </div>

      <CtaDark />
      <Footer />
    </>
  );
}
