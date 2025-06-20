'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Briefcase, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { DataService } from "@/lib/data-service";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  onClick?: () => void;
  loading?: boolean;
}

function StatCard({ title, value, change, icon, onClick, loading }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            value
          )}
        </div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-green-500" />
          {loading ? (
            <div className="h-3 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            change
          )}
        </p>
      </CardContent>
    </Card>
  );
}

interface DashboardStatsProps {
  userId: string;
}

export default function DashboardStats({ userId }: DashboardStatsProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userStats = await DataService.getUserStats(userId);
        setStats(userStats);
      } catch (error) {
        console.error('Error fetching user stats:', error);
        // Fallback to default stats
        setStats({
          total_applications: 0,
          active_applications: 0,
          total_interviews: 0,
          scheduled_interviews: 0,
          total_connections: 0,
          total_referrals: 0,
          unread_messages: 0
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  const statsData = [
    {
      title: "Total Applications",
      value: stats?.total_applications || 0,
      change: "+2 this week",
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View applications")
    },
    {
      title: "Active Applications",
      value: stats?.active_applications || 0,
      change: "Currently tracking",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View active applications")
    },
    {
      title: "Scheduled Interviews",
      value: stats?.scheduled_interviews || 0,
      change: "Next: Tomorrow 2:00 PM",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View interviews")
    },
    {
      title: "Network Connections",
      value: stats?.total_connections || 0,
      change: "+5 this month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View network")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <StatCard key={index} {...stat} loading={loading} />
      ))}
    </div>
  );
} 