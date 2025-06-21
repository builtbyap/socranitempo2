"use client";

import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { signUpAction } from "@/app/actions";
import Navbar from "@/components/navbar";
import { ErrorBoundary } from "@/components/error-boundary";
import React from "react";
import { useSearchParams } from "next/navigation";

// Force dynamic rendering to prevent prerender errors
export const dynamic = 'force-dynamic';

function SignupContent() {
  const searchParams = useSearchParams();
  const [message, setMessage] = React.useState<Message | null>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    
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
  }, [searchParams]);

  // Don't render anything until mounted to prevent hydration issues
  if (!mounted) {
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
          <form action={signUpAction} className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign up</h1>
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-in"
                >
                  Sign in
                </Link>
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="John Doe"
                  required
                  autoComplete="name"
                  className="w-full"
                />
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  placeholder="Your password"
                  minLength={6}
                  required
                  autoComplete="new-password"
                  className="w-full"
                />
              </div>
            </div>

            <SubmitButton
              pendingText="Signing up..."
              className="w-full"
            >
              Sign up
            </SubmitButton>

            {message && <FormMessage message={message} />}
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}

export default function Signup() {
  return (
    <ErrorBoundary>
      <SignupContent />
    </ErrorBoundary>
  );
}
