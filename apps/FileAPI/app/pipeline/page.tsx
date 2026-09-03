import { auth } from "@clerk/nextjs/server";
import { getPipelineJobs } from "@/actions";
import { AppHeader } from "@/components/Pipeline/AppHeader";
import PipelineMonitor from "@/components/Pipeline/PipelineMonitor";

export default async function Pipeline() {
  await auth.protect();
  const jobs = await getPipelineJobs();

  return (
    <div className="relative min-h-screen overflow-x-clip bg-background text-foreground">
      <div
        aria-hidden
        className="animate-relay-drift pointer-events-none absolute -top-40 left-1/2 h-[28rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_oklch,var(--primary)_12%,transparent),transparent)]"
      />

      <AppHeader
        active="/pipeline"
        links={[
          { href: "/project", label: "Upload" },
          { href: "/pipeline", label: "Live pipeline" },
        ]}
      />

      <main className="relative z-10 pt-14 sm:pt-16">
        <PipelineMonitor initialJobs={jobs} />
      </main>
    </div>
  );
}