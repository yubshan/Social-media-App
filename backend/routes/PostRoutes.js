const express = require('express');
const multer = require('multer');
const path = require('path');
const postController = require('../controller/postController.js');
const authMiddleware = require('../middlewares/authmiddleware/authmiddleware.js');
const isAuthor = require('../middlewares/isAuthor.js');
const { body } = require('express-validator');

const router = express.Router();

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

router.get('/', authMiddleware, postController.getAllPost);
router.post(
  '/',
  authMiddleware,
  upload.single('graphics'),
  postController.createPost
);
router.get('/:postId', authMiddleware, postController.getOnePost);
router.put(
  '/update/:postId',
  authMiddleware,
  isAuthor,
  postController.updatePost
);
router.delete(
  '/delete/:postId',
  authMiddleware,
  isAuthor,
  postController.deletePost
);
router.get('/likes/:postId', postController.getLikeCount);
router.post('/likes/:postId', postController.updateLikes);
router.post('/unlikes/:postId', postController.unlikePost);
router.get('/comment/:postId', postController.getCommentCount);
module.exports = router;
