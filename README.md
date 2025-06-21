# ReferralPro - Job Search Platform

A modern job search and referral platform built with Next.js, Supabase, and Tailwind CSS.

## 🚀 Features

- **User Authentication** - Secure sign-up/sign-in with Supabase Auth
- **Dashboard** - Personalized job search dashboard with statistics
- **Job Applications** - Track and manage job applications
- **Network Connections** - Build professional network
- **Real-time Updates** - Live data synchronization
- **Responsive Design** - Works on all devices
- **Premium Subscriptions** - Subscription-based access control

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Forms**: React Hook Form

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Git](https://git-scm.com/)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/builtbyap/socranitempo2.git
cd socranitempo2
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Fill in your environment variables:

```env
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Tempo DevTools (for development)
NEXT_PUBLIC_TEMPO=true
```

### 4. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Run the database migrations:

```bash
# Run the setup script
node scripts/setup-database.js
```

### 5. Run the Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and create an account
3. Click "New Project" and import your GitHub repository
4. Add your environment variables in the Vercel dashboard
5. Deploy!

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts and add your environment variables

### Environment Variables for Vercel

Make sure to add these environment variables in your Vercel project settings:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # React components
│   ├── ui/               # UI components (shadcn/ui)
│   └── ...               # Feature components
├── lib/                  # Utility libraries
│   ├── data-service.ts   # Data service layer
│   └── utils.ts          # Utility functions
└── types/                # TypeScript type definitions
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🗄️ Database Schema

The application uses the following main tables:

- `users` - User profiles and authentication
- `subscriptions` - User subscription data
- `applications` - Job applications
- `jobs` - Job listings
- `network_connections` - Professional network
- `messages` - User messages

## 🔐 Authentication

The app uses Supabase Auth with:
- Email/password authentication
- Email confirmation (can be disabled for development)
- Row Level Security (RLS) for data protection
- Automatic user profile creation

## 💳 Subscription System

- Free tier for basic features
- Premium subscription for full access
- Stripe integration for payments (optional)

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**: Make sure all environment variables are set
2. **Database Connection**: Verify Supabase credentials
3. **Authentication Issues**: Check Supabase Auth settings
4. **TypeScript Errors**: Run `npm run build` to see detailed errors

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Next.js documentation](https://nextjs.org/docs)
- Open an issue on GitHub

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support, email support@referralpro.com or open an issue on GitHub.

---

**Happy coding! 🎉**
