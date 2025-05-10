const { validationResult } = require('express-validator');

const Post = require('../models/Post.js');
const User = require('../models/User.js');
module.exports.getAllPost = async (req, res) => {
  const userId = req.userId;
  try {
    const user = await User.findById(userId).populate('posts');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!user.posts || user.posts.length === 0) {
      return res.status(200).json({ message: 'No post available.' });
    }

    return res
      .status(200)
      .json({ message: 'All post of this user', posts: user.posts });
  } catch (error) {
    console.error('Error in getAllPost :', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports.createPost = async (req, res) => {
  const userId = req.userId;
  const { content, graphics } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newPost = new Post({
      content: content,
      author: user._id,
      graphics,
    });

    await newPost.save();
    user.posts.push(newPost._id);

    await user.save();

    return res
      .status(201)
      .json({ message: 'new post created successfully.', post: newPost });
  } catch (error) {
    console.error('Error in createPost :', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports.getOnePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    return res.status(200).json({ message: 'post found.', post: post });
  } catch (error) {
    console.error('Error in getOnePost :', error);
    return res.status(500).json({ message: 'Internal server error. ' });
  }
};

module.exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;
  console.log(postId);
  
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    post.content = content;

    await post.save();
    return res
      .status(200)
      .json({ message: 'Post has been updated successfully.', post: post });
  } catch (error) {
    console.error('Error in updatePost :', error);
    return res.status(500).json({ message: 'Internal server error. ' });
  }
};

module.exports.deletePost = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        message: 'post not found.',
      });
    }

    const deletePost = await Post.deleteOne({ _id: postId });
    if (deletePost.deletedCount === 0) {
      return res
        .status(400)
        .json({
          message:
            'something went wrong. post may not exist or was not deleted.',
        });
    }

    return res.status(200).json({ message: 'Post is successfully deleted.' });
  } catch (error) {
    console.error('Error in deletePost : ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

module.exports.updateLikes = async (req, res) => {
  const { postId } = req.params;
  const userId = req.userId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    if (post.likes.includes(userId)) {
      return res
        .status(400)
        .json({ message: 'You have already liked this post' });
    }

    post.likes.push(userId);
    await post.save();
    return res
      .status(200)
      .json({ message: 'Like count for this post up by one.' });
  } catch (error) {
    console.error('Error in getPostLIked : ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
exports.unlikePost = async (req, res) => {
    const {postId} = req.params ;
    const userId = req.userId; 
  try {
     const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }

    if (!post.likes.includes(userId)) {
      return res.status(400).json({ message: 'You have not liked this post' });
    }
    
    post.likes = post.likes.filter((id) => id && id.toString() !== userId);
    await post.save();

    res.status(200).json({ message: 'Post unliked successfully', likes: post.likes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


module.exports.getLikeCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const likeCount = post.likeCount;
    return res
      .status(200)
      .json({ message: 'like count of this post.', likeCount: likeCount });
  } catch (error) {
    console.error('Error in getLikeCount: ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports.getCommentCount = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found.' });
    }
    const commentCount = post.commentCount;
    return res
      .status(200)
      .json({
        message: 'comment count for this post.',
        commentCount: commentCount,
      });
  } catch (error) {
    console.error('Error in getCommentCount : ', error);
  }
};
