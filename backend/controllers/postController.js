const Post = require('../models/Post.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { validationResult } = require('express-validator');
const cloudinaryUpload  = require('../utils/cloudinary.js');
module.exports.getAllUserPost = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const posts = await Post.find({ author: userId });
  return res.status(200).json({
    success: true,
    message: 'all posts fetch for following user.',
    data: posts,
  });
});

module.exports.getAllPost = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  return res
    .status(200)
    .json({ success: true, message: 'ALl post fetched', data: posts });
});

module.exports.getOnePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post)
    return res.status(400).json({ success: false, message: 'Post not found.' });
  return res
    .status(200)
    .json({ success: true, message: 'Post found.', data: post });
});


module.exports.createPost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const media = req.file;
  const userId = req.user.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const mediaUrl = '';
  if(media)
    mediaUrl = await cloudinaryUpload(media.path)
  const newPost = new Post({
    content,
    media: mediaUrl,
    author: userId,
  });

  await newPost.save();
  return res
    .status(201)
    .json({ success: true, message: 'Post created', data: newPost });
});

module.exports.updatePost = asyncHandler(async (req, res) => {
  const { content } = req.body;
  const postId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'POST not found.' });
  post.content = content;
  await post.save();
  return res
    .status(200)
    .json({ success: true, message: 'post updated successfully', data: post });
});

module.exports.deletePost = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const deletedPost = await Post.findByIdAndDelete(postId);
  if (!deletedPost) {
    return res.status(404).json({ success: false, message: 'Post not found.' });
  }
  return res.status(200).json({ success: true, message: 'post is deleted.' });
});

module.exports.getLikeCount = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'Post not found.' });
  const likeCount = post.likeCount;
  return res.status(200).json({
    success: true,
    message: 'fetch like count for following post.',
    likeCount: likeCount,
  });
});

module.exports.getCommentCount = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'Post not found.' });
  const CommentCount = post.commentCount;
  return res.status(200).json({
    success: true,
    message: 'fetch like count for following post.',
    CommentCount: CommentCount,
  });
});

module.exports.postUnlike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'post not found.' });
  if (!post.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: "You haven't liked this post yet." });
  post.likes = post.likes.filter((id) => id && id.toString() !== userId);
  await post.save();
  return res
    .status(200)
    .json({ success: true, message: 'Like count is updated.', data: post });
});

module.exports.postLike = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const userId = req.user.id;
  const post = await Post.findById(postId);
  if (!post)
    return res.status(404).json({ success: false, message: 'post not found.' });
  if (post.likes.includes(userId))
    return res
      .status(400)
      .json({ success: false, message: 'You have already liked this post.' });
  post.likes.push(userId);
  await post.save();
  return res
    .status(200)
    .json({ success: true, message: 'Like count is updated.', data: post });
});
