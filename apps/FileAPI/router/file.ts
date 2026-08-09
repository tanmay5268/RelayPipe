import { os, secureOs } from "./os";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prisma } from "@repo/database";
const s3client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY!,
        secretAccessKey:process.env.S3_SECRET_ACCESS_KEY!
    }
})
export const Fileinit = secureOs.relaypipe.fileinit.handler(async ({ input, context, errors }) => {
    const s3key:string = `/relaypipe/uploads/${input.filename}` 
    const command = new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME!,
        Key: s3key,
        ContentType:input.mimeType
    })
    const url = await getSignedUrl(s3client, command)
    
    const job = await prisma.job.create({
      data: {
        userId: context.userId!,
        s3Key:s3key,
        filename: input.filename,
        mimeType: input.mimeType,
        size: input.size,
        jobType: input.mimeType.startsWith("image/") ? "image" : "pdf",
      },
    })
  return {
    s3url: url,
    jobId: job.id,
  };
});

export const Fileupload = os.relaypipe.fileupload.handler(async ({ input }) => {
  return {
    jobId: input.jobId,
    Status: "done",
  };
});