-- Contact form submissions table
-- Stores public contact form entries for admin review

create table if not exists contact_submissions (
    id uuid primary key default gen_random_uuid(),
    name text not null,
    email text not null,
    subject text not null default '',
    message text not null,
    status text not null default 'pending' check (status in ('pending', 'read', 'responded', 'archived')),
    admin_notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- Index for admin listing (most recent first, filter by status)
create index idx_contact_submissions_status_created
    on contact_submissions (status, created_at desc);

-- RLS: only admins can read/update, anyone can insert (public form)
alter table contact_submissions enable row level security;

create policy "Anyone can submit contact form"
    on contact_submissions for insert
    with check (true);

create policy "Admins can view contact submissions"
    on contact_submissions for select
    using (
        exists (
            select 1 from user_profiles
            where user_profiles.user_id = auth.uid()
              and user_profiles.role = 'admin'
        )
    );

create policy "Admins can update contact submissions"
    on contact_submissions for update
    using (
        exists (
            select 1 from user_profiles
            where user_profiles.user_id = auth.uid()
              and user_profiles.role = 'admin'
        )
    );
