import { client } from './redis'
import { Queue } from "bullmq";
export { client } from './redis'
const imgqueue = process.env.NODE_ENV === 'production' ? 'image-worker' : 'image-worker-dev'
export const imageQueue = new Queue(imgqueue, {
  connection: client
});
const pdfqueue = process.env.NODE_ENV === 'production' ? 'pdf-worker' : 'pdf-worker-dev'
export const pdfQueue = new Queue(pdfqueue, {
  connection: client
});
