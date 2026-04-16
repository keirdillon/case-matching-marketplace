-- ========================================
-- AdvisorConnect — V2 Schema Migration
-- Run in Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. ADD 'manager' TO advisor_role ENUM
-- ========================================
ALTER TYPE advisor_role ADD VALUE IF NOT EXISTS 'manager';

-- ========================================
-- 2. ALTER advisors TABLE — new columns
-- ========================================
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS licensed_states TEXT[] DEFAULT '{}';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS production_level TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS closing_rate DECIMAL;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS avg_appointments_per_week INTEGER;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS certifications TEXT[] DEFAULT '{}';
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS joined_date DATE;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS total_joint_work_completed INTEGER DEFAULT 0;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS calendly_url TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE advisors ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT false;

-- ========================================
-- 3. ALTER cases TABLE — new columns
-- ========================================
ALTER TABLE cases ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS meeting_time TIME;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS meeting_location TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS meeting_format TEXT;
ALTER TABLE cases ADD COLUMN IF NOT EXISTS compensation_split TEXT DEFAULT '50/50';
ALTER TABLE cases ADD COLUMN IF NOT EXISTS client_summary TEXT;

-- ========================================
-- 4. CREATE swipe_history TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS swipe_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('pass', 'interested')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(case_id, advisor_id)
);

CREATE INDEX IF NOT EXISTS idx_swipe_history_advisor ON swipe_history(advisor_id);
CREATE INDEX IF NOT EXISTS idx_swipe_history_case ON swipe_history(case_id);

-- ========================================
-- 5. CREATE manager_assignments TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS manager_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  manager_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  case_id UUID NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
  assigned_advisor_id UUID NOT NULL REFERENCES advisors(id) ON DELETE CASCADE,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_manager_assignments_advisor ON manager_assignments(assigned_advisor_id);
CREATE INDEX IF NOT EXISTS idx_manager_assignments_case ON manager_assignments(case_id);

-- Add updated_at trigger to manager_assignments
CREATE TRIGGER manager_assignments_updated_at BEFORE UPDATE ON manager_assignments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ========================================
-- 6. DISABLE RLS ON NEW TABLES (dev mode)
-- ========================================
ALTER TABLE swipe_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE manager_assignments DISABLE ROW LEVEL SECURITY;
