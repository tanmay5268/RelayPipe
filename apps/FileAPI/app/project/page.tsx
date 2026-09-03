import { auth } from "@clerk/nextjs/server";
import { AppHeader } from "@/components/Pipeline/AppHeader";
import LiveUpload from "@/components/Pipeline/LiveUpload";

export default async function Project() {
  await auth.protect();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="animate-relay-drift pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]"
      />

      <AppHeader
        active="/project"
        links={[
          { href: "/project", label: "Upload" },
          { href: "/pipeline", label: "Live pipeline" },
        ]}
      />

      <main className="relative z-10">
        <section className="mx-auto max-w-5xl px-4 pt-14 pb-24 sm:px-6">
          <div className="text-center">
            <p className="flex items-center justify-center gap-2.5 font-mono text-xs font-semibold tracking-[0.2em] text-primary uppercase">
              <span className="h-px w-8 bg-primary/60" />
              Live pipeline
              <span className="h-px w-8 bg-primary/60" />
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              Drop a file.{" "}
              <span className="bg-gradient-to-r from-primary to-[#FFB45C] bg-clip-text text-transparent">
                Watch it move.
              </span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Your upload enters the queue, a worker processes it, and the
              result comes back — then keep watching it live on the pipeline
              page.
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <LiveUpload />
          </div>
        </section>
      </main>
    </div>
  );
}