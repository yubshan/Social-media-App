const User = require('../models/User.js');
const Profile = require('../models/Profile.js');

module.exports.getProfileByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById({ userId }).populate('profile');
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
    const profile = await Profile.findById({ profileId });
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
  const userId = req.userId;
  const { avatar, coverPic, bio, location } = req.body;

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

    Object.assign(user.profile, {
      avatar,
      coverPic,
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
