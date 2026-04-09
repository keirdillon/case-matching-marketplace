# AdvisorConnect — The Case Board

## What This Is

AdvisorConnect is an internal advisor collaboration and mentorship matching platform for Coastal Wealth (350+ advisors across Florida and Georgia). Junior/mid-level advisors post upcoming client opportunities (anonymized), and senior advisors browse, filter, and opt in to co-work or mentor on those cases. Think "Grey's Anatomy surgery board meets Tinder-style matching" — built for compliance-conscious financial advisors.

This is an **internal tool only** — not a SaaS product for external sale. It needs to work, be used, and drive adoption within the Coastal Wealth advisor network.

## Key Documents

- `docs/AdvisorConnect_PRD_v1.docx` — Full product requirements document with personas, features, taxonomy, compliance guardrails, data model, and phased rollout plan.
- `docs/AdvisorConnect-CaseBoard-v1.html` — Interactive HTML/CSS design prototype. This is the **design source of truth**. Match this visual language exactly.
- `docs/coastal-precision-design-system.md` — Coastal Wealth Design System v6 documentation.
- `docs/coastal-precision-tokens.css` — CSS custom properties for all design tokens.
- `docs/coastal-precision-tokens.json` — JSON design tokens.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + CSS custom properties from Coastal Precision tokens
- **Database:** Supabase (PostgreSQL + Auth + Realtime)
- **Hosting:** Vercel
- **Repo:** GitHub
- **Language:** TypeScript

## Coastal Wealth Brand Requirements

- **Display font:** Marlide Display Variable via Adobe Typekit. Include `<link rel="stylesheet" href="https://use.typekit.net/tpw8nnl.css">` in layout head. CSS font-family: `'marlide-display-variable', 'Playfair Display', Georgia, serif`
- **Body serif:** `'Source Serif 4', Georgia, serif` (Google Fonts fallback for Minion Pro)
- **UI sans:** `'DM Sans', -apple-system, sans-serif` (Google Fonts fallback for Neue Haas Grotesk)
- **Color tokens:** Use the Coastal Precision CSS variables throughout. Key colors: `--coastal-900: #252f4a` (primary dark), `--coastal-600: #6b95ba` (accent), `--sand-100: #faf7f2` (warm backgrounds)
- **Design patterns:** Overline with 24px rule before text. Card hover reveals gradient top-border. Buttons use `translateY(-1px)` lift + shadow on hover. No border-radius on buttons/cards (sharp edges per brand).

## Architecture

### Database Schema (Supabase)

**advisors** — Profile data for all advisors
- id (uuid, PK)
- email (text, unique)
- full_name (text)
- avatar_url (text, nullable)
- years_experience (int)
- role (enum: 'junior', 'mid', 'senior')
- region (text)
- office (text, nullable)
- is_senior_profile_active (boolean, default false)
- bio (text, nullable, max 500 chars)
- availability_status (enum: 'active', 'paused')
- mentorship_styles (text[], e.g. ['co_attend', 'strategy_call', 'case_review', 'ongoing', 'referral'])
- notification_preferences (jsonb)
- created_at, updated_at (timestamptz)

**advisor_tags** — Many-to-many: advisors ↔ tags
- advisor_id (uuid, FK → advisors)
- tag_id (uuid, FK → tags)
- tag_category (text: 'specialization', 'client_type', 'industry')

**tags** — Shared taxonomy
- id (uuid, PK)
- name (text)
- category (text: 'specialization', 'client_type', 'industry', 'meeting_type')
- display_order (int)

**cases** — Posted opportunities
- id (uuid, PK)
- poster_id (uuid, FK → advisors)
- title (text, max 60 chars)
- client_type (text)
- industry (text[])
- aum_range (text)
- meeting_type (text)
- complexity (int, 1-5)
- region (text)
- meeting_date (date)
- needs (text[], e.g. ['co_attend', 'strategy_call', 'case_review'])
- additional_context (text, nullable, max 300 chars)
- status (enum: 'active', 'matched', 'closed', 'expired')
- created_at, updated_at (timestamptz)

**case_tags** — Many-to-many: cases ↔ tags
- case_id (uuid, FK → cases)
- tag_id (uuid, FK → tags)

**matches** — Interest expressions and confirmed matches
- id (uuid, PK)
- case_id (uuid, FK → cases)
- senior_advisor_id (uuid, FK → advisors)
- status (enum: 'interested', 'accepted', 'declined', 'saved', 'expired')
- decline_reason (text, nullable)
- created_at, updated_at (timestamptz)

**feedback** — Post-match feedback surveys
- id (uuid, PK)
- match_id (uuid, FK → matches)
- respondent_id (uuid, FK → advisors)
- meeting_happened (boolean)
- was_helpful (int, 1-5)
- case_closed (boolean, nullable)
- comments (text, nullable)
- created_at (timestamptz)

### Row Level Security (RLS)

- Advisors can only see/edit their own profile
- All authenticated advisors can view active cases
- Only the case poster can accept/decline matches on their cases
- Admins (T&D team) can view all data including analytics
- All writes create audit log entries

### Key Pages / Routes

```
/                    → Case Board (main feed with filters)
/post                → Post a Case (modal or page)
/case/[id]           → Case detail view
/case/[id]/matches   → View interested senior advisors (poster only)
/profile             → My profile / senior advisor setup
/profile/[id]        → Public advisor profile
/matches             → My matches (both as poster and as senior)
/admin               → Admin dashboard (T&D team only)
/admin/analytics     → Activity metrics, heatmaps, skill gaps
```

### Auth

- Use Supabase Auth
- For MVP: email/password with domain restriction (@coastalwealth.com or equivalent)
- Phase 2: SSO integration with Coastal Wealth identity provider

## Compliance Rules (Non-Negotiable)

1. **No client PII anywhere.** No names, account numbers, SSNs, or contact information in case posts. Display a compliance disclaimer on every posting form.
2. **All data stays internal.** Authenticated access only. Domain-restricted signups.
3. **Audit trail.** Log all actions (posts, interest expressions, matches, declines) with timestamps and user IDs.
4. **Case descriptions use anonymized descriptors only** (e.g., "business owner, dental practice, Tampa, $3M AUM").

## UX Principles

1. **Two-minute rule:** No action takes more than 2 minutes. Posting a case should feel like filling out 3-4 drop-downs, not a form.
2. **Opportunity, not help:** Language frames everything as "collaboration" and "opportunities," never "help" or "mentorship requests."
3. **Visual over textual:** Cards use color-coded tags, complexity dots, and iconography. A glance conveys: what kind of case, how complex, when it's happening.
4. **Mobile-functional, desktop-rich:** The board must work fully on mobile. Desktop gets the richer filter sidebar and side-by-side match cards.

## Development Approach

1. Start with the database schema and seed data in Supabase
2. Build the Case Board feed page first (the primary view)
3. Add the Post Case flow
4. Add the Senior Advisor profile setup
5. Build the matching flow (express interest → match card → accept/decline)
6. Add notifications (email digest via Supabase Edge Functions + Resend/SendGrid)
7. Add the admin dashboard last

## Seed Data

Create 8-10 realistic sample cases and 5-6 senior advisor profiles for development and demo purposes. Use the examples from the HTML prototype as a starting point. Use fictional advisor names.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```
