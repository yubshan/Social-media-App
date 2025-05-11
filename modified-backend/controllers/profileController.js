const { validationResult } = require('express-validator');
const Profile = require('../models/Profile.js');
const User = require('../models/User.js');
const asyncHandler = require('../utils/asyncHandler.js');

module.exports.getProfile = asyncHandler(async (req, res) => {
  const profileId = req.params.id;
  const profile = await Profile.findById(profileId).populate({
    path: 'user',
    select: 'email username avatar bio follower following',
  });
  if (!profile)
    return res
      .status(400)
      .json({ success: false, message: 'Profile not found.' });
  return res
    .status(200)
    .json({ success: true, message: 'Profile found.', data: profile });
});

module.exports.createProfile = asyncHandler(async (req, res) => {
  const { avatar, bio, website, location, skills, socials } = req.body;
  const userId = req.user.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const newProfile = new Profile({
    user: userId,
    website,
    location,
    skills,
    socials,
  });
  await newProfile.save();
  const user = await User.findById(userId);
  user.bio = bio;
  user.avatar = avatar;

  await user.save();
  return res.status(201).json({
    success: true,
    message: 'profile created successfully.',
    data: newProfile,
  });
});

module.exports.updateProfile = asyncHandler(async (req, res) => {
  const { avatar, bio, website, location, skills, socials } = req.body;
  const profileId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const updateObject = {
    website,
    location,
    skills,
    socials,
  };
  const profile = await Profile.findByIdAndUpdate(
    profileId,
    { $set: updateObject },
    { new: true, runValidators: true }
  ).populate('user');
  if (!profile || !profile.user)
    return res.status(404).json({ success: false, message: 'User not found.' });
  profile.user.bio = bio;
  profile.user.avatar = avatar;
  await profile.save();
  return res.status(200).json({
    success: true,
    message: 'profile updated successfully',
    data: profile,
  });
});
