export function Footer() {
  return (
    <footer
      style={{
        background: "var(--coastal-900)",
        padding: "var(--space-7) var(--space-8) var(--space-5)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div
        className="flex justify-between items-center mx-auto"
        style={{ maxWidth: "1200px" }}
      >
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "18px",
            color: "rgba(255,255,255,0.3)",
            fontWeight: 400,
          }}
        >
          Coastal Wealth
        </span>
        <span
          style={{
            fontFamily: "var(--font-ui)",
            fontSize: "11px",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          AdvisorConnect &mdash; Internal Use Only &mdash; &copy; 2026 Coastal
          Wealth. All rights reserved.
        </span>
      </div>
    </footer>
  );
}
