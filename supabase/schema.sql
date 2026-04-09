-- ========================================
-- AdvisorConnect — Database Schema
-- Coastal Wealth Internal Platform
-- ========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================
-- ENUMS
-- ========================================
CREATE TYPE advisor_role AS ENUM ('junior', 'mid', 'senior');
CREATE TYPE availability_status AS ENUM ('active', 'paused');
CREATE TYPE case_status AS ENUM ('active', 'matched', 'closed', 'expired');
CREATE TYPE match_status AS ENUM ('interested', 'accepted', 'declined', 'saved', 'expired');
CREATE TYPE mentorship_style AS ENUM ('co_attend', 'strategy_call', 'case_review', 'ongoing', 'referral');
CREATE TYPE tag_category AS ENUM ('specialization', 'client_type', 'industry', 'meeting_type');

-- ========================================
-- ADVISORS
-- ========================================
CREATE TABLE advisors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  years_experience INTEGER NOT NULL DEFAULT 0,
  role advisor_role NOT NULL DEFAULT 'junior',
  region TEXT NOT NULL,
  office TEXT,
  is_senior_profile_active BOOLEAN NOT NULL DEFAULT false,
  bio TEXT CHECK (char_length(bio) <= 500),
  availability_status availability_status NOT NULL DEFAULT 'active',
  mentorship_styles mentorship_style[] DEFAULT '{}',
  notification_preferences JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================================
-- TAGS
-- ========================================
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  category tag_category NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(name, category)
);

-- ========================================
-- ADVISOR_TAGS (many-to-many)
-- ========================================
CREATE TABLE advisor_tags (
  advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  tag_category TEXT NOT NULL,
  PRIMARY KEY (advisor_id, tag_id)
);

-- ========================================
-- CASES
-- ========================================
CREATE TABLE cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) <= 60),
  client_type TEXT NOT NULL,
  industry TEXT[] NOT NULL DEFAULT '{}',
  aum_range TEXT NOT NULL,
  meeting_type TEXT NOT NULL,
  complexity INTEGER NOT NULL CHECK (complexity BETWEEN 1 AND 5),
  region TEXT NOT NULL,
  meeting_date DATE NOT NULL,
  needs mentorship_style[] NOT NULL DEFAULT '{}',
  additional_context TEXT CHECK (char_length(additional_context) <= 300),
  status case_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================================
-- CASE_TAGS (many-to-many)
-- ========================================
CREATE TABLE case_tags (
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (case_id, tag_id)
);

-- ========================================
-- MATCHES
-- ========================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  senior_advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  status match_status NOT NULL DEFAULT 'interested',
  decline_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(case_id, senior_advisor_id)
);

-- ========================================
-- FEEDBACK
-- ========================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  respondent_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  meeting_happened BOOLEAN NOT NULL,
  was_helpful INTEGER NOT NULL CHECK (was_helpful BETWEEN 1 AND 5),
  case_closed BOOLEAN,
  comments TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_cases_status ON cases(status);
CREATE INDEX idx_cases_poster ON cases(poster_id);
CREATE INDEX idx_cases_meeting_date ON cases(meeting_date);
CREATE INDEX idx_matches_case ON matches(case_id);
CREATE INDEX idx_matches_senior ON matches(senior_advisor_id);
CREATE INDEX idx_advisor_tags_advisor ON advisor_tags(advisor_id);
CREATE INDEX idx_case_tags_case ON case_tags(case_id);

-- ========================================
-- UPDATED_AT TRIGGER
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER advisors_updated_at BEFORE UPDATE ON advisors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER cases_updated_at BEFORE UPDATE ON cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER matches_updated_at BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- ROW LEVEL SECURITY
-- ========================================
ALTER TABLE advisors ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_tags ENABLE ROW LEVEL SECURITY;

-- Advisors: read own, update own
CREATE POLICY "Advisors can view own profile"
  ON advisors FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Advisors can update own profile"
  ON advisors FOR UPDATE USING (auth.uid() = id);

-- Cases: all authenticated can read active, poster can manage
CREATE POLICY "Authenticated users can view active cases"
  ON cases FOR SELECT USING (status = 'active' OR poster_id = auth.uid());
CREATE POLICY "Advisors can create cases"
  ON cases FOR INSERT WITH CHECK (auth.uid() = poster_id);
CREATE POLICY "Poster can update own cases"
  ON cases FOR UPDATE USING (auth.uid() = poster_id);

-- Matches: involved parties can view
CREATE POLICY "Match participants can view"
  ON matches FOR SELECT USING (
    senior_advisor_id = auth.uid() OR
    case_id IN (SELECT id FROM cases WHERE poster_id = auth.uid())
  );
CREATE POLICY "Senior advisors can express interest"
  ON matches FOR INSERT WITH CHECK (auth.uid() = senior_advisor_id);
CREATE POLICY "Poster can accept/decline matches"
  ON matches FOR UPDATE USING (
    case_id IN (SELECT id FROM cases WHERE poster_id = auth.uid())
  );

-- Feedback: participants can create and view
CREATE POLICY "Match participants can create feedback"
  ON feedback FOR INSERT WITH CHECK (auth.uid() = respondent_id);
CREATE POLICY "Match participants can view feedback"
  ON feedback FOR SELECT USING (
    match_id IN (
      SELECT m.id FROM matches m
      JOIN cases c ON c.id = m.case_id
      WHERE m.senior_advisor_id = auth.uid() OR c.poster_id = auth.uid()
    )
  );

-- Tags: readable by all authenticated
CREATE POLICY "Tags are readable by authenticated users"
  ON tags FOR SELECT USING (auth.role() = 'authenticated');

-- Advisor tags: readable by all authenticated
CREATE POLICY "Advisor tags readable by authenticated"
  ON advisor_tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Advisors can manage own tags"
  ON advisor_tags FOR ALL USING (auth.uid() = advisor_id);

-- Case tags: readable by all authenticated
CREATE POLICY "Case tags readable by authenticated"
  ON case_tags FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Poster can manage case tags"
  ON case_tags FOR ALL USING (
    case_id IN (SELECT id FROM cases WHERE poster_id = auth.uid())
  );
