import { secureOs } from "./os";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { prisma } from "@repo/database";
import { ORPCError } from "@orpc/client";
import { emailQueue } from "@repo/queue";
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

export const Fileupload = secureOs.relaypipe.fileupload.handler(async ({ input, context, errors }) => {
  const jobdetails = await prisma.job.findUnique({
    where: {
      id: input.jobId,
    },
    select: {
      mimeType: true,
      s3Key: true,
    },
  })
  if (!jobdetails) {
    throw new ORPCError("NOT_FOUND")
  }
  
  await emailQueue.add("image-upload", {
    jobId: input.jobId,
    userId: context.userId,
    MimeType: jobdetails.mimeType,
    s3Key:jobdetails.s3Key
  })
  await prisma.job.update({
    where: {
      id: input.jobId,
    },
    data: {
      status: "queued",
    },
  })
  return {
    jobId: input.jobId,
    Status: "queued",
  };
});