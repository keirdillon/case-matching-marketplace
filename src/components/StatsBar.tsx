const STATS = [
  { num: "156", label: "Cases Matched" },
  { num: "42", label: "Active Mentors" },
  { num: "68%", label: "Close Rate Lift" },
  { num: "<24h", label: "Avg. Time to Match" },
];

export function StatsBar() {
  return (
    <div
      className="grid grid-cols-2 md:grid-cols-4"
      style={{
        borderBottom: "1px solid var(--gray-200)",
        background: "var(--white)",
      }}
    >
      {STATS.map((stat, i) => (
        <div
          key={stat.label}
          className="text-center"
          style={{
            padding: "var(--space-5) var(--space-6)",
            borderRight: i < STATS.length - 1 ? "1px solid var(--gray-200)" : "none",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "36px",
              color: "var(--coastal-900)",
              lineHeight: 1,
              marginBottom: "var(--space-1)",
              fontWeight: 400,
            }}
          >
            {stat.num}
          </div>
          <div
            style={{
              fontFamily: "var(--font-ui)",
              fontSize: "11px",
              color: "var(--gray-400)",
              fontWeight: 400,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}
