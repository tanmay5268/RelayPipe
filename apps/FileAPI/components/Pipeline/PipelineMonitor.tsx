"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { PipelineJob } from "@/actions";
import { getPipelineJobs } from "@/actions";
import { formatBytes } from "@/hooks/use-file-upload";
import {
  FileImage,
  FilePdf,
  FileText,
  UploadSimple,
  ArrowRight,
  TerminalWindow,
  ArrowClockwise,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

const POLL_MS = 3000;

type JobStatus = PipelineJob["status"];

const STAGE_RANK: Record<JobStatus, number> = {
  pending: 1,
  queued: 2,
  processing: 3,
  done: 4,
  failed: 3,
};

const statusMeta: Record<
  JobStatus,
  { label: string; chip: string; dot: string; prefix: string; color: string }
> = {
  pending: {
    label: "pending",
    chip: "border-zinc-500/30 bg-zinc-500/10 text-zinc-400",
    dot: "bg-zinc-500",
    prefix: "●",
    color: "text-zinc-400",
  },
  queued: {
    label: "queued",
    chip: "border-sky-400/30 bg-sky-400/10 text-sky-400",
    dot: "bg-sky-400",
    prefix: "▸",
    color: "text-sky-400",
  },
  processing: {
    label: "processing",
    chip: "border-primary/30 bg-primary/10 text-primary",
    dot: "bg-primary animate-relay-blink",
    prefix: "…",
    color: "text-primary",
  },
  done: {
    label: "delivered",
    chip: "border-emerald-400/30 bg-emerald-400/10 text-emerald-400",
    dot: "bg-emerald-400",
    prefix: "✓",
    color: "text-emerald-400",
  },
  failed: {
    label: "failed",
    chip: "border-red-400/30 bg-red-400/10 text-red-400",
    dot: "bg-red-400",
    prefix: "✕",
    color: "text-red-400",
  },
};

const stages = ["pending", "queued", "processing", "done"] as const;

type LogEntry = {
  id: string;
  time: number;
  filename: string;
  status: JobStatus;
  msg: string;
};

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function fmtClock(ms: number): string {
  return new Date(ms).toLocaleTimeString([], {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function durationStr(job: PipelineJob): string {
  if (!job.completedAt) return "";
  const s = (new Date(job.completedAt).getTime() - new Date(job.createdAt).getTime()) / 1000;
  return s < 60 ? `${s.toFixed(1)}s` : `${Math.round(s / 60)}m ${Math.round(s % 60)}s`;
}

function shortId(id: string): string {
  return `job_${id.slice(0, 8)}`;
}

function eventMessage(
  filename: string,
  status: JobStatus,
  errorMessage: string | null,
  createdAt: string,
  completedAt: string | null,
): string {
  switch (status) {
    case "pending":
      return `${filename} · created — waiting to be queued`;
    case "queued":
      return `${filename} · queued for a worker`;
    case "processing":
      return `${filename} · picked up by worker — processing`;
    case "done": {
      const s = completedAt
        ? (new Date(completedAt).getTime() - new Date(createdAt).getTime()) / 1000
        : 0;
      const dur = s < 60 ? `${s.toFixed(1)}s` : `${Math.round(s / 60)}m ${Math.round(s % 60)}s`;
      return `${filename} · delivered in ${dur}`;
    }
    case "failed":
      return `${filename} · failed — ${errorMessage ?? "unknown error"}`;
  }
}

function seedLog(jobs: PipelineJob[]): LogEntry[] {
  const entries: LogEntry[] = [];
  for (const job of jobs) {
    entries.push({
      id: `${job.id}:created`,
      time: new Date(job.createdAt).getTime(),
      filename: job.filename,
      status: "pending",
      msg: eventMessage(job.filename, "pending", null, job.createdAt, null),
    });
    if (job.status !== "pending") {
      entries.push({
        id: `${job.id}:${job.status}`,
        time: new Date(job.updatedAt).getTime(),
        filename: job.filename,
        status: job.status,
        msg: eventMessage(
          job.filename,
          job.status,
          job.errorMessage,
          job.createdAt,
          job.completedAt,
        ),
      });
    }
  }
  return entries.sort((a, b) => b.time - a.time).slice(0, 40);
}

function FileIcon({ mimeType, className }: { mimeType: string; className?: string }) {
  const Icon = mimeType.startsWith("image/") ? FileImage : FilePdf;
  return <Icon weight="duotone" className={className} />;
}

function StatusChip({ status }: { status: JobStatus }) {
  const meta = statusMeta[status];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[10px] font-semibold tracking-widest uppercase",
        meta.chip,
      )}
    >
      <span className={cn("size-1.5 rounded-full", meta.dot)} />
      {meta.label}
    </span>
  );
}

function StagePipeline({ status }: { status: JobStatus }) {
  const rank = STAGE_RANK[status];
  const failed = status === "failed";
  return (
    <div className="flex items-center gap-2">
      {stages.map((stage, i) => {
        const reached = i + 1 <= rank;
        const isCurrent = !failed && reached && (i + 1 === rank) && status !== "done";
        return (
          <div key={stage} className="flex flex-1 items-center gap-2 last:flex-none">
            <div className="flex flex-1 items-center gap-1.5">
              <span
                className={cn(
                  "size-2 shrink-0 rounded-full transition-colors duration-300",
                  failed && reached
                    ? "bg-red-400"
                    : reached
                      ? "bg-primary"
                      : "bg-zinc-600",
                  isCurrent && "animate-relay-blink ring-2 ring-primary/30",
                )}
              />
              <span
                className={cn(
                  "hidden font-mono text-[10px] tracking-widest uppercase sm:block",
                  reached ? "text-foreground/80" : "text-muted-foreground/50",
                )}
              >
                {stage}
              </span>
            </div>
            {i < stages.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "h-px flex-1 rounded-full transition-colors duration-300",
                  i + 1 < rank ? "bg-primary/70" : "bg-zinc-700",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function JobCard({ job }: { job: PipelineJob }) {
  const meta = statusMeta[job.status];
  const isImage = job.jobType === "image";
  const thumb = job.outputs.find((o) => o.outputType === "thumb");

  return (
    <div className="group rounded-2xl border border-border bg-card/60 p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_16px_40px_-20px_color-mix(in_oklch,var(--primary)_30%,transparent)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-background/80 text-primary">
            <FileIcon mimeType={job.mimeType} className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-semibold tracking-tight">
              {job.filename}
            </p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-muted-foreground">
              {shortId(job.id)} · {formatBytes(job.size)} · {job.jobType}
            </p>
          </div>
        </div>
        <StatusChip status={job.status} />
      </div>

      <div className="mt-5">
        <StagePipeline status={job.status} />
      </div>

      {job.status === "failed" && job.errorMessage && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-400/25 bg-red-400/5 px-3 py-2.5">
          <span className="mt-0.5 text-red-400">✕</span>
          <p className="font-mono text-xs leading-relaxed text-red-300">
            {job.errorMessage}
          </p>
        </div>
      )}

      {job.status === "done" && job.outputs.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {isImage && thumb && (
            <Image
              src={thumb.url}
              alt={`${job.filename} thumbnail`}
              width={48}
              height={48}
              className="h-12 w-12 rounded-lg border border-border object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
          {job.outputs.map((output) => (
            <a
              key={output.outputType}
              href={output.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              <FileText className="size-3.5 text-primary" />
              {output.outputType}
              {isImage && ` · ${output.outputType === "thumb" ? 150 : output.outputType === "medium" ? 600 : 1200}px`}
            </a>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 border-t border-border pt-3.5 font-mono text-[11px] text-muted-foreground">
        <span className={cn("size-1.5 rounded-full", meta.dot)} />
        {job.status === "done" ? (
          <span>
            created {fmtTime(job.createdAt)} → delivered {fmtTime(job.completedAt ?? job.updatedAt)}{" "}
            · {durationStr(job)}
          </span>
        ) : (
          <span>
            last update {fmtTime(job.updatedAt)}
            {job.status === "processing" && " · worker running"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function PipelineMonitor({ initialJobs }: { initialJobs: PipelineJob[] }) {
  const [jobs, setJobs] = useState<PipelineJob[]>(initialJobs);
  const [log, setLog] = useState<LogEntry[]>(() => seedLog(initialJobs));
  const [lastUpdated, setLastUpdated] = useState<number>(() => Date.now());
  const [online, setOnline] = useState(true);
  const jobsRef = useRef(jobs);
  jobsRef.current = jobs;

  const applyJobs = useCallback((next: PipelineJob[]) => {
    const now = Date.now();
    const prev = jobsRef.current;
    const prevStatus = new Map(prev.map((j) => [j.id, j.status]));

    const fresh: LogEntry[] = [];
    for (const job of next) {
      const before = prevStatus.get(job.id);
      if (before && before !== job.status) {
        fresh.push({
          id: `${job.id}:${job.status}:${now}`,
          time: now,
          filename: job.filename,
          status: job.status,
          msg: eventMessage(
            job.filename,
            job.status,
            job.errorMessage,
            job.createdAt,
            job.completedAt,
          ),
        });
      }
    }

    if (fresh.length > 0) {
      setLog((prevLog) =>
        [...fresh.sort((a, b) => b.time - a.time), ...prevLog].slice(0, 40),
      );
    }
    setJobs(next);
    setLastUpdated(now);
    setOnline(true);
  }, []);

  useEffect(() => {
    let active = true;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const poll = async () => {
      try {
        const next = await getPipelineJobs();
        if (active) applyJobs(next);
      } catch {
        if (active) setOnline(false);
      }
      if (active) timer = setTimeout(poll, POLL_MS);
    };

    const onVisibility = () => {
      if (document.hidden) {
        if (timer) clearTimeout(timer);
      } else {
        poll();
      }
    };

    poll();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      active = false;
      if (timer) clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [applyJobs]);

  const processing = jobs.filter((j) => j.status === "processing" || j.status === "queued").length;
  const done = jobs.filter((j) => j.status === "done").length;
  const failed = jobs.filter((j) => j.status === "failed").length;

  const stats = [
    { label: "in flight", value: processing, accent: "text-primary" },
    { label: "delivered", value: done, accent: "text-emerald-400" },
    { label: "failed", value: failed, accent: "text-red-400" },
    { label: "total jobs", value: jobs.length, accent: "text-foreground" },
  ];

  return (
    <section className="mx-auto max-w-4xl px-4 pb-24 sm:px-6">
      {/* page heading */}
      <div className="text-center">
        <p className="flex items-center justify-center gap-2.5 font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          <span className="h-px w-8 bg-primary/60" />
          Live pipeline
          <span className="h-px w-8 bg-primary/60" />
        </p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
          Your files,{" "}
          <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
            in motion.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Real job state from the pipeline — refreshed every few seconds, with
          every event you upload logged here.
        </p>
        <div className="mt-5 flex items-center justify-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
            <span
              className={cn(
                "size-1.5 rounded-full bg-emerald-400",
                online && "animate-relay-blink",
              )}
            />
            {online ? "Live" : "Reconnecting"}
          </span>
          <span>updated {fmtClock(lastUpdated)}</span>
          <span className="hidden sm:inline">· polls every {POLL_MS / 1000}s</span>
        </div>
      </div>

      {/* stats */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-border bg-card/60 px-4 py-4 text-center"
          >
            <p className={cn("font-display text-2xl font-semibold tracking-tight sm:text-3xl", stat.accent)}>
              {stat.value}
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* real event console */}
      <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-black/45 shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <div className="flex items-center gap-2.5">
            <TerminalWindow className="size-3.5 text-primary" />
            <span className="font-mono text-xs text-muted-foreground">
              relaypipe / live-events
            </span>
          </div>
          <span className="font-mono text-[10px] tracking-widest text-muted-foreground/70 uppercase">
            {log.length} events
          </span>
        </div>
        <div className="flex h-44 flex-col gap-1 overflow-y-auto px-4 py-3 sm:px-5">
          {log.length === 0 ? (
            <p className="font-mono text-xs text-muted-foreground/60">
              $ waiting for events — upload a file to see it here…
            </p>
          ) : (
            <AnimatePresence initial={false}>
              {log.map((entry) => {
                const meta = statusMeta[entry.status];
                return (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="flex items-baseline gap-2.5 font-mono text-[11px] leading-relaxed sm:text-xs"
                  >
                    <span className="shrink-0 text-muted-foreground/70">
                      {fmtClock(entry.time)}
                    </span>
                    <span className={cn("shrink-0", meta.color)}>{meta.prefix}</span>
                    <span className="min-w-0 truncate text-foreground/85">
                      {entry.msg}
                    </span>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* jobs */}
      {jobs.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/30 bg-card/40 px-6 py-16 text-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-border bg-background/80 text-primary">
            <UploadSimple weight="duotone" className="size-6" />
          </div>
          <h2 className="mt-5 font-display text-2xl font-semibold tracking-tight">
            Your pipeline is quiet
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Upload a file and watch it move through the real pipeline — every
            stage will show up right here.
          </p>
          <Link
            href="/project"
            className="group mt-7 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-[0_0_0_1px_color-mix(in_oklch,var(--primary)_35%,transparent),0_12px_32px_-12px_color-mix(in_oklch,var(--primary)_75%,transparent)] transition-all duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Upload your first file
            <ArrowRight
              weight="bold"
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-4">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <ArrowClockwise className={cn("size-3.5", online && "animate-relay-blink text-primary")} />
            monitoring {jobs.length} job{jobs.length === 1 ? "" : "s"}
          </div>
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}