"use client";

import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { authClient } from "@/lib/auth-client";

export default function GoogleSignInButton({ onError, callbackURL = "/complete-profile" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
      });

      if (error) {
        onError?.(error.message || "Google authentication failed.");
        setIsLoading(false);
      }
    } catch {
      onError?.("Google authentication failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleSignIn}
      disabled={isLoading}
      className="mt-5 w-full border border-border bg-white px-4 py-3 rounded-sm font-body text-sm text-on-surface flex items-center justify-center gap-3 transition-colors hover:border-brand hover:text-brand disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <FcGoogle className="text-xl" aria-hidden />
      <span>{isLoading ? "Connecting to Google..." : "Continue with Google"}</span>
    </button>
  );
}
