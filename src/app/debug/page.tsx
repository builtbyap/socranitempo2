"use client";

import { checkDatabaseConnection } from "@/app/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    try {
      const result = await checkDatabaseConnection();
      setDbStatus(result);
    } catch (error) {
      setDbStatus({ success: false, error: "Test failed" });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Database Debug</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={testDatabase} 
            disabled={loading}
            className="w-full"
          >
            {loading ? "Testing..." : "Test Database Connection"}
          </Button>
          
          {dbStatus && (
            <div className={`p-4 rounded-lg ${
              dbStatus.success 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
            }`}>
              <h3 className="font-semibold">
                {dbStatus.success ? "✅ Success" : "❌ Error"}
              </h3>
              <p className="text-sm mt-1">
                {dbStatus.message || dbStatus.error}
              </p>
            </div>
          )}
          
          <div className="text-sm text-gray-600">
            <p>This page helps diagnose database connection issues.</p>
            <p className="mt-2">
              If the test fails, check your Supabase environment variables:
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>NEXT_PUBLIC_SUPABASE_URL</li>
              <li>NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 