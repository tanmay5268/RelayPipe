"use server";
import { clerk_user_email } from "./lib/fetchuser";
import { prisma } from "@repo/database";
export async function registerUser() {
    // const user = await currentUser()
    // //if somehow this operation fails, that means user is still navigated to project page.. 
    //  if (!user) return 
    // const email = user.emailAddresses?.[0]?.emailAddress;
    const email = await clerk_user_email()
        await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email },
        });
}

export type PipelineJob = {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  jobType: "image" | "pdf";
  status: "pending" | "queued" | "processing" | "done" | "failed";
  errorMessage: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
  outputs: { outputType: string; url: string }[];
};

/**
 * Returns the signed-in user's real jobs, newest first, with their
 * current pipeline state (pending → queued → processing → done/failed).
 */
export async function getPipelineJobs(): Promise<PipelineJob[]> {
  const email = await clerk_user_email();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return [];

  const jobs = await prisma.job.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      outputs: {
        select: { outputType: true, url: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return jobs.map((job) => ({
    id: job.id,
    filename: job.filename,
    mimeType: job.mimeType,
    size: job.size,
    jobType: job.jobType,
    status: job.status,
    errorMessage: job.errorMessage,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
    completedAt: job.completedAt?.toISOString() ?? null,
    outputs: job.outputs.map((o) => ({ outputType: o.outputType, url: o.url })),
  }));
}