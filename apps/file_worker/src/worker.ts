import "./env"; // fail fast with a clear error if required env vars are missing
import { Worker } from "bullmq";
import { client } from "@repo/queue";
import { prisma } from "@repo/database";
import { imageProcessor } from "./processors/image.process";


const imageWorker = new Worker(
  "image-worker",
  imageProcessor,
  {
    connection: client,
    concurrency: 5  
  }
);

const pdfWorker = new Worker(
  "pdf-worker",
  async (job) => {
    console.log("Processing job...PDF");
    console.log(job.data);
    setTimeout(() => {
      console.log("Job processed");
    }, 10000)
  },
  {
    connection: client,
    concurrency: 5
  }
);
for (const worker of [imageWorker, pdfWorker]) {
  worker.on("failed", async (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message)

    if (job && job.attemptsMade >= (job.opts.attempts ?? 1)) {
      await prisma.job.update({
        where: { id: job.data.jobId },
        data: { status: "failed", errorMessage: err.message },
      })
    }
  })
}

console.log("Worker is waiting for jobs...");