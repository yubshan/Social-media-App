const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDb = require('./database/db.js');
const authRoutes = require('./routes/authRouts/authRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');
const postRoutes = require('./routes/PostRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const replyCommentRoutes = require('./routes/replyCommentRoutes.js');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRoutes);
app.use('/profile', profileRouter);
app.use('/post', postRoutes);
app.use('/comments', commentRoutes);
app.use('/replies', replyCommentRoutes);

app.listen(PORT, () => {
  console.log('Sever is running on: ', PORT);
  connectDb();
});
