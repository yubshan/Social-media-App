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
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    Reply:[{
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


module.exports = mongoose.model('Comment', commentSchema), mongoose.model('Reply', replySchema);