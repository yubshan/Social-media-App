const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{
        type:String,
        unique:true,
        required: true,
    },
    password:{
        type: String,
        required: true,
    },
    username: {
        type:String, 
        required: true,
    },
    avatar:{
        type: String,
        default: 'public/images/avatar.png'
    },
    follower:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationCode : String,
    verificationCodeExpiresAt: Date,
    resetPasswordVerificationCode : String,
    resetPasswordVerificationCodeExpiresAt: Date,
},{
    timestamps: true,
});

userSchema.virtual('followerCount').get(function () {
    return this.follower.length ;
});
userSchema.virtual('followingCount').get(function () {
    return this.following.length ;
});

module.exports = mongoose.model("User", userSchema);