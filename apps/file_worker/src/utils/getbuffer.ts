import {  GetObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "./s3Client"


const BUCKET_NAME = process.env.BUCKET_NAME as string

export async function getObjectBuffer(s3Key: string): Promise<Buffer> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  })

  const response = await s3Client.send(command)

  if (!response.Body) {
    throw new Error(`S3 object has no body: ${s3Key}`)
  }

  const byteArray = await response.Body.transformToByteArray()

  return Buffer.from(byteArray)
}

export async function getPdfBuffer(s3Key: string): Promise<Uint8Array> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  })

  const response = await s3Client.send(command)

  if (!response.Body) {
    throw new Error(`S3 object has no body: ${s3Key}`)
  }

  const byteArray = await response.Body.transformToByteArray()

  return Uint8Array.from(byteArray)
}