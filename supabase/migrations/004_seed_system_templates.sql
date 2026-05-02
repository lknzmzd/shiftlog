-- Optional system templates. These are visible to every logged-in user because user_id is null.

insert into public.report_templates (user_id, title, template_text)
values
  (null, 'Robot Incident Basic', 'Device: {{deviceNo}}\nIssue: {{issueType}}\nNote: {{note}}\nPhoto: {{photoUrl}}'),
  (null, 'Warehouse Shift Report', 'Robot {{deviceNo}} had {{issueType}}. Details: {{note}}. Photo: {{photoUrl}}')
on conflict do nothing;