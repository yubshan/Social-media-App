const express = require('express');
const postController = require('../controller/postController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const isAuthor = require('../middlewares/isAuthor.js');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', authMiddleware, postController.getAllPost);
router.post(
  '/',
  authMiddleware,
  [body('content').notEmpty().withMessage("content can't be empty").trim()],
  postController.createPost
);
router.get('/:postId', authMiddleware, postController.getOnePost);
router.put(
  '/update/:postId',
  authMiddleware,
  isAuthor,
  postController.updatePost
);
router.delete(
  '/delete/:postId',
  authMiddleware,
  isAuthor,
  postController.deletePost
);
router.get('/likes/:postId', postController.getLikeCount);
router.post('/likes/:postId', postController.updateLikes);
router.post('/unlikes/:postId', postController.unlikePost);
router.get('/comment/:postId', postController.getCommentCount)
module.exports = router;
