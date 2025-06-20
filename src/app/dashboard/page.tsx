import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "../../../supabase/server";
import { 
  InfoIcon, 
  UserCircle, 
  Bell,
  Settings,
  Crown
} from "lucide-react";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DashboardStats from "@/components/dashboard-stats";
import QuickActions from "@/components/quick-actions";
import RecentActivity from "@/components/recent-activity";

export default async function Dashboard() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile data
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  // Check subscription status
  const isSubscribed = await checkUserSubscription(user.id);

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
            
            {/* Subscription Status */}
            {!isSubscribed && (
              <div className="bg-yellow-50 border border-yellow-200 text-sm p-3 px-4 rounded-lg text-yellow-800 flex gap-2 items-center">
                <Crown className="h-4 w-4" />
                <span>Upgrade to Premium to unlock all features</span>
                <Button size="sm" className="ml-auto">
                  Upgrade Now
                </Button>
              </div>
            )}
            
            <div className="bg-blue-50 border border-blue-200 text-sm p-3 px-4 rounded-lg text-blue-800 flex gap-2 items-center">
              <InfoIcon size="14" />
              <span>Your dashboard is protected and only visible to authenticated users</span>
            </div>
          </header>

          {/* Stats Grid */}
          <DashboardStats />

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* User Profile Section */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCircle className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <UserCircle className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{userProfile?.name || 'User'}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <Badge variant={isSubscribed ? "secondary" : "outline"} className="mt-1">
                        {isSubscribed ? "Premium Member" : "Free Member"}
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
                      <span className="text-sm font-medium">{isSubscribed ? 'Active' : 'Free Plan'}</span>
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    Edit Profile
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

// Helper function to check subscription
async function checkUserSubscription(userId: string) {
  try {
    const supabase = await createClient();
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      return false;
    }

    return !!subscription;
  } catch (error) {
    return false;
  }
}
