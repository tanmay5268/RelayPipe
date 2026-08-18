import { client } from './redis'
import { Queue } from "bullmq";
export { client } from './redis'
export const imageQueue = new Queue("image-worker", {
  connection: client
});
export const pdfQueue = new Queue("pdf-worker", {
  connection: client
});
