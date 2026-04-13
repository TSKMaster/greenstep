-- Enable public read access for report map/list surfaces used by guest users.
-- This keeps report creation, editing, support actions, and profile data protected.

alter table public.reports enable row level security;

drop policy if exists "Public can read reports" on public.reports;

create policy "Public can read reports"
on public.reports
for select
to anon, authenticated
using (true);
