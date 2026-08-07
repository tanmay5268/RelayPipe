import { ApiService } from "@/services/api.service";
import { os,secureOs } from "./os";

export const Fileinit = secureOs.relaypipe.fileinit.handler(async ({ input,context, errors }) => {
    console.log(context.userId)
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
export const ApiKey = os.relaypipe.apikey.handler(async ({ input,context, errors }) => {
    const api = await ApiService.createApi()
    const expiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    context.resHeaders.append(
      "Set-Cookie",
      [
        `relay_pipe_api=${api.key}`,
        "Path=/",
        "HttpOnly",
        "Secure",
        "SameSite=Lax",
        `Expires=${expiry.toUTCString()}`,
      ].join("; ")
    );
    return api
})