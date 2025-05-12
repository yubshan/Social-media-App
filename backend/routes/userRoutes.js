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
router.get('/users', protect, userController.getAllUser);
router.get('/user/:id', protect, isUserId, userController.getUserById);

module.exports = router;
