"use client";

import { signInAction, resendConfirmationEmail } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ErrorBoundary } from "@/components/error-boundary";
import React from "react";
import { useSearchParams } from "next/navigation";

function SignInContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = React.useState<Message | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadSearchParams = async () => {
      try {
        setLoading(true);
        // Parse search params from URL
        const success = searchParams.get('success');
        const error = searchParams.get('error');
        const messageText = searchParams.get('message');
        
        if (success) {
          setMessage({ success });
        } else if (error) {
          setMessage({ error });
        } else if (messageText) {
          setMessage({ message: messageText });
        }
      } catch (error) {
        console.error('Error loading search params:', error);
        setError('Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    loadSearchParams();
  }, [searchParams]);

  // Error state
  if (error) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (message && ("message" in message || "success" in message || "error" in message)) {
    return (
      <div className="flex h-screen w-full flex-1 items-center justify-center p-4 sm:max-w-md">
        <FormMessage message={message} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password
                  </Label>
                  <Link
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  required
                  autoComplete="current-password"
                  className="w-full"
                />
              </div>
            </div>

            <SubmitButton
              className="w-full"
              pendingText="Signing in..."
              formAction={signInAction}
            >
              Sign in
            </SubmitButton>

            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-2">
                Didn't receive confirmation email?
              </p>
              <form action={resendConfirmationEmail} className="inline">
                <input type="hidden" name="email" id="resend-email" />
                <button
                  type="submit"
                  className="text-xs text-primary hover:underline transition-all"
                  onClick={() => {
                    const emailInput = document.getElementById('email') as HTMLInputElement;
                    const resendEmailInput = document.getElementById('resend-email') as HTMLInputElement;
                    if (emailInput && resendEmailInput) {
                      resendEmailInput.value = emailInput.value;
                    }
                  }}
                >
                  Resend confirmation email
                </button>
              </form>
            </div>

            {message && <FormMessage message={message} />}
          </form>
        </div>
      </div>
    </>
  );
}

export default function SignInPage() {
  return (
    <ErrorBoundary>
      <SignInContent />
    </ErrorBoundary>
  );
}
