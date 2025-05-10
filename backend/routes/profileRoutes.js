const express = require('express');
const profileController = require('../controller/profileController.js')
const authMiddleware= require('../middlewares/authmiddleware/authmiddleware.js');
const {body, param} = require('express-validator');

const router = express.Router();
const validator = [
    [param('id').isMongoId().withMessage("Invalid user Id.")]
]
router.get('/:userId/profile', profileController.getProfileByUserId );
router.get('/:profileId', profileController.getProfileByProfileId );
router.put('/update/:userId', authMiddleware ,profileController.updateProfile);
router.post ('/follow/:id', authMiddleware,validator , profileController.followUser);
router.post ('/unfollow/:id', authMiddleware,validator , profileController.unfollowUser);
router.get('/follower-count/:id', profileController.followerCount);
router.get('/following-count/:id', profileController.followingCount);
module.exports = router;