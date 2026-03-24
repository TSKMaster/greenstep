create table if not exists public.report_supports (
  report_id uuid not null references public.reports(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (report_id, user_id)
);

create index if not exists report_supports_user_id_idx
  on public.report_supports (user_id);

alter table public.report_supports enable row level security;

create policy "Users can view their own report supports"
on public.report_supports
for select
to authenticated
using ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create policy "Users can insert their own report supports"
on public.report_supports
for insert
to authenticated
with check ((select auth.uid()) is not null and (select auth.uid()) = user_id);

create or replace function public.sync_report_support_count()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.reports
    set support_count = support_count + 1
    where id = new.report_id;

    return new;
  end if;

  if tg_op = 'DELETE' then
    update public.reports
    set support_count = greatest(support_count - 1, 0)
    where id = old.report_id;

    return old;
  end if;

  return null;
end;
$$;

drop trigger if exists report_supports_sync_count on public.report_supports;

create trigger report_supports_sync_count
after insert or delete on public.report_supports
for each row
execute function public.sync_report_support_count();
