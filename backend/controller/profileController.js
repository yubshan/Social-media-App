const User = require('../models/User.js');
const Profile = require('../models/Profile.js');
const upload = require('../middlewares/cloudinary.js');
const { validationResult } = require('express-validator');
module.exports.getProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).populate('profile');
    if (!user) {
      return res.status(404).json({ message: 'User Not found.' });
    }
    if (!user.profile) {
      return res
        .status(404)
        .json({ message: 'Profile not found for this user.' });
    }

    return res
      .status(200)
      .json({ message: "User's profile found", profile: user.profile });
  } catch (error) {
    console.error('Error in getProfileByUserId :', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.getProfileByProfileId = async (req, res) => {
  const { profileId } = req.params;
  try {
    const profile = await Profile.findById(profileId);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found.' });
    }
    return res
      .status(200)
      .json({ message: 'Profile found successfully.', profile: profile });
  } catch (error) {
    console.error('Error in getProfileByProfileId: ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

// needs an update
module.exports.updateProfile = async (req, res) => {
  const { userId } = req.params;
  const { bio, location } = req.body;
  const { avatar, coverPic } = req.files;

  try {
    const user = await User.findOne({ _id: userId }).populate('profile');

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    if (!user.profile) {
      return res
        .status(404)
        .json({ message: 'Profile not found for this user.' });
    }
    if (userId !== req.userId) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }
    let avatarURL = user.profile.avatar;
    let coverPicURL = user.profile.coverPic;

    if (avatar && avatar[0]) {
      const cloudinaryAvatarUrl = await upload(avatar[0].path);
      avatarURL = cloudinaryAvatarUrl;
    }
    if (coverPic && coverPic[0]) {
      const cloudinaryCoverPicUrl = await upload(coverPic[0].path);
      coverPicURL = cloudinaryCoverPicUrl;
    }
    Object.assign(user.profile, {
      avatar: avatarURL,
      coverPic: coverPicURL,
      bio,
      location,
    });

    await user.profile.save();

    return res.status(200).json({
      message: "User's profile is updated successfully",
      profile: user.profile,
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports.followUser = async (req, res) => {
  const userId = req.userId;
  const userToFollowId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }

  if (userId === userToFollowId) {
    return res.status(400).json({ message: "You can't follow yourself." });
  }
  try {
    const user = await User.findById(userId);
    const userToFollow = await User.findById(userToFollowId);
    if (!userToFollow) {
      return res.status(404).json({ message: 'User to follow not found.' });
    }
    if (user.follower.includes(userToFollowId)) {
      return res
        .status(400)
        .json({ message: 'You have already followed this user.' });
    }
    user.following.push(userToFollowId);
    await user.save();

    userToFollow.follower.push(userId);
    await userToFollow.save();

    res.status(200).json({ message: 'User followed successfully' });
  } catch (error) {
    console.error('Error in followUser.', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports.unfollowUser = async (req, res) => {
  const userId = req.userId;
  const userToUnfollowId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  if (userId == userToUnfollowId) {
    return res.status(400).json({ message: "You can't unfollow yourself." });
  }
  try {
    const user = await User.findById(userId);
    const userToUnfollow = await User.findById(userToUnfollowId);
    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User to unfollow not found.' });
    }
    if (!user.following.includes(userToUnfollowId)) {
      return res
        .status(400)
        .json({ message: 'you have not followed this user yet.' });
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
      .json({ message: 'User is unfollowed successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
module.exports.followerCount = async (req, res) => {
  const userId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const followerCount = user.followerCount;
    res
      .status(200)
      .json({ message: 'User follower count', followerCount: followerCount });
  } catch (error) {
    console.error('Error in getting followerCount : ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
module.exports.followingCount = async (req, res) => {
  const userId = req.params.id;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found.' });
    }
    const followingCount = user.followingCount;
    res
      .status(200)
      .json({ message: 'User follower count', followingCount: followingCount });
  } catch (error) {
    console.error('Error in getting followerCount : ', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
