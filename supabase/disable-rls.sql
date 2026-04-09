-- ========================================
-- Temporarily disable RLS for anon reads
-- Run this in Supabase SQL Editor
-- We'll re-enable + add proper auth later
-- ========================================

ALTER TABLE cases DISABLE ROW LEVEL SECURITY;
ALTER TABLE advisors DISABLE ROW LEVEL SECURITY;
ALTER TABLE tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE case_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE advisor_tags DISABLE ROW LEVEL SECURITY;
ALTER TABLE matches DISABLE ROW LEVEL SECURITY;
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;
