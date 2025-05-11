const mongoose = require('mongoose');
const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    media: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
  }
);

postSchema.virtual('likesCount').set(function () {
  return this.likes.length;
});
postSchema.virtual('commentCount').set(function () {
  return this.likes.comments;
});
module.exports = mongoose.model('Post', postSchema);
