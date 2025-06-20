'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface ActivityItem {
  id: string;
  type: 'application' | 'interview' | 'referral' | 'profile';
  title: string;
  description: string;
  time: string;
  status: 'applied' | 'scheduled' | 'pending' | 'updated' | 'completed';
  company?: string;
  color: string;
  bgColor: string;
}

export default function RecentActivity() {
  const [activities] = useState<ActivityItem[]>([
    {
      id: '1',
      type: 'application',
      title: 'Application submitted to Google',
      description: 'Software Engineer - Mountain View, CA',
      time: '2 hours ago',
      status: 'applied',
      company: 'Google',
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      id: '2',
      type: 'interview',
      title: 'Interview scheduled with Microsoft',
      description: 'Senior Developer - Redmond, WA',
      time: '1 day ago',
      status: 'scheduled',
      company: 'Microsoft',
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: '3',
      type: 'referral',
      title: 'Referral request sent to John Doe',
      description: 'Senior Engineer at Apple',
      time: '3 days ago',
      status: 'pending',
      company: 'Apple',
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50'
    },
    {
      id: '4',
      type: 'profile',
      title: 'Profile updated',
      description: 'Skills and experience updated',
      time: '1 week ago',
      status: 'updated',
      color: 'bg-gray-500',
      bgColor: 'bg-gray-50'
    },
    {
      id: '5',
      type: 'application',
      title: 'Application submitted to Amazon',
      description: 'Frontend Developer - Seattle, WA',
      time: '1 week ago',
      status: 'completed',
      company: 'Amazon',
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    }
  ]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      applied: { label: 'Applied', variant: 'secondary' as const },
      scheduled: { label: 'Scheduled', variant: 'secondary' as const },
      pending: { label: 'Pending', variant: 'secondary' as const },
      updated: { label: 'Updated', variant: 'secondary' as const },
      completed: { label: 'Completed', variant: 'secondary' as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getTimeIcon = (time: string) => {
    if (time.includes('hour')) return <Clock className="h-3 w-3" />;
    if (time.includes('day')) return <Clock className="h-3 w-3" />;
    if (time.includes('week')) return <Clock className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest job search activities</CardDescription>
        </div>
        <Button variant="outline" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`flex items-center gap-4 p-3 ${activity.bgColor} rounded-lg hover:shadow-sm transition-shadow cursor-pointer`}
            >
              <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate">{activity.title}</p>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <MoreHorizontal className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground truncate">{activity.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  {getTimeIcon(activity.time)}
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                  {activity.company && (
                    <span className="text-xs text-muted-foreground">• {activity.company}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(activity.status)}
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 