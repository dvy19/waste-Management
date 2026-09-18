const { createClient } = require("redis");

const redisClient = createClient({
    url: process.env.REDIS_URL
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log("Redis connected successfully");
    } catch (err) {
        console.log("Redis connection failed:", err);
    }
};

module.exports = {
    redisClient,
    connectRedis
};