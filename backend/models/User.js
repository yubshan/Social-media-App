const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    email:{
        type:String,
        required: true,
        unique : true,
        trim : true,
        lowercase:true  
    },
    
    password:{
        type:String,
        required: true
    },
    
    username:{
        type:String,
        required: true,
        trim : true
    },

    profile :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Profile'
    },
    
    lastLogin: {
        type: Date,
        default: Date.now,
      },
    
    isVerified:{
        type:Boolean,
        default: false
    },

    follower :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
    }],
    following:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    posts:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Post'
    }],
    notification:[{
        type:{
            type: String,
            required: true
        },
        content:{
            type:Object,
            required:true
        },
        sender:{
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        },
        isRead:{
            type:Boolean,
            default:false,
        },
        createdAt:{
            type : Date,
            default: Date.now
        }
    }],
    verificationToken: String,
    verificationExpiresAt: Date,
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date

}, {
    timestamps: true
});


//it helps to index a user by userName that helps to find user quickly
// resources: https://docs.google.com/document/d/1ai1NaT3u4EExsdSJkbeW5xMA3ZoQJ7abdzNyJCLNb2U/edit?usp=sharing 

userSchema.index({username: 1});


//it is a middleware 'pre' provided by mongoose (it hash password before saving user when ever user.save() is called.)
userSchema.pre('save', async function (next) {
    if(!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password= await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
})



// virtual is a read only function that read that data and return the result. it can't modify tha actuall document 
userSchema.virtual('followerCount').get(function () {
    return this.follower.length;
});

userSchema.virtual('followingCount').get(function () {
    return this.following.length;
})

//it is a methods that will  verify the dehashed the prompt password with the password saved in this file
userSchema.methods.comparePassword=async function (password) {
    return await bcrypt.compare(password, this.password);
}

module.exports = mongoose.model('User', userSchema);