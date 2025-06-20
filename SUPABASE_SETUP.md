# Supabase Integration Setup Guide

This guide explains how the website now properly checks Supabase tables for all the information it needs.

## 🗄️ Database Schema

The website now uses the following Supabase tables:

### Core Tables
- **`users`** - User profiles and authentication data
- **`subscriptions`** - User subscription information (Stripe integration)
- **`webhook_events`** - Stripe webhook event tracking

### Application Tables
- **`applications`** - Job applications submitted by users
- **`interviews`** - Interview scheduling and tracking
- **`jobs`** - Available job postings
- **`network_connections`** - Professional network connections
- **`messages`** - Internal messaging system
- **`referrals`** - Referral tracking between users
- **`user_profiles`** - Extended user profile information

## 🚀 Setup Instructions

### 1. Apply Database Migrations

First, apply the database migrations to create all the necessary tables:

```sql
-- Run the initial setup migration
-- File: supabase/migrations/initial-setup.sql

-- Run the application tables migration
-- File: supabase/migrations/application-tables.sql
```

### 2. Set Up Environment Variables

Ensure your `.env.local` file contains:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Add Sample Data

Run the database setup script to add sample data:

```bash
node scripts/setup-database.js
```

This will add:
- 5 sample job postings from top tech companies
- Database functions for statistics and recent activity

## 📊 Data Service Layer

The website now uses a comprehensive `DataService` class (`src/lib/data-service.ts`) that handles all Supabase operations:

### Key Features:
- **User Profile Management** - Fetch and update user profiles
- **Statistics** - Get user statistics (applications, interviews, connections)
- **Recent Activity** - Track user activity across all features
- **Applications** - CRUD operations for job applications
- **Jobs** - Browse and search available jobs
- **Network** - Manage professional connections
- **Messages** - Internal messaging system
- **Interviews** - Schedule and track interviews
- **Referrals** - Track referral relationships

### Example Usage:

```typescript
import { DataService } from '@/lib/data-service';

// Get user statistics
const stats = await DataService.getUserStats(userId);

// Get recent activity
const activity = await DataService.getRecentActivity(userId, 10);

// Create a new application
const application = await DataService.createApplication({
  user_id: userId,
  company_name: 'Google',
  job_title: 'Software Engineer',
  status: 'applied'
});
```

## 🎯 Dashboard Integration

The dashboard now fetches real data from Supabase:

### Updated Components:
- **`DashboardStats`** - Shows real statistics from the database
- **`RecentActivity`** - Displays actual user activity
- **`Dashboard`** - Uses DataService for all data operations

### Data Flow:
1. User logs in → Dashboard loads
2. Dashboard calls `DataService.getDashboardData(userId)`
3. DataService fetches from multiple tables:
   - User statistics from `get_user_stats()` function
   - Recent activity from `get_recent_activity()` function
   - Applications, interviews, etc.
4. Components render with real data

## 🔒 Row Level Security (RLS)

All tables have RLS policies enabled:

- **Users can only see their own data**
- **Applications** - Users see only their applications
- **Network Connections** - Users see only their connections
- **Messages** - Users see messages they sent or received
- **Jobs** - Public read access for active jobs
- **Referrals** - Users see referrals they made or received

## 📈 Database Functions

The database includes two main functions:

### `get_user_stats(user_uuid)`
Returns comprehensive user statistics:
```json
{
  "total_applications": 5,
  "active_applications": 3,
  "total_interviews": 2,
  "scheduled_interviews": 1,
  "total_connections": 10,
  "total_referrals": 2,
  "unread_messages": 3
}
```

### `get_recent_activity(user_uuid, limit_count)`
Returns recent user activity from applications, interviews, and referrals.

## 🧪 Testing the Integration

### 1. Test Database Connection
Visit `/test-db` to test the database connection and see sample data.

### 2. Test Dashboard
1. Sign up for a new account
2. You'll automatically get a free tier subscription
3. Visit the dashboard to see real data fetching
4. Check the browser console for detailed logs

### 3. Test Data Operations
- Submit a job application
- Create network connections
- Send messages
- Schedule interviews

## 🔧 Troubleshooting

### Common Issues:

1. **"Table doesn't exist" errors**
   - Ensure migrations have been applied
   - Check Supabase dashboard for table creation

2. **RLS policy errors**
   - Verify user authentication
   - Check that `user_id` matches `auth.uid()`

3. **Function not found errors**
   - Ensure database functions are created
   - Check function permissions

### Debug Tools:
- `/debug` - Environment and connection diagnostics
- `/test-db` - Database connection and data testing
- Browser console - Detailed operation logs

## 📝 Adding New Features

To add new features that use Supabase:

1. **Create the table** in a new migration
2. **Add RLS policies** for security
3. **Update TypeScript types** in `src/types/supabase.ts`
4. **Add methods** to `DataService` class
5. **Update components** to use the new data

## 🎉 Benefits

With this integration, the website now:

✅ **Fetches real data** from Supabase tables  
✅ **Tracks user activity** across all features  
✅ **Provides statistics** and analytics  
✅ **Maintains data security** with RLS  
✅ **Scales efficiently** with proper indexing  
✅ **Offers comprehensive** data management  

The website is now fully integrated with Supabase and ready for production use! 