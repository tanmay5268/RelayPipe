import type { Job } from "bullmq";
import { prisma } from "@repo/database";
import { getObjectBuffer } from "../utils/getbuffer";
import { buildOutputS3Key } from "../utils/buildOutputS3key";
import { putObjectBuffer } from "../utils/putObjectbuffer";
import sharp from "sharp";

const SIZES = { thumb: 150, medium: 600, large: 1200 } as const;

export const imageProcessor = async (job: Job) => {
  const startedAt = Date.now();
  const { jobId, userId, mimeType, s3Key } = job.data;

  await prisma.job.update({
    where: { id: jobId },
    data: { status: "processing" },
  });

  const originalBuffer = await getObjectBuffer(s3Key);
  // decode the source image once; clone() shares the parsed input
  const pipeline = sharp(originalBuffer);

  const outputs = await Promise.all(
    Object.entries(SIZES).map(async ([label, dimension]) => {
      const resizedBuffer = await pipeline
        .clone()
        .resize(dimension)
        .toFormat("jpeg")
        .toBuffer();
      const outputKey = buildOutputS3Key(jobId, label, "jpg");
      const url = await putObjectBuffer(outputKey, resizedBuffer, "image/jpeg");
      return { outputType: label, s3Key: outputKey, url };
    }),
  );

  await prisma.$transaction([
    prisma.jobOutput.createMany({
      data: outputs.map(({ outputType, s3Key, url }) => ({
        jobId,
        outputType,
        s3Key,
        url,
      })),
    }),
    prisma.job.update({
      where: { id: jobId },
      data: { status: "done", completedAt: new Date() },
    }),
  ]);

  console.log(
    `[image-worker] job ${jobId} processed in ${((Date.now() - startedAt) / 1000).toFixed(2)}s`,
  );
};
