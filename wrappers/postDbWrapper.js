const Post = require('../models/post');
const mongoose = require('mongoose');

module.exports = () => {
    return {
        getPaginatedPosts: async (page) => {
            const {PAGE_LIMIT} = process.env;
            console.log('page limit', PAGE_LIMIT);
            const skip = (page - 1) * (+PAGE_LIMIT);
            const posts = await Post.find().sort({createdAt: 'desc'}).limit(+PAGE_LIMIT).skip(skip).exec();
            return posts;
        },
        getPostById: async (postId) => {
            const post = await Post.findById(postId).exec();
            return post;
        },
        makePost: async ({title, imageUrl, postedBy, likes}) => {
            const post = await new Post({
                _id: mongoose.Types.ObjectId(),
                title,
                imageUrl,
                postedBy,
                likes
            }).save();
            return post;
        },
        updateLikeList: async (postId, likeList) => {
            const post = await Post.findById(postId).exec();
            post.likeList = likeList;
            await post.save();
            return post;
        }
    }
}