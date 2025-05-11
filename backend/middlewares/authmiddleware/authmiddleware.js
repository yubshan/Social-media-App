const JWT = require('jsonwebtoken');

const authMiddleware = (req, res, next) =>{
    const token = req.cookies.token;    
    
    try {
        if(!token){
            return res.status(401).json({message:"No token provided."});
        };
        const decoded = JWT.verify(token , process.env.JWT_SECRETS);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.log("Error in Auth Middleware:", error);
        return res.status(401).json({message:"UnAuthorized"})
    }
};

module.exports = authMiddleware;