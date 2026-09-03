"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Pattern } from "@/components/examples/c-file-upload-5";
import type { FileUploadItem } from "@/components/examples/c-file-upload-5";
import type { UploadResult } from "@/lib/upload-service";
import { ArrowRight, Broadcast } from "@phosphor-icons/react";

export default function LiveUpload() {
  const [liveJobs, setLiveJobs] = useState<
    { jobId: string; filename: string }[]
  >([]);

  const handleComplete = (file: FileUploadItem, result: UploadResult) => {
    setLiveJobs((prev) => {
      if (prev.some((j) => j.jobId === result.jobId)) return prev;
      return [
        ...prev,
        { jobId: result.jobId, filename: file.file.name },
      ];
    });
  };

  const latest = liveJobs[0];

  return (
    <div className="w-full max-w-2xl">
      <Pattern onUploadComplete={handleComplete} />

      <AnimatePresence>
        {latest && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex flex-col items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklch,var(--primary)_12%,transparent),transparent_60%)] px-5 py-5 sm:flex-row"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                <Broadcast weight="duotone" className="size-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold tracking-tight">
                  {latest.filename} is in the pipeline
                </p>
                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  job_{latest.jobId.slice(0, 8)} · queued for a worker
                </p>
              </div>
            </div>
            <Link
              href="/pipeline"
              className="group inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-[0_8px_24px_-12px_color-mix(in_oklch,var(--primary)_70%,transparent)] transition-all duration-200 hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              Watch it live
              <ArrowRight
                weight="bold"
                className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}