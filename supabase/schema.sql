create extension if not exists "pgcrypto";

create type public.ownerops_industry as enum (
  'general_contractors',
  'cleaning_services',
  'barbershops',
  'nail_salons',
  'landscaping_companies',
  'auto_detailing_businesses',
  'real_estate_investors'
);

create type public.lead_status as enum ('new', 'contacted', 'qualified', 'lost', 'won');
create type public.opportunity_stage as enum ('lead', 'estimate', 'proposal', 'negotiation', 'won', 'lost');
create type public.task_status as enum ('todo', 'done');
create type public.task_priority as enum ('low', 'medium', 'high');

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_name text not null,
  owner_name text not null,
  industry public.ownerops_industry not null,
  city text,
  state text,
  phone text,
  website text,
  goal text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.customers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  name text not null,
  email text,
  phone text,
  address text,
  notes text,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  name text not null,
  source text,
  status public.lead_status not null default 'new',
  estimated_value numeric(12,2) not null default 0,
  next_follow_up date,
  notes text,
  created_at timestamptz not null default now()
);

create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete set null,
  lead_id uuid references public.leads(id) on delete set null,
  title text not null,
  stage public.opportunity_stage not null default 'lead',
  value numeric(12,2) not null default 0,
  close_date date,
  probability integer not null default 40 check (probability between 0 and 100),
  notes text,
  created_at timestamptz not null default now()
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  opportunity_id uuid references public.opportunities(id) on delete set null,
  title text not null,
  due_date date,
  priority public.task_priority not null default 'medium',
  status public.task_status not null default 'todo',
  notes text,
  created_at timestamptz not null default now()
);

create table public.service_pricing (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  industry public.ownerops_industry not null,
  service_name text not null,
  price_low numeric(12,2) not null,
  price_high numeric(12,2) not null,
  unit text not null,
  notes text,
  created_at timestamptz not null default now()
);

create table public.outreach_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  industry public.ownerops_industry not null,
  name text not null,
  channel text not null,
  template text not null,
  created_at timestamptz not null default now()
);

create table public.ai_prompt_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  business_profile_id uuid references public.business_profiles(id) on delete cascade,
  industry public.ownerops_industry not null,
  name text not null,
  use_case text not null,
  prompt text not null,
  created_at timestamptz not null default now()
);

alter table public.business_profiles enable row level security;
alter table public.customers enable row level security;
alter table public.leads enable row level security;
alter table public.opportunities enable row level security;
alter table public.tasks enable row level security;
alter table public.service_pricing enable row level security;
alter table public.outreach_templates enable row level security;
alter table public.ai_prompt_templates enable row level security;

create policy "Users manage own profiles" on public.business_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own customers" on public.customers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own leads" on public.leads
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own opportunities" on public.opportunities
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own tasks" on public.tasks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own pricing" on public.service_pricing
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own outreach" on public.outreach_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own prompts" on public.ai_prompt_templates
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
