'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, ExternalLink, MoreHorizontal } from "lucide-react";
import { useState, useEffect } from "react";
import { DataService } from "@/lib/data-service";

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

interface RecentActivityProps {
  userId: string;
}

export default function RecentActivity({ userId }: RecentActivityProps) {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentActivity = async () => {
      try {
        const recentActivity = await DataService.getRecentActivity(userId, 5);
        
        // Transform the data to match our ActivityItem interface
        const transformedActivities: ActivityItem[] = recentActivity.map((item: any) => {
          const timeAgo = getTimeAgo(new Date(item.time));
          
          return {
            id: item.id,
            type: item.type,
            title: item.title,
            description: item.description,
            time: timeAgo,
            status: item.status,
            company: item.company,
            color: getActivityColor(item.type),
            bgColor: getActivityBgColor(item.type)
          };
        });

        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching recent activity:', error);
        // Fallback to empty array
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchRecentActivity();
    }
  }, [userId]);

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} weeks ago`;
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'application': return 'bg-green-500';
      case 'interview': return 'bg-blue-500';
      case 'referral': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getActivityBgColor = (type: string): string => {
    switch (type) {
      case 'application': return 'bg-green-50';
      case 'interview': return 'bg-blue-50';
      case 'referral': return 'bg-yellow-50';
      default: return 'bg-gray-50';
    }
  };

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
    if (time.includes('minute')) return <Clock className="h-3 w-3" />;
    if (time.includes('hour')) return <Clock className="h-3 w-3" />;
    if (time.includes('day')) return <Clock className="h-3 w-3" />;
    if (time.includes('week')) return <Clock className="h-3 w-3" />;
    return <Clock className="h-3 w-3" />;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest job search activities</CardDescription>
          </div>
          <Button variant="outline" size="sm" disabled>
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
          {activities.length > 0 ? (
            activities.map((activity) => (
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
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No recent activity</p>
              <p className="text-sm">Start by submitting your first application!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 