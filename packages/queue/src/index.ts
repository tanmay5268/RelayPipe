import { client } from './redis'
import { Queue } from "bullmq";
export { client } from './redis'
export const emailQueue = new Queue("file-worker", {
  connection: client
});