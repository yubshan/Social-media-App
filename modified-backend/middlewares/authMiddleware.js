const JWT = require('jsonwebtoken');
require('dotenv').config();

const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ success: false, message: 'Not Authorized.' });
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Not Authorized.' });
  }
};

module.exports = protect;
