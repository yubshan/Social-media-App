const express = require('express');
const profileController = require('../controller/profileController.js')
const authMiddleware= require('../middlewares/authmiddleware/authmiddleware.js');


const router = express.Router();

router.get('/:userId/profile', profileController.getProfileByUserId );
router.get('/:profileId', profileController.getProfileByProfileId );
router.put('/update', authMiddleware ,profileController.updateProfile);

module.exports = router;