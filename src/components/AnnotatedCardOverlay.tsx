"use client";

import { useExtraHelp } from "@/components/ExtraHelpProvider";

interface Annotation {
  number: number;
  label: string;
  description: string;
}

const DISCOVER_ANNOTATIONS: Annotation[] = [
  { number: 1, label: "Date & Time", description: "When this client meeting is scheduled. Swipe on cases that fit your calendar." },
  { number: 2, label: "Sales Stage Pipeline", description: "Shows where this meeting falls in the sales process. Stage 1 is first contact, Stage 4 is closing the deal." },
  { number: 3, label: "Meeting Type Badge", description: "The specific type of meeting. Uses Coastal Wealth terminology \u2014 Opening Meeting, Discovery, Strategy Session, or Closing Meeting." },
  { number: 4, label: "Compensation Split", description: "Your split for participating in this joint work. This is standardized \u2014 no negotiation needed. 50/50 means equal split of any revenue generated." },
  { number: 5, label: "Location / Format", description: "Where the meeting happens. \uD83D\uDCCD = in-person at this address. \uD83D\uDCBB = Zoom video call. \uD83D\uDCDE = phone call." },
  { number: 6, label: "State", description: "The state where this client is located. You'll only see cases in states where you're licensed." },
  { number: 7, label: "Client Summary", description: "An anonymized description of the client and what the meeting is about. No real names or personal info are shared \u2014 just enough context to decide if you're a good fit." },
  { number: 8, label: "Specialization Tags", description: "The areas of expertise needed for this case. These are matched against your profile specializations." },
  { number: 9, label: "Advisor Name", description: "The advisor who posted this case. Click their name to see their full profile \u2014 stats, experience, certifications, and contact info." },
  { number: 10, label: "Complexity Dots", description: "A 1\u20135 scale of case difficulty. 1 dot = routine. 3 dots = moderate complexity. 5 dots = enterprise-grade, likely needs a team approach." },
  { number: 11, label: "AUM Range", description: "Assets Under Management \u2014 the size of the client's investable portfolio. Higher AUM generally means more complex planning needs." },
  { number: 12, label: "Swipe Right (\u2713)", description: "Express interest in this case. The posting advisor will see your profile and can accept or decline the match." },
  { number: 13, label: "Swipe Left (\u2717)", description: "Pass on this case. It won't appear again. You can reset your swipes anytime with the Reset Demo button." },
];

const BOARD_ANNOTATIONS: Annotation[] = [
  { number: 1, label: "Filter Sidebar", description: "Narrow down cases by specialization, client type, industry, AUM, region, state, meeting format, and date range." },
  { number: 2, label: "Sort Dropdown", description: "Change the order of cases. 'Meeting Date' shows soonest first. 'Newest' shows recently posted. 'Complexity' shows hardest first." },
  { number: 3, label: "Joint Work Needed Banner", description: "Shows how many cases need collaboration support this week. These are real upcoming meetings that need your expertise." },
  { number: 4, label: "Case Cards", description: "Each card represents an upcoming meeting. The date/time is always the headline. Click any card for full details." },
  { number: 5, label: "Sales Pipeline", description: "Stage 1\u20134 are prospect meetings (first contact through closing). 'Existing Client' means it's an annual review or similar." },
];

const POSTS_ANNOTATIONS: Annotation[] = [
  { number: 1, label: "Status Badges", description: "Active = accepting interest from advisors. Matched = someone's been paired with you. Closed = the case is done." },
  { number: 2, label: "Complexity Dots", description: "The difficulty rating you set when posting. Helps senior advisors gauge the scope of work." },
  { number: 3, label: "Posted Date vs Meeting Date", description: "'Posted Apr 9' is when you created the case. 'Meeting Apr 18' is when the client meeting happens. Advisors filter by meeting date." },
  { number: 4, label: "Interest Count", description: "Shows how many senior advisors have swiped right on your case. More interest = more options to choose from." },
];

const DIRECTORY_ANNOTATIONS: Annotation[] = [
  { number: 1, label: "Verified Badge (\u2713)", description: "Verified advisors have above-average production and closing rates at Coastal Wealth. They're proven performers." },
  { number: 2, label: "Production Levels", description: "Platinum = top tier producer. Gold = high performer. Silver = solid contributor. Bronze = building their book." },
  { number: 3, label: "Closing Rate", description: "The percentage of prospects that become clients. A 78% closing rate means 78 out of 100 prospects sign on." },
  { number: 4, label: "Total Joint Work", description: "Lifetime count of cases this advisor has collaborated on. Higher numbers = more joint work experience." },
  { number: 5, label: "Reaching Out", description: "Click any advisor card to see their full profile. Use the Calendly link or phone number to connect directly." },
];

const PROFILE_ANNOTATIONS: Annotation[] = [
  { number: 1, label: "Licensed States", description: "Critical \u2014 you'll only see cases in states where you're licensed. Missing a state means missing opportunities." },
  { number: 2, label: "Specializations", description: "We match you with cases that need your areas of expertise. More specializations = more case matches in your Discover feed." },
  { number: 3, label: "Mentorship Styles", description: "Tells other advisors what kind of joint work you prefer \u2014 co-attending meetings, strategy calls, case reviews, etc." },
  { number: 4, label: "Keep It Updated", description: "Your profile drives all matching. An outdated profile means missed opportunities. Review it monthly." },
];

type AnnotationSet = "discover" | "board" | "posts" | "directory" | "profile";

const ANNOTATION_SETS: Record<AnnotationSet, Annotation[]> = {
  discover: DISCOVER_ANNOTATIONS,
  board: BOARD_ANNOTATIONS,
  posts: POSTS_ANNOTATIONS,
  directory: DIRECTORY_ANNOTATIONS,
  profile: PROFILE_ANNOTATIONS,
};

export function AnnotatedOverlay({ page }: { page: AnnotationSet }) {
  const { isHelpEnabled, toggleHelp } = useExtraHelp();

  if (!isHelpEnabled) return null;

  const annotations = ANNOTATION_SETS[page];

  return (
    <div
      style={{
        background: "var(--card-bg)",
        border: "1px solid var(--card-border)",
        padding: "var(--space-5)",
        marginBottom: "var(--space-5)",
      }}
    >
      <div className="flex justify-between items-center" style={{ marginBottom: "var(--space-4)" }}>
        <div className="flex items-center" style={{ gap: "8px" }}>
          <span
            style={{
              width: "24px",
              height: "24px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--coastal-600)",
              color: "#ffffff",
              fontFamily: "var(--font-ui)",
              fontSize: "12px",
              fontWeight: 600,
              borderRadius: "50%",
            }}
          >
            ?
          </span>
          <span style={{ fontFamily: "var(--font-ui)", fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
            {page === "discover" ? "Card Guide" : page === "board" ? "Board Guide" : page === "posts" ? "My Posts Guide" : page === "directory" ? "Directory Guide" : "Profile Guide"}
          </span>
        </div>
        <button
          onClick={toggleHelp}
          className="cursor-pointer"
          style={{
            padding: "6px 16px",
            fontFamily: "var(--font-ui)",
            fontSize: "12px",
            fontWeight: 500,
            color: "var(--text-on-brand)",
            background: "var(--coastal-600)",
            border: "none",
          }}
        >
          Got it!
        </button>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "8px",
        }}
      >
        {annotations.map((a) => (
          <div
            key={a.number}
            className="flex"
            style={{
              gap: "10px",
              padding: "8px 12px",
              background: "var(--hover-bg)",
              animation: `tooltipFadeIn ${200 + a.number * 50}ms ease-out`,
            }}
          >
            <span
              style={{
                width: "22px",
                height: "22px",
                minWidth: "22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--coastal-600)",
                color: "#ffffff",
                fontFamily: "var(--font-ui)",
                fontSize: "11px",
                fontWeight: 600,
                borderRadius: "50%",
              }}
            >
              {a.number}
            </span>
            <div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "12px", fontWeight: 500, color: "var(--text-primary)", marginBottom: "2px" }}>
                {a.label}
              </div>
              <div style={{ fontFamily: "var(--font-ui)", fontSize: "11px", color: "var(--text-secondary)", lineHeight: 1.45 }}>
                {a.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
