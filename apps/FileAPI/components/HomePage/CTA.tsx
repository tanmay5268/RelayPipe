"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import { Reveal } from "./Reveal";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { Logo } from "./Logo";
import { useToast } from "@/components/ui/toast-context";
import { registerUser } from "@/actions";

export default function CTA() {
  const { isSignedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [isRegistering, setIsRegistering] = useState(false);

  const handleStart = async () => {
    if (!isSignedIn) {
      showToast(
        "warning",
        "Sign in to start",
        "You need to be logged in to run a file through the pipeline.",
        5000,
      );
      return;
    }
    setIsRegistering(true);
    try {
      await registerUser();
      router.push("/project");
    } catch (err) {
      console.error("registerUser failed:", err);
      showToast(
        "error",
        "Something went wrong",
        "We couldn't set up your workspace. Please try again.",
        5000,
      );
      setIsRegistering(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_60%)] px-6 py-16 text-center sm:px-12 sm:py-20">
          {/* decorative mini-pipeline */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-center gap-4 pt-5 opacity-70"
          >
            <span className="h-1 w-10 rounded-full bg-primary/50" />
            <Logo className="size-7" />
            <span className="h-1 w-10 rounded-full bg-primary/50" />
          </div>

          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold tracking-tight text-balance sm:text-5xl sm:leading-[1.08]">
            Ready to see a file{" "}
            <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
              move?
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Sign in, drop a file, and watch every stage of the pipeline happen
            live on your screen. It takes about thirty seconds.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isSignedIn ? (
              <button
                onClick={handleStart}
                disabled={isRegistering}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_12px_32px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-all duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
              >
                {isRegistering ? (
                  <>
                    <CircleNotch weight="bold" className="size-5 animate-spin" />
                    Setting things up…
                  </>
                ) : (
                  <>
                    Upload your first file
                    <ArrowRight
                      weight="bold"
                      className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-8 text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_12px_32px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-all duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto">
                  Start watching
                  <ArrowRight
                    weight="bold"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </SignUpButton>
            )}
            <p className="font-mono text-xs text-muted-foreground">
              free to try · no setup · no config
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}