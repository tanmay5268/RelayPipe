"use client";

import { Reveal, SectionHeading } from "./Reveal";
import { Queue, Cpu, CheckCircle, ArrowRight, ArrowDown } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const steps = [
  {
    num: "01",
    label: "Queued",
    icon: Queue,
    title: "Your file gets in line",
    body: "Drop a file and it's received, checked, and logged into the queue the moment it lands. You can see it waiting — no silent submission.",
    status: "waiting in line",
    dot: "bg-zinc-500",
    accent: "text-zinc-400",
  },
  {
    num: "02",
    label: "Processing",
    icon: Cpu,
    title: "A worker runs it",
    body: "A worker picks your file up and pushes it through the pipeline: stored securely, processed, and tracked at every single step.",
    status: "worker running",
    dot: "bg-primary animate-relay-blink",
    accent: "text-primary",
  },
  {
    num: "03",
    label: "Delivered",
    icon: CheckCircle,
    title: "Output, ready",
    body: "The finished result is handed back with a confirmation — and the whole journey stays visible on your screen.",
    status: "output ready",
    dot: "bg-emerald-400",
    accent: "text-emerald-400",
  },
];

function Connector({ vertical = false }: { vertical?: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center text-primary/70",
        vertical ? "py-2" : "px-1",
      )}
    >
      <div
        aria-hidden
        className={cn(
          "relay-track",
          vertical ? "h-10 w-0.5" : "h-0.5 w-10",
        )}
      />
      {vertical ? (
        <ArrowDown weight="bold" className="size-4 shrink-0" />
      ) : (
        <ArrowRight weight="bold" className="size-4 shrink-0" />
      )}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-28">
      <SectionHeading
        className="text-center [&>div]:flex [&>div]:justify-center"
        eyebrow="How it works"
        title={
          <>
            One upload.{" "}
            <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
              Three stages.
            </span>{" "}
            Zero guesswork.
          </>
        }
        description="Every file follows the same pipeline — and you watch each stage happen, live, as it moves."
      />

      <div className="mt-14 flex flex-col items-stretch lg:flex-row lg:items-start">
        {steps.map((step, i) => (
          <div key={step.num} className="flex flex-1 flex-col">
            {i > 0 && <Connector vertical />}
            <Reveal delay={i * 0.1} className="flex-1">
              <div className="group relative h-full overflow-hidden rounded-2xl border border-border bg-card/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_20px_50px_-20px_color-mix(in_oklch,var(--primary)_35%,transparent)] sm:p-7">
                {/* corner glow on hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex items-start justify-between">
                  <div
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl border border-border bg-background/80 transition-all duration-300 group-hover:border-primary/40 group-hover:shadow-[0_0_20px_-6px_color-mix(in_oklch,var(--primary)_60%,transparent)]",
                      step.accent,
                    )}
                  >
                    <step.icon weight="duotone" className="size-5" />
                  </div>
                  <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground/60">
                    {step.num}
                  </span>
                </div>

                <p className="mt-6 font-mono text-[11px] font-semibold tracking-[0.2em] text-primary uppercase">
                  {step.label}
                </p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {step.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                  {step.body}
                </p>

                <div className="mt-6 flex items-center gap-2 border-t border-border pt-4 font-mono text-[11px] text-muted-foreground">
                  <span className={cn("size-1.5 rounded-full", step.dot)} />
                  <span className="uppercase tracking-wider">{step.status}</span>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}