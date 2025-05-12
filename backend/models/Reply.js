const mongoose = require ('mongoose');

const replySchema = mongoose.Schema({
    text: {
        type: String ,
        required: true,
    },
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
    comment: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }
},{
    timestamps: true
});

replySchema.virtual('likeCount').get(function () {
    return this.likes.length;
})

module.exports = mongoose.model("Reply", replySchema);