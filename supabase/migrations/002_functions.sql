-- ShiftLog database functions

create or replace function public.increment_template_usage(template_uuid uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.report_templates
  set usage_count = usage_count + 1,
      updated_at = now()
  where id = template_uuid
    and (
      user_id is null
      or auth.uid() is null
      or user_id = auth.uid()
    );
$$;

create or replace function public.create_report_with_quota(
  p_user_id uuid,
  p_workplace_id uuid,
  p_template_id uuid,
  p_device_no text,
  p_issue_type text,
  p_note text,
  p_photo_url text,
  p_final_text text
)
returns public.reports
language plpgsql
security definer
set search_path = public
as $$
declare
  v_sub public.user_subscriptions%rowtype;
  v_report public.reports%rowtype;
begin
  -- Direct browser/client calls must only operate on the logged-in user's own ID.
  -- Server-side service-role calls usually have auth.uid() = null, so they are allowed.
  if auth.uid() is not null and auth.uid() <> p_user_id then
    raise exception 'Unauthorized user_id';
  end if;

  if coalesce(trim(p_final_text), '') = '' then
    raise exception 'final_text is required';
  end if;

  insert into public.user_subscriptions (user_id, plan, reports_limit, reports_used)
  values (p_user_id, 'free', 10, 0)
  on conflict (user_id) do nothing;

  select *
  into v_sub
  from public.user_subscriptions
  where user_id = p_user_id
  for update;

  if v_sub.plan = 'free' and v_sub.reports_used >= v_sub.reports_limit then
    raise exception 'Limit reached. Upgrade to Pro.';
  end if;

  insert into public.reports (
    user_id,
    workplace_id,
    template_id,
    device_no,
    issue_type,
    note,
    photo_url,
    final_text
  ) values (
    p_user_id,
    p_workplace_id,
    p_template_id,
    nullif(p_device_no, ''),
    nullif(p_issue_type, ''),
    nullif(p_note, ''),
    nullif(p_photo_url, ''),
    p_final_text
  )
  returning * into v_report;

  update public.user_subscriptions
  set reports_used = reports_used + 1,
      updated_at = now()
  where user_id = p_user_id;

  if p_template_id is not null then
    update public.report_templates
    set usage_count = usage_count + 1,
        updated_at = now()
    where id = p_template_id
      and (user_id = p_user_id or user_id is null);
  end if;

  return v_report;
end;
$$;
