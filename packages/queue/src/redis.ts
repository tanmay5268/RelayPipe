import "dotenv/config";
import Redis from "ioredis";

const redisUrl = process.env.UPSTASH_REDIS_URL;

if (!redisUrl) {
  throw new Error("UPSTASH_REDIS_URL is not set");
}

export const client = new Redis(redisUrl, {
  maxRetriesPerRequest: null,
});
