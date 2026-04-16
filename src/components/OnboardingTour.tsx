"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LS_KEY_COMPLETED = "ac_tour_completed";
const LS_KEY_ROLE = "ac_user_role";

type UserRole = "ixp" | "exp" | null;

interface TourStep {
  title: string;
  description: string;
  ixpDescription?: string;
  expDescription?: string;
  action?: { label: string; href: string };
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to AdvisorConnect",
    description: "This platform matches you with joint work opportunities based on your expertise and availability.",
    ixpDescription: "Post your upcoming client meetings and get matched with experienced advisors who can help you close.",
    expDescription: "Browse upcoming meetings from junior advisors and swipe on the ones where your expertise fits.",
  },
  {
    title: "First, set up your profile",
    description: "Start by updating your profile with your specializations, licensed states, and availability. This is how we match you with the right cases.",
    action: { label: "Go to Profile \u2192", href: "/profile" },
  },
  {
    title: "Your Discover Feed",
    description: "Each card is an upcoming meeting that needs joint work support. Swipe right if you're interested, left to pass.",
    ixpDescription: "After posting a case, you'll see matches from senior advisors who want to collaborate with you.",
    expDescription: "Swipe through cases matched to your specializations and licensed states. Right = interested, left = pass.",
  },
  {
    title: "Meeting-First Cards",
    description: "Every card shows the meeting date, time, type, location, compensation split, and what expertise is needed. The date is always the headline.",
  },
  {
    title: "The Board View",
    description: "Prefer a list view? The Board shows all cases with filters for specialization, state, meeting format, and more.",
    ixpDescription: "Use the Board to browse all active cases and see who's interested in yours.",
    expDescription: "Power users love the Board \u2014 filter by state, date range, complexity, and meeting format.",
  },
  {
    title: "Advisor Directory",
    description: "Browse advisor profiles, see their stats (closing rate, joint work count, certifications), and connect directly via Calendly.",
  },
  {
    title: "You're all set!",
    description: "Start swiping to find your next collaboration. Good luck!",
    ixpDescription: "Post your first case and watch the matches roll in. Good luck!",
    expDescription: "Start swiping to find your next joint work opportunity. Good luck!",
  },
];

export function OnboardingTour() {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(-1); // -1 = role selection pre-step
  const [role, setRole] = useState<UserRole>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem(LS_KEY_COMPLETED);
    const savedRole = localStorage.getItem(LS_KEY_ROLE) as UserRole;
    if (savedRole) setRole(savedRole);
    if (!completed) {
      setTimeout(() => setShowPrompt(true), 1500);
    }
  }, []);

  function startTour() {
    setShowPrompt(false);
    setShow(true);
    setStep(role ? 0 : -1);
  }

  function selectRole(r: UserRole) {
    setRole(r);
    if (r) localStorage.setItem(LS_KEY_ROLE, r);
    setStep(0);
  }

  function next() {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else closeTour();
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else if (step === 0) setStep(-1);
  }

  function closeTour() {
    setShow(false);
    setShowPrompt(false);
    localStorage.setItem(LS_KEY_COMPLETED, "true");
  }

  function getDescription(s: TourStep): string {
    if (role === "ixp" && s.ixpDescription) return s.ixpDescription;
    if (role === "exp" && s.expDescription) return s.expDescription;
    return s.description;
  }

  // First-visit prompt
  if (showPrompt && !show) {
    return (
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "var(--coastal-900)",
          color: "var(--white)",
          padding: "16px 20px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
          zIndex: 300,
          maxWidth: "300px",
          animation: "tooltipFadeIn 400ms ease-out",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: "18px", marginBottom: "8px" }}>
          New to AdvisorConnect?
        </div>
        <p style={{ fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--coastal-300)", lineHeight: 1.5, marginBottom: "12px" }}>
          Take a quick tour to learn how the platform works.
        </p>
        <div className="flex" style={{ gap: "8px" }}>
          <button
            onClick={startTour}
            className="cursor-pointer"
            style={{
              padding: "8px 16px",
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              fontWeight: 500,
              background: "var(--coastal-600)",
              color: "var(--white)",
              border: "none",
            }}
          >
            Take the Tour
          </button>
          <button
            onClick={closeTour}
            className="cursor-pointer"
            style={{
              padding: "8px 16px",
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              background: "none",
              color: "var(--coastal-400)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  if (!show) return null;

  // Role selection pre-step
  if (step === -1) {
    return (
      <Overlay onClose={closeTour}>
        <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--coastal-900)", marginBottom: "var(--space-3)" }}>
            What&apos;s your role?
          </div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "14px", color: "var(--gray-500)", marginBottom: "var(--space-6)", lineHeight: 1.6 }}>
            We&apos;ll customize the tour based on how you use AdvisorConnect.
          </p>
          <div className="flex flex-col" style={{ gap: "var(--space-3)", maxWidth: "360px", margin: "0 auto" }}>
            <RoleButton
              title="I'm looking for joint work support"
              subtitle="Post cases, find senior partners to collaborate with"
              onClick={() => selectRole("ixp")}
            />
            <RoleButton
              title="I'm available to collaborate"
              subtitle="Browse cases, express interest, lend your expertise"
              onClick={() => selectRole("exp")}
            />
          </div>
          <button
            onClick={closeTour}
            className="cursor-pointer"
            style={{
              marginTop: "var(--space-5)",
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              color: "var(--gray-400)",
              background: "none",
              border: "none",
            }}
          >
            Skip Tour
          </button>
        </div>
      </Overlay>
    );
  }

  const currentStep = TOUR_STEPS[step];

  return (
    <Overlay onClose={closeTour}>
      <div style={{ padding: "var(--space-6)" }}>
        {/* Step indicator */}
        <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-5)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
          <button
            onClick={closeTour}
            className="cursor-pointer"
            style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", background: "none", border: "none" }}
          >
            Skip Tour
          </button>
        </div>

        <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--coastal-900)", marginBottom: "var(--space-3)", lineHeight: 1.15 }}>
          {currentStep.title}
        </div>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--gray-500)", lineHeight: 1.7, marginBottom: "var(--space-5)" }}>
          {getDescription(currentStep)}
        </p>

        {currentStep.action && (
          <button
            onClick={() => { closeTour(); router.push(currentStep.action!.href); }}
            className="btn btn-outline btn-sm"
            style={{ marginBottom: "var(--space-5)" }}
          >
            {currentStep.action.label}
          </button>
        )}

        {/* Progress dots */}
        <div className="flex items-center justify-center" style={{ gap: "6px", marginBottom: "var(--space-4)" }}>
          {TOUR_STEPS.map((_, i) => (
            <span
              key={i}
              style={{
                width: i === step ? "16px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === step ? "var(--coastal-600)" : "var(--gray-200)",
                transition: "all 200ms",
              }}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between">
          <button
            onClick={back}
            className="cursor-pointer"
            style={{
              padding: "10px 20px",
              fontFamily: "var(--font-ui)",
              fontSize: "13px",
              color: "var(--gray-500)",
              background: "none",
              border: "1px solid var(--gray-200)",
              opacity: step === 0 ? 0.4 : 1,
            }}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            onClick={next}
            className="cursor-pointer"
            style={{
              padding: "10px 24px",
              fontFamily: "var(--font-ui)",
              fontSize: "13px",
              fontWeight: 500,
              color: "var(--white)",
              background: "var(--coastal-600)",
              border: "none",
            }}
          >
            {step === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function Overlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{ background: "rgba(37,47,74,0.7)", zIndex: 300, backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        style={{
          background: "var(--white)",
          width: "480px",
          maxWidth: "95vw",
          boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          animation: "tooltipFadeIn 300ms ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function RoleButton({ title, subtitle, onClick }: { title: string; subtitle: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="cursor-pointer"
      style={{
        padding: "16px 20px",
        textAlign: "left",
        background: "var(--white)",
        border: "1px solid var(--gray-200)",
        transition: "all 200ms",
      }}
    >
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "14px", fontWeight: 500, color: "var(--coastal-900)", marginBottom: "4px" }}>
        {title}
      </div>
      <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)" }}>
        {subtitle}
      </div>
    </button>
  );
}

export function NewHereButton() {
  const [show, setShow] = useState(false);

  if (show) {
    return <OnboardingTourFromButton onClose={() => setShow(false)} />;
  }

  return (
    <button
      onClick={() => setShow(true)}
      className="cursor-pointer"
      style={{
        fontFamily: "var(--font-ui)",
        fontSize: "12px",
        color: "var(--coastal-400)",
        background: "none",
        border: "1px solid var(--gray-200)",
        padding: "6px 12px",
        transition: "all 200ms",
      }}
    >
      New here?
    </button>
  );
}

function OnboardingTourFromButton({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(-1);
  const [role, setRole] = useState<UserRole>(() => {
    if (typeof window === "undefined") return null;
    return (localStorage.getItem(LS_KEY_ROLE) as UserRole) || null;
  });

  useEffect(() => {
    if (role) setStep(0);
  }, [role]);

  function selectRole(r: UserRole) {
    setRole(r);
    if (r) localStorage.setItem(LS_KEY_ROLE, r);
    setStep(0);
  }

  function next() {
    if (step < TOUR_STEPS.length - 1) setStep(step + 1);
    else onClose();
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else if (step === 0 && !role) setStep(-1);
  }

  function getDescription(s: TourStep): string {
    if (role === "ixp" && s.ixpDescription) return s.ixpDescription;
    if (role === "exp" && s.expDescription) return s.expDescription;
    return s.description;
  }

  if (step === -1) {
    return (
      <Overlay onClose={onClose}>
        <div style={{ textAlign: "center", padding: "var(--space-6)" }}>
          <div style={{ fontFamily: "var(--font-display)", fontSize: "28px", color: "var(--coastal-900)", marginBottom: "var(--space-3)" }}>
            What&apos;s your role?
          </div>
          <p style={{ fontFamily: "var(--font-ui)", fontSize: "14px", color: "var(--gray-500)", marginBottom: "var(--space-6)", lineHeight: 1.6 }}>
            We&apos;ll customize the tour based on how you use AdvisorConnect.
          </p>
          <div className="flex flex-col" style={{ gap: "var(--space-3)", maxWidth: "360px", margin: "0 auto" }}>
            <RoleButton title="I'm looking for joint work support" subtitle="Post cases, find senior partners" onClick={() => selectRole("ixp")} />
            <RoleButton title="I'm available to collaborate" subtitle="Browse cases, express interest" onClick={() => selectRole("exp")} />
          </div>
          <button onClick={onClose} className="cursor-pointer" style={{ marginTop: "var(--space-5)", fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", background: "none", border: "none" }}>Cancel</button>
        </div>
      </Overlay>
    );
  }

  const currentStep = TOUR_STEPS[step];

  return (
    <Overlay onClose={onClose}>
      <div style={{ padding: "var(--space-6)" }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "var(--space-5)" }}>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--gray-400)", textTransform: "uppercase", letterSpacing: "1px" }}>
            Step {step + 1} of {TOUR_STEPS.length}
          </span>
          <button onClick={onClose} className="cursor-pointer" style={{ fontFamily: "var(--font-ui)", fontSize: "12px", color: "var(--gray-400)", background: "none", border: "none" }}>Close</button>
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "24px", color: "var(--coastal-900)", marginBottom: "var(--space-3)", lineHeight: 1.15 }}>{currentStep.title}</div>
        <p style={{ fontFamily: "var(--font-body-serif)", fontSize: "15px", color: "var(--gray-500)", lineHeight: 1.7, marginBottom: "var(--space-5)" }}>{getDescription(currentStep)}</p>
        {currentStep.action && (
          <button onClick={() => { onClose(); router.push(currentStep.action!.href); }} className="btn btn-outline btn-sm" style={{ marginBottom: "var(--space-5)" }}>{currentStep.action.label}</button>
        )}
        <div className="flex items-center justify-center" style={{ gap: "6px", marginBottom: "var(--space-4)" }}>
          {TOUR_STEPS.map((_, i) => (
            <span key={i} style={{ width: i === step ? "16px" : "6px", height: "6px", borderRadius: "3px", background: i === step ? "var(--coastal-600)" : "var(--gray-200)", transition: "all 200ms" }} />
          ))}
        </div>
        <div className="flex justify-between">
          <button onClick={back} disabled={step === 0} className="cursor-pointer" style={{ padding: "10px 20px", fontFamily: "var(--font-ui)", fontSize: "13px", color: "var(--gray-500)", background: "none", border: "1px solid var(--gray-200)", opacity: step === 0 ? 0.4 : 1 }}>Back</button>
          <button onClick={next} className="cursor-pointer" style={{ padding: "10px 24px", fontFamily: "var(--font-ui)", fontSize: "13px", fontWeight: 500, color: "var(--white)", background: "var(--coastal-600)", border: "none" }}>{step === TOUR_STEPS.length - 1 ? "Get Started" : "Next"}</button>
        </div>
      </div>
    </Overlay>
  );
}
