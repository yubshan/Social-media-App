const Comment = require('../models/Comment.js');
const Post = require('../models/Post.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { validationResult } = require('express-validator');
module.exports.getAllCommentByPost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId });
  return res
    .status(200)
    .json({ success: true, message: 'fetched all comments', data: comments });
});

module.exports.createComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const postId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'Post not found.' });
  const newComment = {
    text,
    post: postId,
    author: req.user.id,
  };
  await newComment.save();

  post.comments.push(newComment._id);

  await post.save();
  return res.status(201).json({
    success: true,
    message: 'Comment added successfully.',
    data: newComment,
  });
});

module.exports.updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const commentId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res
      .status(404)
      .json({ success: false, message: 'comment not found.' });
  comment.text = text;
  await comment.save();
  return res.status(200).json({
    success: true,
    message: 'comment updated successfully.',
    data: comment,
  });
});
module.exports.deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const deleteComment = await Comment.findByIdAndDelete(commentId).populate(
    'post'
  );
  if (!deleteComment)
    return res
      .status(404)
      .json({ success: false, message: 'Comment not found.' });
  deleteComment.post.comments = deleteComment.post.comments.filter(
    (id) => id && id.toString() !== deleteComment.post
  );
  await deleteComment.post.save();
  return res
    .status(200)
    .json({ success: true, message: 'Comment deleted successfully.' });
});

module.exports.getLikeCount = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res.status(404).json({ success: false, message: 'comment not found.' });
  const likeCount = comment.likeCount;
  return res.status(200).json({
    success: true,
    message: 'fetch like count for following comment.',
    likeCount: likeCount,
  });
});

module.exports.commentLike = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res
      .status(404)
      .json({ success: false, message: 'comment not found.' });
  if (comment.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: 'You have already liked this comment.' });
  comment.likes.push(userId);
  await comment.save();
  return res.status(200).json({
    success: true,
    message: 'comment liked successfully.',
    data: comment,
  });
});

module.exports.commentUnlike = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const userId = req.user.id;
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res
      .status(404)
      .json({ success: false, message: 'comment not found.' });
  if (!comment.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: 'You have not liked this comment yet.' });
  comment.likes = comment.likes.filter((id) => id && id.toString() !== userId);
  await comment.save();
  return res.status(200).json({
    success: true,
    message: 'comment liked successfully.',
    data: comment,
  });
});
