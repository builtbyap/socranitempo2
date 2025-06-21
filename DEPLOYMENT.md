# Deployment Guide for ReferralPro

This guide will help you deploy your ReferralPro application to Vercel.

## Prerequisites

1. **Node.js Installation** (Required for local development)
   - Download and install Node.js from [nodejs.org](https://nodejs.org/)
   - Recommended version: 18.x or higher
   - Verify installation: `node --version` and `npm --version`

2. **Git Repository**
   - Ensure your code is pushed to a GitHub repository
   - Repository should be public or you need Vercel Pro for private repos

3. **Supabase Project**
   - Create a Supabase project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key

## Step 1: Prepare Your Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Tempo DevTools (for development)
NEXT_PUBLIC_TEMPO=true

# Optional: Stripe Configuration (if using payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository containing your ReferralPro code

2. **Configure Project**
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `.next` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

3. **Environment Variables**
   - Add all environment variables from your `.env.local` file
   - Click "Add" for each variable:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Any other variables you need

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy your application
   - Wait for the build to complete (usually 2-5 minutes)

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Follow the prompts**
   - Link to existing project or create new
   - Set environment variables when prompted

## Step 3: Configure Supabase

1. **Update Supabase Settings**
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Add your Vercel domain to the allowed origins:
     - `https://your-project.vercel.app`
     - `https://your-project.vercel.app/auth/callback`

2. **Database Setup**
   - Run the SQL scripts in `supabase/migrations/` if not already done
   - Or use the Supabase dashboard to create tables manually

3. **Authentication Settings**
   - Go to Authentication > Settings
   - Add your Vercel domain to Site URL
   - Configure redirect URLs:
     - `https://your-project.vercel.app/auth/callback`
     - `https://your-project.vercel.app/sign-in`
     - `https://your-project.vercel.app/sign-up`

## Step 4: Verify Deployment

1. **Check Build Status**
   - Go to your Vercel dashboard
   - Check that the build completed successfully
   - Review any build logs for errors

2. **Test Your Application**
   - Visit your deployed URL
   - Test sign-up and sign-in functionality
   - Verify all features work as expected

3. **Check Environment Variables**
   - Visit `/debug` on your deployed site
   - Verify all environment variables are properly set

## Step 5: Custom Domain (Optional)

1. **Add Custom Domain**
   - In Vercel dashboard, go to Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

2. **Update Supabase Settings**
   - Add your custom domain to Supabase allowed origins
   - Update authentication redirect URLs

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in `package.json`
   - Verify TypeScript compilation

2. **Environment Variables**
   - Double-check all environment variables are set in Vercel
   - Ensure no typos in variable names
   - Verify Supabase URL and key are correct

3. **Authentication Issues**
   - Check Supabase redirect URLs
   - Verify domain is added to allowed origins
   - Test with `/debug` page

4. **Database Connection**
   - Ensure Supabase project is active
   - Check database permissions
   - Verify RLS policies are configured

### Getting Help

1. **Vercel Support**
   - Check Vercel documentation
   - Use Vercel community forums
   - Contact Vercel support for account issues

2. **Supabase Support**
   - Check Supabase documentation
   - Use Supabase community forums
   - Contact Supabase support for database issues

## Post-Deployment

1. **Monitor Performance**
   - Use Vercel Analytics
   - Monitor Supabase usage
   - Set up error tracking

2. **Security**
   - Regularly update dependencies
   - Monitor for security vulnerabilities
   - Keep environment variables secure

3. **Backup**
   - Regularly backup your Supabase database
   - Keep local copies of important data
   - Document any custom configurations

## Next Steps

After successful deployment:

1. Set up monitoring and analytics
2. Configure CI/CD for automatic deployments
3. Set up staging environment
4. Implement proper error tracking
5. Add performance monitoring

Your ReferralPro application should now be live and accessible to users! 