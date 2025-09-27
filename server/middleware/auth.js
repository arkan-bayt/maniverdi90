const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Check if user is admin or superuser
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'superuser') {
    return res.status(403).json({ message: 'Admin or superuser access required' });
  }
  next();
};

// Check if user is superuser (for user management)
const requireSuperuser = (req, res, next) => {
  if (req.user.role !== 'superuser') {
    return res.status(403).json({ message: 'Superuser access required' });
  }
  next();
};

module.exports = {
  authenticateToken,
  requireAdmin,
  requireSuperuser
};