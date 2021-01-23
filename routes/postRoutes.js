const express = require('express');
const router = express.Router();

const { checkJwt } = require('../middleware/checkJwt');
const cacheWrapper = require('../wrappers/cacheWrapper')();
const postDbWrapper = require('../wrappers/postDbWrapper')();
const S3Wrapper = require('../wrappers/S3Wrapper')();
const upload = require('../middleware/fileUpload');

const postsController = require('../controllers/postsController')({cacheWrapper, postDbWrapper, S3Wrapper});

router.get('/feed', (req, res) => {
    const page = req.query.page || 1;
    postsController.getPostFeed(page)
        .then(({status, ...otherInfo}) => {
            res.status(status).json(otherInfo);
        })
        .catch(err => {
            res.status(500).json({success: false, message: 'internal server error'});
        })
});

router.get('/:id', (req, res) => {
    const id = req.params.id;
    postsController.getSinglePost(id)
        .then(({status, ...otherInfo}) => {
            res.status(status).json(otherInfo);
        })
        .catch(err => {
            res.status(500).json({success: false, message: 'internal server error'});
        })
});

router.post('/', checkJwt, upload.single('image'), (req, res) => {
    const user = req.user;
    const file = req.file;
    const {title} = req.body;
    postsController.makePost({title, likes: []}, user, file)
        .then(({status, ...otherInfo}) => {
            res.status(status).json(otherInfo);
        })
        .catch(err => {
            res.status(500).json({success: false, message: 'internal server error'});
        })
});

router.put('/:id/like', checkJwt, (req, res) => {
    const {sub, nickname} = req.user;
    const like = {
        sub,
        nickname,
        timestamp: new Date()
    };
    postsController.likePost(req.params.id, like)
        .then(({status, ...otherInfo}) => {
            res.status(status).json(otherInfo);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({success: false, message: 'internal server error'});
        })
});

router.put('/:id/dislike', checkJwt, (req, res) => {
    const {sub, nickname} = req.user;
    const like = {sub, nickname};
    postsController.dislikePost(req.params.id, like)
        .then(({status, ...otherInfo}) => {
            res.status(status).json(otherInfo);
        })
        .catch(err => {
            res.status(500).json({success: false, message: 'internal server error'});
        })
});

module.exports = router;