'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users, Filter, FileText, MessageSquare, Calendar, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
      icon: <Plus className="h-5 w-5" />,
      label: "New Application",
      description: "Submit a new job application",
      onClick: () => router.push("/applications/new"),
      color: "bg-blue-50 hover:bg-blue-100 text-blue-700"
    },
    {
      icon: <Search className="h-5 w-5" />,
      label: "Find Jobs",
      description: "Search for job opportunities",
      onClick: () => router.push("/jobs"),
      color: "bg-green-50 hover:bg-green-100 text-green-700"
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Network",
      description: "Connect with professionals",
      onClick: () => router.push("/network"),
      color: "bg-purple-50 hover:bg-purple-100 text-purple-700"
    },
    {
      icon: <Filter className="h-5 w-5" />,
      label: "Filters",
      description: "Customize your search",
      onClick: () => router.push("/filters"),
      color: "bg-orange-50 hover:bg-orange-100 text-orange-700"
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Resume",
      description: "Update your resume",
      onClick: () => router.push("/resume"),
      color: "bg-indigo-50 hover:bg-indigo-100 text-indigo-700"
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messages",
      description: "View your messages",
      onClick: () => router.push("/messages"),
      color: "bg-pink-50 hover:bg-pink-100 text-pink-700"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Schedule",
      description: "Manage interviews",
      onClick: () => router.push("/schedule"),
      color: "bg-teal-50 hover:bg-teal-100 text-teal-700"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      description: "Account preferences",
      onClick: () => router.push("/settings"),
      color: "bg-gray-50 hover:bg-gray-100 text-gray-700"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Get started with these common tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className={`h-20 flex flex-col gap-2 ${action.color} border-0 hover:shadow-md transition-all`}
              onClick={action.onClick}
            >
              {action.icon}
              <span className="text-xs font-medium">{action.label}</span>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 