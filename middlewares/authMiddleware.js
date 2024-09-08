const jwt = require('jsonwebtoken');
const User = require('../Models/User.model');

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

const authorize = (roles = [], permissions = {}) => {
  return (req, res, next) => {
    const { user } = req;
    
    if (roles.length && !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden: You do not have the required role.' });
    }

    const userPermissions = user.permissions || {};
    const checkPermissions = (perm) => {
      if (typeof permissions[perm] === 'boolean' && permissions[perm] !== userPermissions[perm]) {
        return false;
      } 
      if (typeof permissions[perm] === 'object') {
        for (const subPerm in permissions[perm]) {
          if (permissions[perm][subPerm] !== userPermissions[perm]?.[subPerm]) {
            return false;
          }
        }
      }
      return true;
    };

    for (const perm in permissions) {
      if (!checkPermissions(perm)) {
        return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
      }
    }
    
    next();
  };
};

module.exports = { authenticate, authorize };
