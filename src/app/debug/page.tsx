"use client";

import { checkDatabaseConnection, checkEnvironment } from "@/app/actions";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DebugPage() {
  const [dbStatus, setDbStatus] = useState<any>(null);
  const [envStatus, setEnvStatus] = useState<any>(null);
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

  const checkEnv = () => {
    const result = checkEnvironment();
    setEnvStatus(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>System Diagnostics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Environment Variables Check */}
          <div>
            <Button 
              onClick={checkEnv} 
              variant="outline"
              className="w-full mb-3"
            >
              Check Environment Variables
            </Button>
            
            {envStatus && (
              <div className={`p-4 rounded-lg ${
                envStatus.success 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                <h3 className="font-semibold">
                  {envStatus.success ? "✅ Environment OK" : "❌ Environment Issues"}
                </h3>
                <div className="text-sm mt-2 space-y-1">
                  <p>Supabase URL: {envStatus.hasUrl ? "✅ Set" : "❌ Missing"}</p>
                  <p>Supabase Key: {envStatus.hasKey ? "✅ Set" : "❌ Missing"}</p>
                  {envStatus.missing.length > 0 && (
                    <p className="font-semibold">Missing: {envStatus.missing.join(", ")}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Database Connection Test */}
          <div>
            <Button 
              onClick={testDatabase} 
              disabled={loading}
              className="w-full mb-3"
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
                  {dbStatus.success ? "✅ Database OK" : "❌ Database Error"}
                </h3>
                <p className="text-sm mt-1">
                  {dbStatus.message || dbStatus.error}
                </p>
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 space-y-2">
            <p>This page helps diagnose sign-up issues.</p>
            <p>If environment variables are missing, add them to your <code>.env.local</code> file:</p>
            <div className="bg-gray-100 p-3 rounded text-xs font-mono">
              NEXT_PUBLIC_SUPABASE_URL=your_supabase_url<br/>
              NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 