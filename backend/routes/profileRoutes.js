const express = require('express');
const multer = require('multer');
const path = require('path');
const profileController = require('../controller/profileController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const { body, param } = require('express-validator');

const router = express.Router();
const validator = [[param('id').isMongoId().withMessage('Invalid user Id.')]];

const filePath = 'public/images/';
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, filePath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const originalExtension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + originalExtension);
  },
});
const upload = multer({ storage });

router.get('/:userId/profile', profileController.getProfileByUserId);
router.get('/:profileId', profileController.getProfileByProfileId);
router.put(
  '/update/:userId',
  authMiddleware,
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverPic', maxCount: 1 },
  ]),
  profileController.updateProfile
);
router.post(
  '/follow/:id',
  authMiddleware,
  validator,
  profileController.followUser
);
router.post(
  '/unfollow/:id',
  authMiddleware,
  validator,
  profileController.unfollowUser
);
router.get('/follower-count/:id', profileController.followerCount);
router.get('/following-count/:id', profileController.followingCount);
module.exports = router;
