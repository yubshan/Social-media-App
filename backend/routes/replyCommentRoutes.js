const express = require('express');
const { body } = require('express-validator');
const commentController = require('../controller/commentController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const isAuthor = require('../middlewares/isAuthor.js');
const router = express.Router();
const validator = [
  body('content').notEmpty().withMessage('content is required.').trim(),
];
router.post('/:parentCommentId', authMiddleware, validator, commentController.createReplyComment);
router.put('/update/:replyCommentId',
  authMiddleware,
  isAuthor,
  validator,
  commentController.updateReplyComment
);
router.delete('/delete/:replyCommentId',
  authMiddleware,
  isAuthor,
  commentController.deleteReplyComment
);
router.post('/likes/:replyCommentId', commentController.updateReplyCommentLike);
router.post('/unlikes/:replyCommentId', commentController.unlikeReplyComment);
router.get('/likes/:replyCommentId', commentController.replyCommentLikeCount);
module.exports = router;
     