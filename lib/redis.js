const Redis = require("ioredis");
require("dotenv").config();

const redis = new Redis(process.env.REDIS_SECRET);

async function run() {
  try {
    await redis.set("foo", "bar");
    console.log("Key was kept");
  } catch (err) {
    console.error("Redis bilan ishlashda xatolik:", err);
  }
}

run();

module.exports = redis;
