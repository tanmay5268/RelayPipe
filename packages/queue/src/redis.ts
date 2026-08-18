import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  throw new Error(
    "[@repo/queue] UPSTASH_REDIS_URL is not set. Add your Redis connection string (e.g. rediss://... for Upstash) to the environment before starting the API or the worker.",
  );
}

export const client = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});
