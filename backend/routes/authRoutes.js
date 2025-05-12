const express = require('express');
const { body, param } = require('express-validator');
const authController = require('../controllers/authController.js');
const protect = require('../middlewares/authMiddleware.js');

const router = express.Router();

const isEmail = [
  body('email')
    .isEmail()
    .withMessage('Invalid Email')
    .notEmpty()
    .withMessage('email must be provided.')
    .trim()
    .isLowercase(),
];
const isPassword = [
  body('password')
    .notEmpty()
    .withMessage('password must be provided')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast of 8 character')
    .trim(),
];

const isUsername = [
  body('username').notEmpty().withMessage('Username must be provided.').trim(),
];

const isToken = [
  param('token').notEmpty().withMessage('Token must be provided.'),
];

router.post(
  '/register',
  isEmail,
  isPassword,
  isUsername,
  authController.register
);
router.get('/verify-email/:token', isToken, authController.verifyEmail);
router.post('/login', isEmail, isPassword, authController.login);
router.post('/forgot-password', isEmail, authController.forgotPassword);
router.post(
  '/reset-password/:token',
  isToken,
  isPassword,
  authController.resetPassword
);
router.get('/logout', protect, authController.logout);

module.exports = router;