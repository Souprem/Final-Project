const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Check Header first (Bearer token)
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    } else {
        // Fallback to cookie
        token = req.cookies.access_token;
    }

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
