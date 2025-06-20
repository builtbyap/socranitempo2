import { checkEnvironment, checkDatabaseConnection } from "@/app/actions";
import { createClient } from "../../supabase/server";

export default async function DebugPage() {
  const envCheck = checkEnvironment();
  const dbCheck = await checkDatabaseConnection();
  
  let users = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('users').select('*').limit(5);
    if (!error && data) {
      users = data;
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Debug Information</h1>
      
      <div className="grid gap-6">
        {/* Environment Variables */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {envCheck.success ? "✅ All set" : "❌ Missing variables"}</p>
            <p><strong>Supabase URL:</strong> {envCheck.hasUrl ? "✅ Present" : "❌ Missing"}</p>
            <p><strong>Supabase Key:</strong> {envCheck.hasKey ? "✅ Present" : "❌ Missing"}</p>
            {envCheck.missing.length > 0 && (
              <p><strong>Missing:</strong> {envCheck.missing.join(", ")}</p>
            )}
          </div>
        </div>

        {/* Database Connection */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Database Connection</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {dbCheck.success ? "✅ Connected" : "❌ Failed"}</p>
            {dbCheck.error && <p><strong>Error:</strong> {dbCheck.error}</p>}
            {dbCheck.message && <p><strong>Message:</strong> {dbCheck.message}</p>}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Users in Database (Last 5)</h2>
          {users.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user: any) => (
                    <tr key={user.id} className="border-b">
                      <td className="px-4 py-2">{user.id}</td>
                      <td className="px-4 py-2">{user.name || user.full_name || 'N/A'}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No users found in database</p>
          )}
        </div>

        {/* Test Sign-up Form */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Test Sign-up Form</h2>
          <p className="text-sm text-gray-600 mb-4">
            Use this form to test if sign-up data is being sent to Supabase correctly.
          </p>
          <form action="/api/test-signup" method="POST" className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="full_name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Test User"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                required
                minLength={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="password123"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Test Sign-up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 