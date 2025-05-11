require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs').promises;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_KEY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(`${filePath}`);
    const url = cloudinary.url(result.public_id);
    return url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  } finally {
    try {
      await fs.unlink(filePath);
      console.log('successfully delted temporary file:', filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        console.warn('Error deleting temporary file:', error);
      }
    }
  }
};

module.exports = upload;
