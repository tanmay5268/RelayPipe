"use client";

import { Reveal, SectionHeading } from "./Reveal";
import {
  Eye,
  CloudArrowUp,
  Files,
  ListChecks,
  TerminalWindow,
  ShieldCheck,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: Eye,
    title: "Live pipeline view",
    body: "Watch every stage happen in real time as your file moves — queued, processing, delivered. Nothing happens off-screen.",
    accent: "text-primary",
  },
  {
    icon: CloudArrowUp,
    title: "Real infrastructure",
    body: "Files are stored in S3, jobs run through a Redis queue, and workers process them. This is the real thing, not a simulation.",
    accent: "text-primary",
  },
  {
    icon: Files,
    title: "Files you already use",
    body: "JPEG, PNG, WEBP, and PDF — up to 50 MB each. Drop in what you have; the pipeline handles the rest.",
    accent: "text-[#FFB45C]",
  },
  {
    icon: ListChecks,
    title: "Progress you can trust",
    body: "Every step reports its status. If something fails, it tells you exactly what went wrong and lets you retry.",
    accent: "text-emerald-400",
  },
  {
    icon: TerminalWindow,
    title: "REST API + playground",
    body: "Drive the pipeline programmatically through the interactive docs — init, upload, and track jobs with plain HTTP.",
    accent: "text-sky-400",
  },
  {
    icon: ShieldCheck,
    title: "Auth built in",
    body: "Sign in with your account and every job is tracked to you. Your uploads, your pipeline, your history.",
    accent: "text-primary",
  },
];

export default function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 border-y border-border bg-card/40 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklch,var(--foreground)_5%,transparent)_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]"
      />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
                see your files through.
              </span>
            </>
          }
          description="A pipeline that shows its work — built on the pieces real file systems are made of."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={(i % 3) * 0.08}>
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-background/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklch,var(--primary)_30%,transparent)]">
                <div
                  aria-hidden
                  className={cn(
                    "pointer-events-none absolute -top-14 -left-14 size-32 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100",
                  )}
                />
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-lg border border-border bg-muted/40 transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10",
                    feature.accent,
                  )}
                >
                  <feature.icon weight="duotone" className="size-5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold tracking-tight">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}