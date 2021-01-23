const redisClient = require('../redis');

module.exports = () => {
    return {
        getPaginatedPosts: async page => {
            const key = `${process.env.REDIS_POSTS_PREFIX}:${page}`;
            try {
                const data = await redisClient.get(key);
                return data;
            } catch(err) {
                console.log(err);
                return null;
            }
        },
        savePaginatedPosts: async (posts, page) => {
            const key = `${process.env.REDIS_POSTS_PREFIX}:${page}`;
            try {
                redisClient.setex(key, process.env.REDIS_CACHE_EXPIRY, JSON.stringify(posts));
                return true;
            } catch(err) {
                console.log(err);
                return false;
            }
        }
    }
}