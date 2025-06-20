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
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        // Check subscription status
        const isSub = await checkUserSubscription(user.id);
        setIsSubscribed(isSub);
      }
      
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const isSub = await checkUserSubscription(session.user.id);
        setIsSubscribed(isSub);
      } else {
        setIsSubscribed(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUserSubscription = async (userId: string) => {
    try {
      const supabase = createClient();
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active');

      if (error) {
        console.error('Subscription check error:', error);
        return false;
      }

      return subscriptions && subscriptions.length > 0;
    } catch (error) {
      console.error('Subscription check exception:', error);
      return false;
    }
  };

  const handleDashboardClick = () => {
    if (isSubscribed) {
      console.log("Dashboard button clicked, navigating to /dashboard");
      router.push("/dashboard");
    } else {
      console.log("User not subscribed, redirecting to pricing");
      router.push("/pricing");
    }
  };

  const handleTestClick = () => {
    console.log("Test button clicked, navigating to /dashboard/test");
    router.push("/dashboard/test");
  };

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
                  <DropdownMenuItem
                    onClick={async () => {
                      const supabase = createClient();
                      await supabase.auth.signOut();
                      router.push("/");
                    }}
                  >
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
