import { Redis } from '@upstash/redis'
const redis = Redis.fromEnv()

await redis.set("tanmay", "mewati");
const sur = await redis.get("tanmay");
console.log(sur)