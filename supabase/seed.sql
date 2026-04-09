-- ========================================
-- AdvisorConnect — Seed Data
-- ========================================

-- ========================================
-- TAGS
-- ========================================

-- Specializations
INSERT INTO tags (id, name, category, display_order) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'Retirement', 'specialization', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Estate Planning', 'specialization', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Business Planning', 'specialization', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Insurance & Risk', 'specialization', 4),
  ('a1000000-0000-0000-0000-000000000005', 'Tax Strategy', 'specialization', 5),
  ('a1000000-0000-0000-0000-000000000006', 'Investment Management', 'specialization', 6),
  ('a1000000-0000-0000-0000-000000000007', 'Executive Compensation', 'specialization', 7),
  ('a1000000-0000-0000-0000-000000000008', 'Special Situations', 'specialization', 8),
  ('a1000000-0000-0000-0000-000000000009', 'Succession Planning', 'specialization', 9),
  ('a1000000-0000-0000-0000-000000000010', 'Business Valuation', 'specialization', 10),
  ('a1000000-0000-0000-0000-000000000011', 'Buy-Sell Agreements', 'specialization', 11),
  ('a1000000-0000-0000-0000-000000000012', 'Wealth Transfer', 'specialization', 12),
  ('a1000000-0000-0000-0000-000000000013', 'Trust Restructuring', 'specialization', 13),
  ('a1000000-0000-0000-0000-000000000014', 'Family Governance', 'specialization', 14),
  ('a1000000-0000-0000-0000-000000000015', 'Stock Options', 'specialization', 15),
  ('a1000000-0000-0000-0000-000000000016', '10b5-1 Plans', 'specialization', 16),
  ('a1000000-0000-0000-0000-000000000017', 'Sudden Wealth', 'specialization', 17),
  ('a1000000-0000-0000-0000-000000000018', 'Roth Conversions', 'specialization', 18),
  ('a1000000-0000-0000-0000-000000000019', 'Executive Benefits', 'specialization', 19);

-- Client Types
INSERT INTO tags (id, name, category, display_order) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'Business Owner', 'client_type', 1),
  ('b1000000-0000-0000-0000-000000000002', 'Professional (Dr/DDS/JD)', 'client_type', 2),
  ('b1000000-0000-0000-0000-000000000003', 'Executive', 'client_type', 3),
  ('b1000000-0000-0000-0000-000000000004', 'Individual', 'client_type', 4),
  ('b1000000-0000-0000-0000-000000000005', 'Family / Multi-gen', 'client_type', 5),
  ('b1000000-0000-0000-0000-000000000006', 'Nonprofit', 'client_type', 6);

-- Industries
INSERT INTO tags (id, name, category, display_order) VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Healthcare', 'industry', 1),
  ('c1000000-0000-0000-0000-000000000002', 'Dental', 'industry', 2),
  ('c1000000-0000-0000-0000-000000000003', 'Legal', 'industry', 3),
  ('c1000000-0000-0000-0000-000000000004', 'Technology', 'industry', 4),
  ('c1000000-0000-0000-0000-000000000005', 'Real Estate', 'industry', 5),
  ('c1000000-0000-0000-0000-000000000006', 'Manufacturing', 'industry', 6),
  ('c1000000-0000-0000-0000-000000000007', 'Construction', 'industry', 7),
  ('c1000000-0000-0000-0000-000000000008', 'Finance', 'industry', 8),
  ('c1000000-0000-0000-0000-000000000009', 'Retail', 'industry', 9),
  ('c1000000-0000-0000-0000-000000000010', 'Hospitality', 'industry', 10);

-- Meeting Types
INSERT INTO tags (id, name, category, display_order) VALUES
  ('d1000000-0000-0000-0000-000000000001', 'Initial Discovery', 'meeting_type', 1),
  ('d1000000-0000-0000-0000-000000000002', 'Plan Presentation', 'meeting_type', 2),
  ('d1000000-0000-0000-0000-000000000003', 'Annual Review', 'meeting_type', 3),
  ('d1000000-0000-0000-0000-000000000004', 'Complex Case Review', 'meeting_type', 4),
  ('d1000000-0000-0000-0000-000000000005', 'Estate/Trust Discussion', 'meeting_type', 5),
  ('d1000000-0000-0000-0000-000000000006', 'Business Valuation', 'meeting_type', 6),
  ('d1000000-0000-0000-0000-000000000007', 'Insurance Review', 'meeting_type', 7);

-- ========================================
-- ADVISORS (Junior/Mid who post cases)
-- ========================================
INSERT INTO advisors (id, email, full_name, years_experience, role, region, office, is_senior_profile_active, bio, availability_status, mentorship_styles) VALUES
  ('11111111-1111-1111-1111-111111111111', 'marcus.reeves@coastalwealth.com', 'Marcus Reeves', 3, 'junior', 'Tampa Bay', 'Tampa Main', false, NULL, 'active', '{}'),
  ('22222222-2222-2222-2222-222222222222', 'jamie.hernandez@coastalwealth.com', 'Jamie Hernandez', 2, 'junior', 'South Florida', 'Fort Lauderdale', false, NULL, 'active', '{}'),
  ('33333333-3333-3333-3333-333333333333', 'aisha.patel@coastalwealth.com', 'Aisha Patel', 5, 'mid', 'Central Florida', 'Orlando', false, NULL, 'active', '{}'),
  ('44444444-4444-4444-4444-444444444444', 'tyler.kim@coastalwealth.com', 'Tyler Kim', 4, 'mid', 'Georgia', 'Atlanta', false, NULL, 'active', '{}'),
  ('55555555-5555-5555-5555-555555555555', 'lauren.watts@coastalwealth.com', 'Lauren Watts', 1, 'junior', 'Tampa Bay', 'St. Petersburg', false, NULL, 'active', '{}'),
  ('66666666-6666-6666-6666-666666666666', 'david.shah@coastalwealth.com', 'David Shah', 3, 'junior', 'South Florida', 'Miami', false, NULL, 'active', '{}');

-- ========================================
-- SENIOR ADVISORS
-- ========================================
INSERT INTO advisors (id, email, full_name, years_experience, role, region, office, is_senior_profile_active, bio, availability_status, mentorship_styles) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'patricia.delgado@coastalwealth.com', 'Patricia Delgado', 18, 'senior', 'Tampa Bay', 'Tampa Main', true, 'I''ve spent 18 years working with dental and medical practice owners on succession planning, M&A advisory, and tax-efficient exit strategies. This is my bread and butter.', 'active', '{co_attend,strategy_call,ongoing}'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'robert.chen@coastalwealth.com', 'Robert Chen', 22, 'senior', 'South Florida', 'Miami', true, 'Former Goldman Sachs VP turned wealth advisor. I specialize in executive compensation, equity strategy, and concentrated stock management for tech and finance executives.', 'active', '{co_attend,strategy_call,case_review}'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'catherine.monroe@coastalwealth.com', 'Catherine Monroe', 25, 'senior', 'Central Florida', 'Orlando', true, 'Estate planning attorney turned advisor. I focus on multi-generational wealth transfer, trust design, and family governance — helping families navigate complex transitions with care.', 'active', '{case_review,co_attend,ongoing}'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'james.whitfield@coastalwealth.com', 'James Whitfield', 15, 'senior', 'Georgia', 'Atlanta', true, 'Insurance and risk management specialist with deep experience in professional practices — physicians, dentists, attorneys. Own-occ disability, key person, buy-sell funding.', 'active', '{strategy_call,case_review,referral}'),
  ('eeee5555-eeee-eeee-eeee-eeeeeeeeeeee', 'maria.santos@coastalwealth.com', 'Maria Santos', 20, 'senior', 'South Florida', 'Fort Lauderdale', true, 'Retirement income strategist. I help advisors build Roth conversion ladders, bridge the 59.5 gap, and design tax-efficient income distribution plans that last 40+ years.', 'active', '{case_review,strategy_call,referral}'),
  ('ffff6666-ffff-ffff-ffff-ffffffffffff', 'william.brooks@coastalwealth.com', 'William Brooks', 16, 'senior', 'Tampa Bay', 'Tampa Main', true, 'Business succession and retirement plan specialist. 401(k), cash balance, ESOP design — I help advisors find the right plan structure for business owners of all sizes.', 'active', '{strategy_call,co_attend}');

-- ========================================
-- SENIOR ADVISOR TAGS
-- ========================================
-- Patricia Delgado — Succession, Valuation, Tax, Buy-Sell, Healthcare, Dental
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1000000-0000-0000-0000-000000000009', 'specialization'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1000000-0000-0000-0000-000000000010', 'specialization'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1000000-0000-0000-0000-000000000005', 'specialization'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'a1000000-0000-0000-0000-000000000011', 'specialization'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1000000-0000-0000-0000-000000000001', 'industry'),
  ('aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1000000-0000-0000-0000-000000000002', 'industry');

-- Robert Chen — Exec Comp, Stock Options, 10b5-1, Sudden Wealth, Technology, Finance
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1000000-0000-0000-0000-000000000007', 'specialization'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1000000-0000-0000-0000-000000000015', 'specialization'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1000000-0000-0000-0000-000000000016', 'specialization'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'a1000000-0000-0000-0000-000000000017', 'specialization'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000004', 'industry'),
  ('bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'c1000000-0000-0000-0000-000000000008', 'industry');

-- Catherine Monroe — Estate, Trust, Wealth Transfer, Family Governance, Real Estate
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'a1000000-0000-0000-0000-000000000002', 'specialization'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'a1000000-0000-0000-0000-000000000013', 'specialization'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'a1000000-0000-0000-0000-000000000012', 'specialization'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'a1000000-0000-0000-0000-000000000014', 'specialization'),
  ('cccc3333-cccc-cccc-cccc-cccccccccccc', 'c1000000-0000-0000-0000-000000000005', 'industry');

-- James Whitfield — Insurance, Business Planning, Healthcare, Dental, Legal
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'a1000000-0000-0000-0000-000000000004', 'specialization'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'a1000000-0000-0000-0000-000000000003', 'specialization'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'c1000000-0000-0000-0000-000000000001', 'industry'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'c1000000-0000-0000-0000-000000000002', 'industry'),
  ('dddd4444-dddd-dddd-dddd-dddddddddddd', 'c1000000-0000-0000-0000-000000000003', 'industry');

-- Maria Santos — Retirement, Tax Strategy, Roth Conversions, Finance
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('eeee5555-eeee-eeee-eeee-eeeeeeeeeeee', 'a1000000-0000-0000-0000-000000000001', 'specialization'),
  ('eeee5555-eeee-eeee-eeee-eeeeeeeeeeee', 'a1000000-0000-0000-0000-000000000005', 'specialization'),
  ('eeee5555-eeee-eeee-eeee-eeeeeeeeeeee', 'a1000000-0000-0000-0000-000000000018', 'specialization'),
  ('eeee5555-eeee-eeee-eeee-eeeeeeeeeeee', 'c1000000-0000-0000-0000-000000000008', 'industry');

-- William Brooks — Business Planning, Retirement, Exec Benefits, Construction
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('ffff6666-ffff-ffff-ffff-ffffffffffff', 'a1000000-0000-0000-0000-000000000003', 'specialization'),
  ('ffff6666-ffff-ffff-ffff-ffffffffffff', 'a1000000-0000-0000-0000-000000000001', 'specialization'),
  ('ffff6666-ffff-ffff-ffff-ffffffffffff', 'a1000000-0000-0000-0000-000000000019', 'specialization'),
  ('ffff6666-ffff-ffff-ffff-ffffffffffff', 'c1000000-0000-0000-0000-000000000007', 'industry');

-- ========================================
-- CASES (matching HTML prototype)
-- ========================================
INSERT INTO cases (id, poster_id, title, client_type, industry, aum_range, meeting_type, complexity, region, meeting_date, needs, additional_context, status) VALUES
  ('c0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111',
   'Dental Practice Succession & Exit Strategy',
   'Business Owner', '{Dental}', '$3M-$5M', 'Initial Discovery', 4, 'Tampa Bay', '2026-04-18',
   '{co_attend,strategy_call}',
   'Multi-location dental practice owner (3 offices) exploring retirement timeline and succession options. Needs expertise in business valuation, buy-sell agreements, and tax-efficient exit structuring.',
   'active'),

  ('c0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222',
   'Pre-IPO Equity Comp & Concentrated Stock',
   'Executive', '{Technology}', '$5M-$10M', 'Complex Case Review', 5, 'South Florida', '2026-04-22',
   '{co_attend,ongoing}',
   'VP Engineering at late-stage startup preparing for IPO in Q3. Significant RSU/ISO position, needs liquidity planning, 10b5-1 plan guidance, and overall wealth management strategy for sudden wealth event.',
   'active'),

  ('c0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333',
   'Multi-Gen Wealth Transfer & Trust Restructuring',
   'Family / Multi-gen', '{Real Estate}', '$10M+', 'Estate/Trust Discussion', 5, 'Central Florida', '2026-04-25',
   '{case_review,co_attend}',
   'Second-generation family with commercial real estate portfolio. Patriarch planning wealth transfer to 3 adult children with differing financial goals. Existing trust structure needs review and potential GRAT/IDGT restructuring.',
   'active'),

  ('c0000004-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444',
   'Physician Practice Buy-In & Disability Coverage',
   'Professional (Dr/DDS/JD)', '{Healthcare}', '$1M-$3M', 'Insurance Review', 3, 'Georgia', '2026-04-20',
   '{strategy_call,case_review}',
   'Orthopedic surgeon (early 40s) negotiating partnership buy-in at established practice. Needs guidance on practice valuation, key person insurance, own-occupation disability, and retirement plan integration.',
   'active'),

  ('c0000005-0000-0000-0000-000000000005', '55555555-5555-5555-5555-555555555555',
   'GC Retirement Plan Setup & Key Employee Retention',
   'Business Owner', '{Construction}', '$500K-$1M', 'Plan Presentation', 2, 'Tampa Bay', '2026-04-16',
   '{strategy_call}',
   'General contractor with 15 employees looking to establish first qualified retirement plan. Also needs key employee retention strategy for two project managers critical to operations.',
   'active'),

  ('c0000006-0000-0000-0000-000000000006', '66666666-6666-6666-6666-666666666666',
   'Early Retiree Roth Conversion & Income Strategy',
   'Individual', '{Finance}', '$3M-$5M', 'Complex Case Review', 3, 'South Florida', '2026-04-24',
   '{case_review,referral}',
   'Former portfolio manager, age 52, recently retired early with significant traditional IRA. Seeking multi-year Roth conversion ladder strategy, ACA subsidy optimization, and income sequencing through age 59.5 gap.',
   'active');

-- ========================================
-- CASE TAGS
-- ========================================
-- Case 1: Succession Planning, Business Valuation, Tax Strategy, Buy-Sell Agreements
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000001-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009'),
  ('c0000001-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000010'),
  ('c0000001-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005'),
  ('c0000001-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000011');

-- Case 2: Executive Comp, Stock Options, 10b5-1 Plans, Sudden Wealth
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000002-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000007'),
  ('c0000002-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000015'),
  ('c0000002-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000016'),
  ('c0000002-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000017');

-- Case 3: Estate Planning, Trust Restructuring, Wealth Transfer, Family Governance
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000003-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002'),
  ('c0000003-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000013'),
  ('c0000003-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000012'),
  ('c0000003-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000014');

-- Case 4: Insurance & Risk, Business Planning, Retirement
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000004-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000004'),
  ('c0000004-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000003'),
  ('c0000004-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001');

-- Case 5: Retirement Planning, Executive Benefits
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000005-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001'),
  ('c0000005-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000019');

-- Case 6: Retirement, Tax Strategy, Roth Conversions
INSERT INTO case_tags (case_id, tag_id) VALUES
  ('c0000006-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001'),
  ('c0000006-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000005'),
  ('c0000006-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000018');

