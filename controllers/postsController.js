module.exports = ({postDbWrapper, cacheWrapper, S3Wrapper}) => {
    return {
        getPostFeed: async (page) => {
            try {
                const postsFromCache = await cacheWrapper.getPaginatedPosts(page);
                if(postsFromCache === null) {
                    const postsFromDb = await postDbWrapper.getPaginatedPosts(page);
                    await cacheWrapper.savePaginatedPosts(postsFromDb, page);
                    console.log('from db', postsFromDb);
                    return {status: 200, success: true, posts: postsFromDb};
                } else {
                    console.log('from cache', typeof postsFromCache);
                    return {status: 200, success: true, posts: JSON.parse(postsFromCache)};
                }
            } catch(err) {
                console.log(err);
                return {status: 500, success: false, message: "internal server error"};
            }
        },
        getSinglePost: async (id) => {
            try {
                const post = await postDbWrapper.getPostById(id);
                return {status: 200, success: true, post};
            } catch(err) {
                console.log(err);
                return {status: 500, success: false, message: 'internal server error'};
            }
        },
        makePost: async (post, user, file) => {
            try {
                const {title, likes} = post;
                const imageUrl = await S3Wrapper.uploadFileToS3(file.path, file.filename);
                const postedBy = user;
                const newPost = await postDbWrapper.makePost({title, imageUrl, postedBy, likes});
                return {status: 200, success: true, post: newPost};
            } catch(err) {
                console.log(err);
                return {status: 500, success: false, message: 'internal server error'};
            }
        },
        // if already existing in like list, do nothing
        // else add to like list
        likePost: async (postId, user) => {
            try {
                const post = await postDbWrapper.getPostById(postId);
                let {likes} = post;
                likes = likes.filter(like => like.sub !== user.sub);
                likes.push(user);
                post.likes = likes;
                await post.save();
                return {status: 200, success: true};
            } catch(err) {
                console.log(err);
                return {status: 500, success: false, message: 'internal server error'};
            }
        },
        // if already not existing in like list, do nothing
        // else remove from like list
        dislikePost: async (postId, user) => {
            try {
                const post = await postDbWrapper.getPostById(postId);
                let {likes} = post;
                likes = likes.filter(like => like.sub !== user.sub);
                post.likes = likes;
                await post.save();
                return {status: 200, success: true};
            } catch(err) {
                console.log(err);
                return {status: 500, success: false, message: 'internal server error'};
            }
        }
    }
}