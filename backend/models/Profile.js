const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    avatar: {
      type: String,
      default: 'public/images/avatar.png',
    },
    coverPic: {
      type: String,
      default: 'public/images/coverPic.jpg',
    },
    bio: {
      type: String,
      default: '',
      maxLength: 500,
    },
    location: {
      type: String,
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
