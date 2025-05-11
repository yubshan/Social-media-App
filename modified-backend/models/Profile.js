const mongoose = require('mongoose');

const profileSchema = mongoose.Schema({
    user:{
        type : mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    website:{
        type: String 
    },
    location: String,
    skills : [String],
    social: {
        twitter: String , 
        facebook : String, 
        linkden: String, 
        instagram: String,
    },

}, {
    timestapms: true,
});

module.exports = mongoose.model("Profile", profileSchema);