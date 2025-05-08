const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
    },
    avtar:{
        type: String,
        default:'/asset/images/avatar.png'
    },
    coverPic : {
        type: String,
        default :'/asset/images/coverPic.png'
    },
    bio:{
        type: String,
        default: '',
        maxLength: 500
    },
    location:{
        type:String
    },

}, {
    timestamp: true,
});

module.exports = mongoose.model('Profile', profileSchema);