-- ShiftLog Row Level Security policies

alter table public.workplaces enable row level security;
alter table public.salary_profiles enable row level security;
alter table public.work_days enable row level security;
alter table public.expense_items enable row level security;
alter table public.report_templates enable row level security;
alter table public.reports enable row level security;
alter table public.user_subscriptions enable row level security;
alter table public.feedback_items enable row level security;
alter table public.incidents enable row level security;

-- Force RLS for non-owner roles. Supabase service_role still bypasses RLS.
alter table public.workplaces force row level security;
alter table public.salary_profiles force row level security;
alter table public.work_days force row level security;
alter table public.expense_items force row level security;
alter table public.report_templates force row level security;
alter table public.reports force row level security;
alter table public.user_subscriptions force row level security;
alter table public.feedback_items force row level security;
alter table public.incidents force row level security;

-- Workplaces
drop policy if exists "workplaces_select_own" on public.workplaces;
create policy "workplaces_select_own" on public.workplaces
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "workplaces_insert_own" on public.workplaces;
create policy "workplaces_insert_own" on public.workplaces
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "workplaces_update_own" on public.workplaces;
create policy "workplaces_update_own" on public.workplaces
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "workplaces_delete_own" on public.workplaces;
create policy "workplaces_delete_own" on public.workplaces
for delete to authenticated
using (user_id = auth.uid());

-- Salary profiles
drop policy if exists "salary_profiles_select_own" on public.salary_profiles;
create policy "salary_profiles_select_own" on public.salary_profiles
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "salary_profiles_insert_own" on public.salary_profiles;
create policy "salary_profiles_insert_own" on public.salary_profiles
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "salary_profiles_update_own" on public.salary_profiles;
create policy "salary_profiles_update_own" on public.salary_profiles
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "salary_profiles_delete_own" on public.salary_profiles;
create policy "salary_profiles_delete_own" on public.salary_profiles
for delete to authenticated
using (user_id = auth.uid());

-- Work days
drop policy if exists "work_days_select_own" on public.work_days;
create policy "work_days_select_own" on public.work_days
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "work_days_insert_own" on public.work_days;
create policy "work_days_insert_own" on public.work_days
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "work_days_update_own" on public.work_days;
create policy "work_days_update_own" on public.work_days
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "work_days_delete_own" on public.work_days;
create policy "work_days_delete_own" on public.work_days
for delete to authenticated
using (user_id = auth.uid());

-- Expenses
drop policy if exists "expense_items_select_own" on public.expense_items;
create policy "expense_items_select_own" on public.expense_items
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "expense_items_insert_own" on public.expense_items;
create policy "expense_items_insert_own" on public.expense_items
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "expense_items_update_own" on public.expense_items;
create policy "expense_items_update_own" on public.expense_items
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "expense_items_delete_own" on public.expense_items;
create policy "expense_items_delete_own" on public.expense_items
for delete to authenticated
using (user_id = auth.uid());

-- Report templates: users can read their own templates + system templates where user_id is null.
drop policy if exists "report_templates_select_own_or_system" on public.report_templates;
create policy "report_templates_select_own_or_system" on public.report_templates
for select to authenticated
using (user_id = auth.uid() or user_id is null);

drop policy if exists "report_templates_insert_own" on public.report_templates;
create policy "report_templates_insert_own" on public.report_templates
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "report_templates_update_own" on public.report_templates;
create policy "report_templates_update_own" on public.report_templates
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "report_templates_delete_own" on public.report_templates;
create policy "report_templates_delete_own" on public.report_templates
for delete to authenticated
using (user_id = auth.uid());

-- Reports
drop policy if exists "reports_select_own" on public.reports;
create policy "reports_select_own" on public.reports
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "reports_insert_own" on public.reports;
create policy "reports_insert_own" on public.reports
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "reports_update_own" on public.reports;
create policy "reports_update_own" on public.reports
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "reports_delete_own" on public.reports;
create policy "reports_delete_own" on public.reports
for delete to authenticated
using (user_id = auth.uid());

-- Subscriptions
drop policy if exists "user_subscriptions_select_own" on public.user_subscriptions;
create policy "user_subscriptions_select_own" on public.user_subscriptions
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "user_subscriptions_insert_own" on public.user_subscriptions;
create policy "user_subscriptions_insert_own" on public.user_subscriptions
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "user_subscriptions_update_own" on public.user_subscriptions;
create policy "user_subscriptions_update_own" on public.user_subscriptions
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

-- Feedback
drop policy if exists "feedback_items_select_own" on public.feedback_items;
create policy "feedback_items_select_own" on public.feedback_items
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "feedback_items_insert_own" on public.feedback_items;
create policy "feedback_items_insert_own" on public.feedback_items
for insert to authenticated
with check (user_id = auth.uid());

-- Incidents
drop policy if exists "incidents_select_own" on public.incidents;
create policy "incidents_select_own" on public.incidents
for select to authenticated
using (user_id = auth.uid());

drop policy if exists "incidents_insert_own" on public.incidents;
create policy "incidents_insert_own" on public.incidents
for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "incidents_update_own" on public.incidents;
create policy "incidents_update_own" on public.incidents
for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "incidents_delete_own" on public.incidents;
create policy "incidents_delete_own" on public.incidents
for delete to authenticated
using (user_id = auth.uid());
