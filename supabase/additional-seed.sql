-- ========================================
-- AdvisorConnect — Additional Seed Cases
-- Run in Supabase SQL Editor after seed.sql
-- ========================================

-- CASE 7: Nonprofit endowment management
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000007-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333',
   'Nonprofit Endowment Strategy & Board Governance',
   'Nonprofit', '{Healthcare}', '$5M-$10M', 'Complex Case Review', 4, 'Central Florida', '2026-04-28',
   '{co_attend,case_review}',
   'Regional hospital foundation with $7M endowment seeking investment policy review, spending rate analysis, and board fiduciary training. Current allocation heavily tilted toward fixed income.',
   'active');

-- CASE 8: Attorney partner buy-in
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000008-0000-0000-0000-000000000008', '44444444-4444-4444-4444-444444444444',
   'Law Firm Partner Buy-In & Deferred Comp',
   'Professional (Dr/DDS/JD)', '{Legal}', '$1M-$3M', 'Initial Discovery', 3, 'Georgia', '2026-04-30',
   '{strategy_call,case_review}',
   'Senior associate (age 38) at mid-size litigation firm being offered partnership. Needs guidance on buy-in financing, deferred compensation plan analysis, and key person insurance requirements.',
   'active');

-- CASE 9: Tech exec RSU diversification
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000009-0000-0000-0000-000000000009', '22222222-2222-2222-2222-222222222222',
   'Post-Vest RSU Diversification & AMT Planning',
   'Executive', '{Technology}', '$3M-$5M', 'Plan Presentation', 4, 'South Florida', '2026-05-02',
   '{co_attend,ongoing}',
   'Director of Engineering at public SaaS company. Large post-vest RSU position (85% of NW). Needs systematic diversification plan, AMT impact modeling, and charitable giving strategy using appreciated shares.',
   'active');

-- CASE 10: Manufacturing business succession
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000010-0000-0000-0000-000000000010', '55555555-5555-5555-5555-555555555555',
   'Family Manufacturing Co. ESOP & Succession',
   'Business Owner', '{Manufacturing}', '$3M-$5M', 'Business Valuation', 5, 'Tampa Bay', '2026-05-05',
   '{co_attend,strategy_call,case_review}',
   'Second-gen owner of precision machining company (45 employees). Exploring ESOP as succession vehicle. Needs valuation, ESOP feasibility study, and comparison with outright sale to private equity.',
   'active');

-- CASE 11: Young physician disability & student loans
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000011-0000-0000-0000-000000000011', '11111111-1111-1111-1111-111111111111',
   'New Attending: Disability, Loans & First Plan',
   'Professional (Dr/DDS/JD)', '{Healthcare}', '< $250K', 'Initial Discovery', 1, 'Tampa Bay', '2026-05-01',
   '{strategy_call}',
   'Emergency medicine physician, age 32, just finished residency. $340K in student loans, no disability coverage, no retirement plan. Needs own-occ disability, PSLF vs. refinance analysis, and backdoor Roth setup.',
   'active');

-- CASE 12: Retail franchise expansion
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000012-0000-0000-0000-000000000012', '66666666-6666-6666-6666-666666666666',
   'Franchise Expansion Financing & Risk Mgmt',
   'Business Owner', '{Retail}', '$1M-$3M', 'Annual Review', 3, 'South Florida', '2026-05-07',
   '{case_review,referral}',
   'Owner of 3 fast-casual franchise locations looking to acquire 2 more. Needs SBA loan guidance, key person insurance across locations, and entity structuring advice for multi-unit ownership.',
   'active');

-- CASE 13: Hospitality group retirement plan
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000013-0000-0000-0000-000000000013', '55555555-5555-5555-5555-555555555555',
   'Hotel Group 401(k) & Cash Balance Plan Design',
   'Business Owner', '{Hospitality}', '$500K-$1M', 'Plan Presentation', 2, 'Tampa Bay', '2026-05-08',
   '{strategy_call,co_attend}',
   'Boutique hotel group (3 properties, 60 employees) with no retirement plan. Owner wants to maximize personal deferrals while providing competitive benefits. Exploring 401(k) + cash balance combo.',
   'active');

-- CASE 14: High-NW divorce financial planning
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000014-0000-0000-0000-000000000014', '33333333-3333-3333-3333-333333333333',
   'High-NW Divorce: Asset Division & Tax Impact',
   'Individual', '{Real Estate}', '$10M+', 'Estate/Trust Discussion', 5, 'Central Florida', '2026-05-10',
   '{co_attend,case_review,ongoing}',
   'Client (age 55) going through divorce with significant real estate holdings, deferred comp, and stock options. Needs QDRO analysis, tax-efficient asset division strategy, and post-divorce financial plan rebuild.',
   'active');

-- ========================================
-- CASE TAGS for new cases
-- ========================================

-- Case 7: Investment Management, Special Situations
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000007-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000006'),
  ('c0000007-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000008');

-- Case 8: Business Planning, Insurance & Risk, Executive Compensation
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000008-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003'),
  ('c0000008-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000004'),
  ('c0000008-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000007');

-- Case 9: Executive Compensation, Stock Options, Tax Strategy
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000009-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000007'),
  ('c0000009-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000015'),
  ('c0000009-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000005');

-- Case 10: Succession Planning, Business Valuation, Retirement
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000010-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000009'),
  ('c0000010-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000010'),
  ('c0000010-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000001');

-- Case 11: Insurance & Risk, Retirement
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000011-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000004'),
  ('c0000011-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000001');

-- Case 12: Business Planning, Insurance & Risk
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000012-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000003'),
  ('c0000012-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000004');

-- Case 13: Retirement, Executive Benefits
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000013-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000001'),
  ('c0000013-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000019');

-- Case 14: Estate Planning, Tax Strategy, Special Situations, Wealth Transfer
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000014-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000002'),
  ('c0000014-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005'),
  ('c0000014-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000008'),
  ('c0000014-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000012');
