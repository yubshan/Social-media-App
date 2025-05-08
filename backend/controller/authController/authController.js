const User = require('../../models/User.js');
const Profile = require('../../models/Profile.js');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');
const { validationResult } = require('express-validator');
const setCookie = require('../../utills/setCookie.js');
const sendEmail = require('../../utills/sendEmail.js');

module.exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }
    const newUser = new User({
      email,
      password,
      username,
    });

    newUser.verificationToken = crypto.randomInt(100000, 999999).toString();
    newUser.verificationExpiresAt = Date.now() + 60 * 60 * 1000;

    const newProfile = new Profile({
        user: newUser._id,
    });

    await newProfile.save();

    newUser.profile = newProfile._id;
     
    await newUser.save();

    const emailSent = sendEmail(email, newUser.verificationToken, true);
    if (!emailSent) {
      return res.status(400).json({ message: 'Error in email-verification.' });
    }
    return res.status(201).json({ message: 'User Created Successfully' });
  } catch (error) {
    console.log('Error in register: ', error);
    return res.status(500).json({ message: 'Server Error.' });
  }
};

module.exports.verifyEmail = async (req, res) => {
  const { token } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const existingUser = await User.findOne({
      verificationToken: token,
      verificationExpiresAt: { $gt: Date.now() },
    });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    existingUser.isVerified = true;
    existingUser.verificationToken = undefined;
    existingUser.verificationExpiresAt = undefined;

    await existingUser.save();
    return res.status(200).json({ message: 'User is verified.' });
  } catch (error) {
    console.log('Error in verify-Email: ', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const checkPassword = await user.comparePassword(password);
    if (!checkPassword) {
      return res.status(400).json({ message: 'Invalid crendentials' });
    }

    setCookie(res, user._id);
    user.lastLogin = Date.now();

    await user.save();
    return res.status(200).json({ message: 'User loged In Successfully.' });
  } catch (error) {
    console.log('Error in Logging in.', error);
    return res.status(500).json({ message: 'Internal Server Error.' });
  }
};

module.exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(400).json({ error: error.array() });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found.' });
    }
    const resetToken = crypto.randomBytes(16).toString('hex').toUpperCase();

    const resetLink = `${req.protocol}://${req.get(
      'host'
    )}/reset-password/${resetToken}`;

    existingUser.resetPasswordToken = resetToken;
    existingUser.resetPasswordExpiresAt = Date.now() + 60 * 60 * 1000;
    
    await existingUser.save();

    const emailSent = sendEmail(email, resetLink, false);
    if (!emailSent) {
      return res
        .status(500)
        .json({ message: 'Error in sending reset password email :', error });
    }

    return res
      .status(200)
      .json({ message:'Reset password email sent successfully.' });
  } catch (error) {
    console.log('Error in forgotPassword: ', error);
    return res.status(500).json({ message: 'Internal Error.' });
  }
};


module.exports.resetPassword = async (req, res) => {
    const {token} = req.params;
    const {password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    };
    
    try {
        const existingUser = await User.findOne({resetPasswordToken: token , resetPasswordExpiresAt : {$gt : Date.now()}});
        if(!existingUser){
            return res.status(400).json({message:"Invalid or expired token"});
        }
        existingUser.password = password;
        existingUser.resetPasswordToken = undefined;
        existingUser.resetPasswordExpiresAt = undefined;

        await existingUser.save();
        return res.status(200).json({message:"Password reset successfully"});
    } catch (error) {
        console.log("Error in resetPassword ", error );
        return res.status(500).json({message:"Internal Server Error."})
    }
}


module.exports.logoutUser =async(req, res) =>{
    res.clearCookie('token');
    return res.status(200).json({message:"You are successfully logged out."});
}