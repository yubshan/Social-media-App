const mongoose = require('mongoose');

const connectDb = async () => {
    try {
       const con =await mongoose.connect(process.env.MONGO_URI);
    console.log("DataBase is connected to : ", con.connection.host);
     
    } catch (error) {
       console.log("Database Connection Error :", error);
        process.exit(0);
    }
    
}

module.exports = connectDb;