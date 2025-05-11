const bcrypt = require ('bcrypt');
const asyncHandler = require('./asyncHandler.js');
const genHashedPassword = asyncHandler(async (password) =>{
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password,salt);
    return hashedPassword;
});

module.exports = genHashedPassword;