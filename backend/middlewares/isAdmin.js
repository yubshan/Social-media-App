const Post = require('../models/Post.js');
const Comment = require('../models/Comment.js');
const Reply = require('../models/Reply.js');
const Profile = require('../models/Profile.js');
const asyncHandler = require('../utils/asyncHandler.js');
const isAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const { id} = req.params;
  let resources;
  let resourceType = 'Resource';

  if (req.baseUrl.includes('/posts')) {
    resources = await Post.findById(id);
    resourceType = 'Post';
  } else if (req.baseUrl.includes('/comments')) {
    resources = await Comment.findById(id);
    resourceType = 'Comment';
  } else if (req.baseUrl.includes('/replies')) {
    resources = await Reply.findById(id);
    resourceType = 'Reply';
  } else if (req.baseUrl.includes('/profile')) {
    resources = await Profile.findById(id);
    resourceType = 'Profile';
  }

  if (!resources) {
    return res
      .status(404)
      .json({ success: false, message: `${resourceType} not found.` });
  }

  if (req.baseUrl.includes('/profile')) {
    if (resources.user.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden. Not authorized to view/edit this profile.' });
    }
  } else if (req.baseUrl.includes('/posts') || req.baseUrl.includes('/comments') || req.baseUrl.includes('/replies')) {
    if (resources.author.toString() !== userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Forbidden. Not the author of this content.' });
    }
  }

  next();
});

module.exports = isAdmin;