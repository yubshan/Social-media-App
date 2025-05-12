const mongoose = require('mongoose');
require('dotenv').config();

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MONGO-DB Database is Connected.");  
    } catch (error) {
        console.error("DB connection error : ", error.message);
        process.exit(1);
    }
};

module.exports=connectDb;