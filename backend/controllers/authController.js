const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const asyncHandler = require('../utils/asyncHandler.js');
const genHashedPassword = require('../utils/genHashedPassword.js');
const User = require('../models/User.js');
const sendEmail = require('../utils/sendEmail.js');
const setCookie = require('../utils/setCookies.js');

module.exports.register = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const user = await User.findOne({ email });
  if (user)
    return res
      .status(400)
      .json({ success: false, message: 'Email already in use.' });
  const hashedPassword = await genHashedPassword(password);
  const verificationCode = crypto.randomBytes(16).toString('hex').toUpperCase();
  const verificationLink = `${req.protocol}://${req.get(
    'host'
  )}/verify-email/${verificationCode}`;
  const verificationCodeExpiresAt = Date.now() + 60 * 60 * 1000; //1hrs
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
    verificationCode,
    verificationCodeExpiresAt,
  });
  await newUser.save();
  sendEmail(email, verificationLink, true);
  return res.status(201).json({
    success: true,
    message: 'User Created.',
    data: newUser,
  });
});

module.exports.verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const user = await User.findOne({
    verificationCode: token,
    verificationCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: 'Token Invalid or may be Expired.' });
  }
  user.isVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpiresAt = undefined;
  await user.save();
  return res
    .status(200)
    .json({
      success: true,
      message: 'user verified successfully.',
      data: user,
    });
});

module.exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const user = await User.findOne({ email });
  const decodedPassword = await bcrypt.compare(password, user.password);
  if (!decodedPassword || !user)
    return res
      .status(404)
      .json({ success: false, message: 'Invalid Credentials.' });
  setCookie(res, user._id);
  return res
    .status(200)
    .json({
      success: true,
      message: 'user logged In.',
      data: user,
    });
});

module.exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const user = await User.findOne({ email });
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found.' });
  const resetPasswordVerificationCode = crypto
    .randomBytes(16)
    .toString('hex')
    .toUpperCase();
  const resetPasswordLink = `${req.protocol}://${req.get(
    'host'
  )}/forgot-password/${resetPasswordVerificationCode}`;
  const resetPasswordVerificationCodeExpiresAt = Date.now() + 60 * 60 * 1000; //1hrs;

  user.resetPasswordVerificationCode = resetPasswordVerificationCode;
  user.resetPasswordVerificationCodeExpiresAt =
    resetPasswordVerificationCodeExpiresAt;

  await user.save();
  sendEmail(email, resetPasswordLink, false);
  return res
    .status(200)
    .json({
      success: true,
      message: 'Password reset link sent to your email address.',
    });
});

module.exports.resetPassword = asyncHandler(async (req, res) => {
  const token = req.params.token;
  const { password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ success: false, error: errors.array() });
  const user = await User.findOne({
    resetPasswordVerificationCode: token,
    resetPasswordVerificationCodeExpiresAt: { $gt: Date.now() },
  });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid token or may be expired.' });
  const hashedPassword = await genHashedPassword(password);
  user.password = hashedPassword;
  user.resetPasswordVerificationCode = undefined;
  user.resetPasswordVerificationCodeExpiresAt = undefined;
  await user.save();
  return res
    .status(200)
    .json({
      success: true,
      message: 'password reset successfully.',
      data: user,
    });
});

module.exports.logout = function (req, res) {
  res.clearCookie('token');
  return res
    .status(200)
    .json({ success: true, message: 'logged out successfully' });
};
