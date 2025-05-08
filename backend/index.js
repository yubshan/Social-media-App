const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const connectDb = require('./database/db.js');
const authRoutes = require('./routes/authRouts/authRoutes.js');
const profileRouter = require('./routes/profileRoutes.js');


dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());


app.use('/auth', authRoutes);
app.use('/profile', profileRouter);

app.listen(PORT, ()=>{
    console.log("Sever is running on: ",PORT);
    connectDb();
})