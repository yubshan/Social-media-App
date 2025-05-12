const app = require('./app.js');
const connectDb = require('./config/db.js');
require('dotenv').config();

const PORT = process.env.PORT || 8000;
const serverConnection = async () => {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`Server is running on port : ${PORT}`);
    });
  } catch (error) {
    console.error("server startup error : ", error);
    process.exit(1);
  }
};
serverConnection();
