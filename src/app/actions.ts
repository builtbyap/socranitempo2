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
          name: fullName,
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
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Verify the user was created in the database by the trigger
    try {
      const { data: verifyUser, error: verifyError } = await supabase
        .from('users')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (verifyError || !verifyUser) {
        console.log("Trigger may have failed, attempting manual user creation...");
        
        // Fallback: manually create the user profile with correct schema
        const userProfileData = {
          id: user.id,
          user_id: user.id,
          name: fullName,
          email: email,
          token_identifier: email, // Use email as token_identifier per schema
          full_name: fullName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: manualInsertError } = await supabase
          .from('users')
          .insert(userProfileData);

        if (manualInsertError) {
          console.error("Manual user creation failed:", manualInsertError);
          return encodedRedirect(
            "error",
            "/sign-up",
            "User created but profile setup failed. Please contact support.",
          );
        }

        console.log("User profile created manually");
      } else {
        console.log("User verified in database:", verifyUser);
      }

    } catch (profileException) {
      console.error("Exception during profile verification:", profileException);
      return encodedRedirect(
        "error",
        "/sign-up",
        "Error verifying user profile. Please try again.",
      );
    }

    console.log("Sign-up process completed successfully");
    
    // Create a free tier subscription for the new user with correct schema
    try {
      console.log("Creating free tier subscription for user:", user.id);
      const subscriptionData = {
        user_id: user.id,
        status: 'active',
        price_id: 'free_tier',
        stripe_price_id: 'free_tier',
        currency: 'usd',
        interval: 'year',
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor((Date.now() + 365 * 24 * 60 * 60 * 1000) / 1000), // 1 year from now
        cancel_at_period_end: false,
        amount: 0,
        started_at: Math.floor(Date.now() / 1000),
        ends_at: null,
        ended_at: null,
        canceled_at: null,
        customer_cancellation_reason: null,
        customer_cancellation_comment: null,
        metadata: { plan: 'free_tier', source: 'signup' },
        custom_field_data: null,
        customer_id: null,
      };

      const { error: subscriptionError } = await supabase
        .from('subscriptions')
        .insert(subscriptionData);

      if (subscriptionError) {
        console.error("Failed to create subscription:", subscriptionError);
        // Don't fail the signup, just log the error
      } else {
        console.log("Free tier subscription created successfully");
      }
    } catch (subscriptionException) {
      console.error("Exception creating subscription:", subscriptionException);
      // Don't fail the signup, just log the error
    }
    
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

    const { data: subscriptions, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) {
      console.error('Subscription check error:', error);
      return false;
    }

    // Check if any active subscriptions exist
    return subscriptions && subscriptions.length > 0;
  } catch (error) {
    console.error('Subscription check exception:', error);
    return false;
  }
};
