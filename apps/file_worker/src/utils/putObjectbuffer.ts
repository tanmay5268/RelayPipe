
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./s3Client"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

export async function putObjectBuffer(
  s3Key: string,
  body: Buffer,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: s3Key,
    Body: body,
    ContentType: contentType,
  })
  const url = await getSignedUrl(s3Client, command)
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": contentType,
    },
    body: new Uint8Array(body),
  })
  if (!res.ok) {
    throw new Error(
      `Failed to upload object to S3 at key "${s3Key}": HTTP ${res.status} ${res.statusText}`,
    )
  }

  // direct S3 object URL — works only if the bucket/prefix is publicly readable
  const region = process.env.BUCKET_REGION ?? "us-east-1"
  return `https://${process.env.BUCKET_NAME}.s3.${region}.amazonaws.com/${s3Key}`
}