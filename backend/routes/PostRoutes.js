const express = require('express');
const {body, param} = require('express-validator')

// import controller and middlwares
const postController = require('../controllers/postController.js');
const protect = require('../middlewares/authMiddleware.js');
const isAdmin = require('../middlewares/isAdmin.js');

// import multer 
const upload = require('../middlewares/multer.js')

// define router
const router = express.Router();

// validator 
const isContent  = body('content').optional().trim();
const isUserId = param('id').notEmpty().withMessage("user id must be provided.");
const isPostId =param('id').notEmpty().withMessage("post id must be provided");
// routes 
router.get('/user/:id', protect, isUserId, postController.getAllUserPost );
router.get('/', protect, postController.getAllPost);
router.get('/:id', protect, isPostId,postController.getOnePost );
router.post('/', protect , isContent, upload.single('media'),postController.createPost);
router.put('/:id', protect, isAdmin, isContent,isPostId, upload.single('media'), postController.updatePost );
router.delete('/:id', protect, isAdmin, isPostId, postController.deletePost);
router.get('/likes/:id', isPostId, postController.getLikeCount);
router.get('/comment/:id', isPostId, postController.getCommentCount);
router.post('/likes/:id',protect, isPostId, postController.postLike );
router.post('/unlikes/:id', protect, isPostId, postController.postUnlike);

module.exports = router;