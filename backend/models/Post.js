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
    comment:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:'Comment'
    }],

}, {timestamp: true});


postSchema.virtual('likeCount').get(function () {
    return this.likes.length;
});

postSchema.virtual('commentCount').get(function () {
    return this.comment.length;
});



module.exports = mongoose.model('Post',postSchema);