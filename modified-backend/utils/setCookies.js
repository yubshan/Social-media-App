const JWT = require('jsonwebtoken');
require('dotenv').config();

const setCookie = function (res, userId) {
  const token = JWT.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7D',
  });

  return res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

module.exports = setCookie;