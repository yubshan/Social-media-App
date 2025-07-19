const express = require("express");
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDb = require('./config/db.js');


// import routes 
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const profileRoutes = require('./routes/profileRoutes.js');
const postRoutes = require('./routes/PostRoutes.js');
const commentRoutes = require('./routes/commentRoutes.js');
const replyRoutes = require('./routes/replyRoutes.js');


// import middleware 
const errorHandler = require('./middlewares/errorHandler.js');

dotenv.config();
const app = express(); 

// Global middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
app.use(cors ({
    origin: true,
    credentials: true,
}));
app.use(cookieParser());


// rate limiter 100 req per 15 min
const apilimiter = rateLimit({windowMs : 15*60*1000 , max : 100});
app.use('/api/', apilimiter);


// Define routes
app.use('/api/ping' , (req, res)=>{
    return res.status(200).json({success: true, message:"API Ping is up."})
})
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/replies', replyRoutes);



// error handleing middleware 
app.use(errorHandler);


module.exports = app;
