const express = require("express");
const helmet  = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDb = require('./config/db.js');


// import routes 



// import middleware 


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



// error handleing middleware 


module.exports = app;
