"use client";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      try {
        console.log('🔍 Navbar: Getting user...');
        const {
          data: { user },
          error: userError
        } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Navbar: Error getting user:', userError);
          setError('Authentication error');
          setLoading(false);
          return;
        }
        
        console.log('👤 Navbar: User data:', user);
        setUser(user);
        
        if (user) {
          // Check subscription status
          try {
            const isSub = await checkUserSubscription(user.id);
            setIsSubscribed(isSub);
          } catch (subscriptionError) {
            console.error('Navbar: Error checking subscription:', subscriptionError);
            // Don't fail the navbar, just log the error
            setIsSubscribed(false);
          }
        }
        
        setLoading(false);
      } catch (getUserError) {
        console.error('Navbar: Unexpected error getting user:', getUserError);
        setError('Failed to load user data');
        setLoading(false);
      }
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      try {
        console.log('🔄 Navbar: Auth state changed:', _event);
        setUser(session?.user ?? null);
        if (session?.user) {
          try {
            const isSub = await checkUserSubscription(session.user.id);
            setIsSubscribed(isSub);
          } catch (subscriptionError) {
            console.error('Navbar: Error checking subscription on auth change:', subscriptionError);
            setIsSubscribed(false);
          }
        } else {
          setIsSubscribed(false);
        }
      } catch (authChangeError) {
        console.error('Navbar: Error handling auth state change:', authChangeError);
        // Don't fail the navbar, just log the error
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSubscription = async (userId: string) => {
    try {
      console.log('🔍 Navbar: Checking subscription for user:', userId);
      const supabase = createClient();
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Navbar: Subscription check error:', error);
        return false;
      }

      const hasSubscription = subscriptions && subscriptions.length > 0;
      console.log('🎯 Navbar: Subscription result:', hasSubscription);
      return hasSubscription;
    } catch (error) {
      console.error('Navbar: Subscription check exception:', error);
      return false;
    }
  };

  const handleDashboardClick = () => {
    try {
      if (isSubscribed) {
        console.log("Dashboard button clicked, navigating to /dashboard");
        router.push("/dashboard");
      } else {
        console.log("User not subscribed, redirecting to pricing");
        router.push("/pricing");
      }
    } catch (error) {
      console.error('Navbar: Error handling dashboard click:', error);
      // Fallback to home page
      router.push("/");
    }
  };

  const handleTestClick = () => {
    try {
      console.log("Test button clicked, navigating to /dashboard/test");
      router.push("/dashboard/test");
    } catch (error) {
      console.error('Navbar: Error handling test click:', error);
      // Fallback to home page
      router.push("/");
    }
  };

  const handleSignOut = async () => {
    try {
      console.log('🚪 Navbar: Signing out...');
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
    } catch (error) {
      console.error('Navbar: Error signing out:', error);
      // Force redirect to home page
      window.location.href = "/";
    }
  };

  // Error state - show minimal navbar
  if (error) {
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            ReferralPro
          </Link>
          <div className="flex gap-4 items-center">
            <Link
              href="/sign-in"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  if (loading) {
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/" className="text-xl font-bold">
            ReferralPro
          </Link>
          <div className="flex gap-4 items-center">
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-8 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          ReferralPro
        </Link>
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <Button onClick={handleDashboardClick} className="bg-blue-600 hover:bg-blue-700">
                {isSubscribed ? "Dashboard" : "Upgrade to Access"}
              </Button>
              <Button onClick={handleTestClick} variant="outline" size="sm">
                Test
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Sign In
              </Link>
              <Link
                href="/sign-up"
                className="px-4 py-2 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
