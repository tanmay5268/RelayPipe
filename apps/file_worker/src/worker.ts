import { Worker } from "bullmq";
import { connection } from "./redis";

new Worker(
  "emails",
  async (job) => {
    console.log("Processing job...");
    console.log(job.data);
  },
  {
    connection,
  }
);

console.log("Worker is waiting for jobs...");