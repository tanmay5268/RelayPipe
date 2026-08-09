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

export async function uploadFile(file: File): Promise<UploadResult> {
  const mimeType = getAllowedMimeType(file.type || 'application/pdf')
  
  const { jobId } = await orpcClient.relaypipe.fileinit({
    filename: file.name,
    mimeType,
    size: file.size,
  })
  const result = await orpcClient.relaypipe.fileupload({ jobId })
console.log(result)
  return result
}