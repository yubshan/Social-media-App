const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content:{
        type:String,
        required: true,
        trim: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    }],
    Comment:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:'Comment'
    }],

}, {timestamp: true});


postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

postSchema.virtual('commentCounts').get(function () {
    return this.comment.length;
})


module.exports = mongoose.model('Post',postSchema);