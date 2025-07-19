const cloudinary = require('cloudinary').v2;
const asyncHandler = require('./asyncHandler.js');
const fs = require('fs').promises;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_API_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_PASS,
});

const cloudinaryUpload = asyncHandler(async (filePath) => {
  console.log(filePath);
  const result = await cloudinary.uploader.upload(filePath);
  const url = result.secure_url; 
  await fs.unlink(filePath);
  console.log('temporary file has been deleted successfully.');
  return url;
});

module.exports = cloudinaryUpload;
