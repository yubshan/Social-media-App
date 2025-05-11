const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
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
  replies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Reply',
    },
  ],
},{
    timestamps: true,
});

commentSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

module.exports = mongoose.model("Comment", commentSchema);