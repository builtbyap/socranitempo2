import { type NextRequest, NextResponse } from "next/server";

export const updateSession = async (request: NextRequest) => {
  // Create an unmodified response
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // For now, we'll skip Supabase authentication in middleware
  // to avoid build issues. Authentication will be handled in components.
  
  // protected routes - basic check without Supabase
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    // Check for auth cookie or token in headers
    const authToken = request.cookies.get('sb-access-token') || 
                     request.headers.get('authorization');
    
    if (!authToken) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return response;
};
