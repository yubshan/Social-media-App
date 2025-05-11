const { validationResult } = require('express-validator');
const Reply = require('../models/Reply.js');
const Comment = require('../models/Comment.js');
const asyncHandler = require('../utils/asyncHandler.js');

module.exports.getAllReplyComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const replyComments = await Reply.find({ comment: commentId });
  return res.status(200).json({
    success: true,
    message: 'fetch all reply comments.',
    data: replyComments,
  });
});

module.exports.createReplyComment = asyncHandler(async (req, res) => {
  const text = req.body;
  const commentId = req.params.id;
  const userId = req.user.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const comment = await Comment.findById(commentId);
  if (!comment)
    return res
      .status(404)
      .json({ success: false, message: 'comment not found.' });
  const newReplyComment = new Reply({
    text,
    author: userId,
    comment: commentId,
  });
  await newReplyComment.save();

  comment.replies.push(newReplyComment._id);
  await comment.save();
  return res.status(201).json({
    success: true,
    message: 'New reply comment created successfully.',
    data: newReplyComment,
  });
});

module.exports.updataReplyComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const replyCommentId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const replyComment = await Reply.findById(replyCommentId);
  if (!replyComment)
    return res
      .status(404)
      .json({ success: false, message: 'Reply comment not found.' });
  replyComment.text = text;
  await replyComment.save();
  return res.status(200).json({
    success: true,
    message: 'reply comment updated successfully.',
    data: replyComment,
  });
});

module.exports.deleteReplyComment = asyncHandler(async (req, res) => {
  const replyCommentId = req.params.id;
  const deleteReplyComment = await Reply.findByIdAndDelete(
    replyCommentId
  ).populate('comment');
  if (!deleteReplyComment)
    return res
      .status(404)
      .json({ success: false, message: 'Reply comment not found.' });
  deleteReplyComment.comment.replies =
    deleteReplyComment.comment.replies.filter(
      (id) => id && id.toString() !== deleteReplyComment.comment
    );
    await deleteReplyComment.comment.save();
    return res.status(200).json({success: true, message: "Reply comment deleted successfully"})
});

module.exports.getLikeCount = asyncHandler(async (req, res) => {
  const replyCommentId = req.params.id;
  const replyComment = await Reply.findById(replyCommentId);
  if (!replyComment)
    return res.status(404).json({ success: false, message: 'reply comment not found.' });
  const likeCount = replyComment.likeCount;
  return res.status(200).json({
    success: true,
    message: 'fetch like count for following reply comment.',
    likeCount: likeCount,
  });
});

module.exports.replyCommentLike = asyncHandler(async (req, res) => {
  const replyCommentId = req.params.id;
  const userId = req.user.id;
  const replyComment = await Reply.findById(replyCommentId);
  if (!replyComment)
    return res
      .status(404)
      .json({ success: false, message: 'reply comment not found.' });
  if (replyComment.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: 'You have already liked this reply comment.' });
  replyComment.likes.push(userId);
  await replyComment.save();
  return res.status(200).json({
    success: true,
    message: 'reply comment liked successfully.',
    data: replyComment,
  });
});

module.exports.replyCommentUnlike = asyncHandler(async (req, res) => {
  const replyCommentId = req.params.id;
  const userId = req.user.id;
  const replyComment = await Reply.findById(replyCommentId);
  if (!replyComment)
    return res
      .status(404)
      .json({ success: false, message: 'reply comment not found.' });
  if (!replyComment.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: 'You have not liked this reply comment yet.' });
  replyComment.likes = replyComment.likes.filter((id) => id && id.toString() !== userId);
  await replyComment.save();
  return res.status(200).json({
    status: true,
    message: 'reply comment liked successfully.',
    data: replyComment,
  });
});