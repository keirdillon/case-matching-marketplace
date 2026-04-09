export function CtaDark() {
  return (
    <section
      className="relative overflow-hidden text-center"
      style={{
        background: "var(--coastal-900)",
        padding: "var(--space-9) var(--space-8)",
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(107,149,186,0.1) 0%, transparent 60%)",
        }}
      />
      <h2
        className="relative z-10"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(32px, 4vw, 52px)",
          color: "var(--white)",
          lineHeight: 1.06,
          letterSpacing: "-0.015em",
          fontWeight: 400,
          marginBottom: "var(--space-4)",
        }}
      >
        Your expertise is someone&apos;s{" "}
        <em style={{ fontStyle: "italic", color: "var(--coastal-400)" }}>
          breakthrough
        </em>
      </h2>
      <p
        className="relative z-10 mx-auto"
        style={{
          fontFamily: "var(--font-body-serif)",
          fontSize: "17px",
          color: "rgba(255,255,255,0.4)",
          maxWidth: "500px",
          lineHeight: 1.7,
          fontWeight: 300,
          marginBottom: "var(--space-6)",
        }}
      >
        Set up your senior advisor profile once and get matched with
        collaboration opportunities that fit your specialization.
      </p>
      <div
        className="relative z-10 flex flex-wrap justify-center items-center"
        style={{ gap: "var(--space-3)" }}
      >
        <button className="btn btn-accent">Create Senior Profile</button>
        <button className="btn btn-ghost" style={{ color: "var(--coastal-400)" }}>
          Learn More
        </button>
      </div>
    </section>
  );
}
