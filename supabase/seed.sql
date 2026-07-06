-- Seed these rows after creating a test user and business profile.
-- Replace the placeholders before running in Supabase SQL editor.
-- :user_id, :business_profile_id, and :industry are intended placeholders.

insert into public.customers (user_id, business_profile_id, name, email, phone, address, notes) values
(:user_id, :business_profile_id, 'Maya Johnson', 'maya@example.com', '555-210-8820', '1410 Westview Ave', 'Prefers text follow-ups'),
(:user_id, :business_profile_id, 'Northside Property Group', 'ops@northside.example', '555-611-1400', '88 Market Street', 'Commercial account');

insert into public.leads (user_id, business_profile_id, name, source, status, estimated_value, next_follow_up, notes) values
(:user_id, :business_profile_id, 'Website quote request', 'Website', 'new', 1200, current_date + interval '1 day', 'Needs same-week estimate'),
(:user_id, :business_profile_id, 'Instagram DM referral', 'Instagram', 'contacted', 450, current_date + interval '2 days', 'Asked for before/after examples');

insert into public.opportunities (user_id, business_profile_id, title, stage, value, close_date, probability, notes) values
(:user_id, :business_profile_id, 'July recurring service package', 'proposal', 2400, current_date + interval '14 days', 65, 'Send revised terms'),
(:user_id, :business_profile_id, 'One-time premium job', 'estimate', 850, current_date + interval '7 days', 45, 'Waiting on site photos');

insert into public.tasks (user_id, business_profile_id, title, due_date, priority, status, notes) values
(:user_id, :business_profile_id, 'Call new website lead', current_date, 'high', 'todo', 'Ask budget and timeline'),
(:user_id, :business_profile_id, 'Send follow-up script to old quote', current_date + interval '1 day', 'medium', 'todo', 'Use polite urgency template');
