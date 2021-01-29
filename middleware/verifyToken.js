const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('authorization').split(' ')[1];
    if (!token) return res.status(401).json({
        status: 'failed',
        message: 'Access Denied'
    });
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({
            status: 'failed',
            message: 'Invalid Token'
        });
    }
}
