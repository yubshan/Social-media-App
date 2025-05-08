const express = require('express');
const postController = require('../controller/postController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const { body } = require('express-validator');

const router = express.Router();

router.get('/', authMiddleware, postController.getAllPost);
router.post(
  '/',
  authMiddleware,
  [body('content').notEmpty().withMessage("content can't be empty").trim()],
  postController.createPost
);
router.get('/:postId', authMiddleware, postController.getOnePost);
router.put('/update/:postId', authMiddleware, postController.updatePost);
router.delete('/delete/:postId', authMiddleware, postController.deletePost);

module.exports = router;
