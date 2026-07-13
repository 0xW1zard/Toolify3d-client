"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import AuthPageLayout from "@/components/auth/AuthPageLayout";
import { useToast } from "@/components/providers/ToastProvider";
import { useApi } from "@/components/providers/ApiProvider";
import { apiFetch } from "@/lib/api/client";
import { authClient } from "@/lib/auth-client";
import { hasPhoneNumber, isValidPhone } from "@/lib/auth/phone";

const inputClassName =
  "w-full bg-white border border-outline-variant px-4 py-3 rounded-sm font-body text-on-surface transition-all placeholder:text-outline focus:outline-2 focus:outline-brand focus:outline-offset-2";

function CompleteProfileLoading() {
  return (
    <AuthPageLayout footerLeft="Verifying session..." footerRight="PROFILE_GATE">
      <div className="bg-white text-dark p-8 rounded-sm shadow-2xl border border-border text-center">
        <p className="font-mono text-sm text-brand tracking-wide">{"// CHECKING_PROFILE"}</p>
        <p className="font-body text-secondary mt-2">One moment...</p>
      </div>
    </AuthPageLayout>
  );
}

function CompleteProfileForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { session, isPending, tokenReady } = useApi();

  const [phone, setPhone] = useState("");
  const [isChecking, setIsChecking] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const nextPath = searchParams.get("next") || "/";

  useEffect(() => {
    if (isPending) return;

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    if (!tokenReady) return;

    let cancelled = false;

    async function checkExistingPhone() {
      try {
        const profile = await apiFetch("/profile");
        if (cancelled) return;

        if (hasPhoneNumber(session, profile)) {
          router.replace(nextPath);
          return;
        }

        const existingPhone = profile.phone || session.user.phone || "";
        if (existingPhone) setPhone(existingPhone);
      } catch {
        if (!cancelled && hasPhoneNumber(session)) {
          router.replace(nextPath);
          return;
        }
      } finally {
        if (!cancelled) setIsChecking(false);
      }
    }

    checkExistingPhone();

    return () => {
      cancelled = true;
    };
  }, [isPending, session, tokenReady, router, nextPath]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedPhone = phone.trim();
    if (!isValidPhone(trimmedPhone)) {
      showToast("Enter a valid phone number for order updates.", "error");
      return;
    }

    setIsSaving(true);

    try {
      await Promise.all([
        authClient.updateUser({ phone: trimmedPhone }),
        apiFetch("/profile", {
          method: "PATCH",
          body: JSON.stringify({ phone: trimmedPhone }),
        }),
      ]);

      showToast("Profile updated. You're all set.", "success");
      router.replace(nextPath);
    } catch {
      showToast("Could not save your phone number. Please try again.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session?.user || !tokenReady || isChecking) {
    return <CompleteProfileLoading />;
  }

  return (
    <AuthPageLayout footerLeft="Profile completion required" footerRight="OAUTH_ONBOARDING">
      <div className="bg-white text-dark p-8 rounded-sm shadow-2xl border border-border">
        <header className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <Link
              href="/"
              className="font-display text-2xl font-extrabold tracking-tighter text-on-background hover:text-brand transition-colors"
            >
              TOOLIFY 3D
            </Link>
            <span className="font-mono text-sm text-brand tracking-wide">
              {"// COMPLETE_PROFILE"}
            </span>
          </div>
          <h1 className="font-display text-[32px] leading-tight font-bold mb-1">
            Almost there
          </h1>
          <p className="font-body text-secondary">
            Add a phone number so we can reach you about your 3D print orders.
          </p>
        </header>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block font-mono text-sm text-secondary uppercase tracking-widest"
            >
              Phone Number
            </label>
            <input
              id="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+880XXXXXXXXXX"
              className={inputClassName}
            />
            <span className="block font-mono text-[10px] text-brand tracking-tight">
              {"// USED FOR ORDER UPDATES"}
            </span>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full bg-black text-white font-display text-xl font-bold py-4 rounded-sm flex items-center justify-center gap-2 group transition-colors hover:bg-brand hover:text-dark active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span>SAVING...</span>
                <span
                  className="size-5 border-2 border-white/20 border-l-white rounded-full animate-spin"
                  aria-hidden
                />
              </>
            ) : (
              <>
                <span>CONTINUE</span>
                <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>
      </div>
    </AuthPageLayout>
  );
}

export default function CompleteProfilePage() {
  return (
    <Suspense fallback={<CompleteProfileLoading />}>
      <CompleteProfileForm />
    </Suspense>
  );
}
