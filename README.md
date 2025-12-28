# Smart Task Reminder — Supabase Integration

This project is a small static frontend that stores reminders in Supabase.

Setup steps

1. Create a new project at https://app.supabase.com.
2. In the SQL editor, run the following to create the `reminders` table:

```sql
create extension if not exists pgcrypto;

create table reminders (
  id uuid default gen_random_uuid() primary key,
  task text not null,
  time time not null,
  added_hour int,
  created_at timestamptz default now()
);

-- Optionally enable RLS and add permissive policies for public anon key
alter table reminders enable row level security;
create policy "allow_public_read" on reminders for select using (true);
create policy "allow_public_insert" on reminders for insert with check (true);
```

3. Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY` from the project settings → API.
4. Open `script.js` and replace the placeholder values at the top with your project values:

- `SUPABASE_URL = "https://your-project.supabase.co"`
- `SUPABASE_ANON_KEY = "public-anon-key"`

Security notes

- Using the anon key in a public static site is common for client-authenticated public apps. Ensure RLS policies are configured to limit or validate writes if needed.
- For production write access rules, consider requiring authenticated users and creating more specific RLS policies.

Files changed

- `index.html` — added Supabase UMD script include.
- `script.js` — initialized Supabase client and replaced local storage with DB insert/select logic.

Usage

Open `index.html` in a browser, enter your Supabase details, and try adding a reminder.
#
