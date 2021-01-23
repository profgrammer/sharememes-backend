const redis = require('ioredis');

const redisClient = new redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

module.exports = redisClient;