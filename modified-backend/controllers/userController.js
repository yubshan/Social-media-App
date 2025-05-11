const User = require('../models/User.js');
const asyncHandler = require('../utils/asyncHandler.js');

module.exports.getAllUser  = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    return res.status(200).json({success: true, message:'All user are successfully fetched.', data : users});
});

module.exports.getUserById = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    if(!user)
        return res.status(404).json({success:false, message:"User not found,"});
    return res.status(200).json({success: true, message:"User found.", data: user});
})