const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) return res.status(401).json({ message: 'Not authenticated!' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is not valid!' });
        req.user = user;
        next();
    });
};

const verifyModerator = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'moderator') {
            next();
        } else {
            res.status(403).json({ message: 'You are not authorized!' });
        }
    });
};

module.exports = { verifyToken, verifyModerator };
