const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controller/commentController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const isAuthor = require('../middlewares/isAuthor.js');
const router = express.Router();
const validator = [
  body('content').notEmpty().withMessage('content is required.').trim(),
];
router.post('/:postId', authMiddleware, validator, commentController.createComment);
router.put(
  '/update/:commentId',
  authMiddleware,
  isAuthor,
  validator,
  commentController.updateComment
);
router.delete(
  '/delete/:commentId',
  authMiddleware,
  isAuthor,
  commentController.deleteComment
);
router.post('/like/:commentId', commentController.updateCommentLike);
router.post('/unlike/:commentId', commentController.unlikeComment);
router.get('/likes/:commentId', commentController.commentLikeCount);
module.exports = router;
