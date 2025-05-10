const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    content:{
        type:String,
        required: true,
        trim: true,
        default: ''
    },
    graphics:{
        type: String
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        
    }],
    comments:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:'Comment'
    }],

}, {timestamp: true});


postSchema.virtual('likeCount').get(function () {
    return this.likes.length? this.likes.length : 0;
});

postSchema.virtual('commentCount').get(function () {
    return this.comments.length? this.comment.length : 0;
});



module.exports = mongoose.model('Post',postSchema);