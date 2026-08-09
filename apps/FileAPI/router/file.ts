import { os, secureOs } from "./os";

export const Fileinit = secureOs.relaypipe.fileinit.handler(async ({ input, context, errors }) => {

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