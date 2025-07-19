const User = require('../models/User.js');
const asyncHandler = require('../utils/asyncHandler.js');
const { validationResult } = require('express-validator');


module.exports.getAllUser  = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    return res.status(200).json({success: true, message:'All user are successfully fetched.', data : users});
});

module.exports.getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if(!user)
        return res.status(404).json({success:false, message:"User not found,"});
    return res.status(200).json({success: true, message:"User found.", data: user});
});


module.exports.followUser =asyncHandler (async (req, res) => {
  const userId = req.user.id;
  const userToFollowId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success: false,  errors: errors.array() });
  }

  if (userId === userToFollowId) {
    return res.status(400).json({ success: false,  message: "You can't follow yourself." });
  }
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({success: false,  message: 'User to follow not found.' });
    }
    if (user.follower.includes(userToFollowId)) {
      return res
        .status(400)
        .json({success: false, message: 'You have already followed this user.' });
    }
    user.following.push(userToFollowId);
    await user.save();

    userToFollow.follower.push(userId);
    await userToFollow.save();

    res.status(200).json({success: true,  message: 'User followed successfully' , data : user});
  
});

module.exports.unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const userToUnfollowId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({success: false,  error: errors.array() });
  }
  if (userId == userToUnfollowId) {
    return res.status(400).json({success: false,  message: "You can't unfollow yourself." });
  }
 
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({success: false, message: 'User to unfollow not found.' });
    }
    if (!user.following.includes(userToUnfollowId)) {
      return res
        .status(400)
        .json({success: false,  message: 'you have not followed this user yet.' });
    }

    userToUnfollow.follower = userToUnfollow.follower.filter(
      (id) => id.toString() !== userId
    );

    await userToUnfollow.save();

    user.following = user.following.filter(
      (id) => id.toString() !== userToUnfollowId
    );
    await user.save();

    return res
      .status(200)
      .json({success: true,  message: 'User is unfollowed successfully.', data: user });
  
});
module.exports.followerCount =asyncHandler (async (req, res) => {
  const userId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({success: false, error: error.array() });
  }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({success: false,  message: 'User not found.' });
    }
    const followerCount = user.followerCount;
    res
      .status(200)
      .json({success:true,  message: 'User follower count', followerCount: followerCount });
  
});
module.exports.followingCount =asyncHandler( async (req, res) => {
  const userId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({success: false,  error: error.array() });
  }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({success: false,  message: 'User not found.' });
    }
    const followingCount = user.followingCount;
    res
      .status(200)
      .json({ success: true, message: 'User follower count', followingCount: followingCount });
  
});