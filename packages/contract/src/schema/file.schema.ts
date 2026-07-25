import { z } from "zod";
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
] as const;
const JOB_STATUSES = [
  "pending",
  "queued",
  "processing",
  "done",
  "failed",
] as const;

export const uploadInitInputSchema = z.object({
  filename: z
    .string()
    .min(1, "Filename is required")
    .max(255, "Filename too long")
    .refine(
      (name) => !/[/\\]/.test(name),
      "Filename cannot contain path separators",
    ),

  mimeType: z.enum(ALLOWED_MIME_TYPES, {
    error: "Provide valid VALID_MIME_TYPES",
  }),
  size: z
    .number()
    .int()
    .positive()
    .max(50 * 1024 * 1024, "File exceeds 50MB limit"),
});
export const uploadInitOutputSchema = z.object({
  s3url: z.string(),
  jobId: z.string(),
});
export type UploadInitInput = z.infer<typeof uploadInitInputSchema>;

export const confirmUploadInputSchema = z.object({
  jobId: z.string(),
});
export const confirmUploadOutputSchema = z.object({
  jobId: z.string(),
  Status: z.enum(JOB_STATUSES, {
    error: "Not a valid Job_Status",
  }),
});
