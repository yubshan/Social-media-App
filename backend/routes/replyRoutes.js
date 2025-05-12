const express = require('express');
const {body, param}= require('express-validator');

// import controller and middlewares
const replyController = require("../controllers/replyController.js");
const protect = require("../middlewares/authMiddleware.js");
const isAdmin = require('../middlewares/isAdmin.js');

// define router 
const router = express.Router();

// validator 
const isText = [body('text').notEmpty().withMessage("content can't be empty").trim()];
const isPostId = param('id').notEmpty().withMessage("post id can't be empty");
const isCommentId = param('id').notEmpty().withMessage("comment id can't be empty.");
// routes 
router.get('/:id', protect,isPostId,  replyController.getAllReplyComment);
router.post('/:id',protect , isPostId,isText, replyController.createReplyComment );
router.put('/:id',protect, isAdmin, isCommentId, isText, replyController.updataReplyComment );
router.delete('/:id', protect, isAdmin, isCommentId, replyController.deleteReplyComment);
router.get('/likes/:id', isCommentId, replyController.getLikeCount);
router.post('/likes/:id', protect, isCommentId, replyController.replyCommentLike);
router.post('/unlike/:id' , protect, isCommentId, replyController.replyCommentUnlike);

module.exports= router;


