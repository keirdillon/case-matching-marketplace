export type AdvisorRole = "junior" | "mid" | "senior";
export type AvailabilityStatus = "active" | "paused";
export type CaseStatus = "active" | "matched" | "closed" | "expired";
export type MatchStatus =
  | "interested"
  | "accepted"
  | "declined"
  | "saved"
  | "expired";
export type MentorshipStyle =
  | "co_attend"
  | "strategy_call"
  | "case_review"
  | "ongoing"
  | "referral";
export type TagCategory =
  | "specialization"
  | "client_type"
  | "industry"
  | "meeting_type";

export interface Advisor {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
  years_experience: number;
  role: AdvisorRole;
  region: string;
  office: string | null;
  is_senior_profile_active: boolean;
  bio: string | null;
  availability_status: AvailabilityStatus;
  mentorship_styles: MentorshipStyle[];
  notification_preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  name: string;
  category: TagCategory;
  display_order: number;
}

export interface Case {
  id: string;
  poster_id: string;
  title: string;
  client_type: string;
  industry: string[];
  aum_range: string;
  meeting_type: string;
  complexity: number;
  region: string;
  meeting_date: string;
  needs: MentorshipStyle[];
  additional_context: string | null;
  status: CaseStatus;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  case_id: string;
  senior_advisor_id: string;
  status: MatchStatus;
  decline_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface Feedback {
  id: string;
  match_id: string;
  respondent_id: string;
  meeting_happened: boolean;
  was_helpful: number;
  case_closed: boolean | null;
  comments: string | null;
  created_at: string;
}

export interface CaseWithAdvisor extends Case {
  advisor: Pick<
    Advisor,
    "id" | "full_name" | "years_experience" | "region" | "role"
  >;
  tags: Pick<Tag, "id" | "name" | "category">[];
}

export interface Database {
  public: {
    Tables: {
      advisors: { Row: Advisor };
      tags: { Row: Tag };
      cases: { Row: Case };
      matches: { Row: Match };
      feedback: { Row: Feedback };
      advisor_tags: {
        Row: { advisor_id: string; tag_id: string; tag_category: string };
      };
      case_tags: { Row: { case_id: string; tag_id: string } };
    };
  };
}
