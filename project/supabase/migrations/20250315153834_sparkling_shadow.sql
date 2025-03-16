/*
  # Initial Schema for Campus Coffee Chat App

  1. Tables
    - users (extends auth.users)
      - Basic profile information
      - Interests and experiences
    - time_slots
      - Weekly schedule slots
    - chat_requests
      - Coffee chat requests between users
    - messages
      - Chat messages between users
    
  2. Security
    - RLS policies for all tables
    - Users can only access their own data and related chat requests
*/

-- Users table extending auth.users
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  department text not null,
  year int not null check (year between 1 and 6),
  interests text[] default '{}',
  experiences text[] default '{}',
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Time slots for weekly schedule
create table public.time_slots (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles on delete cascade not null,
  day text not null check (day in ('MON', 'TUE', 'WED', 'THU', 'FRI')),
  start_time time not null,
  end_time time not null,
  semester text not null,
  created_at timestamptz default now(),
  check (start_time < end_time)
);

-- Chat requests
create table public.chat_requests (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid references public.profiles not null,
  receiver_id uuid references public.profiles not null,
  status text default 'PENDING' check (status in ('PENDING', 'ACCEPTED', 'REJECTED')),
  proposed_time timestamptz not null,
  message text not null,
  created_at timestamptz default now(),
  check (sender_id != receiver_id)
);

-- Messages
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  chat_request_id uuid references public.chat_requests on delete cascade not null,
  sender_id uuid references public.profiles not null,
  content text not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.time_slots enable row level security;
alter table public.chat_requests enable row level security;
alter table public.messages enable row level security;

-- Profiles policies
create policy "Users can read all profiles"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id);

-- Time slots policies
create policy "Users can read their own time slots"
  on public.time_slots for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can manage their own time slots"
  on public.time_slots for all
  to authenticated
  using (auth.uid() = user_id);

-- Chat requests policies
create policy "Users can read their chat requests"
  on public.chat_requests for select
  to authenticated
  using (auth.uid() = sender_id or auth.uid() = receiver_id);

create policy "Users can create chat requests"
  on public.chat_requests for insert
  to authenticated
  with check (auth.uid() = sender_id);

create policy "Users can update their received chat requests"
  on public.chat_requests for update
  to authenticated
  using (auth.uid() = receiver_id);

-- Messages policies
create policy "Users can read messages in their chats"
  on public.messages for select
  to authenticated
  using (
    exists (
      select 1 from public.chat_requests
      where id = messages.chat_request_id
      and (sender_id = auth.uid() or receiver_id = auth.uid())
    )
  );

create policy "Users can insert messages in their chats"
  on public.messages for insert
  to authenticated
  with check (
    exists (
      select 1 from public.chat_requests
      where id = chat_request_id
      and (sender_id = auth.uid() or receiver_id = auth.uid())
      and status = 'ACCEPTED'
    )
  );