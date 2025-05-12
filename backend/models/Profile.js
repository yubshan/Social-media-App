const mongoose = require('mongoose');

const profileSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    bio: {
      type: String,
    },
    website: {
      type: String,
    },
    location: String,
    skills: [String],
    socials: {
      twitter: String,
      facebook: String,
      linkden: String,
      instagram: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Profile', profileSchema);
