"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

// Check environment variables
export const checkEnvironment = () => {
  const envVars = {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  };

  const missing = Object.entries(envVars)
    .filter(([key, value]) => !value)
    .map(([key]) => key);

  return {
    success: missing.length === 0,
    missing,
    hasUrl: !!envVars.supabaseUrl,
    hasKey: !!envVars.supabaseKey,
  };
};

// Diagnostic function to check database connection and table structure
export const checkDatabaseConnection = async () => {
  try {
    const supabase = await createClient();
    
    // Test basic connection
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error("Database connection test failed:", error);
      return { success: false, error: error.message };
    }
    
    return { success: true, message: "Database connection successful" };
  } catch (err) {
    console.error("Database connection exception:", err);
    return { success: false, error: "Database connection failed" };
  }
};

export const signUpAction = async (formData: FormData) => {
  try {
    // Validate environment variables first
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Missing Supabase environment variables");
      return encodedRedirect(
        "error",
        "/sign-up",
        "Configuration error. Please contact support.",
      );
    }

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const fullName = formData.get("full_name")?.toString() || '';

    console.log("Form data received:", { email, fullName, passwordLength: password?.length });

    if (!email || !password) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Email and password are required",
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Please enter a valid email address",
      );
    }

    // Validate password length
    if (password.length < 6) {
      return encodedRedirect(
        "error",
        "/sign-up",
        "Password must be at least 6 characters long",
      );
    }

    console.log("Starting sign-up process for:", email);

    // Create Supabase client
    let supabase;
    try {
      supabase = await createClient();
    } catch (clientError) {
      console.error("Failed to create Supabase client:", clientError);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Unable to connect to authentication service. Please try again.",
      );
    }

    // Create the user in Supabase Auth (the database trigger will handle creating the user profile)
    console.log("Creating user in Supabase Auth...");
    const { data: { user }, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          email: email,
        }
      },
    });

    if (authError) {
      console.error("Auth error:", authError);
      return encodedRedirect("error", "/sign-up", authError.message);
    }

    if (!user) {
      console.error("No user returned from auth signup");
      return encodedRedirect(
        "error", 
        "/sign-up", 
        "Failed to create user account. Please try again."
      );
    }

    console.log("User created in auth:", user.id);

    // Wait a moment for the database trigger to create the user profile
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Verify the user was created in the database by the trigger
    try {
      const { data: verifyUser, error: verifyError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (verifyError) {
        console.error("Verification error:", verifyError);
        return encodedRedirect(
          "error",
          "/sign-up",
          "User created but verification failed. Please contact support.",
        );
      }

      if (!verifyUser) {
        console.error("User not found in database after creation");
        return encodedRedirect(
          "error",
          "/sign-up",
          "User created but not found in database. Please contact support.",
        );
      }

      console.log("User verified in database:", verifyUser);

    } catch (profileException) {
      console.error("Exception during profile verification:", profileException);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Error verifying user profile. Please try again.",
      );
    }

    console.log("Sign-up process completed successfully");
    return encodedRedirect(
      "success",
      "/sign-up",
      "Thanks for signing up! Please check your email for a verification link.",
    );

  } catch (exception) {
    console.error("Unexpected error during signup:", exception);
    
    // Provide more specific error information
    if (exception instanceof Error) {
      console.error("Error details:", exception.message);
      console.error("Error stack:", exception.stack);
    }
    
    return encodedRedirect(
      "error",
      "/sign-up",
      "An unexpected error occurred. Please try again or contact support.",
    );
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return encodedRedirect("error", "/sign-in", error.message);
  }

  return redirect("/dashboard");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {});

  if (error) {
    return encodedRedirect(
      "error",
      "/forgot-password",
      "Could not reset password",
    );
  }

  if (callbackUrl) {
    return redirect(callbackUrl);
  }

  return encodedRedirect(
    "success",
    "/forgot-password",
    "Check your email for a link to reset your password.",
  );
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/dashboard/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};

export const checkUserSubscription = async (userId: string) => {
  try {
    const supabase = await createClient();

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      console.error('Subscription check error:', error);
      return false;
    }

    return !!subscription;
  } catch (error) {
    console.error('Subscription check exception:', error);
    return false;
  }
};
