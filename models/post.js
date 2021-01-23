const moongoose = require('mongoose');

const Post = moongoose.Schema({
    _id: moongoose.ObjectId,
    title: String,
    imageUrl: String,
    postedBy: Object,
    likes: Array
}, {timestamps: true});

module.exports = moongoose.model('post', Post);