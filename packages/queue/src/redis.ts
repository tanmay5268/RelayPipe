import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  console.warn(
    "[@repo/queue] UPSTASH_REDIS_URL is not set - queue operations will fail at runtime until it is provided.",
  );
}

export const client = new Redis(redisUrl!, {
  maxRetriesPerRequest: null,
  lazyConnect: true,
});
