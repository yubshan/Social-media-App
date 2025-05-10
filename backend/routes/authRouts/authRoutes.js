const express = require('express');
const { body } = require('express-validator');
const authController = require('../../controller/authController/authController.js');
const authMiddleware = require('../../middlewares/authmiddleware/authmiddleware.js');
const router = express.Router();
const validator = [
  body('email')
    .isEmail()
    .withMessage('Invalid Email address')
    .notEmpty()
    .withMessage('Email is required')
    .trim()
    .toLowerCase(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must contain at least 8 characters')
    .trim(),
  body('username').notEmpty().withMessage('username is required').trim(),
];
router.post('/register', validator, authController.registerUser);
router.post( '/register/email-verification',
  [
    body('token').notEmpty().withMessage('Token is required.'),
    validator.slice(0, 0),
  ],
  authController.verifyEmail
);
router.post('/login', validator.slice(0, 1), authController.loginUser);
router.post('/forgot-password',
  [
    body('email')
      .isEmail()
      .withMessage('Invalid Email.')
      .notEmpty()
      .withMessage('Email is required.')
      .trim()
      .isLowercase(),
  ],
  authController.forgotPassword
);
router.post( '/reset-password/:token',
  [
    body('password')
      .notEmpty()
      .withMessage('password is required.')
      .isLength({min:8})
      .withMessage('Password must contain at least 8 characters')
      .trim()
  ],
  authController.resetPassword
);

router.get('/logout',authMiddleware, authController.logoutUser);

module.exports = router;
