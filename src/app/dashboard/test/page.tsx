import { createClient } from "../../../../supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardTest() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Dashboard Test Page</h1>
        <p className="text-gray-600 mb-4">If you can see this, the dashboard routing is working!</p>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-green-800">
            <strong>User ID:</strong> {user.id}
          </p>
          <p className="text-green-800">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
      </div>
    </div>
  );
} 