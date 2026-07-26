import { os } from "./os";

export const Fileinit = os.relaypipe.fileinit.handler(async ({ input, errors }) => {
    const get = input.filename
  return {
    s3url: "https://dummy-s3-url.com/upload",
    jobId: "dummy-job-id-123",
  };
});

export const Fileupload = os.relaypipe.fileupload.handler(async ({ input }) => {
  return {
    jobId: input.jobId,
    Status: "done",
  };
});