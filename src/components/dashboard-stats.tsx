'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Briefcase, Calendar, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

function StatCard({ title, value, change, icon, onClick }: StatCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ArrowUpRight className="h-3 w-3 text-green-500" />
          {change}
        </p>
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  const stats = [
    {
      title: "Total Referrals",
      value: "24",
      change: "+12% from last month",
      icon: <Users className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View referrals")
    },
    {
      title: "Active Applications",
      value: "8",
      change: "+3 new this week",
      icon: <Briefcase className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View applications")
    },
    {
      title: "Interviews Scheduled",
      value: "3",
      change: "Next: Tomorrow 2:00 PM",
      icon: <Calendar className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View interviews")
    },
    {
      title: "Success Rate",
      value: "85%",
      change: "+5% from last month",
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      onClick: () => console.log("View analytics")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
} 