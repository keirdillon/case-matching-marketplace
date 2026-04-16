# AdvisorConnect — The Case Board v2.0

## What This Is

AdvisorConnect is an internal advisor collaboration and case-matching platform for Coastal Wealth (350+ advisors across Florida and Georgia). Advisors post upcoming client meetings that need joint work support, and experienced colleagues browse, swipe, and opt in to co-work on those cases. The signature UX is a Tinder-style swipe deck — but the platform also includes a filterable board view, advisor baseball cards, Calendly-powered scheduling, manager workflows, and a browsable advisor directory.

This is **internal only** — built for Coastal Wealth advisors and managers. Not a SaaS product for sale.

**Core insight from stakeholder feedback:** The swipe experience (Discover) should be the **default landing view**, not buried in nav. The board is the secondary "power user" view. Make it fun, fast, and frictionless.

---

## Key Documents

- `docs/AdvisorConnect_PRD_v1.docx` — Original PRD (v1 reference, some specs superseded by v2 feedback below)
- `docs/AdvisorConnect-CaseBoard-v1.html` — v1 HTML design prototype (Coastal Precision design system reference)
- `docs/coastal-precision-design-system.md` — Coastal Wealth Design System v6 documentation
- `docs/coastal-precision-tokens.css` — CSS custom properties for all design tokens
- `docs/coastal-precision-tokens.json` — JSON design tokens

---

## Tech Stack

- **Framework:** Next.js 16+ (App Router)
- **Styling:** Tailwind CSS + CSS custom properties from Coastal Precision tokens
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel
- **Repo:** GitHub (`keirdillon/case-matching-marketplace`)
- **Language:** TypeScript
- **Calendar:** Calendly API integration (Phase 2)

---

## Coastal Wealth Brand Requirements

- **Display font:** Marlide Display Variable via Adobe Typekit (`<link rel="stylesheet" href="https://use.typekit.net/tpw8nnl.css">`). CSS: `'marlide-display-variable', 'Playfair Display', Georgia, serif`
- **Body serif:** `'Source Serif 4', Georgia, serif`
- **UI sans:** `'DM Sans', -apple-system, sans-serif`
- **Color tokens:** Use Coastal Precision CSS variables. Key: `--coastal-900: #252f4a`, `--coastal-600: #6b95ba`, `--sand-100: #faf7f2`
- **Design patterns:** Overline with 24px rule. Card hover with gradient top-border. Button lift + shadow on hover. Sharp edges (no border-radius on cards/buttons per brand).

---

## V2 Architecture Changes

### Updated Database Schema

**advisors** — Enhanced with licensing, stats, and background
- id (uuid, PK)
- email (text, unique)
- full_name (text)
- avatar_url (text, nullable)
- years_experience (int)
- role (enum: 'junior', 'mid', 'senior', 'manager')
- region (text)
- office (text, nullable)
- is_senior_profile_active (boolean, default false)
- bio (text, nullable, max 500 chars)
- availability_status (enum: 'active', 'paused')
- mentorship_styles (text[])
- notification_preferences (jsonb)
- **licensed_states (text[])** — Array of state abbreviations where advisor is licensed (e.g., ['FL', 'GA', 'NY'])
- **production_level (text, nullable)** — e.g., 'Platinum', 'Gold', 'Silver', 'Bronze'
- **closing_rate (decimal, nullable)** — Percentage, e.g., 0.72 for 72%
- **avg_appointments_per_week (int, nullable)** — Average weekly appointments
- **education (text, nullable)** — School and degree
- **certifications (text[], default '{}')** — e.g., ['CFP', 'ChFC', 'CLU', 'CIMA']
- **joined_date (date, nullable)** — When they joined Coastal Wealth
- **total_joint_work_completed (int, default 0)** — Lifetime joint work count
- **calendly_url (text, nullable)** — Calendly scheduling link
- **phone (text, nullable)** — Contact phone
- **verified (boolean, default false)** — Blue-check verified status for high performers
- created_at, updated_at (timestamptz)

**cases** — Enhanced with scheduling details and splits
- id (uuid, PK)
- poster_id (uuid, FK → advisors)
- title (text, max 60 chars)
- client_type (text)
- industry (text[])
- aum_range (text)
- meeting_type (text) — **Use Coastal Wealth internal verbiage: 'Opening Meeting', 'Discovery', 'Strategy Session', 'Closing Meeting', 'Annual Review', 'Complex Case Review', 'Estate/Trust Discussion', 'Insurance Review'**
- complexity (int, 1-5)
- region (text)
- **state (text)** — Two-letter state abbreviation (e.g., 'FL', 'GA')
- meeting_date (date)
- **meeting_time (time, nullable)** — Time of the meeting
- **meeting_location (text, nullable)** — Physical address or 'Zoom' or 'Phone'
- **meeting_format (enum: 'in_person', 'zoom', 'phone')** — How the meeting happens
- needs (text[])
- additional_context (text, nullable, max 300 chars)
- **compensation_split (text, default '50/50')** — The split displayed on every card. Standardized, not negotiable.
- **client_summary (text, nullable, max 500 chars)** — Anonymized recap of who the client is and what the meeting looks like
- status (enum: 'active', 'matched', 'closed', 'expired')
- created_at, updated_at (timestamptz)

**matches** — Same as v1
- id, case_id, senior_advisor_id, status, decline_reason, created_at, updated_at

**swipe_history** — New table to track passes (left swipes) separately from matches
- id (uuid, PK)
- case_id (uuid, FK → cases)
- advisor_id (uuid, FK → advisors)
- action (enum: 'pass', 'interested')
- created_at (timestamptz)

**manager_assignments** — New table for manager push workflow
- id (uuid, PK)
- manager_id (uuid, FK → advisors)
- case_id (uuid, FK → cases)
- assigned_advisor_id (uuid, FK → advisors)
- message (text, nullable) — "Hey, I think this is good for you"
- status (enum: 'pending', 'accepted', 'declined')
- created_at, updated_at (timestamptz)

**All other tables** (tags, advisor_tags, case_tags, feedback) remain the same.

---

### Updated Routes

```
/                    → Discover (Tinder swipe deck) — DEFAULT LANDING PAGE
/board               → Case Board (filterable feed — power user view)
/post                → Post a Case (modal or page)
/case/[id]           → Case detail view
/posts               → My posted cases
/matches             → My matches (as poster and as senior)
/directory           → Advisor directory — browse all senior + junior profiles
/directory/[id]      → Individual advisor "baseball card" profile
/profile             → My profile setup/edit
/admin               → Admin dashboard (Phase 3)
```

---

## V2 Feature Specifications

### 1. DISCOVER VIEW (Default Landing — `/`)

The Tinder-style swipe deck is the **primary experience**. This is what loads when you open AdvisorConnect.

**Layout:**
- Full-screen dark background (coastal-900) with radial gradient glow
- Single card centered on screen, stacked depth effect (shadow cards behind)
- Large swipe buttons below: red X (pass) and green checkmark (interested)
- Toggle in top-right to switch to "Board View" (small, subtle — not competing with the cards)
- Counter showing "3 of 12 opportunities this week"

**Card redesign — Meeting-first hierarchy:**
The card headline is NO LONGER the case title. The new hierarchy is:
1. **Date + Time** (biggest text) — "Thursday, April 18 · 2:00 PM"
2. **Meeting type** — "Opening Meeting" (use Coastal Wealth verbiage)
3. **Meeting format + location** — "Zoom" or "Tampa Main Office" or "123 Main St, Miami"
4. **State badge** — "FL" in a small tag (critical for licensing filter)
5. **Compensation split** — "50/50 Split" in a visible badge
6. **Client summary** — Anonymized 2-3 sentence description
7. **Specialization tags** — What expertise is needed
8. **Poster info** — Click to open their baseball card
9. **Complexity dots** — Visual indicator
10. **AUM range tag**

**Swipe behavior:**
- Drag right → "INTERESTED" stamp appears → releases past threshold → match record inserted + card flies off
- Drag left → "PASS" stamp appears → releases past threshold → swipe_history record inserted + card flies off
- Card tilts with drag (rotation = drag distance * 0.08)
- Spring-back animation if released under threshold
- Desktop: click buttons as alternative to dragging

**Filtering logic:**
- Only show cases in states where the current advisor is licensed
- Only show cases where at least one specialization tag overlaps with the advisor's tags
- Exclude cases already swiped (check swipe_history table)
- Sort by meeting date (soonest first — "this week's opportunities")

**Reset Demo button:** Small ghost button at the bottom: "Reset Demo" — clears swipe_history and matches for current user. Remove before production launch.

---

### 2. CASE BOARD VIEW (`/board`)

The power-user filterable feed. Secondary to Discover but important for managers and detail-oriented advisors.

**Header change:** Replace "New This Week" with **"Joint Work Needed This Week"** — framed as appointments needing coverage, organized by date.

**Card redesign — same meeting-first hierarchy as Discover cards:**
- Date + time as the card headline
- Meeting type below
- Location/format + state
- Compensation split badge
- Client summary
- Specialization tags
- Poster avatar (clickable → baseball card)
- Complexity dots

**Filters remain:** Specialization, client type, industry, AUM, region, complexity — plus NEW:
- **State filter** — Filter by state
- **Meeting format filter** — In-person / Zoom / Phone
- **This week / Next week / All** — Date range quick filter

**Sort options:** Date soonest (default), newest posted, complexity highest, best match

---

### 3. BASEBALL CARD PROFILES (`/directory` and `/directory/[id]`)

Every advisor gets a "baseball card" — a rich profile page that pops up when you click on any advisor name anywhere in the app.

**Baseball card contains:**
- **Header:** Full name, title, office location, region
- **Photo** (or avatar with initials)
- **Verified badge** (blue checkmark for top performers)
- **Stats grid** (4 columns, Marlide Display numbers, gray-400 labels):
  - Years of experience
  - Closing rate (percentage)
  - Avg appointments/week
  - Total joint work completed
- **Production level badge** — Platinum / Gold / Silver / Bronze
- **Certifications row** — CFP, ChFC, CLU, etc. as tags
- **Licensed states** — Tag row showing all states
- **Specialization tags** — What they're expert in
- **Industries** — What industries they know
- **Bio** — Serif italic, Source Serif 4
- **Mentorship style** — What kind of joint work they prefer
- **Education** — School, degree
- **Contact** — Phone, email, Calendly link (if available)
- **Availability status** — Active / Paused toggle indicator
- **Joined Coastal Wealth** — Date

**Directory page (`/directory`):**
- Grid of advisor cards (smaller versions of the baseball card)
- Filter by: role (senior/junior/mid), region, specialization, state
- Search by name
- Two tabs: "Senior Advisors" and "All Advisors"
- Verified advisors appear first
- Show total count: "87 Senior Advisors Available"

**Click-through:** Clicking any advisor name ANYWHERE in the app (on a case card, in the match view, on the board) opens their full baseball card as a modal or navigates to `/directory/[id]`.

---

### 4. CASE POSTING FLOW (Updated)

**Updated fields:**
- Case title (free text, 60 char max)
- **Meeting date** (date picker) — REQUIRED, prominent
- **Meeting time** (time picker) — REQUIRED
- **Meeting format** (radio: In-Person / Zoom / Phone) — REQUIRED
- **Meeting location** (conditional — shows text field if In-Person, auto-fills "Zoom" or "Phone")
- **State** (dropdown, 2-letter abbreviation) — REQUIRED, auto-populated from advisor profile
- **Meeting type** (dropdown with Coastal Wealth verbiage) — REQUIRED
  - Opening Meeting
  - Discovery
  - Strategy Session
  - Closing Meeting
  - Annual Review
  - Complex Case Review
  - Estate/Trust Discussion
  - Insurance Review
- Client type (dropdown)
- Industry (multi-select chips)
- AUM range (dropdown)
- Specialization needed (multi-select chips)
- Complexity (1-5 visual selector)
- What I'm looking for (multi-select chips)
- **Client summary** (free text, 500 char max) — "Describe the client and what the meeting will look like. No names or PII."
- **Compensation split** (dropdown, default "50/50") — Options: 50/50, 60/40, 70/30, Referral Fee, To Be Discussed
- Additional context (free text, 300 char max)
- Compliance disclaimer

---

### 5. MANAGER WORKFLOW

Managers (role = 'manager') get additional capabilities:

- **Push to advisor:** On any case card, managers see a "Suggest to Advisor" button. Click opens a modal where they select an advisor from a dropdown and add an optional message: "Hey, I think this is good for you. Want it?"
- **This creates a manager_assignments record.** The assigned advisor sees it as a notification/highlight in their Discover deck or board.
- **Dashboard view:** Managers can see all cases in their region, who's been assigned, and match status.

---

### 6. CALENDLY INTEGRATION (Phase 2 — Stub for Now)

The vision: Pull availability from advisors' Calendly links to show who's free at a given meeting time.

**For now (v2):**
- Add a `calendly_url` field to advisor profiles
- Display a "Check Availability" button on the baseball card that opens their Calendly link in a new tab
- On case cards, show a "Schedule Joint Work" button that opens a simple time-slot picker (static UI for now, functional integration later)

**Future (v3):**
- Calendly API integration to pull real availability
- Auto-match by time slot: "Thursday 7pm — 3 advisors available"
- One-click confirm that adds to both calendars

---

### 7. STATE LICENSING SYSTEM

**Critical compliance feature.** Advisors should only see cases in states where they are licensed.

- `licensed_states` field on advisor profile (multi-select of US states)
- `state` field on every case
- **Discover deck auto-filters:** Only shows cases in advisor's licensed states
- **Board view:** State filter dropdown, but also visual indicator if a case is outside your licensed states (grayed out with "Not licensed" badge)
- **Profile setup:** Licensed states is a required field during onboarding

---

### 8. UPDATED SEED DATA

Update all seed data to include the new fields. Every case needs:
- meeting_time
- meeting_format
- meeting_location
- state
- compensation_split
- client_summary

Every advisor needs:
- licensed_states
- production_level
- closing_rate
- avg_appointments_per_week
- education
- certifications
- joined_date
- total_joint_work_completed

Create realistic, varied seed data. At least 14 cases (we already have 14) and 12 advisors (6 junior/mid, 6 senior). Add 2 manager accounts.

---

## Meeting Type Verbiage — IMPORTANT

Use ONLY these terms (confirmed with Coastal Wealth field team):

| Internal Term | What It Means |
|---|---|
| Opening Meeting | First meeting with a prospect |
| Discovery | Deep-dive into client's financial situation |
| Strategy Session | Presenting a financial plan or strategy |
| Closing Meeting | Asking for the business / signing paperwork |
| Annual Review | Existing client yearly check-in |
| Complex Case Review | Multi-dimensional planning case |
| Estate/Trust Discussion | Estate planning specific meeting |
| Insurance Review | Insurance-focused meeting |

**NOTE:** Before finalizing, confirm these terms with James, Roy, or Noah at Coastal Wealth. The verbiage matters — advisors will reject the tool if the language feels off.

---

## UX Principles (Updated for v2)

1. **Discover is the front door.** The swipe deck is what loads first. It should be fun, fast, and feel like a game. The board is the "serious" view you toggle into.
2. **Meeting-first hierarchy.** Date, time, and format are the headline on every card. Not the case title. Advisors think in terms of "when is this meeting" not "what is this case called."
3. **Show the split.** No ambiguity on compensation. Every card displays the split. Everyone knows the deal before they swipe.
4. **State licensing is a gate.** Never show an advisor a case they can't legally work. This is compliance, not convenience.
5. **Baseball cards build trust.** Before I co-work with someone, I want to see their stats. Make profiles rich, visual, and impressive.
6. **Two-minute rule still applies.** Posting a case, setting up a profile, swiping through the deck — nothing takes more than 2 minutes.
7. **Managers are matchmakers.** Give them the tools to push opportunities to the right people.
8. **Language matters.** Use Coastal Wealth's internal meeting terminology exactly. No generic terms.

---

## Development Approach for v2

1. Update the database schema (add new columns, new tables)
2. Update seed data with all new fields
3. Redesign the Discover view as the default landing page (`/`)
4. Move the board to `/board`
5. Redesign case cards with meeting-first hierarchy
6. Build the advisor baseball card component
7. Build the directory page (`/directory`)
8. Update the case posting flow with new fields
9. Add state licensing filter logic
10. Build the manager workflow (suggest to advisor)
11. Add Calendly URL field to profiles (stub for future integration)
12. Update nav and routing

---

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://ulwjnurtpboszaqipptj.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[stored in Vercel env vars]
SUPABASE_SERVICE_ROLE_KEY=[stored in Vercel env vars]
```

---

## Current State (v1 — Shipped)

- Case Board with live Supabase data ✅
- Filters and sort (client-side) ✅
- Post a Case form → Supabase ✅
- Match flow (express interest, accept/decline) ✅
- Tinder-style Discover swipe view ✅
- My Posts page ✅
- My Matches page ✅
- Senior Advisor profile page ✅
- Reset Demo button ✅
- Deployed on Vercel ✅
- Coastal Precision design system ✅

## What v2 Adds

- Discover as default landing page 🆕
- Meeting-first card hierarchy 🆕
- Compensation splits on every card 🆕
- State licensing system 🆕
- Advisor baseball cards 🆕
- Browsable directory 🆕
- Manager push workflow 🆕
- Enhanced case posting (time, location, format, state, client summary) 🆕
- Meeting type verbiage alignment 🆕
- Calendly URL stub 🆕
- Swipe history tracking 🆕
- Updated seed data 🆕
