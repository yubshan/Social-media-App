const { validationResult } = require('express-validator');
const Comment= require('../models/Comment.js');
const Reply = require('../models/Reply.js');
const User = require('../models/User.js');
const Post = require('../models/Post.js');
module.exports.createComment = async (req, res) => {
  const userId = req.userId;
  const { content } = req.body;
  const { postId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array() });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'post not found.' });
    }
    const newComment = new Comment({
      content,
      author: user._id,
      post: post._id,
    });

    await newComment.save();

    post.comments.push(newComment._id);
    await post.save();

    res
      .status(201)
      .json({ message: 'new comment is created', comment: newComment });
  } catch (error) {
    console.error('Error in createComment:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports.updateComment = async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'comment not found.' });
    }
    comment.content = content;
    await comment.save();
    return res
      .status(200)
      .json({ message: 'comment is successfully updated.', comment: comment });
  } catch (error) {
    console.error('Error in updateComment :', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports.deleteComment = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'comment not found.' });
    }
    const deletedComment = await Comment.deleteOne({ _id: comment._id });
    if (deletedComment.deletedCount === 0) {
      return res.status(400).json({
        message:
          'Something went wrong. comment may not exist or was already deleted.',
      });
    }
    return res
      .status(200)
      .json({ message: 'comment is successfully deleted.' });
  } catch (error) {
    console.error('Error in deleteComment :', error);
    return res.status(500).json({ message: 'Internal server Error.' });
  }
};

module.exports.createReplyComment = async (req, res) => {
  const { content } = req.body;
  const { parentCommentId } = req.params;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const parentComment = await Comment.findById(parentCommentId);
    if (!parentComment) {
      res.status(404).json({ message: 'Comment not found.' });
    }
    const userId = req.userId;
    const newReplyComment = new Reply({
      content,
      author: userId,
      parentComment: parentComment._id,
    });
    await newReplyComment.save();

    parentComment.replies.push(newReplyComment._id);
    await parentComment.save();
    return res
      .status(201)
      .json({ message: 'Reply Comment is created.', reply: newReplyComment });
  } catch (error) {
    console.error('Error in createReplyError: ', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateReplyComment = async (req, res) => {
  const { replyCommentId } = req.params;
  const { content } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return req.status(400).json({ error: error.array() });
  }
  try {
    const replyComment = await Reply.findById(replyCommentId);
    if (!replyComment) {
      return res.status(404).json({ message: 'Reply comment not found.' });
    }
    replyComment.content = content;
    await replyComment.save();
    return res.status(200).json({
      message: 'reply comment successfully updated',
      updatedReply: replyComment,
    });
  } catch (error) {
    console.error('Error in updataReplyComment.');
    return req.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports.deleteReplyComment = async (req, res) => {
  const { replyCommentId } = req.params;
  try {
    const replyComment = await Reply.findById(replyCommentId);
    if (!replyComment) {
      return res.status(404).json({ message: 'Reply comment not found.' });
    }
    const deletedReplyComment = await Reply.deleteOne({ _id: replyCommentId });
    if (deletedReplyComment.deletedCount === 0) {
      return res.status(400).json({
        message:
          'something went wrong. reply comment may not exist or was already delted.',
      });
    }
    res.status(200).json({
      message: 'Reply comment deleted successfully.',
      deletedComment: replyComment,
    });
  } catch (error) {
    console.error('Error in deleteReplyComment : ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports.updateCommentLike = async (req, res) => {
  const { commentId } = req.params;
  const userId = req.userId;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'comment not found.' });
    }

    if (comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have already liked this comment' });
    }

    comment.likes.push(userId);
    await comment.save();
    return res
      .status(200)
      .json({ message: 'Like for this comment is updated.' });
  } catch (error) {
    console.error('Error in updataCommentLike:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.unlikeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    
    const userId = req.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have not liked this comment' });
    }

    comment.likes = comment.likes.filter((id) => id && id.toString() !== userId);
    await comment.save();

    res.status(200).json({ message: 'Comment unliked', likes: comment.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
exports.unlikeReplyComment = async (req, res) => {
  try {
    const { replyCommentId } = req.params;
    const userId = req.userId;

    const comment = await Reply.findById(replyCommentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (!comment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have not liked this comment' });
    }

    comment.likes = comment.likes.filter((id) => id && id.toString() !== userId);
    await comment.save();

    res.status(200).json({ message: 'Comment unliked', likes: comment.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports.updateReplyCommentLike = async (req, res) => {
  const { replyCommentId } = req.params;
  const userId = req.userId;
  try {
    const replyComment = await Reply.findById(replyCommentId);
    if (!replyComment) {
      return res.status(404).json({ message: 'comment not found.' });
    }
    if (replyComment.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have already liked this comment' });
    }

    replyComment.likes.push(userId);
    await replyComment.save();
    return res
      .status(200)
      .json({ message: 'Like for this comment is updated.' });
  } catch (error) {
    console.error('Error in updataCommentLike:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports.commentLikeCount = async (req, res) => {
  const { commentId } = req.params;
  try {
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'comment not found.' });
    }
    const commentLikeCount = comment.likeCount;
    return res.status(200).json({
      message: 'like count for this comment.',
      likeCount: commentLikeCount,
    });
  } catch (error) {
    console.error('Error in commentLikeCount: ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports.replyCommentLikeCount = async (req, res) => {
  const { replyCommentId } = req.params;
  try {
    const replyComment = await Reply.findById(replyCommentId);
    if (!replyComment) {
      return res.status(404).json({ message: 'comment not found.' });
    }
    const commentLikeCount = replyComment.likeCount;
    return res.status(200).json({
      message: 'like count for this comment.',
      likeCount: commentLikeCount,
    });
  } catch (error) {
    console.error('Error in getCommentLike: ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
