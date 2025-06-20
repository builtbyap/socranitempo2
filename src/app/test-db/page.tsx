"use client";
import { createClient } from "../../../supabase/client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestDB() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [insertResults, setInsertResults] = useState<any>(null);
  const [insertLoading, setInsertLoading] = useState(false);

  const testDatabase = async () => {
    setLoading(true);
    const supabase = createClient();
    
    try {
      // Test 1: Check if we can connect
      console.log("Testing database connection...");
      
      // Test 2: Check users table
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('*')
        .limit(5);
      
      console.log("Users query result:", { users, usersError });
      
      // Test 3: Check subscriptions table
      const { data: subscriptions, error: subscriptionsError } = await supabase
        .from('subscriptions')
        .select('*')
        .limit(5);
      
      console.log("Subscriptions query result:", { subscriptions, subscriptionsError });
      
      // Test 4: Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      console.log("Current user:", { user, userError });
      
      setResults({
        users: { data: users, error: usersError },
        subscriptions: { data: subscriptions, error: subscriptionsError },
        currentUser: { user, error: userError }
      });
      
    } catch (error) {
      console.error("Test failed:", error);
      setResults({ error: error instanceof Error ? error.message : 'An unknown error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const testDataInsertion = async () => {
    setInsertLoading(true);
    
    try {
      // Test data insertion via API
      const response = await fetch('/api/test-db', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log("Insertion test result:", data);
      setInsertResults(data);
      
    } catch (error) {
      console.error("Insertion test failed:", error);
      setInsertResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setInsertLoading(false);
    }
  };

  const testApiConnection = async () => {
    setLoading(true);
    
    try {
      // Test API connection
      const response = await fetch('/api/test-db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      console.log("API test result:", data);
      setResults(data);
      
    } catch (error) {
      console.error("API test failed:", error);
      setResults({ 
        success: false, 
        error: error instanceof Error ? error.message : 'An unknown error occurred' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Database Test Page</h1>
      
      <div className="space-y-4 mb-6">
        <Button onClick={testDatabase} disabled={loading} className="mr-4">
          {loading ? "Testing..." : "Test Client Connection"}
        </Button>
        
        <Button onClick={testApiConnection} disabled={loading} className="mr-4">
          {loading ? "Testing..." : "Test API Connection"}
        </Button>
        
        <Button onClick={testDataInsertion} disabled={insertLoading} variant="outline">
          {insertLoading ? "Testing..." : "Test Data Insertion"}
        </Button>
      </div>
      
      {results && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Connection Results:</h2>
          
          {results.error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {results.error}
            </div>
          ) : (
            <>
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                <h3 className="font-semibold">Users Table:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(results.users, null, 2)}
                </pre>
              </div>
              
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <h3 className="font-semibold">Subscriptions Table:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(results.subscriptions, null, 2)}
                </pre>
              </div>
              
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
                <h3 className="font-semibold">Current User:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(results.currentUser, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
      
      {insertResults && (
        <div className="space-y-4 mt-6">
          <h2 className="text-xl font-semibold">Insertion Results:</h2>
          
          {insertResults.error ? (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <strong>Error:</strong> {insertResults.error}
            </div>
          ) : (
            <>
              <div className="bg-purple-100 border border-purple-400 text-purple-700 px-4 py-3 rounded">
                <h3 className="font-semibold">User Insertion:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(insertResults.userInsert, null, 2)}
                </pre>
              </div>
              
              <div className="bg-indigo-100 border border-indigo-400 text-indigo-700 px-4 py-3 rounded">
                <h3 className="font-semibold">Subscription Insertion:</h3>
                <pre className="mt-2 text-sm overflow-auto">
                  {JSON.stringify(insertResults.subscriptionInsert, null, 2)}
                </pre>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 