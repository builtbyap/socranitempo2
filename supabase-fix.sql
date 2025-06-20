-- Fix RLS policies to allow data insertion
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;

-- Create INSERT policies for users table
CREATE POLICY "Users can insert own data" ON public.users
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create INSERT policies for subscriptions table  
CREATE POLICY "Users can insert own subscriptions" ON public.subscriptions
FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Also create UPDATE policies for completeness
CREATE POLICY "Users can update own data" ON public.users
FOR UPDATE USING (auth.uid()::text = user_id);

CREATE POLICY "Users can update own subscriptions" ON public.subscriptions
FOR UPDATE USING (auth.uid()::text = user_id);

-- Verify the policies are created
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'subscriptions')
ORDER BY tablename, policyname; 