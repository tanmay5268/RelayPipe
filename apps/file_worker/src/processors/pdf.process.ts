import type { Job } from "bullmq";
import { prisma } from "@repo/database";
import { getPdfBuffer } from "../utils/getbuffer";
import { PDFParse } from "pdf-parse";
import { buildOutputS3Key } from "../utils/buildOutputS3key";
import { putObjectBuffer } from "../utils/putObjectbuffer";

export const pdfProcessor = async (job: Job) => {
  const startedAt = Date.now();
  const { jobId, userId, mimeType, s3Key } = job.data;

  try {
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "processing" },
    });

    const originalBuffer = await getPdfBuffer(s3Key);
    const parsedPdf = new PDFParse(originalBuffer);
    const text = await parsedPdf.getText();
    const response = await fetch("https://router.requesty.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.REQUESTY_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemma-4-31b-it",
        messages: [
          {
            role: "user",
            content: `Summarize this document in 3 bullet points:\n\n${text.text}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const result = await response.json();
    const summary = result.choices?.[0]?.message?.content;

    if (!summary) {
      throw new Error("No summary returned from API");
    }

    console.log(`[pdf-worker] job ${jobId} summary:`, summary);

    const outputKey = buildOutputS3Key(jobId, "summary", "txt");
    const url = await putObjectBuffer(outputKey, Buffer.from(summary, "utf-8"), "text/plain");

    await prisma.$transaction([
      prisma.jobOutput.create({
        data: {
          jobId,
          outputType: "text",
          s3Key: outputKey,
          url,
        },
      }),
      prisma.job.update({
        where: { id: jobId },
        data: { status: "done", completedAt: new Date() },
      }),
    ]);

    console.log(
      `[pdf-worker] job ${jobId} completed in ${((Date.now() - startedAt) / 1000).toFixed(2)}s`,
    );
  } catch (error) {
    console.error(`[pdf-worker] job ${jobId} failed:`, error);
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "failed", completedAt: new Date() },
    });
    throw error;
  }
}