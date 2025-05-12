const express = require('express');
const {body, param}= require('express-validator');

// import controller and middlewares
const commentController = require("../controllers/commentController.js");
const protect = require("../middlewares/authMiddleware.js");
const isAdmin = require('../middlewares/isAdmin.js');

// define router 
const router = express.Router();

// validator 
const isText = [body('text').notEmpty().withMessage("content can't be empty").trim()];
const isPostId = param('id').notEmpty().withMessage("post id can't be empty");
const isCommentId = param('id').notEmpty().withMessage("comment id can't be empty.");
// routes 
router.get('/:id', protect,isPostId,  commentController.getAllCommentByPost );
router.post('/:id',protect , isPostId,isText, commentController.createComment );
router.put('/:id',protect, isAdmin, isCommentId, isText, commentController.updateComment );
router.delete('/:id', protect, isAdmin, isCommentId, commentController.deleteComment);
router.get('/likes/:id', isCommentId, commentController.getLikeCount);
router.post('/likes/:id', protect, isCommentId, commentController.commentLike);
router.post('/unlike/:id' , protect, isCommentId, commentController.commentUnlike);

module.exports= router;


