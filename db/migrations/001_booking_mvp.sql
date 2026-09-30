-- Salón Danny booking MVP. Apply this file in Supabase SQL Editor.
create extension if not exists btree_gist;

create table if not exists public.salon_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.salon_services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  duration_minutes integer not null default 60 check (duration_minutes between 15 and 480),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create table if not exists public.salon_weekly_hours (
  day_of_week smallint primary key check (day_of_week between 0 and 6),
  opens_at time not null default '08:00',
  closes_at time not null default '21:00',
  is_open boolean not null default true,
  check (closes_at > opens_at)
);
create table if not exists public.salon_appointments (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null check (char_length(customer_name) between 2 and 100),
  customer_phone text not null check (char_length(customer_phone) between 7 and 24),
  service_id uuid not null references public.salon_services(id),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  status text not null default 'solicitada' check (status in ('solicitada','confirmada','cancelada')),
  created_at timestamptz not null default now(),
  check (ends_at > starts_at),
  constraint salon_appointments_no_overlap exclude using gist (
    tstzrange(starts_at, ends_at, '[)') with &&
  ) where (status in ('solicitada','confirmada'))
);

insert into public.salon_services (slug,name,duration_minutes) values
 ('manicure','Manicure',60),('pedicure','Pedicure',60),('unas-acrilicas-poligel','Acrílico, poligel y más',60),
 ('cejas-pestanas','Cejas y pestañas',60),('keratina','Keratina',60),('alisados','Alisados',60),
 ('peinados-trenzas','Peinados y trenzas',60),('corte-dama','Corte dama',60),('cuidado-capilar','Cuidado capilar',60),
 ('limpieza-facial','Limpieza facial',60),('depilacion','Depilación',60)
on conflict (slug) do update set name=excluded.name;
insert into public.salon_weekly_hours (day_of_week,opens_at,closes_at,is_open)
select n, '08:00', '21:00', true from generate_series(0,6) n
on conflict (day_of_week) do nothing;

alter table public.salon_admins enable row level security;
alter table public.salon_services enable row level security;
alter table public.salon_weekly_hours enable row level security;
alter table public.salon_appointments enable row level security;
create policy "Admins can read their own admin link" on public.salon_admins for select to authenticated using (user_id = auth.uid());
create policy "Public can read active services" on public.salon_services for select to anon, authenticated using (is_active);
create policy "Admins manage services" on public.salon_services for all to authenticated using (exists(select 1 from public.salon_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.salon_admins a where a.user_id=auth.uid()));
create policy "Public can read opening hours" on public.salon_weekly_hours for select to anon, authenticated using (true);
create policy "Admins manage opening hours" on public.salon_weekly_hours for all to authenticated using (exists(select 1 from public.salon_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.salon_admins a where a.user_id=auth.uid()));
create policy "Admins can view appointments" on public.salon_appointments for select to authenticated using (exists(select 1 from public.salon_admins a where a.user_id=auth.uid()));
create policy "Admins can update appointments" on public.salon_appointments for update to authenticated using (exists(select 1 from public.salon_admins a where a.user_id=auth.uid())) with check (exists(select 1 from public.salon_admins a where a.user_id=auth.uid()));

create or replace function public.get_booked_slots(p_date date)
returns table (slot_time text) language sql security definer set search_path = public
as $$
  select to_char((a.starts_at at time zone 'America/Bogota')::time, 'HH24:MI')
  from public.salon_appointments a
  where (a.starts_at at time zone 'America/Bogota')::date = p_date
    and a.status in ('solicitada','confirmada');
$$;
grant execute on function public.get_booked_slots(date) to anon, authenticated;

create or replace function public.create_public_booking(p_name text, p_phone text, p_service_slug text, p_starts_at timestamptz)
returns uuid language plpgsql security definer set search_path = public
as $$
declare
  v_service salon_services%rowtype;
  v_local timestamp;
  v_day smallint;
  v_hours salon_weekly_hours%rowtype;
  v_end timestamptz;
  v_id uuid;
begin
  if char_length(trim(p_name)) not between 2 and 100 or char_length(regexp_replace(p_phone, '\D', '', 'g')) not between 7 and 16 then
    raise exception 'Revisa tu nombre y teléfono.' using errcode='22023';
  end if;
  select * into v_service from salon_services where slug=p_service_slug and is_active;
  if not found then raise exception 'El servicio elegido no está disponible.' using errcode='22023'; end if;
  v_local := p_starts_at at time zone 'America/Bogota';
  v_day := extract(dow from v_local)::smallint;
  select * into v_hours from salon_weekly_hours where day_of_week=v_day;
  if not found or not v_hours.is_open then raise exception 'El salón no atiende ese día.' using errcode='22023'; end if;
  v_end := p_starts_at + make_interval(mins => v_service.duration_minutes);
  if p_starts_at <= now() or v_local::time < v_hours.opens_at or (v_local::time + make_interval(mins => v_service.duration_minutes)) > v_hours.closes_at then
    raise exception 'Ese horario está fuera de atención.' using errcode='22023';
  end if;
  perform pg_advisory_xact_lock(hashtext(v_local::date::text));
  if exists(select 1 from salon_appointments a where a.status in ('solicitada','confirmada') and tstzrange(a.starts_at,a.ends_at,'[)') && tstzrange(p_starts_at,v_end,'[)')) then
    raise exception 'Ese horario acaba de ocuparse. Elige otro.' using errcode='23P01';
  end if;
  insert into salon_appointments(customer_name,customer_phone,service_id,starts_at,ends_at)
  values(trim(p_name),regexp_replace(p_phone, '\D', '', 'g'),v_service.id,p_starts_at,v_end) returning id into v_id;
  return v_id;
end $$;
grant execute on function public.create_public_booking(text,text,text,timestamptz) to anon, authenticated;

revoke all on public.salon_appointments from anon;
grant select, update on public.salon_appointments to authenticated;
grant select on public.salon_services, public.salon_weekly_hours to anon, authenticated;
