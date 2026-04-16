-- ========================================
-- AdvisorConnect — V2 Seed Data Updates
-- Run AFTER schema-v2-migration.sql
-- ========================================

-- ========================================
-- UPDATE EXISTING ADVISORS (Junior/Mid)
-- ========================================

UPDATE advisors SET
  licensed_states = '{FL}',
  production_level = 'Silver',
  closing_rate = 0.58,
  avg_appointments_per_week = 8,
  education = 'University of South Florida, B.S. Finance',
  certifications = '{}',
  joined_date = '2023-06-15',
  total_joint_work_completed = 4,
  phone = '(813) 555-0101'
WHERE id = '11111111-1111-1111-1111-111111111111'; -- Marcus Reeves

UPDATE advisors SET
  licensed_states = '{FL}',
  production_level = 'Bronze',
  closing_rate = 0.52,
  avg_appointments_per_week = 6,
  education = 'Florida International University, B.B.A. Finance',
  certifications = '{}',
  joined_date = '2024-02-01',
  total_joint_work_completed = 2,
  phone = '(954) 555-0202'
WHERE id = '22222222-2222-2222-2222-222222222222'; -- Jamie Hernandez

UPDATE advisors SET
  licensed_states = '{FL,GA}',
  production_level = 'Silver',
  closing_rate = 0.65,
  avg_appointments_per_week = 10,
  education = 'University of Central Florida, M.B.A.',
  certifications = '{CFP}',
  joined_date = '2021-09-01',
  total_joint_work_completed = 11,
  phone = '(407) 555-0303'
WHERE id = '33333333-3333-3333-3333-333333333333'; -- Aisha Patel

UPDATE advisors SET
  licensed_states = '{GA,FL}',
  production_level = 'Silver',
  closing_rate = 0.61,
  avg_appointments_per_week = 9,
  education = 'Georgia Tech, B.S. Industrial Engineering',
  certifications = '{}',
  joined_date = '2022-04-15',
  total_joint_work_completed = 7,
  phone = '(404) 555-0404'
WHERE id = '44444444-4444-4444-4444-444444444444'; -- Tyler Kim

UPDATE advisors SET
  licensed_states = '{FL}',
  production_level = 'Bronze',
  closing_rate = 0.45,
  avg_appointments_per_week = 5,
  education = 'Eckerd College, B.A. Economics',
  certifications = '{}',
  joined_date = '2025-01-10',
  total_joint_work_completed = 1,
  phone = '(727) 555-0505'
WHERE id = '55555555-5555-5555-5555-555555555555'; -- Lauren Watts

UPDATE advisors SET
  licensed_states = '{FL,NY}',
  production_level = 'Bronze',
  closing_rate = 0.55,
  avg_appointments_per_week = 7,
  education = 'University of Miami, B.B.A. Finance',
  certifications = '{}',
  joined_date = '2023-08-20',
  total_joint_work_completed = 3,
  phone = '(305) 555-0606'
WHERE id = '66666666-6666-6666-6666-666666666666'; -- David Shah

-- ========================================
-- UPDATE EXISTING SENIOR ADVISORS
-- ========================================

UPDATE advisors SET
  licensed_states = '{FL,GA,TX}',
  production_level = 'Platinum',
  closing_rate = 0.78,
  avg_appointments_per_week = 14,
  education = 'University of Florida, M.B.A.',
  certifications = '{CFP,ChFC}',
  joined_date = '2008-03-01',
  total_joint_work_completed = 47,
  phone = '(813) 555-1001',
  verified = true,
  calendly_url = 'https://calendly.com/patricia-delgado'
WHERE id = 'aaaa1111-aaaa-aaaa-aaaa-aaaaaaaaaaaa'; -- Patricia Delgado

UPDATE advisors SET
  licensed_states = '{FL,NY,NJ,CT}',
  production_level = 'Platinum',
  closing_rate = 0.82,
  avg_appointments_per_week = 12,
  education = 'Columbia University, M.B.A.',
  certifications = '{CFP,CIMA,CFA}',
  joined_date = '2004-01-15',
  total_joint_work_completed = 63,
  phone = '(305) 555-2002',
  verified = true,
  calendly_url = 'https://calendly.com/robert-chen'
WHERE id = 'bbbb2222-bbbb-bbbb-bbbb-bbbbbbbbbbbb'; -- Robert Chen

UPDATE advisors SET
  licensed_states = '{FL,GA,NC}',
  production_level = 'Platinum',
  closing_rate = 0.75,
  avg_appointments_per_week = 11,
  education = 'Stetson University College of Law, J.D.',
  certifications = '{CFP,CLU,ChFC}',
  joined_date = '2001-06-01',
  total_joint_work_completed = 52,
  phone = '(407) 555-3003',
  calendly_url = 'https://calendly.com/catherine-monroe'
WHERE id = 'cccc3333-cccc-cccc-cccc-cccccccccccc'; -- Catherine Monroe

UPDATE advisors SET
  licensed_states = '{GA,FL,SC,AL}',
  production_level = 'Gold',
  closing_rate = 0.71,
  avg_appointments_per_week = 13,
  education = 'Emory University, B.B.A. Risk Management',
  certifications = '{CLU,ChFC}',
  joined_date = '2011-09-01',
  total_joint_work_completed = 34,
  phone = '(404) 555-4004',
  calendly_url = 'https://calendly.com/james-whitfield'
WHERE id = 'dddd4444-dddd-dddd-dddd-dddddddddddd'; -- James Whitfield

UPDATE advisors SET
  licensed_states = '{FL,NY}',
  production_level = 'Platinum',
  closing_rate = 0.76,
  avg_appointments_per_week = 10,
  education = 'Florida State University, M.S. Financial Planning',
  certifications = '{CFP,RICP}',
  joined_date = '2006-04-15',
  total_joint_work_completed = 41,
  phone = '(954) 555-5005',
  calendly_url = 'https://calendly.com/maria-santos'
WHERE id = 'eeee5555-eeee-eeee-eeee-eeeeeeeeeeee'; -- Maria Santos

UPDATE advisors SET
  licensed_states = '{FL,GA}',
  production_level = 'Gold',
  closing_rate = 0.69,
  avg_appointments_per_week = 12,
  education = 'University of Tampa, B.S. Business Management',
  certifications = '{CFP,QKA}',
  joined_date = '2010-01-10',
  total_joint_work_completed = 29,
  phone = '(813) 555-6006',
  calendly_url = 'https://calendly.com/william-brooks'
WHERE id = 'ffff6666-ffff-ffff-ffff-ffffffffffff'; -- William Brooks

-- ========================================
-- UPDATE EXISTING CASES — v2 fields
-- ========================================

-- Case 1: Dental Practice Succession
UPDATE cases SET
  state = 'FL',
  meeting_time = '14:00',
  meeting_format = 'in_person',
  meeting_location = 'Tampa Main Office',
  compensation_split = '50/50',
  client_summary = 'Multi-location dental practice owner with 3 offices across Tampa Bay. Exploring retirement in 3-5 years. Needs valuation of combined practice, buy-sell agreement review, and tax-efficient exit strategy.'
WHERE id = 'c0000001-0000-0000-0000-000000000001';

-- Case 2: Pre-IPO Equity Comp
UPDATE cases SET
  state = 'FL',
  meeting_time = '10:00',
  meeting_format = 'zoom',
  meeting_location = 'Zoom',
  compensation_split = '50/50',
  client_summary = 'VP Engineering at late-stage startup (Series D, $2B valuation). IPO expected Q3. Holds $4M in unvested RSUs plus ISO grants. Needs pre-IPO planning, 10b5-1 setup, and diversification strategy.'
WHERE id = 'c0000002-0000-0000-0000-000000000002';

-- Case 3: Multi-Gen Wealth Transfer
UPDATE cases SET
  state = 'FL',
  meeting_time = '11:00',
  meeting_format = 'in_person',
  meeting_location = 'Orlando Downtown Office',
  compensation_split = '60/40',
  client_summary = 'Second-generation family with $15M+ in commercial real estate. Patriarch (age 72) wants to transfer to 3 adult children with very different financial goals and risk tolerances. Existing trust structure needs overhaul.'
WHERE id = 'c0000003-0000-0000-0000-000000000003';

-- Case 4: Physician Practice Buy-In
UPDATE cases SET
  state = 'GA',
  meeting_time = '09:00',
  meeting_format = 'in_person',
  meeting_location = '2400 Peachtree Rd NW, Atlanta',
  compensation_split = '50/50',
  client_summary = 'Orthopedic surgeon, early 40s, negotiating partnership buy-in at 6-physician practice. Needs practice valuation guidance, own-occ disability review, and key person insurance analysis.'
WHERE id = 'c0000004-0000-0000-0000-000000000004';

-- Case 5: GC Retirement Plan
UPDATE cases SET
  state = 'FL',
  meeting_time = '15:30',
  meeting_format = 'in_person',
  meeting_location = 'St. Petersburg Office',
  compensation_split = '50/50',
  client_summary = 'General contractor, 15 employees, no retirement plan in place. Owner wants to maximize personal contributions while offering competitive benefits. Also needs key employee retention for 2 project managers.'
WHERE id = 'c0000005-0000-0000-0000-000000000005';

-- Case 6: Early Retiree Roth Conversion
UPDATE cases SET
  state = 'FL',
  meeting_time = '13:00',
  meeting_format = 'zoom',
  meeting_location = 'Zoom',
  compensation_split = '50/50',
  client_summary = 'Former portfolio manager, age 52, retired early with $3.8M in traditional IRA. Needs multi-year Roth conversion ladder, ACA subsidy optimization, and income sequencing plan through the 59.5 gap.'
WHERE id = 'c0000006-0000-0000-0000-000000000006';

-- Case 7: Nonprofit Endowment
UPDATE cases SET
  state = 'FL',
  meeting_time = '10:30',
  meeting_format = 'in_person',
  meeting_location = 'Orlando Downtown Office',
  compensation_split = '50/50',
  client_summary = 'Regional hospital foundation with $7M endowment. Board wants investment policy review and spending rate analysis. Current allocation is 70% fixed income — likely needs rebalancing discussion.'
WHERE id = 'c0000007-0000-0000-0000-000000000007';

-- Case 8: Law Firm Partner Buy-In
UPDATE cases SET
  state = 'GA',
  meeting_time = '16:00',
  meeting_format = 'phone',
  meeting_location = 'Phone',
  compensation_split = '50/50',
  client_summary = 'Senior associate at mid-size litigation firm, age 38, being offered partnership track. Needs guidance on buy-in financing options, deferred comp plan analysis, and understanding key person insurance requirements.'
WHERE id = 'c0000008-0000-0000-0000-000000000008';

-- Case 9: Tech Exec RSU Diversification
UPDATE cases SET
  state = 'FL',
  meeting_time = '11:30',
  meeting_format = 'zoom',
  meeting_location = 'Zoom',
  compensation_split = '50/50',
  client_summary = 'Director of Engineering at public SaaS company. 85% of net worth in company stock post-vest. Needs systematic diversification, AMT modeling, and charitable giving strategy using appreciated shares.'
WHERE id = 'c0000009-0000-0000-0000-000000000009';

-- Case 10: Manufacturing ESOP
UPDATE cases SET
  state = 'FL',
  meeting_time = '09:30',
  meeting_format = 'in_person',
  meeting_location = 'Tampa Main Office',
  compensation_split = '60/40',
  client_summary = 'Second-generation owner of precision machining company, 45 employees. Exploring ESOP as succession vehicle vs. PE sale. Needs independent valuation, ESOP feasibility study, and side-by-side comparison.'
WHERE id = 'c0000010-0000-0000-0000-000000000010';

-- Case 11: New Physician
UPDATE cases SET
  state = 'FL',
  meeting_time = '14:30',
  meeting_format = 'in_person',
  meeting_location = 'Tampa Main Office',
  compensation_split = '50/50',
  client_summary = 'Emergency medicine physician, age 32, just finished residency. $340K student loans, no disability coverage, no retirement plan. First-time comprehensive financial planning engagement.'
WHERE id = 'c0000011-0000-0000-0000-000000000011';

-- Case 12: Franchise Expansion
UPDATE cases SET
  state = 'FL',
  meeting_time = '10:00',
  meeting_format = 'in_person',
  meeting_location = 'Fort Lauderdale Office',
  compensation_split = '50/50',
  client_summary = 'Owner of 3 fast-casual franchise locations in South Florida. Looking to acquire 2 more. Needs SBA loan guidance, key person insurance across all locations, and multi-entity structuring advice.'
WHERE id = 'c0000012-0000-0000-0000-000000000012';

-- Case 13: Hotel Group Retirement
UPDATE cases SET
  state = 'FL',
  meeting_time = '15:00',
  meeting_format = 'in_person',
  meeting_location = 'St. Petersburg Office',
  compensation_split = '50/50',
  client_summary = 'Boutique hotel group owner, 3 properties, 60 employees. No retirement plan currently. Wants to maximize personal deferrals while providing competitive benefits. Exploring 401(k) + cash balance combo.'
WHERE id = 'c0000013-0000-0000-0000-000000000013';

-- Case 14: High-NW Divorce
UPDATE cases SET
  state = 'FL',
  meeting_time = '11:00',
  meeting_format = 'in_person',
  meeting_location = 'Orlando Downtown Office',
  compensation_split = '70/30',
  client_summary = 'Client (age 55) in high-net-worth divorce. Significant real estate holdings, deferred compensation, and stock options to divide. Needs QDRO analysis, tax-efficient division strategy, and post-divorce plan rebuild.'
WHERE id = 'c0000014-0000-0000-0000-000000000014';

-- ========================================
-- INSERT MANAGER ACCOUNTS
-- ========================================

INSERT INTO advisors (id, email, full_name, years_experience, role, region, office, is_senior_profile_active, bio, availability_status, mentorship_styles, licensed_states, production_level, closing_rate, avg_appointments_per_week, education, certifications, joined_date, total_joint_work_completed, phone, verified)
VALUES
  ('aa007777-aa00-aa00-aa00-aa0000000007',
   'greg.harrison@coastalwealth.com',
   'Greg Harrison',
   20, 'manager', 'Tampa Bay', 'Tampa Main', true,
   'Regional manager overseeing 45 advisors across Tampa Bay. Former top producer — now focused on developing the next generation and making sure the right advisors are on the right cases.',
   'active', '{co_attend,strategy_call,case_review}',
   '{FL,GA}', 'Platinum', 0.81, 6,
   'University of Florida, M.B.A.',
   '{CFP,CLU,ChFC}',
   '2006-08-01', 72,
   '(813) 555-7007', true),

  ('bb008888-bb00-bb00-bb00-bb0000000008',
   'sandra.lopez@coastalwealth.com',
   'Sandra Lopez',
   17, 'manager', 'South Florida', 'Fort Lauderdale', true,
   'South Florida regional manager leading 38 advisors. Passionate about joint work culture — I believe the best outcomes happen when advisors collaborate instead of competing.',
   'active', '{co_attend,case_review,ongoing}',
   '{FL,NY,NJ}', 'Platinum', 0.77, 5,
   'Nova Southeastern University, M.B.A.',
   '{CFP,ChFC}',
   '2009-03-15', 58,
   '(954) 555-8008', true);

-- Manager tags (they have specializations too)
-- Greg Harrison — Business Planning, Succession, Insurance
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('aa007777-aa00-aa00-aa00-aa0000000007', 'a1000000-0000-0000-0000-000000000003', 'specialization'),
  ('aa007777-aa00-aa00-aa00-aa0000000007', 'a1000000-0000-0000-0000-000000000009', 'specialization'),
  ('aa007777-aa00-aa00-aa00-aa0000000007', 'a1000000-0000-0000-0000-000000000004', 'specialization');

-- Sandra Lopez — Estate Planning, Wealth Transfer, Retirement
INSERT INTO advisor_tags (advisor_id, tag_id, tag_category) VALUES
  ('bb008888-bb00-bb00-bb00-bb0000000008', 'a1000000-0000-0000-0000-000000000002', 'specialization'),
  ('bb008888-bb00-bb00-bb00-bb0000000008', 'a1000000-0000-0000-0000-000000000012', 'specialization'),
  ('bb008888-bb00-bb00-bb00-bb0000000008', 'a1000000-0000-0000-0000-000000000001', 'specialization');
