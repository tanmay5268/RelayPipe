const REQUIRED_ENV_VARS = [
  "DATABASE_URL",
  "UPSTASH_REDIS_URL",
  "BUCKET_NAME",
  "BUCKET_REGION",
  "S3_ACCESS_KEY",
  "S3_SECRET_ACCESS_KEY",
  "CLERK_SECRET_KEY",
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
] as const;

export async function register() {
  const missing = REQUIRED_ENV_VARS.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    throw new Error(
      `[file-api] Missing required environment variables: ${missing.join(", ")}. ` +
        "Set them in the deployment environment before starting the server (see README).",
    );
  }
}
