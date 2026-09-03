"use client";

import { useRouter } from "next/navigation";
import { Reveal } from "./Reveal";
import { ArrowUpRight, TerminalWindow } from "@phosphor-icons/react";

export default function ApiBand() {
  const router = useRouter();

  return (
    <section id="api" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 sm:py-28">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60">
          {/* ambient glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/3 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_14%,transparent),transparent)]"
          />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div>
              <p className="flex items-center gap-2.5 font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
                <span className="h-px w-8 bg-primary/60" />
                For builders
              </p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
                The same pipeline,{" "}
                <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
                  over HTTP.
                </span>
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
                Every upload on RelayPipe runs through the same REST API you can
                call yourself. Init a job, push your file, and track it — the
                interactive playground documents every endpoint.
              </p>
              <button
                onClick={() => router.push("/api")}
                className="group mt-8 inline-flex items-center gap-2 rounded-xl border border-border bg-background/60 px-5 py-3 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/40 hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <TerminalWindow className="size-4 text-primary" />
                Open the API playground
                <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-black/50 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-2 border-b border-border px-4 py-2.5 font-mono text-xs text-muted-foreground">
                <TerminalWindow className="size-3.5 text-primary" />
                relaypipe / api-reference
                <span className="ml-auto rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-emerald-400 uppercase">
                  REST
                </span>
              </div>
              <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-relaxed">
                <code>
                  <span className="text-emerald-400">POST</span>{" "}
                  <span className="text-foreground">/api/relaypipe.fileinit</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">&quot;filename&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#FFB45C]">&quot;photo.jpg&quot;</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">&quot;mimeType&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#FFB45C]">&quot;image/jpeg&quot;</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">&quot;size&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#FFB45C]">4200000</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"}"}</span>
                  {"\n\n"}
                  <span className="text-muted-foreground">→ 200 OK</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"{"}</span>
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">&quot;jobId&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#FFB45C]">&quot;job_9f2k1&quot;</span>
                  <span className="text-muted-foreground">,</span>
                  {"\n"}
                  {"  "}
                  <span className="text-sky-400">&quot;s3url&quot;</span>
                  <span className="text-muted-foreground">: </span>
                  <span className="text-[#FFB45C]">&quot;https://…&quot;</span>
                  {"\n"}
                  <span className="text-muted-foreground">{"}"}</span>
                </code>
              </pre>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}