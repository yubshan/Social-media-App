        const JWT = require('jsonwebtoken');
    
    function setCookie(res, userId) {
    const token = JWT.sign({ userId }, process.env.JWT_SECRETS, {
        expiresIn: '7D',
    });

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    };

    module.exports = setCookie;