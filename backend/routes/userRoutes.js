const express = require('express');
const { param } = require('express-validator');

// import controller and middlewares
const userController = require('../controllers/userController.js');
const protect = require('../middlewares/authMiddleware.js');
// define router
const router = express.Router();

// validator
const isUserId = [param('id').notEmpty().withMessage('Id must be provided.')];

// routes
router.get('/', protect, userController.getAllUser);
router.get('/:id', protect, isUserId, userController.getUserById);
router.get('/follow/:id', protect, userController.followUser)
router.get('/unfollow/:id', protect, userController.unfollowUser)
router.get('/follower/:id', protect, userController.followerCount)
router.get('/following/:id', protect, userController.followingCount)
module.exports = router;
