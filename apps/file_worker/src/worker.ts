import { Worker } from "bullmq";
import { client } from "@repo/queue";

new Worker(
  "file-worker",
  async (job) => {
    console.log("Processing job...");
    console.log(job);
    setTimeout(() => {
      console.log("Job processed");
    }, 10000)
  },
  {
    connection: client,
  }
);

console.log("Worker is waiting for jobs...");