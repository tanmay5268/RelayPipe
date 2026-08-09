"use client"

import { orpcClient } from './orpc-client'

export interface UploadResult {
  jobId: string
  Status: string
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const

type AllowedMimeType = (typeof ALLOWED_MIME_TYPES)[number]

function getAllowedMimeType(mimeType: string): AllowedMimeType {
  if (ALLOWED_MIME_TYPES.includes(mimeType as AllowedMimeType)) {
    return mimeType as AllowedMimeType
  }
  return 'application/pdf'
}

async function uploadToS3(s3url: string, file: File, mimeType: string): Promise<boolean> {
  const response = await fetch(s3url, {
      method: 'PUT',
      mode:"cors",
    headers: {
      'Content-Type': mimeType,
    },
    body: file,
  })
  return response.ok
}

export async function uploadFile(file: File): Promise<UploadResult> {
  const mimeType = getAllowedMimeType(file.type || 'application/pdf')
  
  const { jobId, s3url } = await orpcClient.relaypipe.fileinit({
    filename: file.name,
    mimeType,
    size: file.size,
  })
  
  // Upload to S3 first
  const s3Success = await uploadToS3(s3url, file, mimeType)
  if (!s3Success) {
    throw new Error('S3 upload failed')
  }
  
  
  // File upload call only happens after successful S3 upload
  const result = await orpcClient.relaypipe.fileupload({ jobId })
  console.log(result)
  return result
}