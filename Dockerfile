# Runs the BullMQ worker (apps/file_worker) as a persistent process.
# Deploy this to any platform that runs long-lived containers (Railway,
# Render, Fly.io, ECS, VPS + Docker, ...). NOT suitable for serverless hosts
# like Vercel — a worker must stay alive to consume Redis jobs.
FROM node:22-slim

WORKDIR /app

# Enable pnpm (version pinned by "packageManager" in package.json)
RUN corepack enable

# Prisma needs OpenSSL present in the image
RUN apt-get update && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy the whole monorepo context (see .dockerignore) so pnpm workspaces resolve.
COPY . .

# Install only file_worker's production dependency tree (worker source is run
# directly via tsx — no compiled bundle needed). @types/node etc. are dev-only.
RUN pnpm install --filter file_worker --frozen-lockfile --prod

ENV NODE_ENV=production

# Provide these at runtime on the platform (same vars as apps/file_worker/.env):
#   DATABASE_URL, UPSTASH_REDIS_URL, BUCKET_NAME, BUCKET_REGION,
#   S3_ACCESS_KEY, S3_SECRET_ACCESS_KEY
CMD ["pnpm", "--filter", "file_worker", "start"]
