const { validationResult } = require('express-validator');
const cloudinaryUpload = require('../utils/cloudinary.js');
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
      .status(404)
      .json({ success: false, message: 'Profile not found.' });
  return res
    .status(200)
    .json({ success: true, message: 'Profile found.', data: profile });
});

module.exports.createProfile = asyncHandler(async (req, res) => {
  const {bio, website, location, skills, socials } = req.body;
  const avatar = req.file;
  const userId = req.user.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const newProfile = new Profile({
    user: userId,
    bio,
    website,
    location,
    skills,
    socials,
  });
  await newProfile.save();
  const user = await User.findById(userId);
  const avatarUrl = user.avatar;
  if(avatar)
    avatarUrl = await cloudinaryUpload(avatar.path);
  user.avatar = avatarUrl;

  await user.save();
  return res.status(201).json({
    success: true,
    message: 'profile created successfully.',
    data: newProfile,
  });
});


module.exports.updateProfile = asyncHandler(async (req, res) => {
  const { bio, website, location, skills, socials } = req.body;
  const avatar = req.file;
  const profileId = req.params.id;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const updateObject = {
    bio,
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
  const avatarUrl = profile.user.avatar;
  if(avatar)
    avatarUrl = await cloudinaryUpload(avatar.path);
  profile.user.avatar = avatarUrl;
  await profile.user.save();
  return res.status(200).json({
    success: true,
    message: 'profile updated successfully',
    data: profile,
  });
});
