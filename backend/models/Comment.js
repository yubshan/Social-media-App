const mongoose = require('mongoose');

const replySchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
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
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  },
  { timestamps: true }
);

const commentSchema = mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    post:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    replies:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Reply'
    }]
  },
  {
    timestamps: true,
  }
);

commentSchema.virtual('likeCount').get(function () {
  return this.likes.length;
});
replySchema.virtual('likeCount').get(function () {
  return this.likes.length;
});

const CommentModel = mongoose.model('Comment', commentSchema);
const ReplyModel = mongoose.model('Reply', replySchema);
module.exports = { Comment: CommentModel, Reply: ReplyModel };