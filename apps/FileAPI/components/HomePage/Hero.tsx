"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { SignUpButton } from "@clerk/nextjs";
import {
  motion,
  AnimatePresence,
  type Variants,
} from "framer-motion";
import { useToast } from "@/components/ui/toast-context";
import { registerUser } from "@/actions";
import { Logo } from "./Logo";
import {
  ArrowRight,
  CircleNotch,
  TerminalWindow,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 26, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

type LogType = "queue" | "worker" | "process" | "done";

const logLines: { time: string; type: LogType; msg: string }[] = [
  { time: "12:04:11", type: "queue", msg: "job_9f2k1 queued — waiting for a worker" },
  { time: "12:04:12", type: "worker", msg: "worker-03 picked up job_9f2k1" },
  { time: "12:04:12", type: "process", msg: "processing photo.jpg · 4.2 MB" },
  { time: "12:04:18", type: "process", msg: "photo.jpg · 4.2 MB · done in 6.1s" },
  { time: "12:04:19", type: "done", msg: "job_9f2k1 delivered — output ready" },
  { time: "12:04:21", type: "queue", msg: "job_9f2k2 queued — waiting for a worker" },
  { time: "12:04:22", type: "worker", msg: "worker-07 picked up job_9f2k2" },
  { time: "12:04:23", type: "process", msg: "processing report.pdf · 1.1 MB" },
];

const logColor: Record<LogType, string> = {
  queue: "text-muted-foreground",
  worker: "text-primary",
  process: "text-sky-400",
  done: "text-emerald-400",
};

const logPrefix: Record<LogType, string> = {
  queue: "●",
  worker: "▸",
  process: "…",
  done: "✓",
};

const stages = [
  { label: "Queued", caption: "in line", dot: "bg-zinc-500" },
  { label: "Processing", caption: "working", dot: "bg-primary animate-relay-blink" },
  { label: "Delivered", caption: "done", dot: "bg-emerald-400" },
];

export default function Hero() {
  const { isSignedIn } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const [logCount, setLogCount] = useState(3);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setLogCount((prev) => (prev >= logLines.length ? 3 : prev + 1));
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const visibleLogs = logLines.slice(Math.max(0, logCount - 3), logCount);

  const handleSeeHowItWorks = async (direct: string) => {
    if (!isSignedIn) {
      showToast(
        "warning",
        "Sign in to watch the pipeline",
        "You need to be logged in to run your own file through it.",
        5000,
      );
      return;
    }
    setIsRegistering(true);
    try {
      await registerUser();
      router.push(direct);
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

  const handleApiPlayground = () => {
    if (!isSignedIn) {
      showToast(
        "warning",
        "Sign in to open the API playground",
        "The interactive docs are available once you're signed in.",
        5000,
      );
      return;
    }
    router.push("/api");
  };

  return (
      <section
        id="top"
        className="relative overflow-hidden pb-24 pt-32 sm:pt-40"
      >
        {/* ambient glows — warm orange, matching the logo */}
        <div
          aria-hidden
          className="animate-relay-drift pointer-events-none absolute -top-40 left-1/2 h-[32rem] w-[48rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_16%,transparent),transparent)]"
        />
        <div
          aria-hidden
          className="animate-relay-drift pointer-events-none absolute -bottom-48 -left-40 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_10%,transparent),transparent)] [animation-delay:-7s]"
        />
        {/* faint dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_7%,transparent)_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,black,transparent)]"
        />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-6xl px-4 sm:px-6"
        >
          <motion.div variants={item} className="flex justify-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-mono text-xs font-medium tracking-widest text-primary uppercase">
              <span className="animate-relay-blink size-1.5 rounded-full bg-primary" />
              Live file pipeline
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="mt-7 text-center font-display text-5xl leading-[1.02] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            Upload it.{" "}
            <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
              Watch it move.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-muted-foreground sm:text-xl"
          >
            RelayPipe runs your files through a real processing pipeline —
            queued, processed, delivered, step by step, live on screen. No
            black boxes. No guessing what happens next.
          </motion.p>

          <motion.div
            variants={item}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {isSignedIn ? (
              <button
                onClick={() => handleSeeHowItWorks("/project")}
                disabled={isRegistering}
                className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_12px_32px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_50%,transparent),0_16px_40px_-12px_color-mix(in_oklch,var(--primary)_90%,transparent)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
              >
                {isRegistering ? (
                  <>
                    <CircleNotch weight="bold" className="size-5 animate-spin" />
                    Setting things up…
                  </>
                ) : (
                  <>
                    Upload a file
                    <ArrowRight
                      weight="bold"
                      className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            ) : (
              <SignUpButton mode="modal">
                <button className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_12px_32px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-all duration-200 hover:bg-primary/90 hover:shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_50%,transparent),0_16px_40px_-12px_color-mix(in_oklch,var(--primary)_90%,transparent)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto">
                  Start watching
                  <ArrowRight
                    weight="bold"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1"
                  />
                </button>
              </SignUpButton>
            )}

            <button
              onClick={handleApiPlayground}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/60 px-7 text-base font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none sm:w-auto"
            >
              <TerminalWindow className="size-5 text-primary" />
              Read the API docs
            </button>
          </motion.div>

          {/* ---- signature: the live pipeline ---- */}
          <motion.div
            variants={item}
            className="relative mx-auto mt-16 max-w-3xl"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-x-6 -inset-y-4 rounded-3xl bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)] blur-md"
            />
            <div className="relative overflow-hidden rounded-2xl border border-border bg-card/90 shadow-2xl shadow-black/40 backdrop-blur-sm">
              {/* window chrome */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-full bg-zinc-600" />
                    <span className="size-2.5 rounded-full bg-zinc-600" />
                    <span className="size-2.5 rounded-full bg-primary/80" />
                  </div>
                  <span className="font-mono text-xs text-muted-foreground">
                    relaypipe / live-pipeline
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
                  <span className="animate-relay-blink size-1.5 rounded-full bg-emerald-400" />
                  Live
                </span>
              </div>

              {/* stage track with traveling packet */}
              <div className="relative px-6 py-8 sm:px-10">
                <div className="relative flex items-center gap-2 sm:gap-3">
                  {/* traveling packet — the logo blob */}
                  <div
                    aria-hidden
                    className="animate-relay-packet absolute top-1/2 z-10 -translate-y-1/2"
                  >
                    <div className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
                    <Logo className="relative size-8" />
                  </div>

                  {stages.map((stage, i) => (
                    <div key={stage.label} className="flex flex-1 items-center gap-2 sm:gap-3">
                      <div className="relative z-0 flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background/80 px-2 py-3 transition-colors duration-300 hover:border-primary/40 sm:gap-2.5 sm:px-3">
                        <span className={cn("size-2 rounded-full", stage.dot)} />
                        <span className="flex flex-col items-start leading-none">
                          <span className="font-mono text-[11px] font-semibold tracking-widest text-foreground uppercase sm:text-xs">
                            {stage.label}
                          </span>
                          <span className="mt-1 hidden text-[10px] text-muted-foreground sm:block">
                            {stage.caption}
                          </span>
                        </span>
                      </div>
                      {i < stages.length - 1 && (
                        <div
                          aria-hidden
                          className="relay-track h-0.5 w-4 rounded-full sm:w-8"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* live log console */}
              <div className="border-t border-border bg-black/40 px-4 py-3 sm:px-6">
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                  <span className="text-primary">$</span>
                  <span>tail -f pipeline.log</span>
                </div>
                <div className="mt-2.5 flex h-[4.75rem] flex-col justify-end gap-1 overflow-hidden">
                  <AnimatePresence initial={false} mode="popLayout">
                    {visibleLogs.map((line) => (
                      <motion.div
                        key={`${line.time}-${line.msg}`}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.35, ease: "easeOut" }}
                        className="flex items-center gap-2 font-mono text-[11px] leading-relaxed sm:text-xs"
                      >
                        <span className="shrink-0 text-muted-foreground/70">
                          {line.time}
                        </span>
                        <span className={cn("shrink-0", logColor[line.type])}>
                          {logPrefix[line.type]}
                        </span>
                        <span className="truncate text-foreground/85">
                          {line.msg}
                        </span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.p
            variants={item}
            className="mt-8 text-center font-mono text-xs text-muted-foreground"
          >
            sign in → drop a file → watch every stage
          </motion.p>
        </motion.div>
      </section>
  );
}