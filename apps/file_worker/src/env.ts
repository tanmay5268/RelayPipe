import "dotenv/config";

const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "UPSTASH_REDIS_URL",
  "BUCKET_NAME",
  "BUCKET_REGION",
  "S3_ACCESS_KEY",
  "S3_SECRET_ACCESS_KEY",
] as const;

export function assertWorkerEnv(): void {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `[file_worker] Missing required environment variables: ${missing.join(", ")}. ` +
        "Set them in the deployment environment before starting the worker (see README).",
    );
  }
}

// Run the check at import time. Import this module FIRST in the entry file so
// the clear error is raised before any client (Prisma, Redis, S3) is built.
assertWorkerEnv();
