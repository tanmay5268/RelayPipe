export function buildOutputS3Key(jobId: string, outputType: string, extension: string): string {
  return `outputs/${jobId}/${outputType}.${extension}`
}