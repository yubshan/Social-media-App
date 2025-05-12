const express = require('express');
const { body, param } = require('express-validator');

// import controller and middleware
const profileController = require('../controllers/profileController.js');
const protect = require('../middlewares/authMiddleware.js');
const isAdmin = require('../middlewares/isAdmin.js');
// import multer
const upload = require('../middlewares/multer.js');

// define router
const router = express.Router();

// validator
const isBio = body('bio')
  .optional()
  .trim()
  .isLength({ max: 500 })
  .withMessage('Bio cannot be more than 500 characters.');
const isWebsite = body('website')
  .optional()
  .trim()
  .isURL()
  .withMessage('Invalid Url.');
const isLocation = body('location').optional().trim();
const isSkills = body('skills')
  .optional()
  .isArray()
  .withMessage('skills must be an array.')
  .isArray({ max: 10 })
  .withMessage('you can have atmost 10 skills.');
const isEachSkills = body('skills.*')
  .trim()
  .notEmpty()
  .withMessage('Each skills cannot be empty.')
  .isLength({ max: 50 })
  .withMessage("Skill can't be more than 50 characters.");
const isSocials = body('socials')
  .optional()
  .isObject()
  .withMessage('Socials must be an object.');
const isTwitter = body('socials.twitter')
  .optional()
  .trim()
  .isURL()
  .withMessage('Invalid  Twitter Url.');
const isInstagram = body('socials.instagram')
  .optional()
  .trim()
  .isURL()
  .withMessage('Inavlid Instagram Url');
const isFacebook = body('socials.facebook')
  .optional()
  .trim()
  .isURL()
  .withMessage('Invalid facebook url');
const isLinkden = body('socials.linkden')
  .optional()
  .trim()
  .isURL()
  .withMessage('Invalid linkden Url');
const isProfileId = param('id')
  .notEmpty()
  .withMessage('Profile id must be provided.');

const profileValidate = [
  isBio,
  isWebsite,
  isLocation,
  isSkills,
  isEachSkills,
  isSocials,
  isTwitter,
  isInstagram,
  isFacebook,
  isLinkden,
];

// routes
router.get('/:id', protect, profileController.getProfile);
router.post(
  '/build-profile',
  protect,
  upload.single('avatar'),
  profileValidate,
  profileController.createProfile
);
router.put(
  '/:id',
  protect,
  isAdmin,
  upload.single('avatar'),
  profileValidate,
  profileController.updateProfile
);

module.exports = router;