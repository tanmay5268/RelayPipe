import "./env"; // fail fast with a clear error if required env vars are missing
import { Worker } from "bullmq";
import { client } from "@repo/queue";
import { prisma } from "@repo/database";
import { imageProcessor } from "./processors/image.process";
import { pdfProcessor } from "./processors/pdf.process";

const imageQueueName = process.env.NODE_ENV === 'production' ? 'image-worker' : 'image-worker-dev'
const imageWorker = new Worker(
  imageQueueName,
  imageProcessor,
  {
    connection: client,
    concurrency: 5  
  }
);

const pdfQueueName = process.env.NODE_ENV === 'production' ? 'pdf-worker' : 'pdf-worker-dev'
const pdfWorker = new Worker(
  pdfQueueName,
  pdfProcessor,
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