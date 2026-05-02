-- ShiftLog initial schema
-- Run in Supabase SQL Editor or with: supabase db push

create extension if not exists pgcrypto;

create table if not exists public.workplaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.salary_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  hourly_rate numeric(12,2) not null default 0 check (hourly_rate >= 0),
  hours_per_day numeric(6,2) not null default 0 check (hours_per_day >= 0 and hours_per_day <= 24),
  working_days_per_month integer not null default 0 check (working_days_per_month >= 0 and working_days_per_month <= 31),
  fixed_expenses numeric(12,2) not null default 0 check (fixed_expenses >= 0),
  currency text not null default 'EUR',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.work_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workplace_id uuid references public.workplaces(id) on delete set null,
  work_date date not null,
  hours_worked numeric(6,2) not null default 0 check (hours_worked >= 0 and hours_worked <= 24),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint work_days_user_date_workplace_unique unique (user_id, work_date, workplace_id)
);

create table if not exists public.expense_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workplace_id uuid references public.workplaces(id) on delete set null,
  title text not null,
  amount numeric(12,2) not null default 0 check (amount >= 0),
  expense_month text not null check (expense_month ~ '^\\d{4}-\\d{2}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_templates (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  template_text text not null,
  usage_count integer not null default 0 check (usage_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workplace_id uuid references public.workplaces(id) on delete set null,
  template_id uuid references public.report_templates(id) on delete set null,
  device_no text,
  issue_type text,
  note text,
  photo_url text,
  final_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  subscription_status text not null default 'free',
  reports_limit integer not null default 10 check (reports_limit >= 0),
  reports_used integer not null default 0 check (reports_used >= 0),
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.feedback_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  page text,
  status text not null default 'open' check (status in ('open', 'reviewed', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  device_no text,
  device_type text,
  issue_text text,
  issue_type text,
  quick_reason text,
  shift text,
  created_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_workplaces_user_created on public.workplaces(user_id, created_at desc);
create index if not exists idx_salary_profiles_user_active_created on public.salary_profiles(user_id, active, created_at desc);
create index if not exists idx_work_days_user_date on public.work_days(user_id, work_date desc);
create index if not exists idx_expense_items_user_month on public.expense_items(user_id, expense_month, created_at desc);
create index if not exists idx_report_templates_user_usage on public.report_templates(user_id, usage_count desc);
create index if not exists idx_reports_user_created on public.reports(user_id, created_at desc);
create index if not exists idx_feedback_items_user_created on public.feedback_items(user_id, created_at desc);
create index if not exists idx_incidents_user_created on public.incidents(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'workplaces',
    'salary_profiles',
    'work_days',
    'expense_items',
    'report_templates',
    'reports',
    'user_subscriptions',
    'feedback_items',
    'incidents'
  ] loop
    execute format('drop trigger if exists trg_%I_updated_at on public.%I', table_name, table_name);
    execute format('create trigger trg_%I_updated_at before update on public.%I for each row execute function public.set_updated_at()', table_name, table_name);
  end loop;
end $$;
