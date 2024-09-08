const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

exports.generateToken = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        avatar: user.avatar,
        role: user.role,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

exports.verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
