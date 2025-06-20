-- Additional tables for the referral platform

-- Applications table
CREATE TABLE IF NOT EXISTS public.applications (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id),
    company_name text NOT NULL,
    job_title text NOT NULL,
    job_description_url text,
    location text,
    status text DEFAULT 'applied' CHECK (status IN ('applied', 'interviewing', 'offered', 'rejected', 'withdrawn')),
    notes text,
    resume_url text,
    applied_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Jobs table
CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name text NOT NULL,
    job_title text NOT NULL,
    description text,
    location text,
    salary_range text,
    requirements text,
    benefits text,
    job_url text,
    posted_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Network connections table
CREATE TABLE IF NOT EXISTS public.network_connections (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id),
    connection_name text NOT NULL,
    company text,
    position text,
    email text,
    linkedin_url text,
    notes text,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'connected', 'rejected')),
    connected_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Messages table
CREATE TABLE IF NOT EXISTS public.messages (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id text REFERENCES public.users(user_id),
    recipient_id text REFERENCES public.users(user_id),
    subject text,
    content text NOT NULL,
    is_read boolean DEFAULT false,
    sent_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    read_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    application_id uuid REFERENCES public.applications(id),
    user_id text REFERENCES public.users(user_id),
    interview_type text CHECK (interview_type IN ('phone', 'video', 'onsite', 'technical')),
    scheduled_at timestamp with time zone,
    duration_minutes integer DEFAULT 60,
    interviewer_name text,
    interviewer_email text,
    notes text,
    status text DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled', 'rescheduled')),
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id text REFERENCES public.users(user_id),
    referred_user_id text REFERENCES public.users(user_id),
    company_name text NOT NULL,
    job_title text NOT NULL,
    status text DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'interviewing', 'hired', 'rejected')),
    notes text,
    submitted_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- User profiles table (extended user information)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id text REFERENCES public.users(user_id) UNIQUE,
    bio text,
    skills text[],
    experience_years integer,
    preferred_locations text[],
    salary_expectation text,
    resume_url text,
    linkedin_url text,
    github_url text,
    portfolio_url text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now())
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS applications_user_id_idx ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON public.applications(status);
CREATE INDEX IF NOT EXISTS applications_company_idx ON public.applications(company_name);

CREATE INDEX IF NOT EXISTS jobs_company_idx ON public.jobs(company_name);
CREATE INDEX IF NOT EXISTS jobs_location_idx ON public.jobs(location);
CREATE INDEX IF NOT EXISTS jobs_active_idx ON public.jobs(is_active);

CREATE INDEX IF NOT EXISTS network_connections_user_id_idx ON public.network_connections(user_id);
CREATE INDEX IF NOT EXISTS network_connections_status_idx ON public.network_connections(status);

CREATE INDEX IF NOT EXISTS messages_sender_id_idx ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS messages_recipient_id_idx ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS messages_read_idx ON public.messages(is_read);

CREATE INDEX IF NOT EXISTS interviews_application_id_idx ON public.interviews(application_id);
CREATE INDEX IF NOT EXISTS interviews_user_id_idx ON public.interviews(user_id);
CREATE INDEX IF NOT EXISTS interviews_scheduled_at_idx ON public.interviews(scheduled_at);

CREATE INDEX IF NOT EXISTS referrals_referrer_id_idx ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS referrals_referred_user_id_idx ON public.referrals(referred_user_id);

-- Enable Row Level Security
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Applications policies
CREATE POLICY "Users can view own applications" ON public.applications
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own applications" ON public.applications
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own applications" ON public.applications
FOR UPDATE USING (auth.uid()::text = user_id);

-- Jobs policies (public read, admin write)
CREATE POLICY "Anyone can view active jobs" ON public.jobs
FOR SELECT USING (is_active = true);

-- Network connections policies
CREATE POLICY "Users can view own connections" ON public.network_connections
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own connections" ON public.network_connections
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own connections" ON public.network_connections
FOR UPDATE USING (auth.uid()::text = user_id);

-- Messages policies
CREATE POLICY "Users can view messages they sent or received" ON public.messages
FOR SELECT USING (auth.uid()::text = sender_id OR auth.uid()::text = recipient_id);

CREATE POLICY "Users can insert messages they send" ON public.messages
FOR INSERT WITH CHECK (auth.uid()::text = sender_id);

CREATE POLICY "Users can update messages they received" ON public.messages
FOR UPDATE USING (auth.uid()::text = recipient_id);

-- Interviews policies
CREATE POLICY "Users can view own interviews" ON public.interviews
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own interviews" ON public.interviews
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own interviews" ON public.interviews
FOR UPDATE USING (auth.uid()::text = user_id);

-- Referrals policies
CREATE POLICY "Users can view referrals they made or received" ON public.referrals
FOR SELECT USING (auth.uid()::text = referrer_id OR auth.uid()::text = referred_user_id);

CREATE POLICY "Users can insert referrals they make" ON public.referrals
FOR INSERT WITH CHECK (auth.uid()::text = referrer_id);

CREATE POLICY "Users can update referrals they made or received" ON public.referrals
FOR UPDATE USING (auth.uid()::text = referrer_id OR auth.uid()::text = referred_user_id);

-- User profiles policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
FOR UPDATE USING (auth.uid()::text = user_id);

-- Create functions for common operations
CREATE OR REPLACE FUNCTION public.get_user_stats(user_uuid text)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_applications', (SELECT COUNT(*) FROM public.applications WHERE user_id = user_uuid),
        'active_applications', (SELECT COUNT(*) FROM public.applications WHERE user_id = user_uuid AND status IN ('applied', 'interviewing')),
        'total_interviews', (SELECT COUNT(*) FROM public.interviews WHERE user_id = user_uuid),
        'scheduled_interviews', (SELECT COUNT(*) FROM public.interviews WHERE user_id = user_uuid AND status = 'scheduled'),
        'total_connections', (SELECT COUNT(*) FROM public.network_connections WHERE user_id = user_uuid),
        'total_referrals', (SELECT COUNT(*) FROM public.referrals WHERE referrer_id = user_uuid),
        'unread_messages', (SELECT COUNT(*) FROM public.messages WHERE recipient_id = user_uuid AND is_read = false)
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get recent activity
CREATE OR REPLACE FUNCTION public.get_recent_activity(user_uuid text, limit_count integer DEFAULT 10)
RETURNS json AS $$
DECLARE
    result json;
BEGIN
    SELECT json_agg(activity) INTO result
    FROM (
        SELECT 
            'application' as type,
            id,
            company_name as title,
            job_title as description,
            applied_at as time,
            status,
            company_name as company
        FROM public.applications 
        WHERE user_id = user_uuid
        
        UNION ALL
        
        SELECT 
            'interview' as type,
            id,
            'Interview scheduled' as title,
            interview_type as description,
            scheduled_at as time,
            status,
            '' as company
        FROM public.interviews 
        WHERE user_id = user_uuid
        
        UNION ALL
        
        SELECT 
            'referral' as type,
            id,
            'Referral request' as title,
            company_name as description,
            created_at as time,
            status,
            company_name as company
        FROM public.referrals 
        WHERE referrer_id = user_uuid
        
        ORDER BY time DESC
        LIMIT limit_count
    ) as activity;
    
    RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 