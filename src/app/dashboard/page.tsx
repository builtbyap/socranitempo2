"use client";
import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/client";
import { 
  InfoIcon, 
  UserCircle, 
  Bell,
  Settings,
  Crown,
  X,
  Lock
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/dashboard-stats";
import QuickActions from "@/components/quick-actions";
import RecentActivity from "@/components/recent-activity";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { DataService } from "@/lib/data-service";
import { ErrorBoundary } from "@/components/error-boundary";

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('🚀 Starting dashboard data fetch...');
        const supabase = createClient();
        
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          setError('Authentication error. Please sign in again.');
          setLoading(false);
          return;
        }
        
        console.log('👤 User data:', user);
        setUser(user);

        if (user) {
          console.log('🔍 Fetching user profile...');
          try {
            // Use DataService to fetch user profile
            const profile = await DataService.getUserProfile(user.id);
            console.log('📋 Profile data:', profile);
            setUserProfile(profile);

            // Check subscription status using DataService
            console.log('🔍 Checking subscription status...');
            const isSub = await DataService.checkUserSubscription(user.id);
            console.log('🎯 Final subscription result:', isSub);
            setIsSubscribed(isSub);
            
            // Redirect non-subscribed users to pricing page
            if (!isSub) {
              console.log('🔄 Redirecting to pricing page...');
              router.push('/pricing');
              return;
            }
            
            console.log('✅ User has active subscription, allowing dashboard access');
          } catch (profileError) {
            console.error('Error fetching user data:', profileError);
            // If there's an error, still allow access but log it
            setError('Unable to load user profile. Some features may be limited.');
          }
        } else {
          // No user found, redirect to sign in
          router.push('/sign-in');
          return;
        }
        
        console.log('✅ Setting loading to false');
        setLoading(false);
      } catch (fetchError) {
        console.error('Unexpected error in dashboard data fetch:', fetchError);
        setError('An unexpected error occurred. Please try refreshing the page.');
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-2">
              <Button 
                onClick={() => window.location.reload()}
                className="w-full"
              >
                Refresh Page
              </Button>
              <Button 
                onClick={() => router.push('/sign-in')}
                variant="outline"
                className="w-full"
              >
                Sign In Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please sign in to access the dashboard.</p>
          <Button 
            onClick={() => router.push('/sign-in')}
            className="mt-4"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  // Show subscription required message while redirecting
  if (!isSubscribed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <Lock className="h-16 w-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Access Required</h2>
            <p className="text-gray-600 mb-6">
              The dashboard is only available to premium subscribers. Please upgrade your plan to continue.
            </p>
            <Button 
              onClick={() => router.push('/pricing')}
              className="w-full"
            >
              View Pricing Plans
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <DashboardNavbar />
      <main className="w-full bg-gray-50 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <header className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Welcome back, {userProfile?.name || user.email}</p>
              </div>
              <div className="flex gap-3">
                <Button 
                  onClick={() => setShowProfile(true)}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <UserCircle className="h-4 w-4" />
                  Profile
                </Button>
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 text-sm p-3 px-4 rounded-lg text-green-800 flex gap-2 items-center">
              <Crown className="h-4 w-4" />
              <span>Premium Access Active - All features unlocked</span>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 text-sm p-3 px-4 rounded-lg text-blue-800 flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Your dashboard is protected and only visible to premium subscribers</span>
            </div>
          </header>

          {/* Profile Modal */}
          {showProfile && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Profile Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowProfile(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{userProfile?.name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant="secondary" className="mt-1">
                        Premium Member
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Member since</span>
                      <span className="text-sm font-medium">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Credits remaining</span>
                      <span className="text-sm font-medium">{userProfile?.credits || 'Unlimited'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subscription</span>
                      <span className="text-sm font-medium">Active</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <DashboardStats userId={user.id} />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <RecentActivity userId={user.id} />
        </div>
      </main>
    </>
  );
}

export default function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
